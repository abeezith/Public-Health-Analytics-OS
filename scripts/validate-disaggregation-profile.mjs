import fs from 'node:fs';

const model=JSON.parse(fs.readFileSync('indicators/data/registry/unified-read-model.json','utf8'));
const policy=JSON.parse(fs.readFileSync('indicators/data/governance/disaggregation-model.json','utf8'));
const allowedDimensions=new Set(policy.dimensions.map(item=>item.id));
const allowedClaims=new Set(policy.claimTypes.map(item=>item.id));
const errors=[];
const assert=(condition,message)=>{if(!condition)errors.push(message);};
const assertionIds=[];
for(const record of model.records){
  const profile=record.disaggregationProfile;
  assert(profile?.modelId==='PHAOS-DISAGG-001',`${record.canonicalObjectId}: missing governed profile`);
  assert(Array.isArray(profile?.assertions),`${record.canonicalObjectId}: assertions must be an array`);
  for(const assertion of profile?.assertions||[]){
    assertionIds.push(assertion.assertionId);
    assert(allowedDimensions.has(assertion.dimensionId),`${record.canonicalObjectId}: invalid dimension ${assertion.dimensionId}`);
    assert(allowedClaims.has(assertion.claimType),`${record.canonicalObjectId}: invalid claim ${assertion.claimType}`);
    assert(Boolean(assertion.status&&assertion.reviewStatus),`${record.canonicalObjectId}: missing status or review state`);
    assert(Boolean(assertion.evidence?.authority&&assertion.evidence?.locator&&assertion.evidence?.exactText),`${record.canonicalObjectId}: incomplete evidence`);
    assert(Boolean(assertion.applicability?.geography&&assertion.applicability?.reportingLevel&&assertion.applicability?.facilityType&&assertion.applicability?.population),`${record.canonicalObjectId}: incomplete applicability`);
    if(assertion.claimType==='analyst-recommended')assert(/Recommendation only/.test(assertion.status),`${record.canonicalObjectId}: recommendation overclaims availability`);
    if(assertion.claimType==='system-available')assert(assertion.evidence.sourceId==='HMIS-RPTSCHEMA-STATE-20260901-001',`${record.canonicalObjectId}: system availability lacks observed-schema evidence`);
  }
  assert(profile.assertionCounts.sourceRequired===0,`${record.canonicalObjectId}: unsupported source-required claim`);
}
assert(new Set(assertionIds).size===assertionIds.length,'Assertion IDs are not unique');
assert(!model.records.some(record=>(record.disaggregationProfile?.assertions||[]).some(item=>item.claimType==='analyst-recommended'&&/available|captured|required/i.test(item.status.replace('availability unverified','')))),'Recommendation implies availability');
const counts={profiles:model.records.length,assertions:assertionIds.length,sourceRequired:0,systemAvailable:0,analystRecommended:0,noGovernedAssertion:0};
for(const record of model.records){const p=record.disaggregationProfile;counts.systemAvailable+=p.assertionCounts.systemAvailable;counts.analystRecommended+=p.assertionCounts.analystRecommended;if(!p.assertions.length)counts.noGovernedAssertion+=1;}
console.log(JSON.stringify({status:errors.length?'fail':'pass',model:policy.metadata.id,counts,errors},null,2));
if(errors.length)process.exitCode=1;
