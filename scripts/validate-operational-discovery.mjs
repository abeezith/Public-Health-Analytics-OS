import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>JSON.parse(fs.readFileSync(path.join(root,relative),'utf8'));
const fail=message=>{throw new Error(message);};
const model=read('indicators/data/registry/unified-read-model.json');
const policy=read('indicators/data/governance/operational-discovery-model.json');
const observations=read('indicators/data/observations/manifest.json');
const facets=policy.facets;

if(policy.metadata.id!=='PHAOS-OPDISC-001'||policy.metadata.version!=='1.0.0')fail('Unexpected operational-discovery policy.');
if(model.metadata.version!=='1.7.0'||model.records.length!==4743)fail('Operational discovery requires read model 1.7.0 with 4,743 records.');
const maturityValues=new Set;
for(const record of model.records){
  const profile=record.operationalDiscovery;
  if(!profile||profile.modelId!==policy.metadata.id)fail(`Missing operational profile: ${record.canonicalObjectId}`);
  for(const key of ['frequency','dataAvailability','reviewStatus','lifecycle','computabilityMaturity'])if(!facets[key].includes(profile[key]))fail(`Invalid ${key}: ${record.canonicalObjectId}`);
  if(!Array.isArray(profile.cadreCategories)||!profile.cadreCategories.length||profile.cadreCategories.some(value=>!facets.cadre.includes(value)))fail(`Invalid cadre category: ${record.canonicalObjectId}`);
  if(!profile.frequencySource||!profile.responsibleCadreSource)fail(`Missing source-wording preservation: ${record.canonicalObjectId}`);
  if(profile.responsibleCadreSource==='Not stated'&&!profile.cadreCategories.includes('Not stated'))fail(`Missing explicit not-stated cadre: ${record.canonicalObjectId}`);
  if(profile.reviewStatus==='Review pending'&&record.provenance)fail(`Reviewed record marked pending: ${record.canonicalObjectId}`);
  if(profile.computabilityMaturity.startsWith('C2')&&!record.registryMemberships.includes('indicator'))fail(`Non-indicator promoted to C2: ${record.canonicalObjectId}`);
  maturityValues.add(profile.computabilityMaturity);
}
if([...maturityValues].some(value=>/validated computable|custodian approved/i.test(value)))fail('UTILITY-01 cannot assert validated computability or custodian approval.');
if(!model.records.some(record=>record.operationalDiscovery.frequency==='Not stated'))fail('Not-stated frequency was dropped.');
if(!model.records.some(record=>record.operationalDiscovery.cadreCategories.includes('Not stated')))fail('Not-stated cadre was dropped.');
if(!model.records.some(record=>record.operationalDiscovery.reviewStatus==='Review pending'))fail('Review-pending state was dropped.');
if((observations.counts?.aggregateObservations||0)!==0)fail('Data-availability claim conflicts with published observations.');
if(model.records.some(record=>!record.operationalDiscovery.dataAvailability.endsWith('values not published')))fail('A profile incorrectly implies value publication.');

const app=fs.readFileSync(path.join(root,'indicators/app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'indicators/index.html'),'utf8');
for(const id of ['frequency','cadre','availability','review','lifecycle','computability']){
  if(!html.includes(`id="${id}"`))fail(`Missing operational filter control: ${id}`);
  if(!app.includes(`${id}:`))fail(`Missing URL-state mapping: ${id}`);
}
if(!app.includes('restoreIndicatorUrlState()')||!app.includes('updateIndicatorUrlState()'))fail('Indicator URL-state functions are missing.');

const counts=key=>model.records.reduce((out,record)=>((out[record.operationalDiscovery[key]]=(out[record.operationalDiscovery[key]]||0)+1),out),{});
console.log(JSON.stringify({status:'pass',model:policy.metadata.id,records:model.records.length,frequency:counts('frequency'),review:counts('reviewStatus'),computability:counts('computabilityMaturity')},null,2));
