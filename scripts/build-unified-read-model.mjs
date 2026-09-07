import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const write = (relative, value) => {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
};
const releaseDate = '2026-09-07';
const modelPath = 'indicators/data/registry/unified-read-model.json';
const manifestPath = 'indicators/data/registry/manifest.json';

const indicatorRelease = read('indicators/data/indicators.json');
const ncdRelease = read('indicators/data/ncd/release.json');
const hmisCatalogue = read('indicators/data/hmis/catalog.json');
const hmisCrosswalks = read('indicators/data/hmis/crosswalks.json');
const headquarters = read('indicators/data/hmis/headquarters-elements.json');
const facilityCorrections = read('indicators/data/hmis/facility-format-corrections.json');
const identities = read('indicators/data/governance/unified-identity-index.json');
const discovery = read('indicators/data/governance/discovery-facets.json');
const graph = read('indicators/data/graph/graph.json');
const reportDir = 'indicators/data/hmis/report-schemas/state-report-20260901';
const reportManifest = read(`${reportDir}/HMIS-RPTSCHEMA-STATE-20260901-001.report-schema-manifest.json`);
const dimensionDictionary = read(`${reportDir}/HMIS-RPTSCHEMA-STATE-20260901-001.dimension-dictionary.json`);
const candidateFields = read(`${reportDir}/candidate-new-elements.json`);
const reportCrosswalk = read(`${reportDir}/column-to-element-crosswalk.json`);

function expandNcdRelease(release) {
  const programme = 'National Programme for Prevention and Control of Non-Communicable Diseases';
  const guidelines = release.sources.find(x => x.id === 'IND_NPNCD_2023_GUIDELINES');
  const training = release.sources.find(x => x.id === 'IND_NPNCD_TRAINING_2025');
  return (release.records || []).map(([id,name,component,measureType,denominator,numerator,definition,reportingLevel,lowestReportingLevel,frequency,whoPillars,sourcePage]) => {
    const source = id >= 'IND-NPNCD2-040' ? training : guidelines;
    const percentage = measureType === 'Percentage/proportion';
    const count = measureType === 'Count';
    return {id,name,officialIndicatorName:name,officialNameStatus:'Official/source wording preserved',domain:'Noncommunicable diseases',subdomain:component,type:count?'Output / activity':component==='Control and outcomes'||component==='Incidence'?'Outcome / performance':'Process / performance',code:'',definition,displayDefinition:`${definition} Denominator population: ${denominator}.`,numerator,denominator,formula:percentage?'(Numerator / denominator) × 100':count?'Count':'Source-defined status, change or categorical method',unit:percentage?'Percentage':count?'Number':'Source-defined index/status',population:denominator,frequency,dataSource:'National NCD Portal and NP-NCD programme reporting',disaggregation:'Geography; sex; age; disease; facility type and cadre where collected',direction:'Interpret against the official programme target and source-defined method',uses:'Programme monitoring; service-cascade analysis; readiness assessment; local planning; data-quality review',caveats:id==='IND-NPNCD2-038'?'The official label is preserved but appears internally inconsistent: it specifies blood-pressure control for people with diabetes. Custodian clarification is required before computation or comparison.':'Source-table manifestation. Confirm current portal field codes, exclusions, reporting period and validation rules before operational computation.',source:`India — ${source.source}`,org:'Ministry of Health and Family Welfare, Government of India',url:source.url,authority:5,utility:9,group:id.replaceAll('-','_'),confidence:id==='IND-NPNCD2-038'?'Moderate':'High',status:'Active / published',verified:'2026-09-05',collection:'India national programme extension — official source-table release',sourceId:source.id,language:'English',metadataLevel:'A',sourceVariant:false,completeness:94,whoPillars,whoPillarPrimary:whoPillars[0],whoPillarBasis:'Analytical mapping by the Public Health Analytics-OS registry to the WHO health-system building-block framework; not assigned by the source custodian.',country:'India',indiaProgram:programme,programmeTags:[programme],programmeComponent:component,indiaReportingSystem:'National NCD Portal and NP-NCD programme reporting',administrativeLevel:reportingLevel,reportingLevel,lowestReportingLevel,facilityType:lowestReportingLevel==='Facility'?'Programme facility, including AAM/SHC, PHC, CHC or DH as source-defined':lowestReportingLevel==='Community/household'?'Community/household and linked primary-care facility':'Administrative programme unit',reportingUnit:lowestReportingLevel,responsibleCadre:'Source-defined NP-NCD programme team and reporting facility',recordType:'Official programme monitoring manifestation',objectType:'Indicator manifestation',sourceDocument:source.document,sourceSection:sourcePage,sourceItemCode:'',sourceVersion:source.version,sourcePage,indiaReleaseStatus:'Included — source-complete within declared NP-NCD boundary',measureType,scaleDisplay:percentage?'%':count?'count':'source-defined index/status',normalizedFormula:percentage?'(numerator ÷ denominator) × 100':count?'Count of source-defined events or units':'Source-defined; not computable from the cited table alone',denominatorPopulation:denominator,aggregationRule:percentage?'Aggregate by summing compatible numerators and denominators, then recomputing; do not average reported percentages.':count?'Sum only across mutually exclusive reporting units and compatible periods.':'Do not aggregate until the source-defined scoring or change method is obtained.',zeroDenominatorRule:percentage?'If the denominator is zero, report not applicable/undefined; do not report 0%.':'Not applicable unless defined by the source.',relatedElementIds:[],relatedIndicatorIds:id==='IND-NPNCD2-040'?['IND-NPNCD-001']:id==='IND-NPNCD2-041'?['IND-NPNCD-002','IND-NPNCD-005']:id==='IND-NPNCD2-042'?['IND-NPNCD-003']:id==='IND-NPNCD2-043'?['IND-NPNCD-004']:[],crosswalkStatus:'No exact computable HMIS crosswalk asserted; source and HMIS manifestations remain distinct.',lineage:`Community or programme service event → ${lowestReportingLevel} reporting → National NCD Portal / programme aggregation → analytical output`,currentness:'Official source checked 5 September 2026'};
  });
}

