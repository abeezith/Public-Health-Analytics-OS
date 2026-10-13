import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {metadataFingerprint,sha256,versionFingerprint} from './source-monitoring-engine.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=name=>{const i=process.argv.indexOf(name);return i>=0?process.argv[i+1]:null;};
const output=arg('--output')||'artifacts/source-probe.json';
const ids=new Set((arg('--source-ids')||'WHO_IMR,WB_HEALTH,UN_SDG,OECD_HEALTH,WHO_CORE100').split(','));
const sources=JSON.parse(fs.readFileSync(path.join(root,'indicators/data/sources.json'),'utf8')).filter(source=>ids.has(source.id));
const model=JSON.parse(fs.readFileSync(path.join(root,'indicators/data/registry/unified-read-model.json'),'utf8'));
const affected=new Map();for(const record of model.records){const id=record.indicatorMetadata?.sourceId;if(id){if(!affected.has(id))affected.set(id,[]);affected.get(id).push(record.canonicalObjectId);}}
const observedOn=new Date().toISOString().slice(0,10),limit=2*1024*1024;
async function probe(source){
  const base={snapshotId:`SRC-PROBE-${observedOn.replaceAll('-','')}-${source.id}`,sourceId:source.id,sourceName:source.name,observedOn,initialUrl:source.url,finalUrl:null,httpStatus:null,linkState:'network-error',comparisonState:'baseline-established',metadataFingerprint:metadataFingerprint(source),versionFingerprint:versionFingerprint(source),contentFingerprint:null,contentFingerprintBasis:null,affectedRecordIds:(affected.get(source.id)||[]).sort(),error:null};
  try{
    const response=await fetch(source.url,{redirect:'follow',signal:AbortSignal.timeout(30000),headers:{'user-agent':'Public-Health-Analytics-OS source monitor/1.0'}});
    base.httpStatus=response.status;base.finalUrl=response.url;base.linkState=response.ok?(response.redirected?'redirected':'accessible'):'http-error';
    if(!response.ok){base.error=`HTTP ${response.status}`;return base;}
    const reader=response.body?.getReader();let size=0,chunks=[];
    while(reader&&size<limit){const {done,value}=await reader.read();if(done)break;const remaining=limit-size;chunks.push(value.slice(0,remaining));size+=Math.min(value.length,remaining);if(size>=limit){await reader.cancel();break;}}
    const bytes=Buffer.concat(chunks.map(chunk=>Buffer.from(chunk)));base.contentFingerprint=sha256(bytes);base.contentFingerprintBasis=`sha256-first-${size}-bytes${size===limit?'-prefix':''}`;return base;
  }catch(error){base.error=String(error?.message||error).slice(0,240);return base;}
}
const snapshots=[];for(const source of sources)snapshots.push(await probe(source));
const result={metadata:{id:'PHAOS-SOURCE-PROBE',version:'1.0.0',generatedAt:new Date().toISOString(),automaticRegistryMutation:false},snapshots};
fs.mkdirSync(path.dirname(path.join(root,output)),{recursive:true});fs.writeFileSync(path.join(root,output),`${JSON.stringify(result,null,2)}\n`);
console.log(JSON.stringify({output,states:Object.fromEntries([...new Set(snapshots.map(item=>item.linkState))].map(state=>[state,snapshots.filter(item=>item.linkState===state).length]))},null,2));
