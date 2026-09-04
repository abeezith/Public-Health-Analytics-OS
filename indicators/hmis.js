const hmisState = { objects: [], filtered: [], visible: 24, index: new Map(), crosswalks: new Map(), activeType: 'All objects' };
const h$ = id => document.getElementById(id);
const hmisFields = ['hmis-search','hmis-object-type','hmis-component','hmis-facility','hmis-version'];

Promise.all([
  fetch('./data/hmis/catalog.json?v=hmis-1.4.0', {cache:'no-store'}).then(r=>r.json()),
  fetch('./data/hmis/crosswalks.json?v=hmis-1.4.0', {cache:'no-store'}).then(r=>r.json()),
  fetch('./data/hmis/headquarters-elements.json?v=hmis-1.4.0', {cache:'no-store'}).then(r=>r.json()),
  fetch('./data/hmis/facility-format-corrections.json?v=hmis-1.4.0', {cache:'no-store'}).then(r=>r.json())
]).then(([catalog,crosswalk,headquarters,facilityCorrections])=>{
  const headquartersObjects=expandHeadquarters(headquarters);
  const correctedCatalog=applyFacilityCorrections(catalog.objects||[],facilityCorrections);
  hmisState.objects=[...correctedCatalog,...expandFacilityCorrections(facilityCorrections),...headquartersObjects];
  hmisState.index=new Map(hmisState.objects.map(x=>[x.id,x]));
  hmisState.crosswalks=new Map((crosswalk.indicatorElementCrosswalks||[]).map(x=>[x.indicatorId,x]));
  const counts=hmisState.objects.reduce((acc,item)=>((acc[item.objectType]=(acc[item.objectType]||0)+1),acc),{});
  h$('metric-hmis-objects').textContent=hmisState.objects.length;
  h$('hmis-count-indicators').textContent=counts['Derived indicator']||0;
  h$('hmis-count-elements').textContent=counts['Data element']||0;
  h$('hmis-count-outputs').textContent=counts['Published output']||0;
  h$('hmis-count-rules').textContent=counts['Validation rule']||0;
  hmisFill('hmis-object-type',hmisState.objects.map(x=>x.objectType));
  hmisFill('hmis-component',hmisState.objects.map(x=>x.component).filter(Boolean));
  hmisFill('hmis-facility',hmisState.objects.flatMap(x=>x.facilityTypes||[]));
  hmisFill('hmis-version',hmisState.objects.map(x=>x.versionStatus).filter(Boolean));
  hmisFilter();
}).catch(()=>{h$('hmis-grid').innerHTML='<div class="empty-state"><h3>HMIS data could not be loaded</h3><p>Reload the page or download the structured catalogue.</p></div>';});

function expandHeadquarters(doc){
  return (doc.records||[]).map(([id,reportingUnit,code,name,component,domain,page])=>{
    const stock=component==='District stock position',average=name.startsWith('Average '),rmncha=!['Emergency and referral services','Communicable diseases','Oral health'].includes(domain);
    return {id,objectType:'Data element',name,definition:`Monthly HMIS ${reportingUnit} reporting element: ${name}.`,displayDefinition:`Monthly HMIS ${reportingUnit} reporting element: ${name}.`,component,domain,facilityTypes:[reportingUnit],moduleTitles:[component],sourceCodes:[code],sourceLocations:[`${reportingUnit} p.${page}`],collectionDimensions:stock?['Balance from previous month','Stock received','Unusable stock','Stock distributed','Total stock']:['Numbers reported during the month'],recordClass:'Raw headquarters reporting data element',reportingPeriod:'Monthly',reportingLevels:reportingUnit==='Block HQ'?['Block/planning unit','District','State/UT','National']:['District','State/UT','National'],lowestReportingLevel:reportingUnit==='Block HQ'?'Block/planning unit':'District',aggregationRule:stock?'Stock-flow vector; preserve all five columns and validate the balance equation':average?'Non-additive average; aggregate from numerator and denominator':'Generally additive count subject to source-defined subgroup and duplicate rules',zeroBlankSemantics:'Do not collapse zero, blank, not applicable and non-reporting.',whoPillars:['Health information systems','Service delivery',...(stock?['Medical products, vaccines and technologies']:[])],sourceVersion:doc.metadata.sourceVersion,versionStatus:'Current public headquarters form candidate',sourceUrl:doc.metadata.sourceUrl,sourceAuthority:doc.metadata.sourceAuthority,provenanceStatus:'Exact form label and code retained; section headings excluded',lineage:`Programme or district activity → ${reportingUnit} monthly format → HMIS aggregation → analytical output`,uses:['Programme monitoring','Administrative-unit review','Data-quality review'],caveats:'A form field is not automatically a calculated indicator. Preserve reporting unit, code, collection dimensions and source version.',relatedIndicatorIds:[],relatedValidationRuleIds:[],measureType:null,scaleDisplay:'Not specified',normalizedFormula:'',denominatorPopulation:'Not applicable to a raw reporting field',programmeTags:rmncha?['NHM RMNCH+A']:[]};
  });
}