function expandHeadquarters(doc) {
  return (doc.records || []).map(([id,reportingUnit,code,name,component,domain,page]) => {
    const stock = component === 'District stock position';
    const average = name.startsWith('Average ');
    const rmncha = !['Emergency and referral services','Communicable diseases','Oral health'].includes(domain);
    return {id,objectType:'Data element',name,definition:`Monthly HMIS ${reportingUnit} reporting element: ${name}.`,displayDefinition:`Monthly HMIS ${reportingUnit} reporting element: ${name}.`,component,domain,facilityTypes:[reportingUnit],moduleTitles:[component],sourceCodes:[code],sourceLocations:[`${reportingUnit} p.${page}`],collectionDimensions:stock?['Balance from previous month','Stock received','Unusable stock','Stock distributed','Total stock']:['Numbers reported during the month'],recordClass:'Raw headquarters reporting data element',reportingPeriod:'Monthly',reportingLevels:reportingUnit==='Block HQ'?['Block/planning unit','District','State/UT','National']:['District','State/UT','National'],lowestReportingLevel:reportingUnit==='Block HQ'?'Block/planning unit':'District',aggregationRule:stock?'Stock-flow vector; preserve all five columns and validate the balance equation':average?'Non-additive average; aggregate from numerator and denominator':'Generally additive count subject to source-defined subgroup and duplicate rules',zeroBlankSemantics:'Do not collapse zero, blank, not applicable and non-reporting.',whoPillars:['Health information systems','Service delivery',...(stock?['Medical products, vaccines and technologies']:[])],sourceVersion:doc.metadata.sourceVersion,versionStatus:'Current public headquarters form candidate',sourceUrl:doc.metadata.sourceUrl,sourceAuthority:doc.metadata.sourceAuthority,provenanceStatus:'Exact form label and code retained; section headings excluded',lineage:`Programme or district activity → ${reportingUnit} monthly format → HMIS aggregation → analytical output`,uses:['Programme monitoring','Administrative-unit review','Data-quality review'],caveats:'A form field is not automatically a calculated indicator. Preserve reporting unit, code, collection dimensions and source version.',relatedIndicatorIds:[],relatedValidationRuleIds:[],measureType:null,scaleDisplay:'Not specified',normalizedFormula:'',denominatorPopulation:'Not applicable to a raw reporting field',programmeTags:rmncha?['NHM RMNCH+A']:[]};
  });
}

