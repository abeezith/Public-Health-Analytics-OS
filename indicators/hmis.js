let savedHmisView='cards';
try{if(localStorage.getItem('phaos-hmis-view')==='table')savedHmisView='table';}catch(_){}
const hmisState = { objects: [], filtered: [], visible: 24, index: new Map(), crosswalks: new Map(), activeType: 'All objects', view:savedHmisView };
const h$ = id => document.getElementById(id);
const hmisFields = ['hmis-search','hmis-object-type','hmis-component','hmis-facility','hmis-version'];

Promise.all([
  window.phaosUnifiedModelPromise,
  fetch('./data/hmis/crosswalks.json?v=unify-07-1.0.0', {cache:'no-store'}).then(r=>r.json())
]).then(([model,crosswalk])=>{
  hmisState.objects=model.records.filter(record=>record.registryMemberships.includes('hmis')).map(record=>({...record.hmisMetadata,canonicalObjectId:record.canonicalObjectId,canonicalUri:record.canonicalUri,canonicalObjectType:record.canonicalObjectType,representations:record.representations,navigation:record.navigation,systemPortalTags:record.systemPortalTags}));
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
  const pendingType=h$('hmis-object-type').dataset.pendingValue;
  if(pendingType&&[...h$('hmis-object-type').options].some(option=>option.value===pendingType))h$('hmis-object-type').value=pendingType;
  hmisState.activeType=h$('hmis-object-type').value;
  syncHmisTabs();syncHmisViewButtons();
  hmisFilter();
}).catch(()=>{h$('hmis-grid').innerHTML='<div class="empty-state"><h3>HMIS data could not be loaded</h3><p>Reload the page to retry the structured catalogue.</p></div>';});

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
document.querySelectorAll('[data-hmis-view]').forEach(button=>button.addEventListener('click',()=>{
  hmisState.view=button.dataset.hmisView;
  try{localStorage.setItem('phaos-hmis-view',hmisState.view);}catch(_){}
  syncHmisViewButtons();hmisRender();
}));

