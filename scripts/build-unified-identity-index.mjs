import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const outputPath = path.join(root, 'indicators/data/governance/unified-identity-index.json');
const canonicalBase = 'https://abeezith.github.io/Public-Health-Analytics-OS/id/';
const effectiveDate = '2026-09-07';

const indicatorRelease = read('indicators/data/indicators.json');
const ncdRelease = read('indicators/data/ncd/release.json');
const hmisCatalogue = read('indicators/data/hmis/catalog.json');
const headquarters = read('indicators/data/hmis/headquarters-elements.json');
const facilityCorrections = read('indicators/data/hmis/facility-format-corrections.json');
const reportManifest = read('indicators/data/hmis/report-schemas/state-report-20260901/HMIS-RPTSCHEMA-STATE-20260901-001.report-schema-manifest.json');
const candidateFields = read('indicators/data/hmis/report-schemas/state-report-20260901/candidate-new-elements.json');
const reportCrosswalk = read('indicators/data/hmis/report-schemas/state-report-20260901/column-to-element-crosswalk.json');

const objects = new Map();
const representationIds = new Set();

const normalizedType = sourceType => ({
  'Indicator manifestation': 'Indicator',
  'Derived indicator': 'Indicator',
  'Data element': 'Data element',
  'Published output': 'Published output',
  'Validation rule': 'Validation rule'
}[sourceType] || 'Indicator');

function representation({ id, layer, path: sourcePath, sourceObjectType, sourceVersion = null }) {
  const representationId = `REP-${layer}-${id}`;
  if (representationIds.has(representationId)) throw new Error(`Duplicate representationId: ${representationId}`);
  representationIds.add(representationId);
  return {
    representationId,
    sourceManifestationId: id,
    sourceLayer: layer,
    sourcePath,
    sourceObjectType,
    sourceVersion,
    schemaVersion: 'legacy-compatible'
  };
}

function addObject({ id, name, canonicalObjectType, facet, representation: rep }) {
  if (!id || !name) throw new Error('Every unified identity requires a source ID and display name.');
  const existing = objects.get(id);
  if (existing) {
    if (existing.canonicalObjectType !== canonicalObjectType) {
      throw new Error(`Type collision for ${id}: ${existing.canonicalObjectType} / ${canonicalObjectType}`);
    }
    if (existing.displayName.trim().toLowerCase() !== name.trim().toLowerCase()) {
      throw new Error(`Name collision for ${id}: ${existing.displayName} / ${name}`);
    }
    if (!existing.facets.includes(facet)) existing.facets.push(facet);
    existing.representations.push(rep);
    return;
  }
  objects.set(id, {
    canonicalObjectId: id,
    canonicalUri: `${canonicalBase}${encodeURIComponent(id)}`,
    canonicalObjectType,
    displayName: name,
    facets: [facet],
    businessVersion: '1.0.0',
    lifecycleStatus: 'active',
    effectiveDate,
    retirementDate: null,
    replaces: [],
    replacedBy: [],
    representations: [rep]
  });
}

for (const item of indicatorRelease.indicators || []) {
  addObject({
    id: item.id,
    name: item.name,
    canonicalObjectType: 'Indicator',
    facet: 'Indicator registry',
    representation: representation({
      id: item.id,
      layer: 'REGISTRY',
      path: 'indicators/data/indicators.json',
      sourceObjectType: item.objectType || 'Indicator manifestation',
      sourceVersion: item.sourceVersion || null
    })
  });
}

for (const tuple of ncdRelease.records || []) {
  const [id, name] = tuple;
  const source = id >= 'IND-NPNCD2-040' ? ncdRelease.sources?.find(x => x.id === 'IND_NPNCD_TRAINING_2025') : ncdRelease.sources?.find(x => x.id === 'IND_NPNCD_2023_GUIDELINES');
  addObject({
    id,
    name,
    canonicalObjectType: 'Indicator',
    facet: 'Indicator registry',
    representation: representation({
      id,
      layer: 'NCD',
      path: 'indicators/data/ncd/release.json',
      sourceObjectType: 'Indicator manifestation',
      sourceVersion: source?.version || null
    })
  });
}

for (const item of hmisCatalogue.objects || []) {
  addObject({
    id: item.id,
    name: item.name,
    canonicalObjectType: normalizedType(item.objectType),
    facet: item.objectType === 'Derived indicator' ? 'HMIS derived indicator' : 'HMIS knowledge object',
    representation: representation({
      id: item.id,
      layer: 'HMIS',
      path: 'indicators/data/hmis/catalog.json',
      sourceObjectType: item.objectType,
      sourceVersion: item.sourceVersion || item.sourcePeriod || null
    })
  });
}