function applyFacilityCorrections(objects, doc) {
  const rows = objects.map(x => ({...x,facilityTypes:[...(x.facilityTypes||[])],sourceLocations:[...(x.sourceLocations||[])]}));
  const index = new Map(rows.map(x => [x.id,x]));
  for (const mutation of doc.mutations || []) {
    const item = index.get(mutation.id);
    if (!item) continue;
    for (const [facility,location] of mutation.remove || []) {
      item.facilityTypes = item.facilityTypes.filter(value => value !== facility);
      item.sourceLocations = item.sourceLocations.filter(value => value !== location);
    }
    for (const [facility,location] of mutation.add || []) {
      if (!item.facilityTypes.includes(facility)) item.facilityTypes.push(facility);
      if (!item.sourceLocations.includes(location)) item.sourceLocations.push(location);
    }
  }
  return rows;
}

function expandFacilityCorrections(doc) {
  return (doc.records || []).map(([id,facility,code,name,component,domain,page]) => ({id,objectType:'Data element',name,definition:`Monthly HMIS ${facility} reporting element: ${name}.`,displayDefinition:`Monthly HMIS ${facility} reporting element: ${name}.`,component,domain,facilityTypes:[facility],moduleTitles:[component],sourceCodes:[code],sourceLocations:[`${facility} p.${page}`],collectionDimensions:['Numbers reported during the month'],recordClass:'Raw facility reporting data element',reportingPeriod:'Monthly',reportingLevels:['Facility/reporting unit','Block/subdistrict','District','State/UT','National'],lowestReportingLevel:'Facility/reporting unit',aggregationRule:'Generally additive count subject to source-defined subgroup and duplicate rules',zeroBlankSemantics:'Do not collapse zero, blank, not applicable and non-reporting.',whoPillars:['Health information systems','Service delivery'],sourceVersion:'Revised HMIS formats effective April 2025',versionStatus:'Current public form candidate - verified correction',sourceUrl:'https://nhm.hp.gov.in/reporting-formats',sourceAuthority:'HMIS / National Health Mission',provenanceStatus:'Exact facility-specific form label retained after code-collision review',lineage:`Primary service event → ${facility} monthly format → HMIS aggregation → analytical output`,uses:['Routine service monitoring','Facility and district planning','Data-quality review'],caveats:'A form field is not automatically a calculated indicator. Facility-specific wording remains distinct.',relatedIndicatorIds:[],relatedValidationRuleIds:[],measureType:null,scaleDisplay:'Not specified',normalizedFormula:'',denominatorPopulation:'Not applicable to a raw reporting field',programmeTags:domain==='Maternal, newborn and reproductive health'?['NHM RMNCH+A']:[]}));
}

function normalizeLowestReportingLevel(value = '') {
  const level = String(value).toLowerCase();
  if (!level) return 'Not specified';
  if (['community','household','village','gram panchayat','session'].some(x => level.includes(x))) return 'Community';
  if (level.includes('sub-centre') || level.includes('sub-cent')) return 'Sub-centre';
  if (['facility','laboratory','dmc','phi','specimen collection'].some(x => level.includes(x))) return 'Facility / laboratory';
  if (level.includes('block') || level.includes('planning unit')) return 'Block / planning unit';
  if (level.includes('district')) return 'District';
  if (level.includes('state')) return 'State / UT';
  if (level.includes('national') && !level.includes('below')) return 'National';
  return 'Source-defined / unresolved';
}

const excludedProgrammes = new Set(discovery.programmeExclusions || []);
function programmeTagsFor(item) {
  return [...new Set([...(item.programmeTags || []), item.indiaProgram].filter(value => value && !excludedProgrammes.has(value)))].sort();
}
function systemPortalTagsFor(item) {
  const evidence = (discovery.evidenceFields || []).map(field => item[field]).filter(Boolean).join(' ').toLowerCase();
  return (discovery.systemPortalMappings || []).filter(mapping => mapping.evidencePatterns.some(pattern => evidence.includes(pattern.toLowerCase()))).map(mapping => mapping.label).sort();
}

const indicators = [...(indicatorRelease.indicators || []), ...expandNcdRelease(ncdRelease)];
const hmisObjects = [...applyFacilityCorrections(hmisCatalogue.objects || [], facilityCorrections), ...expandFacilityCorrections(facilityCorrections), ...expandHeadquarters(headquarters)];
const indicatorById = new Map(indicators.map(item => [item.id,item]));
const hmisById = new Map(hmisObjects.map(item => [item.id,item]));

