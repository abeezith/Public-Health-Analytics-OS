import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputIndex = process.argv.indexOf('--output');
const outputRelative = outputIndex >= 0 ? process.argv[outputIndex + 1] : 'artifacts/release-validation-report.json';
const outputPath = path.resolve(root, outputRelative);
const started = Date.now();
const command = (label, script) => ({ label, executable: process.execPath, args: [script] });
const checks = [
  command('Versioned schema contracts', 'scripts/validate-schema-contracts.mjs'),
  command('Metadata-quality profile', 'scripts/validate-metadata-quality.mjs'),
  command('Canonical identity and lifecycle', 'scripts/validate-unified-identities.mjs'),
  command('Unified read model and relationships', 'scripts/validate-unified-read-model.mjs'),
  command('Entry-level provenance and change history', 'scripts/validate-provenance.mjs'),
  command('Verification queue extraction', 'scripts/validate-verification-queue.mjs'),
  command('Source monitoring and human review queue', 'scripts/validate-source-monitoring.mjs'),
  command('Operational discovery profile', 'scripts/validate-operational-discovery.mjs'),
  command('Controlled disaggregation assertions', 'scripts/validate-disaggregation-profile.mjs'),
  command('Data-quality and comparability pilot', 'scripts/validate-quality-comparability.mjs'),
  command('Observation-ready publication boundary', 'scripts/validate-observation-model.mjs'),
  command('Versioned targets and reference values', 'scripts/validate-reference-values.mjs'),
  command('Measure, formula, scale and denominator rules', 'scripts/validate-measure-normalization.mjs'),
  command('Static UI, links and accessibility contract', 'scripts/validate-site-ui.mjs'),
  command('Controlled invalid-fixture rejection', 'scripts/test-release-gate.mjs')
];

const run = check => {
  const checkStarted = Date.now();
  const result = spawnSync(check.executable, check.args, { cwd: root, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  return {
    label: check.label,
    command: `node ${check.args.join(' ')}`,
    status: result.status === 0 ? 'pass' : 'fail',
    exitCode: result.status,
    durationMs: Date.now() - checkStarted,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim()
  };
};

const results = checks.map(run);
const git = args => spawnSync('git', args, { cwd: root, encoding: 'utf8' }).stdout?.trim() || 'unavailable';
const sha256 = relative => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex');
const trackedInputs = [
  'indicators/data/registry/unified-read-model.json',
  'indicators/data/registry/manifest.json',
  'indicators/data/governance/unified-identity-index.json',
  'indicators/data/governance/metadata-quality-profile.json',
  'indicators/data/governance/validation-exceptions.json',
  'indicators/data/observations/manifest.json',
  'indicators/data/schemas/1.4.0/manifest.json',
  'indicators/data/observations/reference-values.json',
  'indicators/data/governance/provenance-model.json',
  'indicators/data/provenance/manifest.json',
  'indicators/data/provenance/review-events.json',
  'indicators/data/provenance/change-events.json',
  'indicators/data/sources.json',
  'indicators/data/coverage.json',
  'indicators/data/governance/source-monitoring-model.json',
  'indicators/data/monitoring/source-snapshots.json',
  'indicators/data/monitoring/review-queue.json',
  'indicators/data/governance/operational-discovery-model.json',
  'scripts/operational-discovery.mjs',
  'indicators/data/governance/disaggregation-model.json',
  'scripts/disaggregation-profile.mjs',
  'indicators/data/governance/quality-comparability-model.json',
  'indicators/data/governance/quality-comparability-pilot.json',
  'scripts/quality-comparability-profile.mjs',
  'index.html',
  'indicators/index.html',
  'indicators/app.js',
  'indicators/hmis.js',
  'indicators/monitoring.js',
  'indicators/graph.js',
  'indicators/report-schemas.js',
  'indicators/styles.css',
  'roadmap/index.html'
];
const model = JSON.parse(fs.readFileSync(path.join(root, 'indicators/data/registry/unified-read-model.json'), 'utf8'));
const schemaManifest = JSON.parse(fs.readFileSync(path.join(root, 'indicators/data/schemas/1.4.0/manifest.json'), 'utf8'));
const monitoringRelease = JSON.parse(fs.readFileSync(path.join(root, 'indicators/data/monitoring/source-snapshots.json'), 'utf8'));
const provenanceManifest = JSON.parse(fs.readFileSync(path.join(root, 'indicators/data/provenance/manifest.json'), 'utf8'));
const status = results.every(result => result.status === 'pass') ? 'pass' : 'fail';
const report = {
  metadata: {
    id: 'PHAOS-RELEASE-VALIDATION-REPORT',
    gateVersion: '1.4.0',
    generatedAt: new Date().toISOString(),
    commitSha: git(['rev-parse', 'HEAD']),
    branch: git(['branch', '--show-current']),
    status,
    durationMs: Date.now() - started
  },
  releaseBoundary: {
    canonicalObjects: model.records.length,
    representations: model.records.reduce((sum, record) => sum + record.representations.length, 0),
    indicatorMemberships: model.counts.registryMemberships.indicator,
    hmisMemberships: model.counts.registryMemberships.hmis,
    reportOccurrences: model.occurrences.length,
    schemaPackageVersion: schemaManifest.version,
    provenanceSubjects: provenanceManifest.subjects,
    reviewEvents: provenanceManifest.reviewEvents,
    changeEvents: provenanceManifest.changeEvents,
    monitoredSourceBaselines: monitoringRelease.counts.declaredSources,
    monitoringPilotSources: monitoringRelease.counts.pilotSources,
    operationalDiscoveryProfiles: model.records.filter(item => item.operationalDiscovery?.modelId === 'PHAOS-OPDISC-001').length,
    disaggregationProfiles: model.records.filter(item => item.disaggregationProfile?.modelId === 'PHAOS-DISAGG-001').length,
    disaggregationAssertions: model.counts.disaggregation.assertions,
    qualityComparabilityProfiles: model.counts.qualityComparability.profiles,
    qualityComparabilityPilotProfiles: model.counts.qualityComparability.pilotProfiles,
    publicBulkDownloadControls: 'disabled',
    aggregateObservations: 0,
    referenceValues: model.counts.referenceValues.referenceValues,
    indicatorsWithReferenceValues: model.counts.referenceValues.indicators
  },
  inputChecksums: Object.fromEntries(trackedInputs.map(relative => [relative, sha256(relative)])),
  checks: results,
  interpretation: 'A passing gate proves structural and regression checks for the declared release. It does not imply source-custodian approval, semantic equivalence, computability or clinical validity.'
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status, report: path.relative(root, outputPath).replaceAll('\\', '/'), checks: Object.fromEntries(results.map(result => [result.label, result.status])), durationMs: report.metadata.durationMs }, null, 2));
if (status !== 'pass') process.exitCode = 1;