function applyFacilityCorrections(objects,doc){
  const rows=objects.map(x=>({...x,facilityTypes:[...(x.facilityTypes||[])],sourceLocations:[...(x.sourceLocations||[])]})),index=new Map(rows.map(x=>[x.id,x]));
  for(const mutation of doc.mutations||[]){const item=index.get(mutation.id);if(!item)continue;for(const [facility,location] of mutation.remove||[]){item.facilityTypes=item.facilityTypes.filter(value=>value!==facility);item.sourceLocations=item.sourceLocations.filter(value=>value!==location);}for(const [facility,location] of mutation.add||[]){if(!item.facilityTypes.includes(facility))item.facilityTypes.push(facility);if(!item.sourceLocations.includes(location))item.sourceLocations.push(location);}}
  return rows;
}

function expandFacilityCorrections(doc){
  return (doc.records||[]).map(([id,facility,code,name,component,domain,page])=>({id,objectType:'Data element',name,definition:`Monthly HMIS ${facility} reporting element: ${name}.`,displayDefinition:`Monthly HMIS ${facility} reporting element: ${name}.`,component,domain,facilityTypes:[facility],moduleTitles:[component],sourceCodes:[code],sourceLocations:[`${facility} p.${page}`],collectionDimensions:['Numbers reported during the month'],recordClass:'Raw facility reporting data element',reportingPeriod:'Monthly',reportingLevels:['Facility/reporting unit','Block/subdistrict','District','State/UT','National'],lowestReportingLevel:'Facility/reporting unit',aggregationRule:'Generally additive count subject to source-defined subgroup and duplicate rules',zeroBlankSemantics:'Do not collapse zero, blank, not applicable and non-reporting.',whoPillars:['Health information systems','Service delivery'],sourceVersion:'Revised HMIS formats effective April 2025',versionStatus:'Current public form candidate - verified correction',sourceUrl:'https://nhm.hp.gov.in/reporting-formats',sourceAuthority:'HMIS / National Health Mission',provenanceStatus:'Exact facility-specific form label retained after code-collision review',lineage:`Primary service event → ${facility} monthly format → HMIS aggregation → analytical output`,uses:['Routine service monitoring','Facility and district planning','Data-quality review'],caveats:'A form field is not automatically a calculated indicator. Facility-specific wording remains distinct.',relatedIndicatorIds:[],relatedValidationRuleIds:[],measureType:null,scaleDisplay:'Not specified',normalizedFormula:'',denominatorPopulation:'Not applicable to a raw reporting field',programmeTags:domain==='Maternal, newborn and reproductive health'?['NHM RMNCH+A']:[]}));
}

function hmisFill(id,values){[...new Set(values)].sort().forEach(value=>h$(id).add(new Option(value,value)));}
hmisFields.forEach(id=>h$(id).addEventListener(id==='hmis-search'?'input':'change',()=>{
  if(id==='hmis-object-type'){hmisState.activeType=h$(id).value;syncHmisTabs();}
  hmisFilter();
}));
document.querySelectorAll('[data-hmis-type]').forEach(button=>button.addEventListener('click',()=>{
  hmisState.activeType=button.dataset.hmisType;
  h$('hmis-object-type').value=hmisState.activeType;
  syncHmisTabs();hmisFilter();
}));
h$('hmis-clear').addEventListener('click',()=>{
  h$('hmis-search').value='';['hmis-object-type','hmis-component','hmis-facility','hmis-version'].forEach(id=>h$(id).selectedIndex=0);
  hmisState.activeType='All objects';syncHmisTabs();hmisFilter();
});
h$('hmis-load-more').addEventListener('click',()=>{hmisState.visible+=24;hmisRender();});

