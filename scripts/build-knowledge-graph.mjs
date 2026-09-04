import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'indicators', 'data');
const graphDir = path.join(dataDir, 'graph');
const programmeLabel = 'Universal Immunization Programme / Mission Indradhanush';
const baseUri = 'https://abeezith.github.io/Public-Health-Analytics-OS/id/';
const releaseDate = '2026-09-04';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const registry = readJson(path.join(dataDir, 'indicators.json'));
const hmis = readJson(path.join(dataDir, 'hmis', 'catalog.json'));
const sourceCensus = readJson(path.join(dataDir, 'sources.json'));
const immunization = readJson(path.join(dataDir, 'immunization', 'release.json'));
const ontology = readJson(path.join(graphDir, 'ontology.json'));
const vocabularies = readJson(path.join(graphDir, 'vocabularies.json'));
const conceptRegistry = readJson(path.join(graphDir, 'concepts.json'));

const allIndicators = registry.indicators || [];
const allHmis = hmis.objects || [];
const sourceRows = Array.isArray(sourceCensus) ? sourceCensus : sourceCensus.sources || [];
const isImmunization = record => record.indiaProgram === programmeLabel || (record.programmeTags || []).includes(programmeLabel);
const indicators = allIndicators.filter(isImmunization);
const taggedHmis = allHmis.filter(record => (record.programmeTags || []).includes(programmeLabel));
const indicatorById = new Map(allIndicators.map(record => [record.id, record]));
const hmisById = new Map(allHmis.map(record => [record.id, record]));
const sourceById = new Map(sourceRows.map(record => [record.id, record]));
for (const source of immunization.sources || []) sourceById.set(source.id, { ...sourceById.get(source.id), ...source });

const nodes = [];
const edges = [];
const mappingReviewRows = [];
const nodeIds = new Set();
const edgeIds = new Set();
const slug = value => String(value).normalize('NFKD').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toUpperCase();
const uri = id => baseUri + encodeURIComponent(id);

function addNode(node) {
  if (!node.id || !ontology.nodeTypes[node.type]) throw new Error(`Invalid node ${node.id || '(missing id)'} / ${node.type}`);
  if (nodeIds.has(node.id)) {
    const existing = nodes.find(item => item.id === node.id);
    if (existing.type !== node.type) {
      existing.additionalTypes = [...new Set([...(existing.additionalTypes || []), node.type])];
      existing.data = { ...existing.data, [`${node.type[0].toLowerCase()}${node.type.slice(1)}`]: node.data };
    }
    return;
  }
  nodeIds.add(node.id);
  nodes.push({ ...node, uri: node.uri || uri(node.id) });
}

function addEdge(edge) {
  if (!ontology.edgeTypes[edge.predicate]) throw new Error(`Unknown predicate ${edge.predicate}`);
  const id = edge.id || `EDGE-${slug(edge.source)}-${slug(edge.predicate)}-${slug(edge.target)}`;
  if (edgeIds.has(id)) return;
  edgeIds.add(id);
  edges.push({ id, assertionStatus: 'curated', ...edge });
}

const programme = vocabularies.programmes.find(item => item.label === programmeLabel);
addNode({ id: programme.id, type: 'Programme', label: programme.label, description: 'India national immunization programme family used to connect source-specific indicator manifestations.', data: programme });

const pillarByLabel = new Map();
for (const pillar of vocabularies.whoBuildingBlocks) {
  addNode({ id: pillar.id, type: 'WHOBuildingBlock', label: pillar.label, description: 'Canonical WHO health-system building block used for analytical discovery.', data: pillar });
  pillarByLabel.set(pillar.label, pillar);
  for (const alternate of pillar.alternateLabels || []) pillarByLabel.set(alternate, pillar);
}

const measureByLabel = new Map(vocabularies.measureTypes.map(item => [item.label, item]));
for (const measure of vocabularies.measureTypes) addNode({ id: measure.id, type: 'MeasureType', label: measure.label, description: measure.scalePolicy, data: measure });