const records = identities.canonicalObjects.map(identity => {
  const indicatorMetadata = indicatorById.get(identity.canonicalObjectId) || null;
  const hmisMetadata = hmisById.get(identity.canonicalObjectId) || null;
  if (!indicatorMetadata && !hmisMetadata) throw new Error(`No source metadata for ${identity.canonicalObjectId}`);
  const memberships = [indicatorMetadata && 'indicator', hmisMetadata && 'hmis'].filter(Boolean);
  const manifestations = [indicatorMetadata,hmisMetadata].filter(Boolean);
  const programmeTags = [...new Set(manifestations.flatMap(programmeTagsFor))].sort();
  const systemPortalTags = [...new Set(manifestations.flatMap(systemPortalTagsFor))].sort();
  const level = indicatorMetadata?.lowestReportingLevel || hmisMetadata?.lowestReportingLevel || '';
  return {
    canonicalObjectId: identity.canonicalObjectId,
    canonicalUri: identity.canonicalUri,
    canonicalObjectType: identity.canonicalObjectType,
    displayName: identity.displayName,
    facets: identity.facets,
    registryMemberships: memberships,
    sourceObjectTypes: [...new Set(identity.representations.map(item => item.sourceObjectType))].sort(),
    programmeTags,
    systemPortalTags,
    domain: indicatorMetadata?.domain || hmisMetadata?.domain || null,
    component: indicatorMetadata?.programmeComponent || hmisMetadata?.component || indicatorMetadata?.subdomain || null,
    normalizedLowestReportingLevel: normalizeLowestReportingLevel(level),
    businessVersion: identity.businessVersion,
    lifecycleStatus: identity.lifecycleStatus,
    effectiveDate: identity.effectiveDate,
    retirementDate: identity.retirementDate,
    replaces: identity.replaces,
    replacedBy: identity.replacedBy,
    representations: identity.representations,
    indicatorMetadata,
    hmisMetadata
  };
}).sort((a,b) => a.canonicalObjectId.localeCompare(b.canonicalObjectId));

const crosswalkByOccurrence = new Map((reportCrosswalk.crosswalk || []).map(item => [item.occurrenceId,item]));
const candidateByOccurrence = new Map((candidateFields.candidateElements || []).map(item => [item.occurrenceId,item]));
const measureByOccurrence = new Map((reportManifest.measureOccurrences || []).map(item => [item.occurrenceId,item]));
const dimensionById = new Map((dimensionDictionary.dimensions || dimensionDictionary.dimensionDefinitions || []).map(item => [item.dimensionId,item]));
const dimensionRefByOrdinal = new Map((reportManifest.dimensionReferences || []).map(item => [item.columnOrdinal,item]));
const canonicalNameById = new Map(records.map(item => [item.canonicalObjectId,item.displayName]));
const occurrences = identities.occurrences.map(identity => {
  if (identity.occurrenceType === 'Report field occurrence') {
    const reportMetadata = measureByOccurrence.get(identity.occurrenceId) || null;
    const reconciliation = crosswalkByOccurrence.get(identity.occurrenceId) || null;
    const candidateMetadata = candidateByOccurrence.get(identity.occurrenceId) || null;
    return {...identity,discovery:{displayName:reportMetadata?.exactSourceLabel||identity.occurrenceId,occurrenceClass:'Measure',group:reportMetadata?.moduleTitle||'Unclassified module',groupCode:reportMetadata?.moduleCode||null,sourceCode:reportMetadata?.sourceCode||null,linkageStatus:identity.canonicalObjectId?'Canonical link':'Candidate—verification required',linkedObjectId:identity.canonicalObjectId||identity.candidateObjectId||null,linkedObjectName:identity.canonicalObjectId?canonicalNameById.get(identity.canonicalObjectId)||null:candidateMetadata?.exactSourceLabel||null},reportMetadata,reconciliation,candidateMetadata};
  }
  const reference = dimensionRefByOrdinal.get(identity.columnOrdinal) || null;
  const dimensionMetadata = reference ? dimensionById.get(reference.dimensionId) || null : null;
  return {...identity,discovery:{displayName:reference?.sourceHeader||identity.sourceManifestationId,occurrenceClass:'Dimension',group:reference?.category||'Reporting dimension',groupCode:null,sourceCode:reference?.canonicalName||null,linkageStatus:'Reporting dimension',linkedObjectId:null,linkedObjectName:null},reportMetadata:reference,dimensionMetadata};
});

