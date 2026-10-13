import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pilot=JSON.parse(fs.readFileSync(path.join(root,'indicators/data/governance/quality-comparability-pilot.json'),'utf8'));
const byId=new Map(pilot.records.map(item=>[item.id,item]));
const emptyBoundary='No governed UTILITY-03 pilot profile is published for this object. Absence is not a statement that no data-quality or comparability risks exist.';

export function qualityComparabilityProfile({canonicalObjectId,indicator,hmis}){
  const item=byId.get(canonicalObjectId);
  if(!item)return {modelId:'PHAOS-DQCOMP-001',modelVersion:'1.0.0',pilotStatus:'Not in 30-indicator pilot',evidenceState:'No governed pilot profile',expectedReportingLag:{state:'Not stated in cited evidence',value:'Not assessed in this pilot',planningNote:'Confirm with the current custodian or reporting calendar before timeliness assessment.'},knownIssues:[],commonMisinterpretations:[],minimumDataRequirements:[],validationChecks:[],comparability:{status:'Not assessed',conditions:[],boundary:emptyBoundary},evidence:null,reviewStatus:'Not reviewed under UTILITY-03',boundary:emptyBoundary};
  const source=indicator||hmis||{};
  const numerator=source.numerator||'Source-defined numerator or event count';
  const denominator=source.denominator||source.denominatorPopulation||'Source-defined denominator or eligible population';
  const sourceLocation=source.sourcePage||source.sourceSection||(source.sourceLocations||[]).join('; ')||'Object-level source metadata; exact locator not stated';
  return {
    modelId:'PHAOS-DQCOMP-001',modelVersion:'1.0.0',pilotStatus:'Pilot profile available',evidenceState:'Source-aware analyst guidance; domain review pending',programme:item.programme,archetype:item.archetype,
    expectedReportingLag:{state:'Not stated in cited evidence',value:'Not stated',planningNote:'Do not infer timeliness from the reporting frequency. Confirm the submission, validation, revision and publication calendar with the responsible custodian.'},
    knownIssues:[{category:'Source-version sensitivity',note:item.issue,evidenceStatus:'Analyst interpretation anchored to the cited definition; domain review pending'},{category:'Timeliness',note:'Late entry, validation and retrospective revision can change a period after its first appearance.',evidenceStatus:'Generic routine-information-system safeguard; local workflow confirmation required'}],
    commonMisinterpretations:[item.misinterpretation],
    minimumDataRequirements:[`Numerator: ${numerator}`,`Denominator / population: ${denominator}`,'Compatible reporting period, geography/reporting unit and source version',item.extraMinimum],
    validationChecks:[{severity:'Error',check:'Denominator must be greater than zero before a percentage or rate is calculated; zero, blank, not applicable and non-reporting remain distinct.'},{severity:'Error',check:'Numerator and denominator must refer to compatible populations, geography and period.'},{severity:'Review',check:item.check}],
    comparability:{status:'Conditional only',conditions:[item.compare,'Recompute from compatible numerator and denominator counts; do not average percentages or rates.'],boundary:'No aggregation or ranking is authorized by this profile. Resolve source-version, definition, period, geography and reporting-completeness differences first.'},
    evidence:{sourceId:source.sourceId||null,authority:source.org||source.sourceAuthority||source.source||'Source authority not stated',sourceVersion:source.sourceVersion||source.versionStatus||'Version not stated',locator:sourceLocation,officialName:source.officialIndicatorName||source.name||canonicalObjectId},
    reviewStatus:pilot.metadata.reviewStatus,
    boundary:'Guidance describes plausible interpretation risks and minimum review checks. It does not assess any observed value, certify validity, or replace the source custodian’s current protocol.'
  };
}

export const qualityComparabilityPilot=pilot;
