const schemaRoot=document.getElementById('hmis-report-schemas');
let savedOccurrenceView='cards';
try{if(localStorage.getItem('phaos-occurrence-view')==='table')savedOccurrenceView='table';}catch(_){}
const occurrenceState={records:[],filtered:[],visible:24,view:savedOccurrenceView,index:new Map()};
const o$=id=>document.getElementById(id);

if(schemaRoot){
  Promise.all([
    window.phaosUnifiedModelPromise,
    fetch('./data/hmis/report-schemas/index.json?v=unify-06-1.0.0',{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json();})
  ]).then(([model,payload])=>{
    renderReportSchemas(payload.schemas||[]);
    initializeOccurrenceExplorer(model.occurrences||[]);
  }).catch(()=>{
    o$('schema-content').innerHTML='<div class="empty-state"><h3>Report-schema data could not be loaded</h3><p>The indicator and HMIS views remain available; reload to retry this occurrence layer.</p></div>';
    o$('occurrence-grid').innerHTML='<div class="empty-state"><h3>Occurrences could not be loaded</h3><p>Reload the page to retry the consolidated read model.</p></div>';
  });
}

function schemaEscape(value=''){const node=document.createElement('div');node.textContent=String(value);return node.innerHTML;}
function occurrenceMeta(title,value,wide=false){const display=Array.isArray(value)?value.join('; '):value;return display!==undefined&&display!==null&&display!==''?`<div class="meta-item${wide?' wide':''}"><span>${schemaEscape(title)}</span><p>${schemaEscape(display)}</p></div>`:'';}

function renderReportSchemas(schemas){
  const target=o$('schema-content');
  if(!schemas.length){target.innerHTML='<div class="empty-state"><h3>No observed report schemas</h3><p>No schema package is included in this release.</p></div>';return;}
  target.innerHTML=schemas.map(schema=>{const c=schema.counts||{};return `<article class="schema-record">
    <div class="schema-heading"><div><span class="schema-state">${schemaEscape(schema.state)} · observed ${schemaEscape(schema.downloadDate)}</span><h3>${schemaEscape(schema.title)}</h3><p>${schemaEscape(schema.schemaId)}</p></div><span class="qa-pass">QA ${schema.qaPassed?'passed':'review'}</span></div>
    <div class="schema-metrics"><div><strong>${c.totalColumns}</strong><span>columns</span></div><div><strong>${c.dimensions}</strong><span>dimensions</span></div><div><strong>${c.measureOccurrences}</strong><span>measures</span></div><div><strong>${c.canonicalLinks}</strong><span>canonical links</span></div><div><strong>${c.candidateNewFields}</strong><span>held candidates</span></div><div><strong>${c.canonicalElementsNotObserved}</strong><span>not observed</span></div><div><strong>${c.schemaSpecificCodeOccurrences}</strong><span>new code occurrences</span></div><div><strong>${c.derivedIndicatorsAssessed}</strong><span>indicators assessed</span></div></div>
    <div class="schema-boundary"><strong>Interpretation boundary</strong><p>${schemaEscape(schema.interpretationBoundary)}</p></div>
    <div class="schema-decisions"><div><b>508 links</b><span>471 exact labels, 34 controlled equivalents and 3 reviewed aliases</span></div><div><b>17 candidates held</b><span>No automatic promotion to the canonical 700-element dictionary</span></div><div><b>Row-dependent applicability</b><span>Facility, format and outreach context require data rows</span></div></div>
    <p class="schema-access-note">Interactive review only · download options disabled</p>
  </article>`;}).join('');
}

