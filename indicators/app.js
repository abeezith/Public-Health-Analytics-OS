let savedRegistryView = 'cards';
try { if (localStorage.getItem('phaos-registry-view') === 'table') savedRegistryView = 'table'; } catch (_) {}
const state = { indicators: [], filtered: [], visible: 24, view: savedRegistryView };
const $ = (id) => document.getElementById(id);
const fields = ['search','geography','program','system','component','level','domain','type','measure','source','pillar','sort'];
const programsMenu=$('programs-menu');
const programmeSections=new Set(['india','ntep','rmncha','immunization','vbd','ncd']);
const registryHashViews=new Map([['registry','overview'],['registry-overview','overview'],['registry-indicators','indicators'],['hmis','hmis'],['hmis-report-schemas','report']]);
const pageUrl=new URL(window.location.href);
if(pageUrl.searchParams.has('v')){pageUrl.searchParams.delete('v');history.replaceState(null,'',pageUrl.pathname+pageUrl.search+pageUrl.hash);}
programsMenu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>programsMenu.removeAttribute('open')));
document.addEventListener('click',event=>{if(programsMenu?.open&&!programsMenu.contains(event.target))programsMenu.removeAttribute('open');});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&programsMenu?.open){programsMenu.removeAttribute('open');programsMenu.querySelector('summary')?.focus();}});

function updateNavigationState(){
  const hash=location.hash.slice(1)||'registry';
  document.querySelectorAll('.header-nav>a[aria-current]').forEach(link=>link.removeAttribute('aria-current'));
  const summary=programsMenu?.querySelector('summary');
  summary?.removeAttribute('aria-current');
  if(programmeSections.has(hash)) summary?.setAttribute('aria-current','location');
  else if(registryHashViews.has(hash)) document.querySelector('.header-nav>a[href="#registry"]')?.setAttribute('aria-current','location');
  else document.querySelector(`.header-nav>a[href="#${CSS.escape(hash)}"]`)?.setAttribute('aria-current','location');
}
window.addEventListener('hashchange',()=>{updateNavigationState();activateRegistrySection(registryHashViews.get(location.hash.slice(1)));});
updateNavigationState();

function setHmisViewTarget(target='All objects'){
  const select=$('hmis-object-type');
  if(!select)return;
  select.dataset.pendingValue=target;
  if([...select.options].some(option=>option.value===target)){
    select.value=target;
    select.dispatchEvent(new Event('change'));
  }
}

function activateRegistrySection(section='overview',options={}){
  if(!section)return;
  const panels={overview:$('registry-overview'),indicators:$('registry-indicators'),hmis:$('hmis'),report:$('hmis-report-schemas')};
  if(!panels[section])return;
  Object.entries(panels).forEach(([key,panel])=>{panel.hidden=key!==section;});
  document.querySelectorAll('.registry-object-switch [data-registry-section]').forEach(button=>{
    const active=button.dataset.registrySection===section;
    button.classList.toggle('active',active);
    button.setAttribute('aria-selected',String(active));
    button.tabIndex=active?0:-1;
  });
  if(section==='hmis')setHmisViewTarget(options.hmisTarget||'All objects');
  if(options.updateHash){
    const hash=section==='overview'?'registry':section==='indicators'?'registry-indicators':section==='hmis'?'hmis':'hmis-report-schemas';
    if(location.hash!==`#${hash}`)history.pushState(null,'',`${location.pathname}${location.search}#${hash}`);
    updateNavigationState();
    $('registry')?.scrollIntoView({behavior:'smooth',block:'start'});
  }
}

function initializeRegistryHub(){
  const mount=$('registry-dynamic-panels');
  const hmis=$('hmis'),report=$('hmis-report-schemas');
  for(const panel of [hmis,report])if(panel&&mount){panel.classList.add('registry-panel');panel.dataset.registryPanel=panel===hmis?'hmis':'report';mount.append(panel);}
  document.querySelectorAll('[data-registry-section]').forEach(control=>control.addEventListener('click',event=>{
    event.preventDefault();
    activateRegistrySection(control.dataset.registrySection,{updateHash:true,hmisTarget:control.dataset.hmisTarget});
  }));
  const tabs=[...document.querySelectorAll('.registry-object-switch [role="tab"]')];
  tabs.forEach((tab,index)=>tab.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const targetIndex=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    tabs[targetIndex].focus();tabs[targetIndex].click();
  }));
  document.querySelectorAll('a.primary-action[href="#registry"][onclick]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();
    activateRegistrySection('indicators',{updateHash:true});
  },true));
  activateRegistrySection(registryHashViews.get(location.hash.slice(1))||'overview');
}
initializeRegistryHub();

