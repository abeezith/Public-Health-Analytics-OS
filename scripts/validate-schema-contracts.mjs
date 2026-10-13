import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const errors = [];
const assert = (condition, code, message) => { if (!condition) errors.push({ code, message }); };

const schemaDirectory = path.join(root, 'indicators/data/schemas/1.4.0');
const manifest = read('indicators/data/schemas/1.4.0/manifest.json');
const schemaIds = new Set();

assert(manifest.version === '1.4.0', 'SCHEMA_VERSION', 'Schema package manifest must be version 1.4.0.');
assert(manifest.schemas?.length === 14, 'SCHEMA_COUNT', `Expected 14 schema contracts, found ${manifest.schemas?.length ?? 0}.`);

for (const entry of manifest.schemas || []) {
  const file = path.join(schemaDirectory, entry.file);
  assert(fs.existsSync(file), 'SCHEMA_FILE_MISSING', `Missing schema file: ${entry.file}.`);
  if (!fs.existsSync(file)) continue;
  const schema = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', 'SCHEMA_DIALECT', `${entry.file} does not declare Draft 2020-12.`);
  assert(schema.$id?.includes('/1.4.0/'), 'SCHEMA_ID_VERSION', `${entry.file} has an unversioned or incorrect $id.`);
  assert(!schemaIds.has(schema.$id), 'SCHEMA_ID_DUPLICATE', `Duplicate schema $id: ${schema.$id}.`);
  schemaIds.add(schema.$id);
  const serialized = JSON.stringify(schema);
  for (const match of serialized.matchAll(/"\$ref":"([^"]+)"/g)) {
    const reference = match[1];
    if (/^https?:/.test(reference) || reference.startsWith('#')) continue;
    const localFile = reference.split('#')[0];
    assert(fs.existsSync(path.join(schemaDirectory, localFile)), 'SCHEMA_REF_MISSING', `${entry.file} references missing ${localFile}.`);
  }
}

const model = read('indicators/data/registry/unified-read-model.json');
const allowedMeasureTypes = new Set(['Percentage/proportion', 'Ratio', 'Rate per population', 'Count', 'Index']);
const allowedObjectTypes = new Set(['Data element', 'Derived indicator', 'Published output', 'Validation rule']);
const allowedPillars = new Set(['Service delivery', 'Health workforce', 'Health information systems', 'Medical products, vaccines and technologies', 'Health financing', 'Leadership and governance']);
const indicatorRequired = ['id', 'name', 'definition', 'source', 'sourceId', 'status', 'verified', 'collection', 'metadataLevel', 'completeness'];
const hmisRequired = ['id', 'objectType', 'name', 'versionStatus', 'sourceAuthority'];
let indicatorRepresentations = 0;
let hmisRepresentations = 0;

for (const record of model.records || []) {
  for (const [kind, item] of [['indicator', record.indicatorMetadata], ['hmis', record.hmisMetadata]]) {
    if (!item) continue;
    if (kind === 'indicator') indicatorRepresentations += 1;
    else hmisRepresentations += 1;
    const required = kind === 'indicator' ? indicatorRequired : hmisRequired;
    for (const field of required) assert(item[field] !== undefined && item[field] !== null, 'REQUIRED_FIELD', `${kind} ${item.id || record.canonicalObjectId} is missing ${field}.`);
    assert(item.id === record.canonicalObjectId, 'IDENTITY_NAMESPACE', `${kind} representation ID does not match canonical object ${record.canonicalObjectId}.`);
    if (kind === 'hmis') assert(allowedObjectTypes.has(item.objectType), 'HMIS_OBJECT_TYPE', `${item.id} has unsupported objectType ${item.objectType}.`);
    if (item.measureType !== undefined && item.measureType !== null) assert(allowedMeasureTypes.has(item.measureType), 'MEASURE_TYPE', `${item.id} has unsupported measureType ${item.measureType}.`);
    if (item.completeness !== undefined) assert(typeof item.completeness === 'number' && item.completeness >= 0 && item.completeness <= 100, 'COMPLETENESS_RANGE', `${item.id} completeness is outside 0–100.`);
    if (item.verified !== undefined) assert(/^\d{4}-\d{2}-\d{2}$/.test(item.verified), 'VERIFIED_DATE', `${item.id} has invalid verified date ${item.verified}.`);
    for (const pillar of item.whoPillars || []) assert(allowedPillars.has(pillar), 'WHO_PILLAR', `${item.id} has unsupported WHO pillar ${pillar}.`);
  }
}

assert(indicatorRepresentations === 3751, 'INDICATOR_REPRESENTATIONS', `Expected 3,751 indicator representations, found ${indicatorRepresentations}.`);
assert(hmisRepresentations === 1046, 'HMIS_REPRESENTATIONS', `Expected 1,046 HMIS representations, found ${hmisRepresentations}.`);

const report = {
  status: errors.length ? 'fail' : 'pass',
  schemaPackage: manifest.version,
  schemaContracts: manifest.schemas?.length || 0,
  schemaIds: schemaIds.size,
  indicatorRepresentations,
  hmisRepresentations,
  errors
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