const recordById = new Map(records.map(item => [item.canonicalObjectId,item]));
const graphNodeById = new Map((graph.nodes || []).map(item => [item.id,item]));
const relationshipKeys = new Set();
let unresolvedRelationshipReferences = 0;
for (const record of records) {
  const indicator = record.indicatorMetadata;
  const hmis = record.hmisMetadata;
  const sourceLinks = [];
  if (indicator?.source || indicator?.sourceId || indicator?.url) sourceLinks.push({sourceId:indicator.sourceId||null,label:indicator.source||indicator.org||'Indicator source',authority:indicator.org||null,url:indicator.url||null,version:indicator.sourceVersion||null,sourcePage:indicator.sourcePage||indicator.sourceSection||null,sourceLayer:'Indicator registry'});
  if (hmis?.sourceAuthority || hmis?.sourceUrl) sourceLinks.push({sourceId:null,label:hmis.sourceAuthority||'HMIS source',authority:hmis.sourceAuthority||null,url:hmis.sourceUrl||null,version:hmis.sourceVersion||hmis.sourcePeriod||null,sourcePage:hmis.sourcePage||null,sourceLayer:'HMIS knowledge registry'});
  record.navigation={relatedObjects:[],occurrences:[],sources:sourceLinks.filter((item,index,array)=>array.findIndex(other=>`${other.label}|${other.url}|${other.version}`===`${item.label}|${item.url}|${item.version}`)===index),graphNode:null};
  const graphNode=graphNodeById.get(record.canonicalObjectId);
  if(graphNode)record.navigation.graphNode={nodeId:graphNode.id,nodeType:graphNode.type,label:graphNode.label};
}

function addReciprocalRelation(sourceId,targetId,relationshipType,label,assertionStatus,evidence){
  if(!sourceId||!targetId||sourceId===targetId)return;
  const source=recordById.get(sourceId),target=recordById.get(targetId);
  if(!source||!target){unresolvedRelationshipReferences+=1;return;}
  const key=[sourceId,targetId,relationshipType,label].join('|');
  if(relationshipKeys.has(key))return;
  relationshipKeys.add(key);
  source.navigation.relatedObjects.push({targetId,targetName:target.displayName,targetType:target.canonicalObjectType,relationshipType,label,direction:'outbound',assertionStatus,evidence});
  target.navigation.relatedObjects.push({targetId:sourceId,targetName:source.displayName,targetType:source.canonicalObjectType,relationshipType,label,direction:'inbound',assertionStatus,evidence});
}

for(const record of records){
  const indicator=record.indicatorMetadata||{},hmis=record.hmisMetadata||{};
  for(const id of indicator.relatedElementIds||[])addReciprocalRelation(record.canonicalObjectId,id,'relatedElement','Uses or relates to data element','curated','Indicator metadata relationship');
  for(const id of indicator.relatedIndicatorIds||[])addReciprocalRelation(record.canonicalObjectId,id,'relatedIndicator','Related indicator','curated','Indicator metadata relationship');
  for(const id of hmis.relatedIndicatorIds||[])addReciprocalRelation(record.canonicalObjectId,id,'relatedIndicator','Related indicator','curated','HMIS metadata relationship');
  for(const id of hmis.relatedValidationRuleIds||[])addReciprocalRelation(record.canonicalObjectId,id,'validationRule','Checked by validation rule','curated','HMIS metadata relationship');
  for(const candidate of hmis.leftCandidates||[])addReciprocalRelation(record.canonicalObjectId,candidate.elementId,'validationOperand','Left-side validation candidate',candidate.matchStatus==='Exact'?'reviewed':'candidate',candidate.reviewStatus||'HMIS validation-rule candidate');
  for(const candidate of hmis.rightCandidates||[])addReciprocalRelation(record.canonicalObjectId,candidate.elementId,'validationOperand','Right-side validation candidate',candidate.matchStatus==='Exact'?'reviewed':'candidate',candidate.reviewStatus||'HMIS validation-rule candidate');
}
for(const crosswalk of hmisCrosswalks.indicatorElementCrosswalks||[]){
  for(const candidate of crosswalk.numeratorCandidates||[])addReciprocalRelation(crosswalk.indicatorId,candidate.elementId,'numeratorCandidate','Numerator data-element candidate',candidate.matchStatus==='Exact'?'reviewed':'candidate',candidate.reviewStatus||crosswalk.relationshipStatus);
  for(const candidate of crosswalk.denominatorCandidates||[])addReciprocalRelation(crosswalk.indicatorId,candidate.elementId,'denominatorCandidate','Denominator data-element candidate',candidate.matchStatus==='Exact'?'reviewed':'candidate',candidate.reviewStatus||crosswalk.relationshipStatus);
}
for(const occurrence of occurrences){
  if(!occurrence.canonicalObjectId)continue;
  const record=recordById.get(occurrence.canonicalObjectId);
  if(record)record.navigation.occurrences.push({occurrenceId:occurrence.occurrenceId,columnOrdinal:occurrence.columnOrdinal,displayName:occurrence.discovery.displayName,linkageStatus:occurrence.discovery.linkageStatus,schemaId:occurrence.schemaId});
}
for(const record of records){
  record.navigation.relatedObjects.sort((a,b)=>a.targetName.localeCompare(b.targetName)||a.relationshipType.localeCompare(b.relationshipType));
  record.navigation.occurrences.sort((a,b)=>a.columnOrdinal-b.columnOrdinal);
}

