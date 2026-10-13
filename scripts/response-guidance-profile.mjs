import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pilot=JSON.parse(fs.readFileSync(path.join(root,'indicators/data/governance/quality-comparability-pilot.json'),'utf8'));
const byId=new Map(pilot.records.map(item=>[item.id,item]));
const boundary='No governed UTILITY-05 response guidance is published for this object. Absence does not mean that no official or locally governed response protocol exists.';

export function responseGuidanceProfile({canonicalObjectId,indicator,hmis}){
  const item=byId.get(canonicalObjectId);
  if(!item)return {modelId:'PHAOS-RESPONSE-001',modelVersion:'1.0.0',guidanceState:'No governed response guidance',officialProtocol:{status:'Not identified in cited indicator metadata',actions:[],evidence:null},advisoryWorkflow:null,reviewStatus:'Not reviewed under UTILITY-05',boundary};
  const source=indicator||hmis||{};
  const locator=source.sourcePage||source.sourceSection||(source.sourceLocations||[]).join('; ')||'Object-level source metadata; exact response-protocol locator not stated';
  const evidence={sourceId:source.sourceId||null,authority:source.org||source.sourceAuthority||source.source||'Source authority not stated',sourceVersion:source.sourceVersion||source.versionStatus||'Version not stated',locator,url:source.url||source.sourceUrl||null,officialName:source.officialIndicatorName||source.name||canonicalObjectId};
  return {
    modelId:'PHAOS-RESPONSE-001',modelVersion:'1.0.0',guidanceState:'Advisory review guidance available',programme:item.programme,archetype:item.archetype,
    officialProtocol:{status:'Not identified in cited indicator metadata',actions:[],evidence,reason:'The cited indicator metadata supports identity and interpretation context but does not provide an exact, versioned response SOP for this manifestation.'},
    advisoryWorkflow:{trigger:'Use when a value, trend or underlying count appears unexpected, adverse or inconsistent; the registry does not set an alert threshold.',steps:[
      'Verify numerator, denominator, scale, period, geography, reporting completeness and source version before interpretation.',
      item.check,
      `Interpret in context: ${item.misinterpretation}`,
      'If the signal persists after verification, document the evidence and refer it to the responsible programme or data-quality reviewer under the applicable local protocol.'
    ],minimumEvidence:[item.extraMinimum,'Underlying numerator and denominator counts where applicable','Applicable source version, reporting period and reporting-unit context'],actionClasses:['Verify data','Interpret in context','Escalate for programme review'],authority:'Analytics-OS analyst advisory; not source-custodian instruction'},
    evidence,reviewStatus:'Analyst-curated pilot — domain review pending',
    prohibitedUses:['Do not initiate or withhold clinical care from this metadata alone.','Do not treat a target breach as proof of programme failure.','Do not automate alerts, sanctions, ranking or resource allocation without an approved local protocol and validated observations.'],
    boundary:'The workflow supports structured review of an indicator signal. It does not assess an observed value, prescribe a programme intervention, or replace current official and local protocols.'
  };
}

export const responseGuidancePilot=pilot;
