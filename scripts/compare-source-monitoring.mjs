import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildReviewItem,compareSnapshots} from './source-monitoring-engine.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=name=>{const i=process.argv.indexOf(name);return i>=0?process.argv[i+1]:null;};
const previousPath=arg('--previous')||'indicators/data/monitoring/source-snapshots.json',currentPath=arg('--current')||'artifacts/source-probe.json',outputPath=arg('--output')||'artifacts/source-review-queue.json';
const unwrap=data=>data.snapshots||data.previous||[];
const previous=unwrap(JSON.parse(fs.readFileSync(path.join(root,previousPath),'utf8'))),current=unwrap(JSON.parse(fs.readFileSync(path.join(root,currentPath),'utf8'))),priorById=new Map(previous.map(item=>[item.sourceId,item]));
for(const item of current)item.comparisonState=compareSnapshots(priorById.get(item.sourceId),item);
const items=current.map(item=>buildReviewItem(priorById.get(item.sourceId),item)).filter(Boolean);
const result={metadata:{id:'PHAOS-SOURCE-REVIEW-QUEUE-RUN',version:'1.0.0',generatedAt:new Date().toISOString(),automaticRegistryMutation:false},counts:{sourcesCompared:current.length,unchanged:current.filter(item=>item.comparisonState==='unchanged').length,reviewItems:items.length},items};
fs.mkdirSync(path.dirname(path.join(root,outputPath)),{recursive:true});fs.writeFileSync(path.join(root,outputPath),`${JSON.stringify(result,null,2)}\n`);console.log(JSON.stringify({output:outputPath,...result.counts},null,2));