const levelById = new Map(vocabularies.reportingLevels.map(item => [item.id, item]));
function normalizeLowestLevel(label = '') {
  const value = label.toLowerCase();
  if (value.includes('community/household') || value.includes('revenue village') || value === 'household') return levelById.get('LEVEL-COMMUNITY-HOUSEHOLD');
  if (value.includes('session/community')) return levelById.get('LEVEL-SESSION-COMMUNITY');
  if (value.includes('facility') || value.includes('sub-centre') || value.includes('phc') || value.includes('laboratory') || value.includes('dmc')) return levelById.get('LEVEL-FACILITY');
  if (value.includes('block')) return levelById.get('LEVEL-BLOCK');
  if (value.includes('district')) return levelById.get('LEVEL-DISTRICT');
  if (value.includes('state')) return levelById.get('LEVEL-STATE');
  return levelById.get('LEVEL-NATIONAL');
}

const usedLevels = new Set(indicators.map(item => normalizeLowestLevel(item.lowestReportingLevel || item.administrativeLevel).id));
for (const id of usedLevels) {
  const level = levelById.get(id);
  addNode({ id: level.id, type: 'ReportingLevel', label: level.label, description: `Normalized reporting hierarchy level ${level.rank}.`, data: level });
}

const sourceIds = new Set(indicators.map(item => item.sourceId).filter(Boolean));
const organizationIds = new Map();
for (const sourceId of sourceIds) {
  const source = sourceById.get(sourceId) || {};
  const manifestations = indicators.filter(item => item.sourceId === sourceId);
  const organization = manifestations.find(item => item.org)?.org || source.org || 'Source custodian not specified';
  const organizationId = `ORG-${slug(organization)}`;
  organizationIds.set(organization, organizationId);
  addNode({ id: organizationId, type: 'Organization', label: organization, description: 'Source publisher or custodian.', data: { name: organization } });
  addNode({
    id: sourceId,
    type: 'SourceDocument',
    label: source.document || source.name || source.source || manifestations[0]?.source || sourceId,
    description: source.boundary || source.status || 'Source publication represented in the registry.',
    url: source.url || manifestations[0]?.url,
    data: {
      sourceId,
      sourceName: source.source || source.name || manifestations[0]?.source,
      organization,
      version: source.version || manifestations[0]?.sourceVersion || '',
      boundary: source.boundary || '',
      status: source.status || '',
      url: source.url || manifestations[0]?.url || ''
    }
  });
  addEdge({ source: sourceId, target: organizationId, predicate: 'publishedBy', label: 'published by', assertionStatus: 'official', evidence: source.url || manifestations[0]?.url || '' });
}

