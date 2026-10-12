import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureIndex = process.argv.indexOf('--fixture');
const fixturePath = fixtureIndex >= 0 ? process.argv[fixtureIndex + 1] : null;
const explicitGap = /not stated|not available|not specified|unknown|pending|not applicable/i;
const allowedTypes = new Set(['Percentage/proportion', 'Ratio', 'Rate per population', 'Count', 'Index']);
const errors = [];
const warnings = [];
const addError = (record, code, message) => errors.push({ id: record.id || 'unknown', code, message });

let representations;
let exceptionIds = new Set();
if (fixturePath) {
  const payload = JSON.parse(fs.readFileSync(path.resolve(root, fixturePath), 'utf8'));
  representations = (Array.isArray(payload) ? payload : payload.records || [payload]).map(item => ({ layer: 'fixture', item }));
} else {
  const model = JSON.parse(fs.readFileSync(path.join(root, 'indicators/data/registry/unified-read-model.json'), 'utf8'));
  const exceptions = JSON.parse(fs.readFileSync(path.join(root, 'indicators/data/governance/validation-exceptions.json'), 'utf8'));
  exceptionIds = new Set((exceptions.exceptions || []).filter(entry => entry.rule === 'EXPLICIT_DENOMINATOR_GAP').map(entry => entry.id));
  representations = model.records.flatMap(record => [
    record.indicatorMetadata && { layer: 'indicator', item: record.indicatorMetadata },
    record.hmisMetadata && { layer: 'hmis', item: record.hmisMetadata }
  ].filter(Boolean));
}

const counts = { totalRepresentations: representations.length, normalized: 0, percentages: 0, rates: 0, ratios: 0, counts: 0, indexes: 0, unnormalized: 0 };
for (const { layer, item } of representations) {
  const type = item.measureType;
  if (!type) {
    counts.unnormalized += 1;
    warnings.push({ id: item.id, code: 'NORMALIZATION_NOT_AVAILABLE', message: `${layer} representation has no normalized measureType.` });
    continue;
  }
  counts.normalized += 1;
  if (!allowedTypes.has(type)) {
    addError(item, 'MEASURE_TYPE_INVALID', `Unsupported measureType: ${type}.`);
    continue;
  }
  const scale = String(item.scaleDisplay || '').trim();
  const formula = String(item.normalizedFormula || '').trim().toLowerCase().replaceAll(' ', '');
  const denominator = String(item.denominatorPopulation || '').trim();
  if (item.officialIndicatorName && item.officialIndicatorName !== item.name) addError(item, 'OFFICIAL_NAME_CHANGED', 'officialIndicatorName differs from the published name field.');
  if (!scale || scale === 'Not specified') addError(item, 'SCALE_MISSING', 'Normalized records require an explicit display scale.');

  if (type === 'Percentage/proportion') {
    counts.percentages += 1;
    if (scale !== '%') addError(item, 'PERCENT_SCALE', `Percentage scale must be %, found ${scale || 'missing'}.`);
    if (formula !== '(numerator÷denominator)×100') addError(item, 'PERCENT_FORMULA', 'Percentage formula must be (numerator ÷ denominator) × 100.');
    if (!denominator) addError(item, 'PERCENT_DENOMINATOR', 'Percentage requires an explicit denominator population.');
    else if (explicitGap.test(denominator)) {
      if (exceptionIds.has(item.id)) warnings.push({ id: item.id, code: 'APPROVED_DENOMINATOR_GAP', message: 'Denominator remains an explicit, governed evidence gap.' });
      else addError(item, 'PERCENT_DENOMINATOR', 'Percentage denominator is an unregistered evidence gap.');
    }
    const display = String(item.displayDefinition || item.definition || '').toLowerCase();
    if (!display.includes('denominator population')) addError(item, 'PERCENT_DISPLAY_DENOMINATOR', 'Display definition must state the denominator population.');
  } else if (type === 'Rate per population') {
    counts.rates += 1;
    if (!/per\s+(\d|woman|women|live birth|population)/i.test(scale)) addError(item, 'RATE_SCALE', `Rate scale must state its population base, found ${scale || 'missing'}.`);
    if (!denominator || explicitGap.test(denominator)) addError(item, 'RATE_DENOMINATOR', 'Rate requires an explicit denominator population.');
  } else if (type === 'Ratio') {
    counts.ratios += 1;
    if (!scale) addError(item, 'RATIO_SCALE', 'Ratio requires an explicit scale.');
    if (!denominator || explicitGap.test(denominator)) addError(item, 'RATIO_DENOMINATOR', 'Ratio requires an explicit denominator population.');
  } else if (type === 'Count') {
    counts.counts += 1;
    if (scale.toLowerCase() !== 'count') addError(item, 'COUNT_SCALE', `Count scale must be count, found ${scale || 'missing'}.`);
  } else if (type === 'Index') {
    counts.indexes += 1;
    if (!scale) addError(item, 'INDEX_SCALE', 'Index requires an explicit scale/status display.');
  }
}

const report = {
  status: errors.length ? 'fail' : 'pass',
  fixture: fixturePath || null,
  counts,
  warningSummary: {
    normalizationNotAvailable: warnings.filter(item => item.code === 'NORMALIZATION_NOT_AVAILABLE').length,
    approvedDenominatorGaps: warnings.filter(item => item.code === 'APPROVED_DENOMINATOR_GAP').length
  },
  interpretation: 'Missing normalization on legacy source records is a declared quality gap. Once measureType is present, formula, scale and denominator rules are release-blocking.',
  errors
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
