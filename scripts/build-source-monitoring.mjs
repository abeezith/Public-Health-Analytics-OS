import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {metadataFingerprint,versionFingerprint} from './source-monitoring-engine.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=relative=>JSON.parse(fs.readFileSync(path.join(root,relative),'utf8'));
const sources=read('indicators/data/sources.json');
const model=read('indicators/data/registry/unified-read-model.json');
const pilot=new Set(read('indicators/data/governance/source-monitoring-model.json').pilot.sourceIds);
const probeArg=process.argv.indexOf('--pilot-probe'),probePath=probeArg>=0?process.argv[probeArg+1]:null;
const probeById=new Map(probePath?(read(probePath).snapshots||[]).map(item=>[item.sourceId,item]):[]);
const affected=new Map();
for(const record of model.records){const sourceId=record.indicatorMetadata?.sourceId;if(sourceId){if(!affected.has(sourceId))affected.set(sourceId,[]);affected.get(sourceId).push(record.canonicalObjectId);}}
const snapshots=sources.map(source=>{const probe=probeById.get(source.id);return {snapshotId:`SRC-SNAPSHOT-20261013-${source.id}`,sourceId:source.id,sourceName:source.name,observedOn:'2026-10-13',initialUrl:source.url,finalUrl:probe?.finalUrl||null,httpStatus:probe?.httpStatus??null,linkState:probe?.linkState||'not-probed',comparisonState:'baseline-established',metadataFingerprint:metadataFingerprint(source),versionFingerprint:versionFingerprint(source),contentFingerprint:probe?.contentFingerprint||null,contentFingerprintBasis:probe?.contentFingerprintBasis||null,affectedRecordIds:(affected.get(source.id)||[]).sort(),error:probe?.error||null,pilotLiveProbe:pilot.has(source.id)};});
const release={metadata:{id:'PHAOS-SOURCE-MONITORING-RELEASE-001',version:'1.0.0',generated:'2026-10-13',task:'TRUST-07',schemaPackage:'1.3.0'},counts:{declaredSources:sources.length,sourcesWithRegistryRecords:snapshots.filter(item=>item.affectedRecordIds.length).length,pilotSources:pilot.size,baselineEstablished:snapshots.length,liveProbed:snapshots.filter(item=>item.linkState!=='not-probed').length,accessible:snapshots.filter(item=>item.linkState==='accessible').length,redirected:snapshots.filter(item=>item.linkState==='redirected').length,accessErrors:snapshots.filter(item=>['http-error','network-error'].includes(item.linkState)).length,openReviewItems:0},policy:{automaticSourceMutation:false,httpSuccessImpliesUnchangedMeaning:false,humanDispositionRequired:true},snapshots};
const queue={metadata:{id:'PHAOS-SOURCE-REVIEW-QUEUE-001',version:'1.0.0',generated:'2026-10-13',status:'No production changes asserted at initial baseline',task:'TRUST-07'},counts:{open:0,high:0,medium:0},items:[],boundary:'The initial production release establishes baselines only. Controlled fixtures exercise three change states; future workflow artifacts require human disposition and cannot rewrite registry records.'};
fs.mkdirSync(path.join(root,'indicators/data/monitoring'),{recursive:true});
fs.writeFileSync(path.join(root,'indicators/data/monitoring/source-snapshots.json'),`${JSON.stringify(release,null,2)}\n`);
fs.writeFileSync(path.join(root,'indicators/data/monitoring/review-queue.json'),`${JSON.stringify(queue,null,2)}\n`);
console.log(JSON.stringify(release.counts,null,2));