const componentIds = new Map();
for (const indicator of indicators) {
  const component = indicator.programmeComponent || indicator.subdomain || 'Unclassified component';
  const componentId = `COMPONENT-UIP-${slug(component)}`;
  componentIds.set(component, componentId);
  addNode({ id: componentId, type: 'ProgrammeComponent', label: component, description: 'Programme component preserved from the indicator metadata.', data: { programme: programmeLabel } });
  addNode({
    id: indicator.id,
    type: 'IndicatorManifestation',
    label: indicator.name,
    description: indicator.displayDefinition || indicator.definition,
    url: indicator.url,
    data: {
      officialIndicatorName: indicator.officialIndicatorName || indicator.name,
      officialNameStatus: indicator.officialNameStatus || '',
      sourceId: indicator.sourceId,
      source: indicator.source,
      organization: indicator.org,
      programme: programmeLabel,
      programmeComponent: component,
      measureType: indicator.measureType,
      scaleDisplay: indicator.scaleDisplay,
      normalizedFormula: indicator.normalizedFormula,
      denominatorPopulation: indicator.denominatorPopulation,
      lowestReportingLevel: indicator.lowestReportingLevel || '',
      reportingLevel: indicator.reportingLevel || indicator.administrativeLevel || '',
      whoPillars: indicator.whoPillars || [],
      crosswalkStatus: indicator.crosswalkStatus || '',
      status: indicator.status,
      verified: indicator.verified,
      sourcePage: indicator.sourcePage || '',
      url: indicator.url
    }
  });
  addEdge({ source: indicator.id, target: indicator.sourceId, predicate: 'definedBy', label: 'defined by', assertionStatus: 'official', evidence: indicator.url || '' });
  addEdge({ source: indicator.id, target: programme.id, predicate: 'partOfProgramme', label: 'part of programme', assertionStatus: 'curated', rationale: 'Programme membership is taken from the registry programme tag.' });
  addEdge({ source: indicator.id, target: componentId, predicate: 'hasProgrammeComponent', label: 'programme component', assertionStatus: 'official', evidence: indicator.url || '' });
  const measure = measureByLabel.get(indicator.measureType);
  if (measure) addEdge({ source: indicator.id, target: measure.id, predicate: 'hasMeasureType', label: 'measure type', assertionStatus: 'normalized', sourceLabel: indicator.measureType });
  const level = normalizeLowestLevel(indicator.lowestReportingLevel || indicator.administrativeLevel);
  addEdge({ source: indicator.id, target: level.id, predicate: 'lowestReportingLevel', label: 'lowest reporting level', assertionStatus: 'normalized', sourceLabel: indicator.lowestReportingLevel || indicator.administrativeLevel || '', rationale: 'Deterministic normalization; original wording is preserved on this edge.' });
  for (const sourcePillar of indicator.whoPillars || []) {
    const pillar = pillarByLabel.get(sourcePillar);
    if (!pillar) throw new Error(`Unmapped WHO building-block label: ${sourcePillar}`);
    addEdge({ source: indicator.id, target: pillar.id, predicate: 'supportsBuildingBlock', label: 'supports building block', assertionStatus: 'curated', sourceLabel: sourcePillar, rationale: indicator.whoPillarBasis || 'Analytics-OS analytical classification.' });
  }
}

for (const hmisObject of taggedHmis) {
  addNode({
    id: hmisObject.id,
    type: 'HmisObject',
    label: hmisObject.name,
    description: hmisObject.displayDefinition || hmisObject.definition || '',
    url: hmisObject.sourceUrl,
    data: {
      objectType: hmisObject.objectType,
      component: hmisObject.component,
      measureType: hmisObject.measureType || '',
      scaleDisplay: hmisObject.scaleDisplay || '',
      denominatorPopulation: hmisObject.denominatorPopulation || '',
      versionStatus: hmisObject.versionStatus || '',
      sourceVersion: hmisObject.sourceVersion || '',
      sourceUrl: hmisObject.sourceUrl || '',
      whoPillars: hmisObject.whoPillars || []
    }
  });
  addEdge({ source: hmisObject.id, target: programme.id, predicate: 'partOfProgramme', label: 'part of programme', assertionStatus: 'curated', rationale: 'HMIS object is tagged to the Immunization programme without changing its HMIS identity.' });
}

for (const indicator of indicators) {
  for (const targetId of indicator.relatedElementIds || []) {
    if (!nodeIds.has(targetId) || !hmisById.has(targetId)) continue;
    const target = hmisById.get(targetId);
    addEdge({
      source: indicator.id,
      target: targetId,
      predicate: target.objectType === 'Data element' ? 'usesDataElement' : 'relatedHmisObject',
      label: target.objectType === 'Data element' ? 'uses data element' : 'related HMIS object',
      assertionStatus: 'curated',
      rationale: indicator.crosswalkStatus || 'Curated registry crosswalk; definitions remain distinct.'
    });
  }
  for (const targetId of indicator.relatedIndicatorIds || []) {
    if (!nodeIds.has(targetId) || !indicatorById.has(targetId)) continue;
    addEdge({ source: indicator.id, target: targetId, predicate: 'relatedIndicator', label: 'related indicator', assertionStatus: 'curated', rationale: indicator.crosswalkStatus || 'Curated discovery relationship; not an equivalence assertion.' });
  }
}

for (const hmisObject of taggedHmis) {
  for (const targetId of hmisObject.relatedElementIds || []) {
    if (!nodeIds.has(targetId) || !hmisById.has(targetId)) continue;
    addEdge({ source: hmisObject.id, target: targetId, predicate: 'relatedHmisObject', label: 'related HMIS object', assertionStatus: 'curated', rationale: 'Relationship preserved from the HMIS knowledge model.' });
  }
}

