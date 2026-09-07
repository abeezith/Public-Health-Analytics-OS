import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = relativePath => JSON.parse(fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8'));
const profile = readJson('indicators/data/governance/metadata-quality-profile.json');
const registry = readJson('indicators/data/indicators.json');
const ncdRelease = readJson('indicators/data/ncd/release.json');
const dimensionWeights = Object.fromEntries(profile.dimensions.map(dimension => [dimension.id, dimension.weight]));
const gapPatterns = profile.explicitGapPatterns.map(pattern => new RegExp(pattern, 'i'));
const notApplicablePatterns = profile.notApplicablePatterns.map(pattern => new RegExp(pattern, 'i'));

function asText(value) {
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join('; ');
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function stateFor(value, options = {}) {
  const text = asText(value);
  if (!text) return { state: 'missing', factor: 0 };
  if (notApplicablePatterns.some(pattern => pattern.test(text))) {
    return options.allowNotApplicable ? { state: 'notApplicable', factor: 1 } : { state: 'invalid', factor: 0 };
  }
  if (gapPatterns.some(pattern => pattern.test(text))) return { state: 'explicitGap', factor: 0.25 };
  return { state: 'complete', factor: 1 };
}

const average = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const factor = (value, options) => stateFor(value, options).factor;
const isUrl = value => /^https?:\/\/[^\s]+$/i.test(asText(value));
const isDate = value => /^\d{4}-\d{2}-\d{2}$/.test(asText(value));
const validId = value => /^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(asText(value));

function definitionFactor(record) {
  const definition = asText(record.definition);
  if (!definition) return 0;
  const base = stateFor(definition);
  if (base.state !== 'complete') return base.factor;
  if (definition.toLocaleLowerCase() === asText(record.name).toLocaleLowerCase()) return 0.5;
  return 1;
}

function calculationFactors(record, issues) {
  const type = asText(record.measureType);
  const countLike = type === 'Count';
  const indexLike = type === 'Index';
  const factors = [factor(record.measureType)];
  factors.push(factor(record.numerator, { allowNotApplicable: indexLike }));
  factors.push(factor(record.denominator, { allowNotApplicable: countLike || indexLike }));
  factors.push(factor(record.normalizedFormula || record.formula, { allowNotApplicable: false }));
  factors.push(factor(record.denominatorPopulation || record.population, { allowNotApplicable: countLike || indexLike }));
  if (type === 'Percentage/proportion') {
    if (record.scaleDisplay !== '%') issues.push('percentageScale');
    if (!/100/.test(asText(record.normalizedFormula || record.formula))) issues.push('percentageFormula');
    if (stateFor(record.denominatorPopulation || record.denominator).factor < 0.5) issues.push('percentageDenominator');
  }
  return factors;
}

function scoreRecord(record) {
  const issues = [];
  if (!validId(record.id)) issues.push('invalidIdentity');
  if (!asText(record.name)) issues.push('missingName');
  if (!asText(record.sourceId) || !asText(record.source) || !isUrl(record.url)) issues.push('incompleteProvenance');
  if (!isDate(record.verified)) issues.push('invalidVerificationDate');

  const scope = record.lowestReportingLevel || record.administrativeLevel || record.country || (record.collection ? 'Global / collection scope' : '');
  const sourceLocation = record.sourceVersion || record.sourcePage || record.sourceSection || record.code;
  const dimensionFactors = {
    identity: average([validId(record.id) ? 1 : 0, factor(record.name), factor(record.domain), factor(record.subdomain)]),
    definition: definitionFactor(record),
    computation: average(calculationFactors(record, issues)),
    scale: average([factor(record.measureType), factor(record.scaleDisplay), factor(record.unit)]),
    populationTime: average([factor(record.denominatorPopulation || record.population), factor(record.frequency), factor(scope)]),
    provenance: average([factor(record.source), factor(record.sourceId), factor(record.org), isUrl(record.url) ? 1 : 0, isDate(record.verified) ? 1 : 0, factor(sourceLocation)]),
    disaggregationContext: average([factor(record.disaggregation), factor(scope)]),
    interpretationUse: average([factor(record.direction), factor(record.uses)]),
    limitations: factor(record.caveats)
  };
  const dimensionScores = Object.fromEntries(Object.entries(dimensionFactors).map(([id, value]) => [id, Number((value * dimensionWeights[id]).toFixed(2))]));
  const unrounded = Object.values(dimensionScores).reduce((sum, value) => sum + value, 0);
  const score = Math.round(unrounded);
  const level = profile.levels.find(item => score >= item.minimum && score <= item.maximum)?.level;
  return { id: record.id, score, level, dimensionScores, issues: [...new Set(issues)] };
}

const seenIds = new Set();
const duplicateIds = [];
for (const record of registry.indicators) {
  if (seenIds.has(record.id)) duplicateIds.push(record.id);
  seenIds.add(record.id);
}
const scored = registry.indicators.map(scoreRecord);
const levelCounts = Object.fromEntries(profile.levels.map(item => [item.level, scored.filter(record => record.level === item.level).length]));
const dimensionAverageScores = Object.fromEntries(profile.dimensions.map(dimension => {
  const total = scored.reduce((sum, record) => sum + record.dimensionScores[dimension.id], 0);
  return [dimension.id, Number((total / scored.length).toFixed(2))];
}));
const dimensionLowCompletenessCounts = Object.fromEntries(profile.dimensions.map(dimension => [
  dimension.id,
  scored.filter(record => record.dimensionScores[dimension.id] < dimension.weight * 0.5).length
]));
const issueCounts = {};
for (const result of scored) for (const issue of result.issues) issueCounts[issue] = (issueCounts[issue] || 0) + 1;
const storedPairs = new Set(registry.indicators.map(record => `${record.metadataLevel}:${record.completeness}`));
const legacyMismatchCount = scored.filter((result, index) => result.score !== registry.indicators[index].completeness || result.level !== registry.indicators[index].metadataLevel).length;
const criticalValidationErrors = duplicateIds.length + (issueCounts.invalidIdentity || 0) + (issueCounts.missingName || 0);

const report = {
  metadata: {
    id: 'PHAOS-MDQ-REPORT-001',
    profileId: profile.id,
    profileVersion: profile.version,
    generated: '2026-09-07',
    registryRelease: registry.coverage?.release || 'not declared in registry payload',
    status: criticalValidationErrors ? 'Failed' : 'Passed with documented quality gaps',
    interpretation: profile.interpretation
  },
  recordsScored: scored.length,
  unscoredProgrammeTupleRecords: ncdRelease.records?.length || 0,
  averageMetadataQualityScore: Number((scored.reduce((sum, record) => sum + record.score, 0) / scored.length).toFixed(1)),
  levelCounts,
  dimensionAverageScores,
  dimensionMaximumScores: dimensionWeights,
  dimensionLowCompletenessCounts,
  issueCounts,
  criticalValidationErrors,
  duplicateIds,
  legacyReconciliation: {
    storedFieldPairs: storedPairs.size,
    recordsWhoseComputedScoreOrLevelDiffersFromLegacy: legacyMismatchCount,
    policy: 'Legacy metadataLevel and completeness values are retained for provenance and are not overwritten by TRUST-03.'
  },
  publicationBoundary: 'This summary publishes aggregate validation results. Record-level scores are generated by the validator and are not exposed as a new bulk-download artifact.'
};

if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`Metadata-quality profile ${profile.version}`);
  console.log(`Records scored: ${report.recordsScored}`);
  console.log(`Average score: ${report.averageMetadataQualityScore}`);
  console.log(`Levels: ${Object.entries(levelCounts).map(([level, count]) => `${level}=${count}`).join(', ')}`);
  console.log(`Critical validation errors: ${criticalValidationErrors}`);
  console.log(`Legacy score/level differences: ${legacyMismatchCount}`);
  console.log(`Unscored legacy programme tuples: ${report.unscoredProgrammeTupleRecords}`);
}
if (criticalValidationErrors) process.exitCode = 1;