function syncHmisTabs(){document.querySelectorAll('[data-hmis-type]').forEach(x=>x.classList.toggle('active',x.dataset.hmisType===hmisState.activeType));}
function syncHmisViewButtons(){document.querySelectorAll('[data-hmis-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.hmisView===hmisState.view)));}
function hmisFilter(){
  hmisState.visible=24;
  const q=h$('hmis-search').value.trim().toLowerCase(),type=h$('hmis-object-type').value,component=h$('hmis-component').value,facility=h$('hmis-facility').value,version=h$('hmis-version').value;
  hmisState.filtered=hmisState.objects.filter(x=>{
    const text=[x.id,x.objectType,x.name,x.definition,x.displayDefinition,x.component,x.domain,x.recordClass,x.formula,x.normalizedFormula,x.measureType,x.scaleDisplay,x.denominatorPopulation,x.numerator,x.denominator,x.leftElement,x.rightElement,x.sourceVersion,x.versionStatus,(x.facilityTypes||[]).join(' '),(x.sourceCodes||[]).join(' ')].join(' ').toLowerCase();
    return (!q||text.includes(q))&&(type==='All objects'||x.objectType===type)&&(component==='All components'||x.component===component)&&(facility==='All facilities'||(x.facilityTypes||[]).includes(facility))&&(version==='All versions'||x.versionStatus===version);
  }).sort((a,b)=>a.objectType.localeCompare(b.objectType)||a.name.localeCompare(b.name));
  h$('hmis-clear').hidden=!(q||type!=='All objects'||component!=='All components'||facility!=='All facilities'||version!=='All versions');
  const summaries=window.phaosResultSummaries,counts=Object.fromEntries(summaries.counts(hmisState.filtered,x=>x.objectType)),occurrenceLinked=hmisState.filtered.filter(x=>(x.navigation?.occurrences||[]).length).length,graphLinked=hmisState.filtered.filter(x=>x.navigation?.graphNode).length;
  summaries.render('hmis-result-summary',{
    eyebrow:'Result summary · HMIS knowledge layer',title:`${hmisState.filtered.length.toLocaleString()} HMIS knowledge objects in this result`,
    metrics:[{value:counts['Derived indicator']||0,label:'derived indicators'},{value:counts['Data element']||0,label:'data elements'},{value:counts['Published output']||0,label:'published outputs'},{value:counts['Validation rule']||0,label:'validation rules'},{value:occurrenceLinked,label:'linked to report occurrences'},{value:graphLinked,label:'linked to graph nodes'}],
    groups:[{label:'Programme components',values:summaries.counts(hmisState.filtered,x=>x.component||x.domain||'Not classified')},{label:'Version status',values:summaries.counts(hmisState.filtered,x=>x.versionStatus||'Not stated')},{label:'Facility / reporting applicability',values:summaries.counts(hmisState.filtered,x=>x.facilityTypes)}],
    filters:summaries.activeFilters([['Search',h$('hmis-search').value.trim(),''],['Object type',type,'All objects'],['Component',component,'All components'],['Facility',facility,'All facilities'],['Version',version,'All versions']]),
    boundary:'Derived indicators are one HMIS object class. The 54 derived indicators do not equal the full HMIS layer of 1,046 knowledge objects.'
  });
  hmisRender();
}
function hmisRender(){
  h$('hmis-result-count').textContent=hmisState.filtered.length;
  const rows=hmisState.filtered.slice(0,hmisState.visible);
  h$('hmis-grid').classList.toggle('table-view',hmisState.view==='table');
  h$('hmis-grid').innerHTML=rows.length?(hmisState.view==='table'?hmisTable(rows):rows.map(hmisCard).join('')):'<div class="empty-state"><h3>No matching HMIS objects</h3><p>Try a broader term or clear the current filters.</p></div>';
  document.querySelectorAll('[data-hmis-open]').forEach(button=>button.addEventListener('click',()=>openHmisModal(button.dataset.hmisOpen)));
  h$('hmis-load-more').hidden=hmisState.visible>=hmisState.filtered.length;
  if(!h$('hmis-load-more').hidden)h$('hmis-load-more').textContent='Load '+Math.min(24,hmisState.filtered.length-hmisState.visible)+' more HMIS objects';
}
function hmisTable(rows){
  const body=rows.map(x=>'<tr><td class="registry-id">'+hEsc(x.id)+'</td><td>'+hEsc(x.objectType)+'</td><td class="registry-name"><strong>'+hEsc(x.name)+'</strong><span>'+hEsc(x.displayDefinition||x.definition||x.formula||'No definition reported')+'</span></td><td>'+hEsc(x.component||x.domain||'Not classified')+'</td><td>'+hEsc(x.lowestReportingLevel||(x.facilityTypes||[]).join('; ')||'Not specified')+'</td><td>'+hEsc(x.versionStatus||'Not specified')+'</td><td><button class="table-open" data-hmis-open="'+hEsc(x.id)+'" aria-label="View linked metadata for '+hEsc(x.name)+'">View <span aria-hidden="true">→</span></button></td></tr>').join('');
  return '<table class="registry-table hmis-table"><caption>Filtered HMIS knowledge objects</caption><thead><tr><th scope="col">Object ID</th><th scope="col">Object type</th><th scope="col">Name and definition</th><th scope="col">Component</th><th scope="col">Lowest level / facility</th><th scope="col">Version status</th><th scope="col"><span class="visually-hidden">Actions</span></th></tr></thead><tbody>'+body+'</tbody></table>';
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
  const graphSelect=h$('kg-focus');
  const graphAvailable=graphSelect&&[...graphSelect.options].some(option=>option.value===id);
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
  h$('modal-content').innerHTML='<div class="modal-kicker"><span>'+hEsc(x.id)+'</span><span>'+hEsc(x.objectType)+'</span><span>'+hEsc(x.versionStatus)+'</span></div><p class="eyebrow">HMIS · '+hEsc(x.component||x.domain)+'</p><h2 id="modal-title">'+hEsc(x.name)+'</h2><div class="metadata-grid hmis-modal-grid">'+body+hMeta('WHO health-system pillars',x.whoPillars,true)+hMeta('Potential uses',x.uses,true)+hMeta('Key limitations',x.caveats,true)+hMeta('Source version',x.sourceVersion,true)+'</div>'+window.phaosNavigation.renderFor(id)+'<div class="source-panel"><div><span>Source authority</span><strong>'+hEsc(x.sourceAuthority)+'</strong><small>'+hEsc(x.sourceVersion||x.sourcePeriod)+'</small></div><div><span>Version treatment</span><strong>'+hEsc(x.versionStatus)+'</strong><small>Analytics-OS Release 1.4</small></div>'+(graphAvailable?'<button type="button" id="hmis-open-graph" class="modal-graph-link">Explore in graph →</button>':'')+'<a href="'+hEsc(x.sourceUrl)+'" target="_blank" rel="noreferrer">Open source ↗</a></div>';
  h$('modal-backdrop').hidden=false;document.body.style.overflow='hidden';h$('modal-close').focus();
  h$('hmis-open-graph')?.addEventListener('click',()=>{h$('modal-close').click();location.hash='knowledge-graph';graphSelect.value=id;graphSelect.dispatchEvent(new Event('change'));});
  window.phaosNavigation.bind(h$('modal-content'));
  document.querySelectorAll('#modal-content [data-hmis-open]').forEach(button=>button.addEventListener('click',()=>openHmisModal(button.dataset.hmisOpen)));
}