for (const concept of conceptRegistry.concepts) {
  addNode({ id: concept.id, type: 'IndicatorConcept', label: concept.label, description: concept.definition, data: { mappingCount: concept.mappings.length, status: conceptRegistry.metadata.status, reviewPolicy: conceptRegistry.metadata.reviewPolicy, mappingDirection: conceptRegistry.metadata.mappingDirection } });
  for (const mapping of concept.mappings) {
    if (!nodeIds.has(mapping.indicatorId)) throw new Error(`Concept mapping target missing from pilot: ${mapping.indicatorId}`);
    const indicator = indicatorById.get(mapping.indicatorId);
    const source = sourceById.get(indicator.sourceId) || {};
    const reviewId = `REVIEW-${mapping.indicatorId}-${concept.id}`;
    const review = {
      id: reviewId,
      conceptId: concept.id,
      conceptLabel: concept.label,
      indicatorId: mapping.indicatorId,
      officialIndicatorName: indicator.officialIndicatorName || indicator.name,
      previousRelation: mapping.previousRelation,
      reviewedRelation: mapping.mappingRelation,
      decision: mapping.previousRelation === mapping.mappingRelation ? 'Retained' : 'Changed',
      reviewStatus: mapping.reviewStatus,
      comparisonClass: mapping.comparisonClass,
      aggregationSafe: mapping.aggregationSafe,
      inverseDirection: Boolean(mapping.inverseDirection),
      differences: mapping.differences || [],
      rationale: mapping.rationale,
      measureType: indicator.measureType,
      scale: indicator.scaleDisplay,
      denominatorPopulation: indicator.denominatorPopulation,
      sourceId: indicator.sourceId,
      sourceName: indicator.source,
      sourcePage: indicator.sourcePage || '',
      sourceUrl: source.url || indicator.url || '',
      reviewedOn: conceptRegistry.metadata.reviewedOn
    };
    mappingReviewRows.push(review);
    addEdge({
      id: `EDGE-${mapping.indicatorId}-MANIFESTATION-${concept.id}`,
      source: mapping.indicatorId,
      target: concept.id,
      predicate: 'manifestationOf',
      label: mapping.mappingRelation,
      assertionStatus: 'curated',
      mappingRelation: mapping.mappingRelation,
      rationale: mapping.rationale,
      reviewId,
      reviewStatus: mapping.reviewStatus,
      comparisonClass: mapping.comparisonClass,
      aggregationSafe: mapping.aggregationSafe,
      inverseDirection: Boolean(mapping.inverseDirection),
      differences: mapping.differences || [],
      sourceId: indicator.sourceId,
      sourceName: indicator.source,
      sourcePage: indicator.sourcePage || '',
      sourceUrl: source.url || indicator.url || '',
      reviewedOn: conceptRegistry.metadata.reviewedOn,
      curatedBy: 'Public Health Analytics-OS'
    });
  }
}

for (const gap of immunization.evidenceGaps || []) {
  addNode({ id: gap.id, type: 'EvidenceGap', label: gap.source, description: gap.status, data: gap });
  addEdge({ source: gap.id, target: programme.id, predicate: 'limitsCompletenessOf', label: 'limits completeness', assertionStatus: 'official', rationale: gap.nextAction });
}

nodes.sort((a, b) => a.type.localeCompare(b.type) || a.label.localeCompare(b.label) || a.id.localeCompare(b.id));
edges.sort((a, b) => a.source.localeCompare(b.source) || a.predicate.localeCompare(b.predicate) || a.target.localeCompare(b.target));

