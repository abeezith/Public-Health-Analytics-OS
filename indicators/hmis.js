const hmisState = { objects: [], filtered: [], visible: 24, index: new Map(), crosswalks: new Map(), activeType: 'All objects' };
const h$ = id => document.getElementById(id);
const hmisFields = ['hmis-search','hmis-object-type','hmis-component','hmis-facility','hmis-version'];

Promise.all([
  fetch('./data/hmis/catalog.json?v=measure-1.0.0', {cache:'no-store'}).then(r=>r.json()),
  fetch('./data/hmis/crosswalks.json?v=hmis-1.3.0', {cache:'no-store'}).then(r=>r.json())
]).then(([catalog,crosswalk])=>{
  hmisState.objects=catalog.objects||[];
  hmisState.index=new Map(hmisState.objects.map(x=>[x.id,x]));
  hmisState.crosswalks=new Map((crosswalk.indicatorElementCrosswalks||[]).map(x=>[x.indicatorId,x]));
  const counts=catalog.metadata?.counts||{};
  h$('metric-hmis-objects').textContent=catalog.metadata?.totalObjects||hmisState.objects.length;
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
    body=hMeta('Definition',x.definition,true)+hMeta('Applicable facilities',x.facilityTypes,true)+hMeta('Official module titles',x.moduleTitles,true)+hMeta('Observed source codes',x.sourceCodes,true)+hMeta('Source locations',x.sourceLocations,true)+hMeta('Reporting levels',x.reportingLevels,true)+hMeta('Aggregation behavior',x.aggregationRule,true)+hMeta('Zero / blank semantics',x.zeroBlankSemantics,true)+hMeta('Data lineage',x.lineage,true)+idRelations(x.relatedIndicatorIds,'Related indicator candidates')+idRelations(x.relatedValidationRuleIds,'Related validation rules');
  }else if(x.objectType==='Published output'){
    body=hMeta('Definition',x.definition,true)+hMeta('Official OGD code',x.officialCode)+hMeta('Object class',x.recordClass)+hMeta('Source period',x.sourcePeriod)+hMeta('Current form exact-label match',x.exactCurrentFormLabelMatch?'Yes':'No')+hMeta('Reporting levels',x.reportingLevels,true)+hMeta('Currentness',x.currentness,true);
  }else{
    body=hMeta('Rule expression',x.name,true)+hMeta('Left element',x.leftElement)+hMeta('Operator',x.operator)+hMeta('Right element',x.rightElement)+hMeta('Rule class',x.ruleClass)+hMeta('Interpretation',x.definition)+hMeta('Severity',x.severity,true)+relationButtons(x.leftCandidates,'Left-side data-element candidates')+relationButtons(x.rightCandidates,'Right-side data-element candidates');
  }
  h$('modal-content').innerHTML='<div class="modal-kicker"><span>'+hEsc(x.id)+'</span><span>'+hEsc(x.objectType)+'</span><span>'+hEsc(x.versionStatus)+'</span></div><p class="eyebrow">HMIS · '+hEsc(x.component||x.domain)+'</p><h2 id="modal-title">'+hEsc(x.name)+'</h2><div class="metadata-grid hmis-modal-grid">'+body+hMeta('WHO health-system pillars',x.whoPillars,true)+hMeta('Potential uses',x.uses,true)+hMeta('Key limitations',x.caveats,true)+hMeta('Source version',x.sourceVersion,true)+'</div><div class="source-panel"><div><span>Source authority</span><strong>'+hEsc(x.sourceAuthority)+'</strong><small>'+hEsc(x.sourceVersion||x.sourcePeriod)+'</small></div><div><span>Version treatment</span><strong>'+hEsc(x.versionStatus)+'</strong><small>Analytics-OS Release 1.3</small></div><a href="'+hEsc(x.sourceUrl)+'" target="_blank" rel="noreferrer">Open source ↗</a></div>';
  h$('modal-backdrop').hidden=false;document.body.style.overflow='hidden';h$('modal-close').focus();
  document.querySelectorAll('#modal-content [data-hmis-open]').forEach(button=>button.addEventListener('click',()=>openHmisModal(button.dataset.hmisOpen)));
}
