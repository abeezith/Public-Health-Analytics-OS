import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>JSON.parse(fs.readFileSync(path.join(root,relative),'utf8'));
const schemaDir=path.join(root,'indicators/data/schemas/1.1.0');
const layerDir=path.join(root,'indicators/data/observations');
const packageManifest=read('indicators/data/schemas/1.1.0/manifest.json');
const layerManifest=read('indicators/data/observations/manifest.json');
const unified=read('indicators/data/registry/unified-read-model.json');
const canonical=new Map(unified.records.map(record=>[record.canonicalObjectId,record]));
const errors=[];
const assert=(condition,message)=>{if(!condition)errors.push(message);};

assert(unified.metadata.taxonomyVersion==='1.1.0','Unified read model must reference taxonomy 1.1.0');
assert(packageManifest.version==='1.1.0','Schema package version must be 1.1.0');
assert(packageManifest.schemas.length===12,'Schema package 1.1.0 must declare 12 contracts');
for(const entry of packageManifest.schemas){
  const file=path.join(schemaDir,entry.file);
  assert(fs.existsSync(file),`Missing schema: ${entry.file}`);
  if(!fs.existsSync(file))continue;
  const schema=JSON.parse(fs.readFileSync(file,'utf8'));
  assert(schema.$schema==='https://json-schema.org/draft/2020-12/schema',`${entry.file}: wrong JSON Schema dialect`);
  assert(schema.$id?.includes('/1.1.0/'),`${entry.file}: $id must be versioned at 1.1.0`);
}
assert(packageManifest.schemas.some(x=>x.file==='aggregate-observation.schema.json'),'Aggregate observation contract missing from manifest');
assert(packageManifest.schemas.some(x=>x.file==='reference-value.schema.json'),'Reference-value contract missing from manifest');

const recordFiles=fs.readdirSync(layerDir,{withFileTypes:true}).flatMap(entry=>{
  if(entry.isFile()&&entry.name.endsWith('.json')&&entry.name!=='manifest.json')return [path.join(layerDir,entry.name)];
  if(entry.isDirectory())return fs.readdirSync(path.join(layerDir,entry.name)).filter(name=>name.endsWith('.json')).map(name=>path.join(layerDir,entry.name,name));
  return [];
});
const records=recordFiles.flatMap(file=>{const payload=JSON.parse(fs.readFileSync(file,'utf8'));return Array.isArray(payload)?payload:[payload];});
const observations=records.filter(x=>x.recordType==='Observation/aggregate value');
const references=records.filter(x=>x.recordType==='Reference value');
assert(records.length===observations.length+references.length,'Unknown record type in observation layer');
assert(layerManifest.counts.aggregateObservations===observations.length,'Observation manifest count mismatch');
assert(layerManifest.counts.referenceValues===references.length,'Reference-value manifest count mismatch');
assert(layerManifest.counts.publicDistributions===0,'Public distributions must remain zero until separately authorized');
assert(layerManifest.publicDownloadControls==='disabled','Public download controls must remain disabled');

const ids=new Set(),versionsByKey=new Set();
const prohibitedKeys=/^(aadhaar|mobile|phone|email|personId|patientId|beneficiaryId|householdId)$/i;
const inspectKeys=(value,recordId)=>{if(!value||typeof value!=='object')return;for(const [key,child] of Object.entries(value)){assert(!prohibitedKeys.test(key),`${recordId}: prohibited person-level field ${key}`);inspectKeys(child,recordId);}};
for(const record of records){assert(record.id&&!ids.has(record.id),`${record.id||'unknown'}: missing or duplicate immutable id`);ids.add(record.id);inspectKeys(record,record.id);}

for(const record of observations){
  const required=['id','observationKey','schemaVersion','businessVersion','lifecycleStatus','subject','period','valueStatus','dataStatus','revision','provenance','privacy'];
  required.forEach(field=>assert(record[field]!==undefined,`${record.id}: missing ${field}`));
  assert(record.schemaVersion==='1.1.0',`${record.id}: schemaVersion must be 1.1.0`);
  const definition=canonical.get(record.subject?.canonicalObjectId);
  assert(Boolean(definition),`${record.id}: unresolved canonical subject`);
  if(definition)assert(definition.canonicalObjectType===record.subject.canonicalObjectType,`${record.id}: canonical subject type mismatch`);
  assert(Boolean(record.geographicUnit||record.reportingUnit),`${record.id}: geography or reporting unit is required`);
  assert(record.valueStatus==='present'?record.valueQuantity?.value!==undefined:(record.valueQuantity===undefined&&record.componentValues===undefined),`${record.id}: value or component values conflict with valueStatus`);
  if(record.valueStatus==='suppressed')assert(Boolean(record.suppressionReason),`${record.id}: suppression reason required`);
  if(record.period?.periodType==='interval')assert(record.period.startDate<=record.period.endDate,`${record.id}: interval dates are reversed`);
  if(record.privacy?.accessClass==='public')assert(['not-required','passed'].includes(record.privacy.disclosureReviewStatus),`${record.id}: public record has not passed disclosure gate`);
  if(record.privacy?.accessClass==='public')assert(record.privacy.aggregationClass==='public aggregate',`${record.id}: public access requires public-aggregate classification`);
  const versionKey=`${record.observationKey}|${record.revision?.revisionNumber}`;assert(!versionsByKey.has(versionKey),`${record.id}: duplicate observation key/revision`);versionsByKey.add(versionKey);
}

for(const record of references){
  const definition=canonical.get(record.indicatorCanonicalObjectId);
  assert(Boolean(definition),`${record.id}: unresolved reference-value indicator`);
  if(definition)assert(definition.canonicalObjectType==='Indicator',`${record.id}: reference value must link to an Indicator`);
  assert(Boolean(record.valueQuantity)!==Boolean(record.valueRange),`${record.id}: exactly one reference value form is required`);
  assert(Boolean(record.publication?.accessClass&&record.publication?.redistributionStatus),`${record.id}: reference-value publication boundary is required`);
  if(record.valueRange)assert(record.valueRange.low<=record.valueRange.high,`${record.id}: reference range is reversed`);
  if(record.effectivePeriod?.endDate)assert(record.effectivePeriod.startDate<=record.effectivePeriod.endDate,`${record.id}: effective dates are reversed`);
}

if(errors.length){console.error(JSON.stringify({status:'fail',errors},null,2));process.exit(1);}
console.log(JSON.stringify({status:'pass',schemaPackage:packageManifest.version,contracts:packageManifest.schemas.length,canonicalSubjects:canonical.size,aggregateObservations:observations.length,referenceValues:references.length,publicDistributions:layerManifest.counts.publicDistributions,downloadControls:layerManifest.publicDownloadControls},null,2));