const countBy = (rows, property) => rows.reduce((acc, row) => ((acc[row[property]] = (acc[row[property]] || 0) + 1), acc), {});
const graph = {
  metadata: {
    id: 'PHAOS-KG-UIP-0.2',
    title: 'Domain-reviewed Immunization knowledge graph pilot',
    version: '0.2.0',
    status: 'Domain-reviewed proof of concept',
    generated: releaseDate,
    programme: programmeLabel,
    scope: 'All 76 Immunization-discoverable registry manifestations, 102 programme-tagged HMIS knowledge objects, their public sources, normalized discovery vocabularies, five curated concepts, 23 domain-reviewed concept mappings and seven declared evidence gaps.',
    ontology: './ontology.json',
    vocabularies: './vocabularies.json',
    schemaOrg: './schemaorg.jsonld',
    counts: {
      nodes: nodes.length,
      edges: edges.length,
      indicators: indicators.length,
      hmisObjects: taggedHmis.length,
      standaloneHmisNodes: nodes.filter(node => node.type === 'HmisObject').length,
      coTypedHmisIndicatorNodes: nodes.filter(node => (node.additionalTypes || []).includes('HmisObject')).length,
      concepts: conceptRegistry.concepts.length,
      reviewedMappings: mappingReviewRows.length,
      sources: sourceIds.size,
      evidenceGaps: (immunization.evidenceGaps || []).length,
      nodeTypes: countBy(nodes, 'type'),
      edgeTypes: countBy(edges, 'predicate')
    }
  },
  nodes,
  edges
};

const reviewRelationCounts = countBy(mappingReviewRows, 'reviewedRelation');
const reviewDecisionCounts = countBy(mappingReviewRows, 'decision');
const mappingReview = {
  metadata: {
    id: 'PHAOS-UIP-CONCEPT-MAPPING-REVIEW-0.2',
    version: conceptRegistry.metadata.version,
    reviewedOn: conceptRegistry.metadata.reviewedOn,
    scope: 'All 23 initial Immunization concept mappings.',
    mappingDirection: conceptRegistry.metadata.mappingDirection,
    directionPolicy: conceptRegistry.metadata.directionPolicy,
    aggregationPolicy: conceptRegistry.metadata.reviewPolicy,
    reviewDimensions: conceptRegistry.metadata.reviewDimensions,
    relationCounts: reviewRelationCounts,
    decisionCounts: reviewDecisionCounts
  },
  reviews: mappingReviewRows
};

const danglingEdges = edges.filter(edge => !nodeIds.has(edge.source) || !nodeIds.has(edge.target));
const duplicateNodeIds = nodes.length - new Set(nodes.map(node => node.id)).size;
const duplicateEdgeIds = edges.length - new Set(edges.map(edge => edge.id)).size;
const missingAssertionStatus = edges.filter(edge => !edge.assertionStatus);
const incompleteConceptMappings = edges.filter(edge => edge.predicate === 'manifestationOf' && (!edge.mappingRelation || !edge.rationale));
const incompleteMappingReviews = mappingReviewRows.filter(review => !review.reviewStatus || !review.comparisonClass || typeof review.aggregationSafe !== 'boolean' || !review.sourceId || !review.sourceUrl || !review.differences.length);
const alteredOfficialNames = indicators.filter(indicator => nodes.find(node => node.id === indicator.id)?.label !== indicator.name);
const representedHmisIds = new Set(nodes.filter(node => node.type === 'HmisObject' || (node.additionalTypes || []).includes('HmisObject')).map(node => node.id));
const sourceNode = sourceId => ({ '@id': uri(sourceId) });
const conceptMappingsByIndicator = new Map();
for (const edge of edges.filter(item => item.predicate === 'manifestationOf')) {
  if (!conceptMappingsByIndicator.has(edge.source)) conceptMappingsByIndicator.set(edge.source, []);
  conceptMappingsByIndicator.get(edge.source).push(edge);
}