window.phaosUnifiedModelPromise=fetch('./data/registry/unified-read-model.json?v=unify-06-1.1.0',{cache:'no-store'}).then(response=>{
  if(!response.ok)throw new Error(`Unified read model request failed: ${response.status}`);
  return response.json();
});

window.phaosUnifiedModelPromise.then(model => {
  const data={coverage:model.coverage||{}};
  state.indicators=model.records.filter(record=>record.registryMemberships.includes('indicator')).map(record=>({...record.indicatorMetadata,canonicalObjectId:record.canonicalObjectId,canonicalUri:record.canonicalUri,canonicalObjectType:record.canonicalObjectType,representations:record.representations,normalizedLowestReportingLevel:record.normalizedLowestReportingLevel,normalizedProgrammeTags:record.programmeTags,systemPortalTags:record.systemPortalTags}));
  $('metric-indicators').textContent = state.indicators.length;
  $('metric-domains').textContent = new Set(state.indicators.map(x => x.domain)).size;
  if (data.coverage && $('metric-sources')) $('metric-sources').textContent = data.coverage.sourceCompleteCatalogues;
  if (data.coverage) $('metric-india').textContent = data.coverage.indiaSpecificRecords || 0;
  if (data.coverage) $('metric-india-sources').textContent = data.coverage.indiaSourcesWithVerifiedRecords || 0;
  if (data.coverage) $('metric-ntep').textContent = data.coverage.ntepRecords || 0;
  if (data.coverage && $('metric-rmncha')) $('metric-rmncha').textContent = data.coverage.rmnchaTotalDiscoverableRecords || 0;
  if (data.coverage && $('metric-rmncha-new')) $('metric-rmncha-new').textContent = data.coverage.rmnchaNewRecords || 0;
  if (data.coverage && $('metric-rmncha-sources')) $('metric-rmncha-sources').textContent = data.coverage.rmnchaSourceDocuments || 0;
  if (data.coverage && $('metric-immunization')) $('metric-immunization').textContent = data.coverage.immunizationTotalDiscoverableRecords || 0;
  if (data.coverage && $('metric-immunization-new')) $('metric-immunization-new').textContent = data.coverage.immunizationNewRecords || 0;
  if (data.coverage && $('metric-immunization-hmis')) $('metric-immunization-hmis').textContent = data.coverage.immunizationLinkedHmisObjects || 0;
  if (data.coverage && $('metric-immunization-sources')) $('metric-immunization-sources').textContent = data.coverage.immunizationSourceDocuments || 0;
  if ($('metric-ncd')) $('metric-ncd').textContent = state.indicators.filter(x=>(x.programmeTags||[]).includes('National Programme for Prevention and Control of Non-Communicable Diseases')).length;
  if ($('metric-ncd-new')) $('metric-ncd-new').textContent = model.metrics.ncdReleaseRecords;
  if ($('metric-ncd-sources')) $('metric-ncd-sources').textContent = model.metrics.ncdSourceDocuments;
  if ($('metric-india')) $('metric-india').textContent = state.indicators.filter(x=>x.country==='India').length;
  if ($('metric-india-sources')) $('metric-india-sources').textContent = (data.coverage?.indiaSourcesWithVerifiedRecords||0)+model.metrics.ncdSourceDocuments;
  fillSelect('geography', state.indicators.map(x => x.country || 'Global / multi-country'));
  fillSelect('program', state.indicators.flatMap(x => x.normalizedProgrammeTags));
  fillSelect('system', state.indicators.flatMap(x => x.systemPortalTags));
  fillSelect('component', state.indicators.map(x => x.programmeComponent).filter(Boolean));
  fillSelect('level', state.indicators.map(x => x.normalizedLowestReportingLevel));
  fillSelect('domain', state.indicators.map(x => x.domain));
  fillSelect('type', state.indicators.map(x => x.type));
  fillSelect('measure', state.indicators.map(x => x.measureType || 'Unclassified / source metadata pending'));
  fillSelect('source', state.indicators.map(x => x.source));
  fillSelect('pillar', state.indicators.flatMap(x => x.whoPillars || []));
  filter();
  const applyGlobalRegistry=source=>{ $('search').value=''; ['program','system','component','level','domain','type','measure','pillar'].forEach(id=>$(id).selectedIndex=0); $('geography').value='Global / multi-country'; source?$('source').value=source:$('source').selectedIndex=0; filter(); };
  document.querySelectorAll('[data-global-filter="all"]').forEach(link=>link.addEventListener('click',()=>applyGlobalRegistry('')));
  document.querySelectorAll('[data-global-source]').forEach(link=>link.addEventListener('click',()=>applyGlobalRegistry(link.dataset.globalSource)));
}).catch(() => { $('indicator-grid').innerHTML = '<div class="empty-state"><h3>Registry data could not be loaded</h3><p>Serve this folder through a web server or GitHub Pages; browsers block local JSON requests from file:// pages.</p></div>'; });

