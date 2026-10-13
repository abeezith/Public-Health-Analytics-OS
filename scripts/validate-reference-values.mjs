import fs from 'node:fs';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const release=read('indicators/data/observations/reference-values.json');
const unified=read('indicators/data/registry/unified-read-model.json');
const canonical=new Map(unified.records.map(x=>[x.canonicalObjectId,x]));
const errors=[],assert=(ok,message)=>{if(!ok)errors.push(message);},ids=new Set();
for(const record of release.records){
  assert(!ids.has(record.id),`${record.id}: duplicate immutable ID`);ids.add(record.id);
  assert(record.schemaVersion==='1.4.0',`${record.id}: wrong schema version`);
  assert(canonical.get(record.indicatorCanonicalObjectId)?.canonicalObjectType==='Indicator',`${record.id}: unresolved indicator`);
  assert([record.valueQuantity,record.valueRange,record.relativeChange].filter(Boolean).length===1,`${record.id}: exactly one value form required`);
  assert(record.effectivePeriod?.periodBasis==='programme-relative',`${record.id}: pilot period must remain programme-relative`);
  assert(record.authority?.source?.sourceId&&record.authority?.source?.url&&record.authority?.source?.locator,`${record.id}: incomplete source evidence`);
  assert(record.recordType==='Reference value',`${record.id}: target must not be typed as an observation`);
}
const embedded=unified.records.flatMap(x=>x.referenceValues||[]);
assert(release.counts.referenceValues===release.records.length,'Release count mismatch');
assert(release.counts.indicators===new Set(release.records.map(x=>x.indicatorCanonicalObjectId)).size,'Indicator count mismatch');
assert(embedded.length===release.records.length,'Unified read-model embedding mismatch');
assert(release.records.filter(x=>x.relativeChange).length===8,'Expected eight source-explicit baseline-relative alternatives');
assert(!JSON.stringify(release).match(/"(observedValue|observationValue|patientId|personId)"/),'Observed or person-level values are prohibited');
if(errors.length){console.error(JSON.stringify({status:'fail',errors},null,2));process.exit(1);}
console.log(JSON.stringify({status:'pass',model:release.metadata.modelId,referenceValues:release.records.length,indicators:release.counts.indicators,relativeAlternatives:release.counts.relativeChangeTargets,observedValues:0},null,2));