const schemaGraph = [
  {
    '@id': baseUri + 'catalog/public-health-indicator-registry',
    '@type': ['DataCatalog', 'dcat:Catalog'],
    name: 'Public Health Analytics-OS Indicator Registry',
    description: 'Evidence-backed metadata catalogue of public-health indicator definitions and source manifestations.',
    url: 'https://abeezith.github.io/Public-Health-Analytics-OS/indicators/',
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    dataset: { '@id': baseUri + 'dataset/immunization-knowledge-graph-0.2' }
  },
  {
    '@id': baseUri + 'dataset/immunization-knowledge-graph-0.2',
    '@type': ['Dataset', 'dcat:Dataset'],
    name: 'Domain-reviewed Immunization knowledge graph pilot',
    description: graph.metadata.scope,
    version: graph.metadata.version,
    dateModified: releaseDate,
    includedInDataCatalog: { '@id': baseUri + 'catalog/public-health-indicator-registry' },
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    variableMeasured: indicators.map(indicator => ({ '@id': uri(indicator.id) }))
  },
  {
    '@id': baseUri + 'term-set/immunization-indicator-concepts',
    '@type': ['DefinedTermSet', 'skos:ConceptScheme'],
    name: 'Immunization indicator concepts',
    hasDefinedTerm: conceptRegistry.concepts.map(concept => ({ '@id': uri(concept.id) }))
  },
  ...[...organizationIds.entries()].map(([name, id]) => ({ '@id': uri(id), '@type': 'Organization', name })),
  ...[...sourceIds].map(id => {
    const node = nodes.find(item => item.id === id);
    return {
      '@id': uri(id),
      '@type': 'DigitalDocument',
      identifier: id,
      name: node.label,
      description: node.description,
      url: node.data.url,
      version: node.data.version,
      publisher: { '@id': uri(organizationIds.get(node.data.organization)) }
    };
  }),
  ...conceptRegistry.concepts.map(concept => ({
    '@id': uri(concept.id),
    '@type': ['DefinedTerm', 'skos:Concept'],
    termCode: concept.id,
    name: concept.label,
    description: concept.definition,
    inDefinedTermSet: { '@id': baseUri + 'term-set/immunization-indicator-concepts' }
  })),
  ...indicators.map(indicator => {
    const mappings = conceptMappingsByIndicator.get(indicator.id) || [];
    const skosMappings = {};
    for (const mapping of mappings) {
      const key = `skos:${mapping.mappingRelation}`;
      if (!skosMappings[key]) skosMappings[key] = [];
      skosMappings[key].push({ '@id': uri(mapping.target) });
    }
    return {
      '@id': uri(indicator.id),
      '@type': ['StatisticalVariable', 'ph:IndicatorManifestation'],
      identifier: indicator.id,
      name: indicator.name,
      alternateName: indicator.officialIndicatorName && indicator.officialIndicatorName !== indicator.name ? indicator.officialIndicatorName : undefined,
      description: indicator.displayDefinition || indicator.definition,
      statType: indicator.measureType,
      unitText: indicator.scaleDisplay || indicator.unit,
      measurementMethod: indicator.normalizedFormula || indicator.formula,
      measurementDenominator: indicator.denominatorPopulation ? {
        '@id': uri(`DENOMINATOR-${indicator.id}`),
        '@type': 'StatisticalVariable',
        name: indicator.denominatorPopulation
      } : undefined,
      isBasedOn: sourceNode(indicator.sourceId),
      about: [{ '@id': uri(programme.id) }, ...mappings.map(mapping => ({ '@id': uri(mapping.target) }))],
      keywords: (indicator.whoPillars || []).map(label => pillarByLabel.get(label)?.label).filter(Boolean),
      dateModified: indicator.verified || releaseDate,
      ...skosMappings
    };
  }),
  ...edges.filter(edge => edge.predicate === 'manifestationOf').map(edge => ({
    '@id': uri(edge.id),
    '@type': ['ph:GraphAssertion', 'prov:Entity'],
    'ph:subject': { '@id': uri(edge.source) },
    'ph:predicate': edge.predicate,
    'ph:object': { '@id': uri(edge.target) },
    'ph:mappingRelation': edge.mappingRelation,
    'ph:assertionStatus': edge.assertionStatus,
    'ph:reviewStatus': edge.reviewStatus,
    'ph:comparisonClass': edge.comparisonClass,
    'ph:aggregationSafe': edge.aggregationSafe,
    'ph:reviewId': edge.reviewId,
    description: edge.rationale,
    dateModified: edge.reviewedOn,
    creator: edge.curatedBy
  }))
];

