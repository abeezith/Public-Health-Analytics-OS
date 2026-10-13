import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { qualityComparabilityProfile, qualityComparabilityPilot } from './quality-comparability-profile.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>JSON.parse(fs.readFileSync(path.join(root,relative),'utf8'));
const fail=message=>{throw new Error(message);};
const model=read('indicators/data/governance/quality-comparability-model.json');
const registry=read('indicators/data/registry/unified-read-model.json');
if(model.metadata.id!=='PHAOS-DQCOMP-001'||model.metadata.version!=='1.0.0')fail('Unexpected quality/comparability model identity.');
if(qualityComparabilityPilot.records.length!==30||new Set(qualityComparabilityPilot.records.map(x=>x.id)).size!==30)fail('Pilot must contain 30 unique records.');
const recordsById=new Map(registry.records.map(item=>[item.canonicalObjectId,item]));
const programmeCounts={};
for(const item of qualityComparabilityPilot.records){
  const record=recordsById.get(item.id);if(!record)fail(`Pilot identity does not resolve: ${item.id}.`);
  if(!record.registryMemberships.includes('indicator'))fail(`Pilot object is not an indicator: ${item.id}.`);
  programmeCounts[item.programme]=(programmeCounts[item.programme]||0)+1;
  for(const key of ['issue','misinterpretation','extraMinimum','check','compare'])if(!item[key])fail(`${item.id} is missing ${key}.`);
  const profile=qualityComparabilityProfile({canonicalObjectId:item.id,indicator:record.indicatorMetadata,hmis:record.hmisMetadata});
  if(profile.pilotStatus!=='Pilot profile available'||profile.expectedReportingLag.state!=='Not stated in cited evidence')fail(`${item.id} has invalid pilot or lag state.`);
  if(profile.knownIssues.length<2||!profile.commonMisinterpretations.length||profile.minimumDataRequirements.length<4||profile.validationChecks.length<3)fail(`${item.id} has an incomplete safeguard profile.`);
  if(profile.comparability.status!=='Conditional only'||profile.comparability.conditions.length<2)fail(`${item.id} has incomplete comparability guidance.`);
  if(!profile.evidence?.sourceVersion||!profile.reviewStatus.includes('domain review pending'))fail(`${item.id} lacks evidence or honest review state.`);
}
for(const programme of ['NTEP','RMNCH+A','Immunization','VBD','NCD'])if(programmeCounts[programme]!==6)fail(`${programme} pilot count is ${programmeCounts[programme]||0}, expected 6.`);
if(registry.records.filter(item=>item.qualityComparabilityProfile?.pilotStatus==='Pilot profile available').length!==30)fail('Read-model pilot profile count is not 30.');
if(registry.records.some(item=>!item.qualityComparabilityProfile))fail('A canonical record lacks an explicit quality/comparability profile.');
console.log(JSON.stringify({status:'pass',model:model.metadata.id,profiles:registry.records.length,pilotProfiles:30,programmeCounts},null,2));