const navigationCounts={
  reciprocalRelationshipAssertions:[...relationshipKeys].length,
  navigableRelationshipEntries:records.reduce((sum,item)=>sum+item.navigation.relatedObjects.length,0),
  canonicalOccurrenceLinks:records.reduce((sum,item)=>sum+item.navigation.occurrences.length,0),
  sourceEvidenceLinks:records.reduce((sum,item)=>sum+item.navigation.sources.length,0),
  graphNodeLinks:records.filter(item=>item.navigation.graphNode).length,
  unresolvedRelationshipReferences
};

const membershipCounts = {
  indicator: records.filter(item => item.registryMemberships.includes('indicator')).length,
  hmis: records.filter(item => item.registryMemberships.includes('hmis')).length,
  shared: records.filter(item => item.registryMemberships.length === 2).length
};
const model = {
  metadata: {
    id: 'PHAOS-UNIFIED-READ-MODEL',
    title: 'Public Health Analytics-OS consolidated discovery read model',
    version: '1.2.0',
    generated: releaseDate,
    task: 'UNIFY-05',
    identityIndexVersion: identities.metadata.version,
    taxonomyVersion: identities.metadata.taxonomyVersion,
    discoveryFacetVersion: discovery.metadata.version,
    interpretationBoundary: 'This generated read model consolidates discovery metadata and preserves source representations in separate namespaces. It is not a dataset of observed values and does not assert semantic equivalence, aggregation safety, computability, source currency or custodian approval.'
  },
  counts: {...identities.counts, registryMemberships:membershipCounts, navigation:navigationCounts},
  metrics: {ncdReleaseRecords:ncdRelease.records.length,ncdSourceDocuments:ncdRelease.sources.length},
  coverage: indicatorRelease.coverage,
  records,
  occurrences
};

write(modelPath, model);
const bytes = fs.readFileSync(path.join(root, modelPath));
const manifest = {
  metadata: {id:'PHAOS-UNIFIED-READ-MODEL-MANIFEST',version:'1.2.0',generated:releaseDate,task:'UNIFY-07'},
  distribution: {path:'unified-read-model.json',mediaType:'application/json',bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')},
  counts: model.counts,
  sources: [
    'indicators/data/governance/unified-identity-index.json',
    'indicators/data/governance/discovery-facets.json',
    'indicators/data/indicators.json',
    'indicators/data/ncd/release.json',
    'indicators/data/hmis/catalog.json',
    'indicators/data/hmis/crosswalks.json',
    'indicators/data/hmis/headquarters-elements.json',
    'indicators/data/hmis/facility-format-corrections.json',
    'indicators/data/graph/graph.json',
    `${reportDir}/HMIS-RPTSCHEMA-STATE-20260901-001.report-schema-manifest.json`,
    `${reportDir}/HMIS-RPTSCHEMA-STATE-20260901-001.dimension-dictionary.json`,
    `${reportDir}/column-to-element-crosswalk.json`,
    `${reportDir}/candidate-new-elements.json`
  ],
  build: 'node scripts/build-unified-read-model.mjs',
  validate: 'node scripts/validate-unified-read-model.mjs',
  publicationBoundary: 'Static discovery metadata only. Public bulk-download controls remain disabled.'
};
write(manifestPath, manifest);
console.log(JSON.stringify({records:records.length,memberships:membershipCounts,occurrences:occurrences.length,bytes:bytes.length,sha256:manifest.distribution.sha256},null,2));