for (const [id, , , name] of headquarters.records || []) {
  addObject({
    id,
    name,
    canonicalObjectType: 'Data element',
    facet: 'HMIS knowledge object',
    representation: representation({
      id,
      layer: 'HMIS-HQ',
      path: 'indicators/data/hmis/headquarters-elements.json',
      sourceObjectType: 'Data element',
      sourceVersion: headquarters.metadata?.sourceVersion || null
    })
  });
}

for (const [id, , , name] of facilityCorrections.records || []) {
  addObject({
    id,
    name,
    canonicalObjectType: 'Data element',
    facet: 'HMIS knowledge object',
    representation: representation({
      id,
      layer: 'HMIS-FORM',
      path: 'indicators/data/hmis/facility-format-corrections.json',
      sourceObjectType: 'Data element',
      sourceVersion: facilityCorrections.metadata?.sourceVersion || null
    })
  });
}

const candidateByOccurrence = new Map((candidateFields.candidateElements || []).map(item => [item.occurrenceId, item.candidateElementId]));
const canonicalByOccurrence = new Map((reportCrosswalk.crosswalk || []).map(item => [item.occurrenceId, item.canonicalElementId || null]));
const occurrences = [];
for (const item of reportManifest.measureOccurrences || []) {
  occurrences.push({
    occurrenceId: item.occurrenceId,
    representationId: `REP-REPORT-${item.occurrenceId}`,
    occurrenceType: 'Report field occurrence',
    schemaId: item.schemaId,
    columnOrdinal: item.columnOrdinal,
    sourceManifestationId: item.occurrenceId,
    canonicalObjectId: canonicalByOccurrence.get(item.occurrenceId) || null,
    candidateObjectId: candidateByOccurrence.get(item.occurrenceId) || null,
    lifecycleStatus: 'active',
    effectiveDate: item.downloadDate || effectiveDate,
    sourceVersion: item.sourceVersion || null
  });
}
for (const item of reportManifest.dimensionReferences || []) {
  const occurrenceId = `OCC-${reportManifest.metadata.schemaId}-COL-${String(item.columnOrdinal).padStart(4, '0')}`;
  occurrences.push({
    occurrenceId,
    representationId: `REP-REPORT-${occurrenceId}`,
    occurrenceType: 'Reporting dimension',
    schemaId: reportManifest.metadata.schemaId,
    columnOrdinal: item.columnOrdinal,
    sourceManifestationId: item.dimensionId,
    canonicalObjectId: null,
    candidateObjectId: null,
    lifecycleStatus: 'active',
    effectiveDate,
    sourceVersion: item.dictionaryVersion || null
  });
}

const canonicalObjects = [...objects.values()].sort((a, b) => a.canonicalObjectId.localeCompare(b.canonicalObjectId));
for (const item of canonicalObjects) {
  item.facets.sort();
  item.representations.sort((a, b) => a.representationId.localeCompare(b.representationId));
}
occurrences.sort((a, b) => a.columnOrdinal - b.columnOrdinal || a.occurrenceId.localeCompare(b.occurrenceId));

const typeCounts = canonicalObjects.reduce((counts, item) => {
  counts[item.canonicalObjectType] = (counts[item.canonicalObjectType] || 0) + 1;
  return counts;
}, {});
const multiRepresentationObjects = canonicalObjects.filter(item => item.representations.length > 1);
const linkedMeasureOccurrences = occurrences.filter(item => item.occurrenceType === 'Report field occurrence' && item.canonicalObjectId);

const result = {
  metadata: {
    id: 'PHAOS-UNIFIED-IDENTITY-INDEX',
    title: 'Public Health Analytics-OS unified object identity index',
    version: '1.0.0',
    generated: effectiveDate,
    taxonomyVersion: '1.0.0',
    identityPolicyVersion: '1.0.0',
    analyticsOsRelease: '3.7',
    canonicalBase,
    interpretationBoundary: 'This is an identity and deduplication index, not a source dictionary, semantic-equivalence assertion, computability claim or dataset of observed values.'
  },
  counts: {
    canonicalObjects: canonicalObjects.length,
    canonicalObjectTypes: typeCounts,
    representations: representationIds.size,
    multiRepresentationObjects: multiRepresentationObjects.length,
    reportColumnOccurrences: occurrences.length,
    reportMeasureOccurrences: occurrences.filter(item => item.occurrenceType === 'Report field occurrence').length,
    reportDimensionOccurrences: occurrences.filter(item => item.occurrenceType === 'Reporting dimension').length,
    linkedMeasureOccurrences: linkedMeasureOccurrences.length,
    candidateMeasureOccurrences: occurrences.filter(item => item.candidateObjectId).length
  },
  canonicalObjects,
  occurrences
};

fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result.counts, null, 2));