function syncHmisTabs(){document.querySelectorAll('[data-hmis-type]').forEach(x=>x.classList.toggle('active',x.dataset.hmisType===hmisState.activeType));}
function hmisFilter(){
  hmisState.visible=24;
  const q=h$('hmis-search').value.trim().toLowerCase(),type=h$('hmis-object-type').value,component=h$('hmis-component').value,facility=h$('hmis-facility').value,version=h$('hmis-version').value;
  hmisState.filtered=hmisState.objects.filter(x=>{
    const text=[x.id,x.objectType,x.name,x.definition,x.displayDefinition,x.component,x.domain,x.recordClass,x.formula,x.normalizedFormula,x.measureType,x.scaleDisplay,x.denominatorPopulation,x.numerator,x.denominator,x.leftElement,x.rightElement,x.sourceVersion,x.versionStatus,(x.facilityTypes||[]).join(' '),(x.sourceCodes||[]).join(' ')].join(' ').toLowerCase();
    return (!q||text.includes(q))&&(type==='All objects'||x.objectType===type)&&(component==='All components'||x.component===component)&&(facility==='All facilities'||(x.facilityTypes||[]).includes(facility))&&(version==='All versions'||x.versionStatus===version);
  }).sort((a,b)=>a.objectType.localeCompare(b.objectType)||a.name.localeCompare(b.name));
  h$('hmis-clear').hidden=!(q||type!=='All objects'||component!=='All components'||facility!=='All facilities'||version!=='All versions');
  hmisRender();
}
function hmisRender(){
  h$('hmis-result-count').textContent=hmisState.filtered.length;
  const rows=hmisState.filtered.slice(0,hmisState.visible);
  h$('hmis-grid').innerHTML=rows.length?rows.map(hmisCard).join(''):'<div class="empty-state"><h3>No matching HMIS objects</h3><p>Try a broader term or clear the current filters.</p></div>';
  document.querySelectorAll('[data-hmis-open]').forEach(button=>button.addEventListener('click',()=>openHmisModal(button.dataset.hmisOpen)));
  h$('hmis-load-more').hidden=hmisState.visible>=hmisState.filtered.length;
  if(!h$('hmis-load-more').hidden)h$('hmis-load-more').textContent='Load '+Math.min(24,hmisState.filtered.length-hmisState.visible)+' more HMIS objects';
}
function hEsc(v=''){const div=document.createElement('div');div.textContent=String(v);return div.innerHTML;}
function hmisCard(x){
  const status=x.versionStatus||'Version not stated';
  const summary=x.displayDefinition||x.definition||x.formula||x.name;
  const measureTags=x.measureType?'<span class="measure-tag">'+hEsc(x.measureType)+'</span><span class="scale-tag">'+hEsc(x.scaleDisplay||'Not specified')+'</span>':'';
  return '<article class="hmis-card type-'+x.objectType.toLowerCase().replaceAll(' ','-')+'"><div class="card-top"><span>'+hEsc(x.id)+'</span><span>'+hEsc(x.objectType)+'</span></div><div class="card-tags"><span class="card-domain">'+hEsc(x.component||x.domain)+'</span>'+measureTags+'</div><h3>'+hEsc(x.name)+'</h3><p>'+hEsc(summary)+'</p><dl><div><dt>Version status</dt><dd>'+hEsc(status)+'</dd></div><div><dt>WHO pillars</dt><dd>'+hEsc((x.whoPillars||[]).join('; '))+'</dd></div></dl><button data-hmis-open="'+hEsc(x.id)+'">View linked metadata <span>→</span></button></article>';
}
function hMeta(title,value,wide=false){
  const display=Array.isArray(value)?value.join('; '):value;
  return '<div class="meta-item'+(wide?' wide':'')+'"><span>'+hEsc(title)+'</span><p>'+hEsc(display||'Not reported')+'</p></div>';
}
function relationButtons(items,label){
  if(!items||!items.length)return hMeta(label,'No credible current-form candidate identified');
  return '<div class="meta-item wide"><span>'+hEsc(label)+'</span><div class="relation-list">'+items.map(x=>'<button data-hmis-open="'+hEsc(x.elementId)+'"><b>'+hEsc(x.name)+'</b><small>'+hEsc(x.matchStatus)+' · score '+hEsc(x.score)+'</small></button>').join('')+'</div></div>';
}
function idRelations(ids,label){
  const rows=(ids||[]).map(id=>hmisState.index.get(id)).filter(Boolean);
  if(!rows.length)return '';
  return '<div class="meta-item wide"><span>'+hEsc(label)+'</span><div class="relation-list">'+rows.slice(0,12).map(x=>'<button data-hmis-open="'+hEsc(x.id)+'"><b>'+hEsc(x.name)+'</b><small>'+hEsc(x.objectType)+' · '+hEsc(x.id)+'</small></button>').join('')+'</div></div>';
}
function openHmisModal(id){
  const x=hmisState.index.get(id);if(!x)return;
  let body='';
  if(x.objectType==='Derived indicator'){
    const link=hmisState.crosswalks.get(x.id)||{};
    body=hMeta('Display definition',x.displayDefinition||x.definition,true)+hMeta('Measure type',x.measureType)+hMeta('Scale',x.scaleDisplay)+hMeta('Normalized formula',x.normalizedFormula,true)+hMeta('Denominator population',x.denominatorPopulation,true)+hMeta('Official / source definition',x.definition,true)+hMeta('Numerator',x.numerator)+hMeta('Denominator',x.denominator)+hMeta('Official / source formula',x.formula)+hMeta('Unit',x.unit)+hMeta('Aggregation rule',x.aggregationRule,true)+hMeta('Zero-denominator rule',x.zeroDenominatorRule,true)+hMeta('Recommended level',x.suggestedLevel)+hMeta('Periodicity',x.periodicity)+relationButtons(link.numeratorCandidates,'Numerator data-element candidates')+relationButtons(link.denominatorCandidates,'Denominator data-element candidates');
  }else if(x.objectType==='Data element'){
    body=hMeta('Definition',x.definition,true)+hMeta('Applicable facilities / reporting units',x.facilityTypes,true)+hMeta('Lowest reporting level',x.lowestReportingLevel)+hMeta('Collection dimensions',x.collectionDimensions,true)+hMeta('Official module titles',x.moduleTitles,true)+hMeta('Observed source codes',x.sourceCodes,true)+hMeta('Source locations',x.sourceLocations,true)+hMeta('Reporting levels',x.reportingLevels,true)+hMeta('Aggregation behavior',x.aggregationRule,true)+hMeta('Zero / blank semantics',x.zeroBlankSemantics,true)+hMeta('Data lineage',x.lineage,true)+idRelations(x.relatedIndicatorIds,'Related indicator candidates')+idRelations(x.relatedValidationRuleIds,'Related validation rules');
  }else if(x.objectType==='Published output'){
    body=hMeta('Definition',x.definition,true)+hMeta('Official OGD code',x.officialCode)+hMeta('Object class',x.recordClass)+hMeta('Source period',x.sourcePeriod)+hMeta('Current form exact-label match',x.exactCurrentFormLabelMatch?'Yes':'No')+hMeta('Reporting levels',x.reportingLevels,true)+hMeta('Currentness',x.currentness,true);
  }else{
    body=hMeta('Rule expression',x.name,true)+hMeta('Left element',x.leftElement)+hMeta('Operator',x.operator)+hMeta('Right element',x.rightElement)+hMeta('Rule class',x.ruleClass)+hMeta('Interpretation',x.definition)+hMeta('Severity',x.severity,true)+relationButtons(x.leftCandidates,'Left-side data-element candidates')+relationButtons(x.rightCandidates,'Right-side data-element candidates');
  }
  h$('modal-content').innerHTML='<div class="modal-kicker"><span>'+hEsc(x.id)+'</span><span>'+hEsc(x.objectType)+'</span><span>'+hEsc(x.versionStatus)+'</span></div><p class="eyebrow">HMIS · '+hEsc(x.component||x.domain)+'</p><h2 id="modal-title">'+hEsc(x.name)+'</h2><div class="metadata-grid hmis-modal-grid">'+body+hMeta('WHO health-system pillars',x.whoPillars,true)+hMeta('Potential uses',x.uses,true)+hMeta('Key limitations',x.caveats,true)+hMeta('Source version',x.sourceVersion,true)+'</div><div class="source-panel"><div><span>Source authority</span><strong>'+hEsc(x.sourceAuthority)+'</strong><small>'+hEsc(x.sourceVersion||x.sourcePeriod)+'</small></div><div><span>Version treatment</span><strong>'+hEsc(x.versionStatus)+'</strong><small>Analytics-OS Release 1.4</small></div><a href="'+hEsc(x.sourceUrl)+'" target="_blank" rel="noreferrer">Open source ↗</a></div>';
  h$('modal-backdrop').hidden=false;document.body.style.overflow='hidden';h$('modal-close').focus();
  document.querySelectorAll('#modal-content [data-hmis-open]').forEach(button=>button.addEventListener('click',()=>openHmisModal(button.dataset.hmisOpen)));
}