function initializeOccurrenceExplorer(records){
  occurrenceState.records=records;
  occurrenceState.index=new Map(records.map(item=>[item.occurrenceId,item]));
  const measures=records.filter(item=>item.discovery.occurrenceClass==='Measure');
  const dimensions=records.filter(item=>item.discovery.occurrenceClass==='Dimension');
  o$('occurrence-total').textContent=records.length;
  o$('occurrence-measures').textContent=measures.length;
  o$('occurrence-links').textContent=measures.filter(item=>item.canonicalObjectId).length;
  o$('occurrence-candidates').textContent=measures.filter(item=>item.candidateObjectId).length;
  o$('occurrence-dimensions').textContent=dimensions.length;
  occurrenceFill('occurrence-class',records.map(item=>item.discovery.occurrenceClass));
  occurrenceFill('occurrence-group',records.map(item=>item.discovery.group));
  occurrenceFill('occurrence-linkage',records.map(item=>item.discovery.linkageStatus));
  ['occurrence-search','occurrence-class','occurrence-group','occurrence-linkage','occurrence-sort'].forEach(id=>o$(id).addEventListener(id==='occurrence-search'?'input':'change',occurrenceFilter));
  o$('occurrence-clear').addEventListener('click',()=>{o$('occurrence-search').value='';['occurrence-class','occurrence-group','occurrence-linkage'].forEach(id=>o$(id).selectedIndex=0);o$('occurrence-sort').value='ordinal';occurrenceFilter();});
  o$('occurrence-load-more').addEventListener('click',()=>{occurrenceState.visible+=24;occurrenceRender();});
  document.querySelectorAll('[data-occurrence-view]').forEach(button=>button.addEventListener('click',()=>{occurrenceState.view=button.dataset.occurrenceView;try{localStorage.setItem('phaos-occurrence-view',occurrenceState.view);}catch(_){}syncOccurrenceView();occurrenceRender();}));
  syncOccurrenceView();occurrenceFilter();
}

