import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { responseGuidanceProfile, responseGuidancePilot } from './response-guidance-profile.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const fail=message=>{throw new Error(message)};
const model=read('indicators/data/governance/response-guidance-model.json');
const registry=read('indicators/data/registry/unified-read-model.json');
if(model.metadata.id!=='PHAOS-RESPONSE-001'||model.metadata.version!=='1.0.0')fail('Unexpected response-guidance model identity.');
if(responseGuidancePilot.records.length!==30||new Set(responseGuidancePilot.records.map(x=>x.id)).size!==30)fail('Pilot must contain 30 unique records.');
for(const item of responseGuidancePilot.records){
  const record=registry.records.find(x=>x.canonicalObjectId===item.id); if(!record)fail(`Unresolved pilot record ${item.id}`);
  const profile=responseGuidanceProfile({canonicalObjectId:item.id,indicator:record.indicatorMetadata,hmis:record.hmisMetadata});
  if(profile.officialProtocol.status!=='Not identified in cited indicator metadata'||profile.officialProtocol.actions.length)fail(`Unsupported official protocol assertion for ${item.id}`);
  if(profile.advisoryWorkflow.steps.length!==4||profile.advisoryWorkflow.minimumEvidence.length<3)fail(`Incomplete advisory workflow for ${item.id}`);
  if(!profile.evidence.authority||!profile.evidence.sourceVersion||!profile.evidence.locator)fail(`Incomplete evidence for ${item.id}`);
  if(!profile.prohibitedUses.length)fail(`Missing safety boundary for ${item.id}`);
}
if(registry.records.filter(x=>x.responseGuidanceProfile?.guidanceState==='Advisory review guidance available').length!==30)fail('Read-model advisory count is not 30.');
if(registry.records.some(x=>!x.responseGuidanceProfile))fail('A canonical record lacks an explicit response-guidance profile.');
if(registry.records.some(x=>x.responseGuidanceProfile?.officialProtocol?.status==='Source-stated protocol available'))fail('An unreviewed official protocol was published.');
console.log(JSON.stringify({status:'pass',model:model.metadata.id,profiles:registry.records.length,advisoryProfiles:30,officialProtocols:0},null,2));
