import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = JSON.parse(fs.readFileSync(path.join(root, 'indicators/data/governance/unified-identity-index.json'), 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(index.counts.canonicalObjects === 4743, `Expected 4,743 canonical objects, found ${index.counts.canonicalObjects}.`);
expect(index.counts.representations === 4797, `Expected 4,797 representations, found ${index.counts.representations}.`);
expect(index.counts.multiRepresentationObjects === 54, `Expected 54 cross-registry identities, found ${index.counts.multiRepresentationObjects}.`);
expect(index.counts.reportColumnOccurrences === 560, `Expected 560 report-column occurrences, found ${index.counts.reportColumnOccurrences}.`);
expect(index.counts.reportMeasureOccurrences === 525, `Expected 525 measure occurrences, found ${index.counts.reportMeasureOccurrences}.`);
expect(index.counts.reportDimensionOccurrences === 35, `Expected 35 dimension occurrences, found ${index.counts.reportDimensionOccurrences}.`);
expect(index.counts.linkedMeasureOccurrences === 508, `Expected 508 linked measure occurrences, found ${index.counts.linkedMeasureOccurrences}.`);
expect(index.counts.candidateMeasureOccurrences === 17, `Expected 17 candidate measure occurrences, found ${index.counts.candidateMeasureOccurrences}.`);
expect(index.counts.canonicalObjectTypes.Indicator === 3751, `Expected 3,751 indicators, found ${index.counts.canonicalObjectTypes.Indicator}.`);
expect(index.counts.canonicalObjectTypes['Data element'] === 765, `Expected 765 data elements, found ${index.counts.canonicalObjectTypes['Data element']}.`);
expect(index.counts.canonicalObjectTypes['Published output'] === 202, `Expected 202 outputs, found ${index.counts.canonicalObjectTypes['Published output']}.`);
expect(index.counts.canonicalObjectTypes['Validation rule'] === 25, `Expected 25 validation rules, found ${index.counts.canonicalObjectTypes['Validation rule']}.`);

const canonicalIds = index.canonicalObjects.map(item => item.canonicalObjectId);
const canonicalUris = index.canonicalObjects.map(item => item.canonicalUri);
const representationIds = index.canonicalObjects.flatMap(item => item.representations.map(rep => rep.representationId));
const occurrenceIds = index.occurrences.map(item => item.occurrenceId);
const occurrenceRepresentations = index.occurrences.map(item => item.representationId);
expect(new Set(canonicalIds).size === canonicalIds.length, 'Canonical object IDs are not unique.');
expect(new Set(canonicalUris).size === canonicalUris.length, 'Canonical URIs are not unique.');
expect(new Set(representationIds).size === representationIds.length, 'Canonical-object representation IDs are not unique.');
expect(new Set(occurrenceIds).size === occurrenceIds.length, 'Occurrence IDs are not unique.');
expect(new Set(occurrenceRepresentations).size === occurrenceRepresentations.length, 'Occurrence representation IDs are not unique.');
expect(new Set([...representationIds, ...occurrenceRepresentations]).size === representationIds.length + occurrenceRepresentations.length, 'Canonical and occurrence representation IDs overlap.');

const canonicalSet = new Set(canonicalIds);
for (const occurrence of index.occurrences) {
  if (occurrence.canonicalObjectId) expect(canonicalSet.has(occurrence.canonicalObjectId), `Unresolved canonical link: ${occurrence.occurrenceId} -> ${occurrence.canonicalObjectId}`);
}
for (const item of index.canonicalObjects) {
  expect(item.canonicalUri === `${index.metadata.canonicalBase}${encodeURIComponent(item.canonicalObjectId)}`, `Unstable canonical URI for ${item.canonicalObjectId}.`);
  expect(/^\d+\.\d+\.\d+$/.test(item.businessVersion), `Invalid business version for ${item.canonicalObjectId}.`);
  expect(['draft', 'active', 'retired', 'superseded'].includes(item.lifecycleStatus), `Invalid lifecycle state for ${item.canonicalObjectId}.`);
  expect(!item.retirementDate || ['retired', 'superseded'].includes(item.lifecycleStatus), `Retirement date on a non-retired object: ${item.canonicalObjectId}.`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Unified identity validation passed: ${canonicalIds.length} canonical objects, ${representationIds.length} representations and ${occurrenceIds.length} report-column occurrences.`);