function occurrenceFill(id,values){[...new Set(values)].sort().forEach(value=>o$(id).add(new Option(value,value)));}
function syncOccurrenceView(){document.querySelectorAll('[data-occurrence-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.occurrenceView===occurrenceState.view)));}
function occurrenceFilter(){
  occurrenceState.visible=24;
  const query=o$('occurrence-search').value.trim().toLowerCase(),occurrenceClass=o$('occurrence-class').value,group=o$('occurrence-group').value,linkage=o$('occurrence-linkage').value,sort=o$('occurrence-sort').value;
  occurrenceState.filtered=occurrenceState.records.filter(item=>{
    const d=item.discovery,r=item.reportMetadata||{},m=item.dimensionMetadata||{},x=item.reconciliation||{};
    const text=[item.occurrenceId,item.schemaId,item.sourceManifestationId,item.canonicalObjectId,item.candidateObjectId,d.displayName,d.group,d.groupCode,d.sourceCode,d.linkedObjectName,r.rawHeader,m.definition,m.canonicalName,m.candidateStandardOrNamespace,x.matchMethod,x.labelRelation,x.reviewStatus].filter(Boolean).join(' ').toLowerCase();
    return(!query||text.includes(query))&&(occurrenceClass==='All occurrence classes'||d.occurrenceClass===occurrenceClass)&&(group==='All modules / categories'||d.group===group)&&(linkage==='All linkage statuses'||d.linkageStatus===linkage);
  });
  occurrenceState.filtered.sort(sort==='name'?(a,b)=>a.discovery.displayName.localeCompare(b.discovery.displayName):sort==='group'?(a,b)=>a.discovery.group.localeCompare(b.discovery.group)||a.columnOrdinal-b.columnOrdinal:(a,b)=>a.columnOrdinal-b.columnOrdinal);
  o$('occurrence-clear').hidden=!(query||occurrenceClass!=='All occurrence classes'||group!=='All modules / categories'||linkage!=='All linkage statuses'||sort!=='ordinal');
  const summaries=window.phaosResultSummaries,measures=occurrenceState.filtered.filter(item=>item.discovery.occurrenceClass==='Measure').length,dimensions=occurrenceState.filtered.filter(item=>item.discovery.occurrenceClass==='Dimension').length,canonical=occurrenceState.filtered.filter(item=>item.canonicalObjectId).length,candidates=occurrenceState.filtered.filter(item=>item.candidateObjectId).length;
  summaries.render('occurrence-result-summary',{
    eyebrow:'Result summary · report-schema occurrences',title:`${occurrenceState.filtered.length.toLocaleString()} observed columns in this result`,
    metrics:[{value:measures,label:'measure fields'},{value:dimensions,label:'dimensions'},{value:canonical,label:'canonical links'},{value:candidates,label:'held candidates'},{value:new Set(occurrenceState.filtered.map(item=>item.discovery.group).filter(Boolean)).size,label:'modules / categories'}],
    groups:[{label:'Occurrence classes',values:summaries.counts(occurrenceState.filtered,item=>item.discovery.occurrenceClass)},{label:'Linkage status',values:summaries.counts(occurrenceState.filtered,item=>item.discovery.linkageStatus)},{label:'Leading modules / categories',values:summaries.counts(occurrenceState.filtered,item=>item.discovery.group)}],
    filters:summaries.activeFilters([['Search',o$('occurrence-search').value.trim(),''],['Class',occurrenceClass,'All occurrence classes'],['Module / category',group,'All modules / categories'],['Linkage',linkage,'All linkage statuses']]),
    boundary:'Occurrences record version-specific report-column appearances. They do not increase the 4,743 canonical-object count or the 765 canonical HMIS data-element count.'
  });
  occurrenceRender();
}

function occurrenceRender(){
  o$('occurrence-result-count').textContent=occurrenceState.filtered.length;
  const rows=occurrenceState.filtered.slice(0,occurrenceState.visible),grid=o$('occurrence-grid');
  grid.classList.toggle('table-view',occurrenceState.view==='table');
  grid.innerHTML=rows.length?(occurrenceState.view==='table'?occurrenceTable(rows):rows.map(occurrenceCard).join('')):'<div class="empty-state"><h3>No matching occurrences</h3><p>Try a broader term or clear the current filters.</p></div>';
  document.querySelectorAll('[data-occurrence-open]').forEach(button=>button.addEventListener('click',()=>openOccurrence(button.dataset.occurrenceOpen)));
  o$('occurrence-load-more').hidden=occurrenceState.visible>=occurrenceState.filtered.length;
  if(!o$('occurrence-load-more').hidden)o$('occurrence-load-more').textContent=`Load ${Math.min(24,occurrenceState.filtered.length-occurrenceState.visible)} more occurrences`;
}

function occurrenceCard(item){
  const d=item.discovery,linked=d.linkedObjectId?`${d.linkedObjectId}${d.linkedObjectName?` · ${d.linkedObjectName}`:''}`:'Not linked to a canonical object';
  const statusClass=d.linkageStatus.startsWith('Canonical')?'linked':d.linkageStatus.startsWith('Candidate')?'candidate':'dimension';
  return `<article class="occurrence-card ${d.occurrenceClass.toLowerCase()}"><div class="card-top"><span>Column ${item.columnOrdinal}</span><span>${schemaEscape(d.occurrenceClass)}</span></div><div class="occurrence-tags"><span>${schemaEscape(d.groupCode||d.occurrenceClass)}</span><span class="linkage-${statusClass}">${schemaEscape(d.linkageStatus)}</span></div><h4>${schemaEscape(d.displayName)}</h4><p>${schemaEscape(item.occurrenceId)}</p><dl><div><dt>Module / category</dt><dd>${schemaEscape(d.group)}</dd></div><div><dt>Source code / key</dt><dd>${schemaEscape(d.sourceCode||'Not stated')}</dd></div><div class="wide"><dt>Linked identity</dt><dd>${schemaEscape(linked)}</dd></div></dl><button data-occurrence-open="${item.occurrenceId}">View occurrence metadata <span>→</span></button></article>`;
}

function occurrenceTable(rows){
  const body=rows.map(item=>{const d=item.discovery,statusClass=d.linkageStatus.startsWith('Canonical')?'linked':d.linkageStatus.startsWith('Candidate')?'candidate':'dimension';return `<tr><td class="registry-id">${item.columnOrdinal}</td><td>${schemaEscape(d.occurrenceClass)}</td><td class="registry-name"><strong>${schemaEscape(d.displayName)}</strong><span>${schemaEscape(item.occurrenceId)}</span></td><td>${schemaEscape(d.group)}<small>${schemaEscape(d.groupCode||'')}</small></td><td>${schemaEscape(d.sourceCode||'Not stated')}</td><td><span class="occurrence-status linkage-${statusClass}">${schemaEscape(d.linkageStatus)}</span><small>${schemaEscape(d.linkedObjectId||'')}</small></td><td><button class="table-open" data-occurrence-open="${item.occurrenceId}">View <span aria-hidden="true">→</span></button></td></tr>`;}).join('');
  return `<table class="registry-table occurrence-table"><caption>Filtered report-column occurrences</caption><thead><tr><th scope="col">Column</th><th scope="col">Class</th><th scope="col">Source label and occurrence ID</th><th scope="col">Module / category</th><th scope="col">Source code / key</th><th scope="col">Linkage</th><th scope="col"><span class="visually-hidden">Actions</span></th></tr></thead><tbody>${body}</tbody></table>`;
}

function openOccurrence(id){
  const item=occurrenceState.index.get(id);if(!item)return;
  const d=item.discovery,r=item.reportMetadata||{},x=item.reconciliation||{},candidate=item.candidateMetadata||{},dimension=item.dimensionMetadata||{};
  let details='';
  if(d.occurrenceClass==='Measure')details=occurrenceMeta('Exact source label',r.exactSourceLabel,true)+occurrenceMeta('Raw header',r.rawHeader,true)+occurrenceMeta('Module',`${r.moduleCode} · ${r.moduleTitle}`)+occurrenceMeta('Source code',r.sourceCode)+occurrenceMeta('Canonical object ID',item.canonicalObjectId)+occurrenceMeta('Canonical object name',x.canonicalElementLabel)+occurrenceMeta('Candidate object ID',item.candidateObjectId)+occurrenceMeta('Candidate family',candidate.candidateFamily)+occurrenceMeta('Match method',x.matchMethod)+occurrenceMeta('Label relation',x.labelRelation)+occurrenceMeta('Reconciliation status',x.reconciliationStatus,true)+occurrenceMeta('Review basis',x.reviewBasis,true)+occurrenceMeta('Review status',x.reviewStatus,true)+occurrenceMeta('Facility applicability',r.facilityTypeApplicability,true)+occurrenceMeta('Format applicability',r.formatTypeApplicability,true);
  else details=occurrenceMeta('Source header',dimension.sourceHeader,true)+occurrenceMeta('Canonical key',dimension.canonicalName)+occurrenceMeta('Category',dimension.category)+occurrenceMeta('Definition',dimension.definition,true)+occurrenceMeta('Logical data type',dimension.logicalDataType)+occurrenceMeta('Identifier role',dimension.identifierRole)+occurrenceMeta('Hierarchy level',dimension.hierarchyLevel)+occurrenceMeta('Candidate standard / namespace',dimension.candidateStandardOrNamespace,true)+occurrenceMeta('Linkage status',dimension.linkageStatus,true)+occurrenceMeta('Validation rules',dimension.validationRules,true)+occurrenceMeta('Recommended uses',dimension.recommendedUses,true)+occurrenceMeta('Review status',dimension.reviewStatus,true);
  const canonicalPath=item.canonicalObjectId?`<section class="reciprocal-navigation"><div><p class="eyebrow">Reciprocal registry path</p><h3>Follow the accepted canonical identity</h3></div><div class="nav-group"><div class="nav-link-grid"><button type="button" data-nav-object="${schemaEscape(item.canonicalObjectId)}"><b>${schemaEscape(d.linkedObjectName||item.canonicalObjectId)}</b><small>Canonical HMIS object · ${schemaEscape(item.canonicalObjectId)}</small></button></div></div></section>`:item.candidateObjectId?`<section class="reciprocal-navigation candidate-boundary"><div><p class="eyebrow">Candidate boundary</p><h3>No canonical navigation target</h3><p>${schemaEscape(item.candidateObjectId)} remains held for verification and is not a canonical object.</p></div></section>`:'';
  o$('modal-content').innerHTML=`<div class="modal-kicker"><span>${schemaEscape(item.occurrenceId)}</span><span>Column ${item.columnOrdinal}</span><span>${schemaEscape(d.linkageStatus)}</span></div><p class="eyebrow">${schemaEscape(d.occurrenceClass)} occurrence · ${schemaEscape(d.group)}</p><h2 id="modal-title">${schemaEscape(d.displayName)}</h2><p class="occurrence-modal-boundary">This is a version-specific report-column occurrence. It does not create another canonical HMIS element.</p><div class="metadata-grid hmis-modal-grid">${occurrenceMeta('Schema ID',item.schemaId,true)}${details}${occurrenceMeta('Source version',item.sourceVersion,true)}${occurrenceMeta('Effective date',item.effectiveDate)}</div>${canonicalPath}`;
  window.phaosNavigation.bind(o$('modal-content'));
  o$('modal-backdrop').hidden=false;document.body.style.overflow='hidden';o$('modal-close').focus();
}
window.openOccurrence=openOccurrence;
