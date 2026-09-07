import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const fail = message => { throw new Error(message); };
const modelPath = 'indicators/data/registry/unified-read-model.json';
const model = read(modelPath);
const manifest = read('indicators/data/registry/manifest.json');
const identities = read('indicators/data/governance/unified-identity-index.json');

if (model.metadata.version !== '1.0.0') fail('Unexpected read-model version.');
if (model.records.length !== 4743) fail(`Expected 4743 records, got ${model.records.length}.`);
const ids = model.records.map(item => item.canonicalObjectId);
const uris = model.records.map(item => item.canonicalUri);
if (new Set(ids).size !== ids.length) fail('Duplicate canonical object IDs.');
if (new Set(uris).size !== uris.length) fail('Duplicate canonical URIs.');
const expectedIds = new Set(identities.canonicalObjects.map(item => item.canonicalObjectId));
if (ids.some(id => !expectedIds.has(id)) || expectedIds.size !== ids.length) fail('Read-model identities drift from the canonical identity index.');

const indicatorRecords = model.records.filter(item => item.registryMemberships.includes('indicator'));
const hmisRecords = model.records.filter(item => item.registryMemberships.includes('hmis'));
const sharedRecords = model.records.filter(item => item.registryMemberships.length === 2);
if (indicatorRecords.length !== 3751) fail(`Expected 3751 indicator memberships, got ${indicatorRecords.length}.`);
if (hmisRecords.length !== 1046) fail(`Expected 1046 HMIS memberships, got ${hmisRecords.length}.`);
if (sharedRecords.length !== 54) fail(`Expected 54 shared identities, got ${sharedRecords.length}.`);
if (sharedRecords.some(item => !item.indicatorMetadata || !item.hmisMetadata)) fail('A shared identity is missing a source metadata namespace.');
if (indicatorRecords.some(item => !item.indicatorMetadata)) fail('Indicator membership without indicator metadata.');
if (hmisRecords.some(item => !item.hmisMetadata)) fail('HMIS membership without HMIS metadata.');

const types = model.records.reduce((out,item) => ((out[item.canonicalObjectType]=(out[item.canonicalObjectType]||0)+1),out),{});
for (const [type,count] of Object.entries({'Indicator':3751,'Data element':765,'Published output':202,'Validation rule':25})) {
  if (types[type] !== count) fail(`Expected ${count} ${type} records, got ${types[type] || 0}.`);
}
const representationCount = model.records.reduce((sum,item) => sum + item.representations.length, 0);
if (representationCount !== 4797) fail(`Expected 4797 representations, got ${representationCount}.`);
if (model.occurrences.length !== 560) fail(`Expected 560 occurrences, got ${model.occurrences.length}.`);
const measures = model.occurrences.filter(item => item.occurrenceType === 'Report field occurrence');
const dimensions = model.occurrences.filter(item => item.occurrenceType === 'Reporting dimension');
if (measures.length !== 525 || dimensions.length !== 35) fail(`Occurrence split is ${measures.length}/${dimensions.length}, expected 525/35.`);
if (measures.filter(item => item.canonicalObjectId).length !== 508) fail('Linked occurrence count is not 508.');
if (measures.filter(item => item.candidateObjectId).length !== 17) fail('Candidate occurrence count is not 17.');
if (measures.filter(item => item.canonicalObjectId).some(item => !expectedIds.has(item.canonicalObjectId))) fail('An occurrence link does not resolve.');
if (measures.some(item => !item.reportMetadata || !item.reconciliation)) fail('A measure occurrence is missing discovery metadata.');
if (dimensions.some(item => !item.reportMetadata)) fail('A dimension occurrence is missing discovery metadata.');
if (indicatorRecords.some(item => item.programmeTags.includes('Health Management Information System'))) fail('HMIS leaked into the programme facet.');
const hmisTaggedIndicators = indicatorRecords.filter(item => item.systemPortalTags.includes('HMIS')).length;
if (hmisTaggedIndicators !== 130) fail(`Expected 130 HMIS-tagged indicators, got ${hmisTaggedIndicators}.`);

const bytes = fs.readFileSync(path.join(root, modelPath));
const checksum = crypto.createHash('sha256').update(bytes).digest('hex');
if (manifest.distribution.sha256 !== checksum || manifest.distribution.bytes !== bytes.length) fail('Manifest distribution checksum or byte count is stale.');
console.log(JSON.stringify({status:'pass',records:model.records.length,indicatorRecords:indicatorRecords.length,hmisRecords:hmisRecords.length,sharedRecords:sharedRecords.length,representations:representationCount,occurrences:model.occurrences.length,hmisTaggedIndicators,sha256:checksum},null,2));