function fillSelect(id, values) { [...new Set(values)].sort().forEach(value => $(id).add(new Option(value, value))); }
fields.forEach(id => $(id).addEventListener(id === 'search' ? 'input' : 'change', filter));
$('clear').addEventListener('click', () => { $('search').value=''; ['geography','program','system','component','level','domain','type','measure','source','pillar'].forEach(id => $(id).selectedIndex=0); filter(); });
$('load-more').addEventListener('click', () => { state.visible += 24; render(); });
document.querySelectorAll('[data-registry-view]').forEach(button=>button.addEventListener('click',()=>setRegistryView(button.dataset.registryView)));
syncViewButtons();
$('modal-close').addEventListener('click', closeModal);
$('modal-backdrop').addEventListener('mousedown', e => { if(e.target === $('modal-backdrop')) closeModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

function filter() {
  state.visible = 24;
  const q = $('search').value.trim().toLowerCase(), geography=$('geography').value, program=$('program').value, system=$('system').value, component=$('component').value, level=$('level').value, domain=$('domain').value, type=$('type').value, measure=$('measure').value, source=$('source').value, pillar=$('pillar').value, sort=$('sort').value;
  state.filtered = state.indicators.filter(x => {
    const geo=x.country || 'Global / multi-country';
    const normalizedMeasure=x.measureType||'Unclassified / source metadata pending';
    const text=[x.id,x.name,x.officialIndicatorName,x.domain,x.subdomain,x.code,x.definition,x.displayDefinition,x.source,x.org,x.uses,x.country,x.normalizedProgrammeTags.join(' '),x.systemPortalTags.join(' '),x.indiaReportingSystem,x.programmeComponent,x.reportingLevel,x.lowestReportingLevel,x.normalizedLowestReportingLevel,x.reportingUnit,x.responsibleCadre,x.measureType,x.scaleDisplay,x.normalizedFormula,x.denominatorPopulation].join(' ').toLowerCase();
    return (!q || text.includes(q)) && (geography==='All geographies'||geo===geography) && (program==='All India programmes'||x.normalizedProgrammeTags.includes(program)) && (system==='All systems / portals'||x.systemPortalTags.includes(system)) && (component==='All programme components'||x.programmeComponent===component) && (level==='All lowest reporting levels'||x.normalizedLowestReportingLevel===level) && (domain==='All domains'||x.domain===domain) && (type==='All types'||x.type===type) && (measure==='All measure types'||normalizedMeasure===measure) && (source==='All sources'||x.source===source) && (pillar==='All WHO pillars'||(x.whoPillars||[]).includes(pillar));
  }).sort((a,b)=>sort==='domain'?a.domain.localeCompare(b.domain)||a.name.localeCompare(b.name):sort==='id'?a.id.localeCompare(b.id):a.name.localeCompare(b.name));
  $('clear').hidden = !(q || geography!=='All geographies' || program!=='All India programmes' || system!=='All systems / portals' || component!=='All programme components' || level!=='All lowest reporting levels' || domain!=='All domains' || type!=='All types' || measure!=='All measure types' || source!=='All sources' || pillar!=='All WHO pillars');
  render();
}
function render() {
  $('result-count').textContent=state.filtered.length;
  const rows=state.filtered.slice(0,state.visible);
  const results=$('indicator-grid');
  results.classList.toggle('table-view',state.view==='table');
  results.innerHTML=rows.length?(state.view==='table'?table(rows):rows.map(card).join('')):'<div class="empty-state"><h3>No matching indicators</h3><p>Try a broader term or clear one of the filters.</p></div>';
  document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>openModal(button.dataset.open)));
  $('load-more').hidden=state.visible>=state.filtered.length;
  if(!$('load-more').hidden) $('load-more').textContent='Load '+Math.min(24,state.filtered.length-state.visible)+' more indicators';
}
function setRegistryView(view){
  if(view!=='cards'&&view!=='table')return;
  state.view=view;
  try { localStorage.setItem('phaos-registry-view',view); } catch (_) {}
  syncViewButtons();
  render();
}
function syncViewButtons(){
  document.querySelectorAll('[data-registry-view]').forEach(button=>{
    const active=button.dataset.registryView===state.view;
    button.setAttribute('aria-pressed',String(active));
  });
}
function esc(v=''){ const div=document.createElement('div'); div.textContent=String(v); return div.innerHTML; }
function card(x){ const programmes=x.normalizedProgrammeTags.join('; '); const systems=x.systemPortalTags.join('; '); const context=programmes?'<div><dt>India programme</dt><dd>'+esc(programmes)+'</dd></div>':!systems?'<div><dt>Collection</dt><dd>'+esc(x.collection)+'</dd></div>':''; const system=systems?'<div><dt>System / portal</dt><dd>'+esc(systems)+'</dd></div>':''; return '<article class="indicator-card"><div class="card-top"><span>'+esc(x.id)+'</span>'+(x.country?'<span class="india-badge">'+esc(x.country)+'</span>':x.code?'<span>'+esc(x.code)+'</span>':'')+'</div><div class="card-tags"><span class="card-domain">'+esc(x.domain)+'</span><span class="pillar-tag">'+esc(x.whoPillarPrimary||'Unclassified')+'</span><span class="measure-tag">'+esc(x.measureType||'Unclassified')+'</span><span class="scale-tag">'+esc(x.scaleDisplay||'Not specified')+'</span></div><h3>'+esc(x.name)+'</h3><p>'+esc(x.displayDefinition||x.definition)+'</p><dl>'+context+system+'<div><dt>WHO pillars</dt><dd>'+esc((x.whoPillars||[]).join('; ')||'Not classified')+'</dd></div></dl><button data-open="'+esc(x.id)+'">View full metadata <span>→</span></button></article>'; }
function table(rows){
  const body=rows.map(x=>{
    const programme=x.normalizedProgrammeTags.join('; ')||x.country||'Global / multi-country';
    const systems=x.systemPortalTags.join('; ')||'Not specified';
    return '<tr><td class="registry-id">'+esc(x.id)+'</td><td class="registry-name"><strong>'+esc(x.name)+'</strong><span>'+esc(x.displayDefinition||x.definition)+'</span></td><td>'+esc(x.domain||'Not classified')+'</td><td><span class="table-measure">'+esc(x.measureType||'Unclassified')+'</span><small>'+esc(x.scaleDisplay||'Not specified')+'</small></td><td>'+esc(x.normalizedLowestReportingLevel||x.lowestReportingLevel||'Not specified')+'</td><td>'+esc(programme)+'</td><td>'+esc(systems)+'</td><td>'+esc(x.source||'Not reported')+'</td><td><button class="table-open" data-open="'+esc(x.id)+'" aria-label="View full metadata for '+esc(x.name)+'">View <span aria-hidden="true">→</span></button></td></tr>';
  }).join('');
  return '<table class="registry-table"><caption>Filtered public-health indicator registry results</caption><thead><tr><th scope="col">Registry ID</th><th scope="col">Indicator</th><th scope="col">Domain</th><th scope="col">Measure</th><th scope="col">Lowest level</th><th scope="col">Programme / scope</th><th scope="col">System / portal</th><th scope="col">Source</th><th scope="col"><span class="visually-hidden">Actions</span></th></tr></thead><tbody>'+body+'</tbody></table>';
}
function meta(title,value,wide=false){ return '<div class="meta-item'+(wide?' wide':'')+'"><span>'+title+'</span><p>'+esc(value||'Not reported')+'</p></div>'; }
function openModal(id){
  const x=state.indicators.find(item=>item.id===id); if(!x)return;
  const graphSelect=$('kg-focus');
  const graphAvailable=graphSelect&&[...graphSelect.options].some(option=>option.value===id);
  const indiaMeta=x.country?meta('Country / scope',x.country)+meta('India programme',x.normalizedProgrammeTags.join('; ')||'Not assigned')+meta('System / portal',x.systemPortalTags.join('; ')||'Not specified')+meta('Source programme labels',x.programmeTags,true)+meta('Programme component',x.programmeComponent)+meta('Object type',x.objectType||x.recordType)+meta('Official-name status',x.officialNameStatus)+meta('Source-reported system',x.indiaReportingSystem)+meta('Normalized lowest reporting level',x.normalizedLowestReportingLevel)+meta('Source-reported lowest level',x.lowestReportingLevel)+meta('Full reporting levels',x.reportingLevel)+meta('Reporting unit',x.reportingUnit)+meta('Responsible cadre',x.responsibleCadre)+meta('Administrative level',x.administrativeLevel)+meta('Facility type',x.facilityType)+meta('Record type',x.recordType)+meta('Source document',x.sourceDocument)+meta('Source section',x.sourceSection)+meta('Source item code',x.sourceItemCode)+meta('Source version',x.sourceVersion)+meta('Aggregation rule',x.aggregationRule,true)+meta('Zero-denominator rule',x.zeroDenominatorRule,true)+meta('Linked HMIS data elements',x.relatedElementIds,true)+meta('Related registry indicators',x.relatedIndicatorIds,true)+meta('Crosswalk status',x.crosswalkStatus,true)+meta('Data lineage',x.lineage,true)+meta('Currentness',x.currentness,true)+meta('Source location',x.sourcePage,true):'';
  $('modal-content').innerHTML='<div class="modal-kicker"><span>'+esc(x.id)+'</span><span>'+esc(x.status)+'</span><span>Verified '+esc(x.verified)+'</span></div><p class="eyebrow">'+esc(x.domain)+' · '+esc(x.subdomain)+'</p><h2 id="modal-title">'+esc(x.name)+'</h2><div class="modal-lead"><p>'+esc(x.displayDefinition||x.definition)+'</p><div><span>Collection</span><strong>'+esc(x.collection)+'</strong></div><div><span>Framework</span><strong>'+esc(x.code||'Not assigned')+'</strong></div></div><div class="metadata-grid">'+meta('Measure type',x.measureType)+meta('Scale',x.scaleDisplay)+meta('Normalized formula',x.normalizedFormula,true)+meta('Denominator population',x.denominatorPopulation,true)+indiaMeta+meta('WHO health-system pillars',(x.whoPillars||[]).join('; '),true)+meta('Numerator',x.numerator)+meta('Denominator',x.denominator)+meta('Official / source formula or method',x.formula)+meta('Unit',x.unit)+meta('Reference population',x.population)+meta('Frequency',x.frequency)+meta('Preferred data source',x.dataSource)+meta('Recommended disaggregation',x.disaggregation)+meta('Direction',x.direction)+meta('Potential uses',x.uses)+meta('Key limitations',x.caveats,true)+meta('Pillar classification note',x.whoPillarBasis,true)+meta('Legacy metadata marker','Historical '+x.metadataLevel+' · '+x.completeness+'%; retained for provenance and not a PHAOS-MDQ-001 computed grade',true)+'</div><div class="source-panel"><div><span>Primary registry</span><strong>'+esc(x.source)+'</strong><small>'+esc(x.org)+'</small></div><div><span>Source identity</span><strong>'+esc(x.sourceId)+'</strong><small>'+(x.sourceVariant?'Unresolved source variant':esc(x.indiaReleaseStatus||'Curated record'))+'</small></div>'+(graphAvailable?'<button type="button" id="modal-graph-link" class="modal-graph-link">Explore in graph →</button>':'')+'<a href="'+esc(x.url)+'" target="_blank" rel="noreferrer">Open authoritative metadata ↗</a></div>';
  $('modal-graph-link')?.addEventListener('click',()=>{ closeModal(); location.hash='knowledge-graph'; graphSelect.value=id; graphSelect.dispatchEvent(new Event('change')); });
  $('modal-backdrop').hidden=false; document.body.style.overflow='hidden'; $('modal-close').focus();
}
function closeModal(){ $('modal-backdrop').hidden=true; document.body.style.overflow=''; }