const schemaOrg = {
  '@context': {
    '@vocab': 'https://schema.org/',
    ph: baseUri + 'vocab/',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    prov: 'http://www.w3.org/ns/prov#',
    dcat: 'http://www.w3.org/ns/dcat#'
  },
  '@graph': JSON.parse(JSON.stringify(schemaGraph).replace(/,"[^"]+":undefined/g, ''))
};

const qa = {
  metadata: { graphId: graph.metadata.id, checked: releaseDate },
  counts: graph.metadata.counts,
  gates: {
    expectedImmunizationIndicators: { expected: 76, actual: indicators.length, pass: indicators.length === 76 },
    expectedHmisObjects: { expected: 102, actual: taggedHmis.length, pass: taggedHmis.length === 102 },
    allHmisIdentitiesRepresented: { expected: 102, actual: representedHmisIds.size, pass: representedHmisIds.size === 102 },
    expectedConcepts: { expected: 5, actual: conceptRegistry.concepts.length, pass: conceptRegistry.concepts.length === 5 },
    expectedEvidenceGaps: { expected: 7, actual: immunization.evidenceGaps.length, pass: immunization.evidenceGaps.length === 7 },
    uniqueNodeIds: { failures: duplicateNodeIds, pass: duplicateNodeIds === 0 },
    uniqueEdgeIds: { failures: duplicateEdgeIds, pass: duplicateEdgeIds === 0 },
    noDanglingEdges: { failures: danglingEdges.length, pass: danglingEdges.length === 0 },
    allEdgesHaveAssertionStatus: { failures: missingAssertionStatus.length, pass: missingAssertionStatus.length === 0 },
    conceptMappingsHaveRelationAndRationale: { failures: incompleteConceptMappings.length, pass: incompleteConceptMappings.length === 0 },
    allInitialMappingsDomainReviewed: { expected: 23, actual: mappingReviewRows.length, failures: incompleteMappingReviews.length, pass: mappingReviewRows.length === 23 && incompleteMappingReviews.length === 0 },
    reviewDecisionAudit: { expectedChanged: 14, changed: reviewDecisionCounts.Changed || 0, expectedRetained: 9, retained: reviewDecisionCounts.Retained || 0, pass: reviewDecisionCounts.Changed === 14 && reviewDecisionCounts.Retained === 9 },
    reviewedRelationDistribution: { expected: { closeMatch: 6, broadMatch: 12, relatedMatch: 5 }, actual: reviewRelationCounts, pass: reviewRelationCounts.closeMatch === 6 && reviewRelationCounts.broadMatch === 12 && reviewRelationCounts.relatedMatch === 5 && !reviewRelationCounts.narrowMatch && !reviewRelationCounts.exactMatch },
    noAggregationPermissionGranted: { failures: mappingReviewRows.filter(review => review.aggregationSafe).length, pass: !mappingReviewRows.some(review => review.aggregationSafe) },
    officialNamesPreserved: { failures: alteredOfficialNames.length, pass: alteredOfficialNames.length === 0 },
    sixCanonicalBuildingBlocks: { expected: 6, actual: vocabularies.whoBuildingBlocks.length, pass: vocabularies.whoBuildingBlocks.length === 6 },
    schemaOrgUsesDefinitionsNotObservations: { observationNodes: schemaGraph.filter(item => item['@type'] === 'Observation' || item['@type']?.includes?.('Observation')).length, pass: !schemaGraph.some(item => item['@type'] === 'Observation' || item['@type']?.includes?.('Observation')) }
  }
};

const failedGates = Object.entries(qa.gates).filter(([, gate]) => !gate.pass);
if (failedGates.length) throw new Error(`Knowledge graph QA failed: ${failedGates.map(([name]) => name).join(', ')}`);

writeJson(path.join(graphDir, 'graph.json'), graph);
writeJson(path.join(graphDir, 'mapping-review.json'), mappingReview);
writeJson(path.join(graphDir, 'schemaorg.jsonld'), schemaOrg);
writeJson(path.join(graphDir, 'qa.json'), qa);
console.log(JSON.stringify({ graph: graph.metadata.counts, qa: 'passed' }, null, 2));
