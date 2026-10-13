import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sourceUrl='https://www.nhm.gov.in/New_Updates_2018/NHM_Components/RMNCH_MH_Guidelines/LaQshya-Guidelines.pdf';
const source={sourceId:'IND_NHM_LAQSHYA_2017',url:sourceUrl,locator:'Annexure C: Facility Level Targets for Incentives, PDF pages 41–42'};
const absolute=[
  ['046',90,'%', 'at least'],['047',90,'%','at least'],['048',90,'%','at least'],
  ['049',80,'%','at least'],['050',0,'%','equal to'],['051',0,'%','equal to'],
  ['052',5,'%','at most'],['053',80,'%','at least'],['054',0,'%','equal to'],
  ['055',0,'%','equal to'],['058',100,'%','equal to'],['059',80,'percentage score','at least']
];
const relative=[
  ['049',30,'increase'],['050',20,'reduction'],['051',20,'reduction'],['052',30,'reduction'],
  ['053',30,'increase'],['054',25,'reduction'],['055',25,'reduction'],['059',30,'increase']
];
const common=(suffix,variant,direction)=>({
  id:`REF-LAQ-${suffix}-${variant}`,recordType:'Reference value',schemaVersion:'1.4.0',businessVersion:'1.0.0',lifecycleStatus:'active',
  indicatorCanonicalObjectId:`IND-RMNCHA2-${suffix}`,indicatorCanonicalUri:`https://abeezith.github.io/Public-Health-Analytics-OS/id/IND-RMNCHA2-${suffix}`,
  definitionBusinessVersion:'1.0.0',referenceType:'target',
  applicability:{geography:'India',geographyCode:'IN',geographyLevel:'National programme guidance',population:'LaQshya-designated labour rooms and maternity operation theatres',programme:'LaQshya'},
  effectivePeriod:{periodBasis:'programme-relative',anchor:'Implementation under the cited LaQshya guideline',label:'Applies under the cited guideline; no calendar start or end date is asserted by this registry.'},
  authority:{source,sourceVersion:'MoHFW/NHM operational guidelines, 2017',accessedOn:'2026-09-03',issuingOrganization:'National Health Mission, Ministry of Health and Family Welfare, Government of India'},
  interpretation:{direction,scopeNote:'Official alternative target preserved as an independent reference-value record. It is not an observed result and does not alter the indicator definition.'},
  publication:{accessClass:'public',redistributionStatus:'permitted'}
});
const comparator={"at least":'>=',"at most":'<=',"equal to":'='};
const records=[
  ...absolute.map(([suffix,value,unit,direction])=>({...common(suffix,'ABS',direction),valueQuantity:{value,unit,comparator:comparator[direction]}})),
  ...relative.map(([suffix,magnitude,direction])=>({...common(suffix,`REL-${direction.toUpperCase()}`,direction==='increase'?'at least':'at most'),relativeChange:{magnitude,unit:'percent relative change',direction,baseline:'Facility baseline defined by the cited programme source'}}))
].sort((a,b)=>a.indicatorCanonicalObjectId.localeCompare(b.indicatorCanonicalObjectId)||a.id.localeCompare(b.id));
const output={metadata:{id:'PHAOS-REFERENCE-VALUE-PILOT',modelId:'PHAOS-REFERENCE-001',modelVersion:'1.0.0',schemaPackageVersion:'1.4.0',generated:'2026-10-13',task:'UTILITY-04',scope:'Source-bounded LaQshya Annexure C numeric target pilot'},counts:{referenceValues:records.length,indicators:new Set(records.map(x=>x.indicatorCanonicalObjectId)).size,absoluteTargets:records.filter(x=>x.valueQuantity).length,relativeChangeTargets:records.filter(x=>x.relativeChange).length},records,interpretationBoundary:'Only explicit numeric targets in the cited source table are represented. Compliance-status and frequency statements are not coerced into numeric targets. Alternative absolute and baseline-relative targets remain separate. No observed health values are included.'};
fs.writeFileSync(path.join(root,'indicators/data/observations/reference-values.json'),`${JSON.stringify(output,null,2)}\n`);
console.log(JSON.stringify(output.counts,null,2));
