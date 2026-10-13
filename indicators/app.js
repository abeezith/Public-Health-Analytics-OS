let savedRegistryView = 'cards';
try { if (localStorage.getItem('phaos-registry-view') === 'table') savedRegistryView = 'table'; } catch (_) {}
const state = { indicators: [], filtered: [], visible: 24, view: savedRegistryView };
const $ = (id) => document.getElementById(id);
const fields = ['search','geography','program','system','component','level','domain','type','measure','source','pillar','frequency','cadre','availability','review','lifecycle','computability','disagg-dimension','disagg-claim','disagg-evidence','quality-profile','sort'];
const indicatorUrlFields={search:'q',geography:'geo',program:'programme',system:'system',component:'component',level:'level',domain:'domain',type:'type',measure:'measure',source:'source',pillar:'pillar',frequency:'frequency',cadre:'cadre',availability:'availability',review:'review',lifecycle:'lifecycle',computability:'computability','disagg-dimension':'disagg','disagg-claim':'disaggClaim','disagg-evidence':'disaggEvidence','quality-profile':'quality',sort:'sort'};
const disaggClaimLabels={'source-required':'Source-required','system-available':'System-available','analyst-recommended':'Analyst-recommended'};
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

const navEsc=value=>{const node=document.createElement('div');node.textContent=String(value??'');return node.innerHTML;};
window.phaosProvenancePanel=function(provenance){
  if(!provenance)return '<section class="provenance-panel provenance-pending"><div><p class="eyebrow">Entry-level provenance</p><h3>Review history not yet published</h3></div><p>No attributable Analytics-OS review event is available for this record. This does not change its source authority or official wording.</p></section>';
  const e=navEsc,fields=(provenance.reviewedFields||[]).join('; ')||'Not reported',reviewer=provenance.reviewerName||provenance.reviewerRole||'Not reported';
  return '<section class="provenance-panel"><div class="provenance-head"><div><p class="eyebrow">Entry-level provenance</p><h3>Review and change history</h3></div><span class="provenance-status">'+e(provenance.status||'Unknown')+'</span></div><p class="provenance-boundary">Analytics-OS review evidence only; it is not source-custodian approval, source authority or proof of computability.</p><dl><div><dt>Review type</dt><dd>'+e(provenance.reviewType||'Not reported')+'</dd></div><div><dt>Reviewer</dt><dd>'+e(reviewer)+'</dd></div><div><dt>Reviewed on</dt><dd>'+e(provenance.reviewedOn||'Unknown')+'</dd></div><div><dt>Source accessed on</dt><dd>'+e(provenance.sourceAccessedOn||'Unknown')+'</dd></div><div><dt>Method</dt><dd>'+e(provenance.method||'Not reported')+'</dd></div><div><dt>Identity policy</dt><dd>'+e(provenance.publicIdentityPolicy||'Not reported')+'</dd></div><div class="wide"><dt>Reviewed fields</dt><dd>'+e(fields)+'</dd></div><div class="wide"><dt>Reason</dt><dd>'+e(provenance.reason||'Not reported')+'</dd></div><div class="wide"><dt>Findings / scope</dt><dd>'+e(provenance.findings||provenance.scope||'Not reported')+'</dd></div></dl><details><summary>Event identifiers</summary><p>Review: '+e((provenance.reviewEventIds||[]).join('; ')||'None')+'<br>Change: '+e((provenance.changeEventIds||[]).join('; ')||'None')+'</p></details></section>';
};
window.phaosNavigation={
  records:new Map(),
  initialize(model){this.records=new Map((model.records||[]).map(record=>[record.canonicalObjectId,record]));window.dispatchEvent(new CustomEvent('phaos:navigation-ready'));},
  hasRecord(id){return this.records.has(id);},
  renderFor(id,{includeGraph=false}={}){
    const record=this.records.get(id);if(!record)return '';
    const navigation=record.navigation||{},relations=(navigation.relatedObjects||[]).slice(0,16),occurrences=(navigation.occurrences||[]).slice(0,12),sources=navigation.sources||[];
    if(!relations.length&&!occurrences.length&&!sources.length&&!(includeGraph&&navigation.graphNode))return '';
    const relationButtons=relations.map(item=>`<button type="button" data-nav-object="${navEsc(item.targetId)}"><b>${navEsc(item.targetName)}</b><small>${navEsc(item.direction==='outbound'?item.label:`Referenced by · ${item.label}`)} · ${navEsc(item.assertionStatus)}</small></button>`).join('');
    const occurrenceButtons=occurrences.map(item=>`<button type="button" data-nav-occurrence="${navEsc(item.occurrenceId)}"><b>Column ${item.columnOrdinal} · ${navEsc(item.displayName)}</b><small>${navEsc(item.linkageStatus)} · ${navEsc(item.occurrenceId)}</small></button>`).join('');
    const sourceLinks=sources.map(item=>item.url?`<a href="${navEsc(item.url)}" target="_blank" rel="noreferrer"><b>${navEsc(item.label)}</b><small>${navEsc(item.version||item.sourceLayer)}</small></a>`:`<span><b>${navEsc(item.label)}</b><small>${navEsc(item.version||item.sourceLayer)}</small></span>`).join('');
    const graphButton=includeGraph&&navigation.graphNode?`<button type="button" data-nav-graph="${navEsc(navigation.graphNode.nodeId)}"><b>Open knowledge graph</b><small>${navEsc(navigation.graphNode.nodeType)} · ${navEsc(navigation.graphNode.label)}</small></button>`:'';
    return `<section class="reciprocal-navigation"><div><p class="eyebrow">Connected registry evidence</p><h3>Follow this object in both directions</h3></div>${relations.length?`<div class="nav-group"><strong>Related canonical objects <span>${navigation.relatedObjects.length}</span></strong><div class="nav-link-grid">${relationButtons}</div></div>`:''}${occurrences.length?`<div class="nav-group"><strong>Observed report occurrences <span>${navigation.occurrences.length}</span></strong><div class="nav-link-grid">${occurrenceButtons}</div></div>`:''}${sources.length?`<div class="nav-group"><strong>Source evidence <span>${sources.length}</span></strong><div class="nav-link-grid source-links">${sourceLinks}</div></div>`:''}${graphButton?`<div class="nav-group"><strong>Knowledge graph</strong><div class="nav-link-grid">${graphButton}</div></div>`:''}</section>`;
  },
  bind(container=document){
    container.querySelectorAll('[data-nav-object]').forEach(button=>button.addEventListener('click',()=>this.openCanonical(button.dataset.navObject)));
    container.querySelectorAll('[data-nav-occurrence]').forEach(button=>button.addEventListener('click',()=>this.openOccurrence(button.dataset.navOccurrence)));
    container.querySelectorAll('[data-nav-graph]').forEach(button=>button.addEventListener('click',()=>this.openGraph(button.dataset.navGraph)));
  },
  openCanonical(id){
    const record=this.records.get(id);if(!record)return;
    closeActiveModal();
    if(record.registryMemberships.includes('indicator')){activateRegistrySection('indicators',{updateHash:true});openModal(id);}
    else if(record.registryMemberships.includes('hmis')){activateRegistrySection('hmis',{updateHash:true});openHmisModal(id);}
  },
  openOccurrence(id){closeActiveModal();activateRegistrySection('report',{updateHash:true});if(typeof window.openOccurrence==='function')window.openOccurrence(id);},
  openGraph(id){closeActiveModal();location.hash='knowledge-graph';if(typeof window.phaosGraphFocus==='function')window.phaosGraphFocus(id);else{const select=$('kg-focus');if(select&&[...select.options].some(option=>option.value===id)){select.value=id;select.dispatchEvent(new Event('change'));}}}
};
function closeActiveModal(){if(!$('modal-backdrop').hidden)$('modal-close').click();}

window.phaosResultSummaries={
  counts(items,accessor){
    const counts=new Map();
    items.forEach(item=>{const raw=accessor(item),values=Array.isArray(raw)?raw:[raw];values.filter(Boolean).forEach(value=>counts.set(String(value),(counts.get(String(value))||0)+1));});
    return [...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  },
  activeFilters(entries){return entries.filter(([,value,defaultValue])=>value&&value!==defaultValue).map(([label,value])=>({label,value}));},
  render(id,{eyebrow,title,metrics,groups=[],filters=[],boundary}){
    const target=$(id);if(!target)return;
    const metricHtml=metrics.map(metric=>`<div><strong>${esc(metric.value)}</strong><span>${esc(metric.label)}</span></div>`).join('');
    const filterHtml=filters.length?`<div class="summary-filters"><b>Active filters</b>${filters.map(item=>`<span>${esc(item.label)}: ${esc(item.value)}</span>`).join('')}</div>`:'<div class="summary-filters"><b>Active filters</b><span>None · showing the full view</span></div>';
    const groupHtml=groups.filter(group=>group.values.length).map(group=>`<div class="summary-group"><b>${esc(group.label)}</b><ul>${group.values.slice(0,4).map(([label,count])=>`<li><span>${esc(label)}</span><strong>${esc(count)}</strong></li>`).join('')}</ul></div>`).join('');
    target.innerHTML=`<section class="result-summary-card"><div class="result-summary-head"><div><p class="eyebrow">${esc(eyebrow)}</p><h3>${esc(title)}</h3></div>${filterHtml}</div><div class="summary-metrics">${metricHtml}</div>${groupHtml?`<div class="summary-groups">${groupHtml}</div>`:''}<p class="summary-boundary"><strong>Counting boundary:</strong> ${esc(boundary)}</p></section>`;
  }
};

window.phaosUnifiedModelPromise=fetch('./data/registry/unified-read-model.json?v=utility-03-1.7.0',{cache:'no-store'}).then(response=>{
  if(!response.ok)throw new Error(`Unified read model request failed: ${response.status}`);
  return response.json();
});

window.phaosUnifiedModelPromise.then(model => {
  window.phaosNavigation.initialize(model);
  window.dispatchEvent(new Event('phaos:navigation-ready'));
  const data={coverage:model.coverage||{}};
  state.indicators=model.records.filter(record=>record.registryMemberships.includes('indicator')).map(record=>({...record.indicatorMetadata,canonicalObjectId:record.canonicalObjectId,canonicalUri:record.canonicalUri,canonicalObjectType:record.canonicalObjectType,representations:record.representations,navigation:record.navigation,provenance:record.provenance,lifecycleStatus:record.lifecycleStatus,operationalDiscovery:record.operationalDiscovery,disaggregationProfile:record.disaggregationProfile,qualityComparabilityProfile:record.qualityComparabilityProfile,normalizedLowestReportingLevel:record.normalizedLowestReportingLevel,normalizedProgrammeTags:record.programmeTags,systemPortalTags:record.systemPortalTags}));
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
  fillSelect('frequency', state.indicators.map(x => x.operationalDiscovery.frequency));
  fillSelect('cadre', state.indicators.flatMap(x => x.operationalDiscovery.cadreCategories));
  fillSelect('availability', state.indicators.map(x => x.operationalDiscovery.dataAvailability));
  fillSelect('review', state.indicators.map(x => x.operationalDiscovery.reviewStatus));
  fillSelect('lifecycle', state.indicators.map(x => x.operationalDiscovery.lifecycle));
  fillSelect('computability', state.indicators.map(x => x.operationalDiscovery.computabilityMaturity));
  fillSelect('disagg-dimension', state.indicators.flatMap(x => x.disaggregationProfile.assertions.map(item=>item.dimensionLabel)));
  fillSelect('disagg-claim', state.indicators.flatMap(x => x.disaggregationProfile.assertions.map(item=>disaggClaimLabels[item.claimType])));
  fillSelect('disagg-evidence', state.indicators.map(x => x.disaggregationProfile.evidenceState));
  fillSelect('quality-profile', state.indicators.map(x => x.qualityComparabilityProfile.pilotStatus));
  restoreIndicatorUrlState();
  filter();
  const applyGlobalRegistry=source=>{ $('search').value=''; ['program','system','component','level','domain','type','measure','pillar','frequency','cadre','availability','review','lifecycle','computability','disagg-dimension','disagg-claim','disagg-evidence','quality-profile'].forEach(id=>$(id).selectedIndex=0); $('geography').value='Global / multi-country'; source?$('source').value=source:$('source').selectedIndex=0; filter(); };
  document.querySelectorAll('[data-global-filter="all"]').forEach(link=>link.addEventListener('click',()=>applyGlobalRegistry('')));
  document.querySelectorAll('[data-global-source]').forEach(link=>link.addEventListener('click',()=>applyGlobalRegistry(link.dataset.globalSource)));
}).catch(() => { $('indicator-grid').innerHTML = '<div class="empty-state"><h3>Registry data could not be loaded</h3><p>Serve this folder through a web server or GitHub Pages; browsers block local JSON requests from file:// pages.</p></div>'; });

function fillSelect(id, values) { [...new Set(values)].sort().forEach(value => $(id).add(new Option(value, value))); }
function restoreIndicatorUrlState(){
  const params=new URL(location.href).searchParams;
  for(const [id,param] of Object.entries(indicatorUrlFields)){
    const value=params.get(param);if(!value)continue;const control=$(id);if(!control)continue;
    if(control.tagName==='SELECT'&&![...control.options].some(option=>option.value===value))continue;
    control.value=value;
  }
}
function updateIndicatorUrlState(){
  const url=new URL(location.href);
  for(const [id,param] of Object.entries(indicatorUrlFields)){
    const control=$(id);if(!control)continue;url.searchParams.delete(param);
    const value=control.value,defaultValue=control.options?.[0]?.value||'';
    if(value&&value!==defaultValue)url.searchParams.set(param,value);
  }
  history.replaceState(null,'',url.pathname+(url.searchParams.size?`?${url.searchParams}`:'')+url.hash);
}
fields.forEach(id => $(id).addEventListener(id === 'search' ? 'input' : 'change', filter));
$('clear').addEventListener('click', () => { $('search').value=''; ['geography','program','system','component','level','domain','type','measure','source','pillar','frequency','cadre','availability','review','lifecycle','computability','disagg-dimension','disagg-claim','disagg-evidence','quality-profile'].forEach(id => $(id).selectedIndex=0); filter(); });
$('load-more').addEventListener('click', () => { state.visible += 24; render(); });
document.querySelectorAll('[data-registry-view]').forEach(button=>button.addEventListener('click',()=>setRegistryView(button.dataset.registryView)));
syncViewButtons();
$('modal-close').addEventListener('click', closeModal);
$('modal-backdrop').addEventListener('mousedown', e => { if(e.target === $('modal-backdrop')) closeModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

function filter() {
  state.visible = 24;
  const q = $('search').value.trim().toLowerCase(), geography=$('geography').value, program=$('program').value, system=$('system').value, component=$('component').value, level=$('level').value, domain=$('domain').value, type=$('type').value, measure=$('measure').value, source=$('source').value, pillar=$('pillar').value, frequency=$('frequency').value, cadre=$('cadre').value, availability=$('availability').value, review=$('review').value, lifecycle=$('lifecycle').value, computability=$('computability').value, disaggDimension=$('disagg-dimension').value, disaggClaim=$('disagg-claim').value, disaggEvidence=$('disagg-evidence').value, qualityProfile=$('quality-profile').value, sort=$('sort').value;
  state.filtered = state.indicators.filter(x => {
    const geo=x.country || 'Global / multi-country';
    const normalizedMeasure=x.measureType||'Unclassified / source metadata pending';
    const text=[x.id,x.name,x.officialIndicatorName,x.domain,x.subdomain,x.code,x.definition,x.displayDefinition,x.source,x.org,x.uses,x.country,x.normalizedProgrammeTags.join(' '),x.systemPortalTags.join(' '),x.indiaReportingSystem,x.programmeComponent,x.reportingLevel,x.lowestReportingLevel,x.normalizedLowestReportingLevel,x.reportingUnit,x.responsibleCadre,x.measureType,x.scaleDisplay,x.normalizedFormula,x.denominatorPopulation,...Object.values(x.operationalDiscovery).flat(),...x.disaggregationProfile.assertions.flatMap(item=>[item.dimensionLabel,item.claimType,item.status,item.evidence.exactText]),x.qualityComparabilityProfile.pilotStatus,x.qualityComparabilityProfile.evidenceState,...x.qualityComparabilityProfile.commonMisinterpretations,...x.qualityComparabilityProfile.knownIssues.map(item=>item.note)].join(' ').toLowerCase();
    const ops=x.operationalDiscovery;
    const disagg=x.disaggregationProfile;
    return (!q || text.includes(q)) && (geography==='All geographies'||geo===geography) && (program==='All India programmes'||x.normalizedProgrammeTags.includes(program)) && (system==='All systems / portals'||x.systemPortalTags.includes(system)) && (component==='All programme components'||x.programmeComponent===component) && (level==='All lowest reporting levels'||x.normalizedLowestReportingLevel===level) && (domain==='All domains'||x.domain===domain) && (type==='All types'||x.type===type) && (measure==='All measure types'||normalizedMeasure===measure) && (source==='All sources'||x.source===source) && (pillar==='All WHO pillars'||(x.whoPillars||[]).includes(pillar)) && (frequency==='All frequencies'||ops.frequency===frequency) && (cadre==='All cadre categories'||ops.cadreCategories.includes(cadre)) && (availability==='All availability states'||ops.dataAvailability===availability) && (review==='All review statuses'||ops.reviewStatus===review) && (lifecycle==='All lifecycle states'||ops.lifecycle===lifecycle) && (computability==='All computability states'||ops.computabilityMaturity===computability) && (disaggDimension==='All disaggregation dimensions'||disagg.assertions.some(item=>item.dimensionLabel===disaggDimension)) && (disaggClaim==='All claim types'||disagg.assertions.some(item=>disaggClaimLabels[item.claimType]===disaggClaim)) && (disaggEvidence==='All evidence states'||disagg.evidenceState===disaggEvidence) && (qualityProfile==='All quality-profile states'||x.qualityComparabilityProfile.pilotStatus===qualityProfile);
  }).sort((a,b)=>sort==='domain'?a.domain.localeCompare(b.domain)||a.name.localeCompare(b.name):sort==='id'?a.id.localeCompare(b.id):a.name.localeCompare(b.name));
  $('clear').hidden = !(q || geography!=='All geographies' || program!=='All India programmes' || system!=='All systems / portals'|| component!=='All programme components'|| level!=='All lowest reporting levels'|| domain!=='All domains'|| type!=='All types'|| measure!=='All measure types'|| source!=='All sources'|| pillar!=='All WHO pillars'|| frequency!=='All frequencies'|| cadre!=='All cadre categories'|| availability!=='All availability states'|| review!=='All review statuses'|| lifecycle!=='All lifecycle states'|| computability!=='All computability states'|| disaggDimension!=='All disaggregation dimensions'|| disaggClaim!=='All claim types'|| disaggEvidence!=='All evidence states'|| qualityProfile!=='All quality-profile states');
  const summaries=window.phaosResultSummaries,linked=state.filtered.filter(x=>(x.navigation?.occurrences||[]).length).length;
  summaries.render('indicator-result-summary',{
    eyebrow:'Result summary · indicator manifestations',title:`${state.filtered.length.toLocaleString()} indicators in this result`,
    metrics:[{value:new Set(state.filtered.map(x=>x.domain).filter(Boolean)).size,label:'domains'},{value:new Set(state.filtered.map(x=>x.source).filter(Boolean)).size,label:'source labels'},{value:state.filtered.filter(x=>x.qualityComparabilityProfile.pilotStatus==='Pilot profile available').length,label:'with quality guidance'},{value:state.filtered.filter(x=>x.disaggregationProfile.assertions.length).length,label:'with disaggregation assertions'},{value:linked,label:'linked to report occurrences'}],
    groups:[{label:'Leading domains',values:summaries.counts(state.filtered,x=>x.domain)},{label:'Measure types',values:summaries.counts(state.filtered,x=>x.measureType||'Unclassified')},{label:'Systems / portals',values:summaries.counts(state.filtered,x=>x.systemPortalTags)}],
    filters:summaries.activeFilters([['Search',$('search').value.trim(),''],['Geography',geography,'All geographies'],['Programme',program,'All India programmes'],['System / portal',system,'All systems / portals'],['Component',component,'All programme components'],['Lowest level',level,'All lowest reporting levels'],['Domain',domain,'All domains'],['Type',type,'All types'],['Measure',measure,'All measure types'],['Source',source,'All sources'],['WHO pillar',pillar,'All WHO pillars'],['Frequency',frequency,'All frequencies'],['Cadre',cadre,'All cadre categories'],['Availability',availability,'All availability states'],['Review',review,'All review statuses'],['Lifecycle',lifecycle,'All lifecycle states'],['Computability',computability,'All computability states'],['Disaggregation dimension',disaggDimension,'All disaggregation dimensions'],['Disaggregation claim',disaggClaim,'All claim types'],['Disaggregation evidence',disaggEvidence,'All evidence states'],['Quality guidance',qualityProfile,'All quality-profile states']]),
    boundary:system==='HMIS'?'These are indicator manifestations tagged to HMIS. They are not the complete 1,046-object HMIS knowledge layer; open HMIS objects to see all object classes.':'This view counts indicator manifestations. HMIS data elements, outputs, validation rules and report-column occurrences are separate object classes.'
  });
  updateIndicatorUrlState();
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
function disaggregationSummary(profile){const count=profile.dimensions.length;return count?`${count} dimension${count===1?'':'s'} · ${profile.evidenceState}`:profile.evidenceState;}
function card(x){ const programmes=x.normalizedProgrammeTags.join('; '); const systems=x.systemPortalTags.join('; '); const ops=x.operationalDiscovery; const quality=x.qualityComparabilityProfile; const context=programmes?'<div><dt>India programme</dt><dd>'+esc(programmes)+'</dd></div>':!systems?'<div><dt>Collection</dt><dd>'+esc(x.collection)+'</dd></div>':''; const system=systems?'<div><dt>System / portal</dt><dd>'+esc(systems)+'</dd></div>':''; return '<article class="indicator-card"><div class="card-top"><span>'+esc(x.id)+'</span>'+(x.country?'<span class="india-badge">'+esc(x.country)+'</span>':x.code?'<span>'+esc(x.code)+'</span>':'')+'</div><div class="card-tags"><span class="card-domain">'+esc(x.domain)+'</span><span class="pillar-tag">'+esc(x.whoPillarPrimary||'Unclassified')+'</span><span class="measure-tag">'+esc(x.measureType||'Unclassified')+'</span><span class="scale-tag">'+esc(x.scaleDisplay||'Not specified')+'</span></div><h3>'+esc(x.name)+'</h3><p>'+esc(x.displayDefinition||x.definition)+'</p><div class="ops-profile"><span>'+esc(ops.frequency)+'</span><span>'+esc(ops.reviewStatus)+'</span><span>'+esc(ops.computabilityMaturity)+'</span></div><div class="disagg-summary">'+esc(disaggregationSummary(x.disaggregationProfile))+'</div>'+(quality.pilotStatus==='Pilot profile available'?'<div class="quality-summary">Quality/comparability pilot · review pending</div>':'')+'<dl>'+context+system+'<div><dt>WHO pillars</dt><dd>'+esc((x.whoPillars||[]).join('; ')||'Not classified')+'</dd></div></dl><button data-open="'+esc(x.id)+'">View full metadata <span>→</span></button></article>'; }
function table(rows){
  const body=rows.map(x=>{
    const programme=x.normalizedProgrammeTags.join('; ')||x.country||'Global / multi-country';
    const systems=x.systemPortalTags.join('; ')||'Not specified';
    const ops=x.operationalDiscovery;
    return '<tr><td class="registry-id">'+esc(x.id)+'</td><td class="registry-name"><strong>'+esc(x.name)+'</strong><span>'+esc(x.displayDefinition||x.definition)+'</span></td><td>'+esc(x.domain||'Not classified')+'</td><td><span class="table-measure">'+esc(x.measureType||'Unclassified')+'</span><small>'+esc(x.scaleDisplay||'Not specified')+'</small></td><td>'+esc(x.normalizedLowestReportingLevel||x.lowestReportingLevel||'Not specified')+'</td><td><strong>'+esc(ops.frequency)+'</strong><small>'+esc(ops.reviewStatus)+'<br>'+esc(ops.computabilityMaturity)+'</small></td><td><strong>'+esc(x.disaggregationProfile.dimensions.length)+'</strong><small>'+esc(x.disaggregationProfile.evidenceState)+'</small></td><td><strong>'+esc(x.qualityComparabilityProfile.pilotStatus)+'</strong><small>'+esc(x.qualityComparabilityProfile.reviewStatus)+'</small></td><td>'+esc(programme)+'</td><td>'+esc(systems)+'</td><td>'+esc(x.source||'Not reported')+'</td><td><button class="table-open" data-open="'+esc(x.id)+'" aria-label="View full metadata for '+esc(x.name)+'">View <span aria-hidden="true">→</span></button></td></tr>';
  }).join('');
  return '<table class="registry-table"><caption>Filtered public-health indicator registry results</caption><thead><tr><th scope="col">Registry ID</th><th scope="col">Indicator</th><th scope="col">Domain</th><th scope="col">Measure</th><th scope="col">Lowest level</th><th scope="col">Operational profile</th><th scope="col">Disaggregation evidence</th><th scope="col">Quality / comparability</th><th scope="col">Programme / scope</th><th scope="col">System / portal</th><th scope="col">Source</th><th scope="col"><span class="visually-hidden">Actions</span></th></tr></thead><tbody>'+body+'</tbody></table>';
}
function meta(title,value,wide=false){ return '<div class="meta-item'+(wide?' wide':'')+'"><span>'+title+'</span><p>'+esc(value||'Not reported')+'</p></div>'; }
function operationalProfile(ops){return '<section class="operational-profile"><strong>UTILITY-01 · operational discovery profile</strong><dl><div><dt>Frequency</dt><dd>'+esc(ops.frequency)+'<br><small>Source wording: '+esc(ops.frequencySource)+'</small></dd></div><div><dt>Responsible cadre</dt><dd>'+esc(ops.cadreCategories.join('; '))+'<br><small>Source wording: '+esc(ops.responsibleCadreSource)+'</small></dd></div><div><dt>Data availability</dt><dd>'+esc(ops.dataAvailability)+'</dd></div><div><dt>Review status</dt><dd>'+esc(ops.reviewStatus)+'</dd></div><div><dt>Lifecycle</dt><dd>'+esc(ops.lifecycle)+'</dd></div><div><dt>Computability maturity</dt><dd>'+esc(ops.computabilityMaturity)+'</dd></div></dl></section>';}
function disaggregationPanel(profile){
  const types=[['source-required','Source-required'],['system-available','System-available'],['analyst-recommended','Analyst-recommended']];
  const columns=types.map(([id,label])=>{const rows=profile.assertions.filter(item=>item.claimType===id);return '<div class="disagg-column claim-'+id+'"><h4>'+esc(label)+' <span>'+rows.length+'</span></h4>'+(rows.length?rows.map(item=>'<article><strong>'+esc(item.dimensionLabel)+'</strong><p>'+esc(item.status)+'</p><small>'+esc(item.evidence.exactText)+' · '+esc(item.evidence.sourceVersion||'Version not stated')+'</small><details><summary>Evidence and applicability</summary><dl><div><dt>Authority</dt><dd>'+esc(item.evidence.authority)+'</dd></div><div><dt>Locator</dt><dd>'+esc(item.evidence.locator)+'</dd></div><div><dt>Geography</dt><dd>'+esc(item.applicability.geography)+'</dd></div><div><dt>Reporting level</dt><dd>'+esc(item.applicability.reportingLevel)+'</dd></div><div><dt>Facility type</dt><dd>'+esc(item.applicability.facilityType)+'</dd></div><div><dt>Population</dt><dd>'+esc(item.applicability.population)+'</dd></div><div><dt>Review</dt><dd>'+esc(item.reviewStatus)+'</dd></div></dl></details></article>').join(''):'<p class="disagg-empty">Not evidenced in this release.</p>')+'</div>';}).join('');
  return '<section class="disaggregation-profile"><div><p class="eyebrow">UTILITY-02 · PHAOS-DISAGG-001</p><h3>Controlled disaggregation assertions</h3><p>'+esc(profile.boundary)+'</p></div><div class="disagg-columns">'+columns+'</div>'+(profile.unresolvedSourceText.length?'<p class="disagg-unresolved"><strong>Unresolved source wording:</strong> '+esc(profile.unresolvedSourceText.join('; '))+'</p>':'')+'</section>';
}
function qualityComparabilityPanel(profile){
  if(profile.pilotStatus!=='Pilot profile available')return '<section class="quality-profile quality-not-piloted"><div><p class="eyebrow">UTILITY-03 · PHAOS-DQCOMP-001</p><h3>Quality and comparability guidance</h3><p>This object is outside the 30-indicator pilot. No record-specific guidance is asserted in this release.</p></div></section>';
  const list=items=>'<ul>'+items.map(item=>'<li>'+esc(item)+'</li>').join('')+'</ul>';
  return '<section class="quality-profile"><div class="quality-profile-head"><div><p class="eyebrow">UTILITY-03 · PHAOS-DQCOMP-001</p><h3>Quality and comparability guidance</h3></div><span>'+esc(profile.reviewStatus)+'</span></div><p class="quality-boundary">'+esc(profile.boundary)+'</p><div class="quality-grid"><article><h4>Expected reporting lag</h4><strong>'+esc(profile.expectedReportingLag.state)+'</strong><p>'+esc(profile.expectedReportingLag.planningNote)+'</p></article><article><h4>Known issues</h4>'+list(profile.knownIssues.map(item=>item.category+': '+item.note))+'</article><article><h4>Common misinterpretations</h4>'+list(profile.commonMisinterpretations)+'</article><article><h4>Minimum data requirements</h4>'+list(profile.minimumDataRequirements)+'</article><article><h4>Validation checks</h4>'+list(profile.validationChecks.map(item=>item.severity+': '+item.check))+'</article><article><h4>Comparability conditions</h4><strong>'+esc(profile.comparability.status)+'</strong>'+list(profile.comparability.conditions)+'<p>'+esc(profile.comparability.boundary)+'</p></article></div><p class="quality-evidence"><strong>Evidence:</strong> '+esc(profile.evidence.authority)+' · '+esc(profile.evidence.sourceVersion)+' · '+esc(profile.evidence.locator)+'</p></section>';
}
function openModal(id){
  const x=state.indicators.find(item=>item.id===id); if(!x)return;
  const graphSelect=$('kg-focus');
  const graphAvailable=graphSelect&&[...graphSelect.options].some(option=>option.value===id);
  const indiaMeta=x.country?meta('Country / scope',x.country)+meta('India programme',x.normalizedProgrammeTags.join('; ')||'Not assigned')+meta('System / portal',x.systemPortalTags.join('; ')||'Not specified')+meta('Source programme labels',x.programmeTags,true)+meta('Programme component',x.programmeComponent)+meta('Object type',x.objectType||x.recordType)+meta('Official-name status',x.officialNameStatus)+meta('Source-reported system',x.indiaReportingSystem)+meta('Normalized lowest reporting level',x.normalizedLowestReportingLevel)+meta('Source-reported lowest level',x.lowestReportingLevel)+meta('Full reporting levels',x.reportingLevel)+meta('Reporting unit',x.reportingUnit)+meta('Responsible cadre',x.responsibleCadre)+meta('Administrative level',x.administrativeLevel)+meta('Facility type',x.facilityType)+meta('Record type',x.recordType)+meta('Source document',x.sourceDocument)+meta('Source section',x.sourceSection)+meta('Source item code',x.sourceItemCode)+meta('Source version',x.sourceVersion)+meta('Aggregation rule',x.aggregationRule,true)+meta('Zero-denominator rule',x.zeroDenominatorRule,true)+meta('Linked HMIS data elements',x.relatedElementIds,true)+meta('Related registry indicators',x.relatedIndicatorIds,true)+meta('Crosswalk status',x.crosswalkStatus,true)+meta('Data lineage',x.lineage,true)+meta('Currentness',x.currentness,true)+meta('Source location',x.sourcePage,true):'';
  const reviewKicker=x.provenance?'Reviewed '+esc(x.provenance.reviewedOn):'Entry review pending';
  $('modal-content').innerHTML='<div class="modal-kicker"><span>'+esc(x.id)+'</span><span>'+esc(x.status)+'</span><span>'+reviewKicker+'</span></div><p class="eyebrow">'+esc(x.domain)+' · '+esc(x.subdomain)+'</p><h2 id="modal-title">'+esc(x.name)+'</h2><div class="modal-lead"><p>'+esc(x.displayDefinition||x.definition)+'</p><div><span>Collection</span><strong>'+esc(x.collection)+'</strong></div><div><span>Framework</span><strong>'+esc(x.code||'Not assigned')+'</strong></div></div>'+operationalProfile(x.operationalDiscovery)+disaggregationPanel(x.disaggregationProfile)+qualityComparabilityPanel(x.qualityComparabilityProfile)+'<div class="metadata-grid">'+meta('Measure type',x.measureType)+meta('Scale',x.scaleDisplay)+meta('Normalized formula',x.normalizedFormula,true)+meta('Denominator population',x.denominatorPopulation,true)+indiaMeta+meta('WHO health-system pillars',(x.whoPillars||[]).join('; '),true)+meta('Numerator',x.numerator)+meta('Denominator',x.denominator)+meta('Official / source formula or method',x.formula)+meta('Unit',x.unit)+meta('Reference population',x.population)+meta('Frequency',x.frequency)+meta('Preferred data source',x.dataSource)+meta('Legacy recommended-disaggregation wording',x.disaggregation,true)+meta('Direction',x.direction)+meta('Potential uses',x.uses)+meta('Key limitations',x.caveats,true)+meta('Pillar classification note',x.whoPillarBasis,true)+meta('Legacy metadata marker','Historical '+x.metadataLevel+' · '+x.completeness+'%; retained for provenance and not a PHAOS-MDQ-001 computed grade',true)+'</div>'+window.phaosProvenancePanel(x.provenance)+window.phaosNavigation.renderFor(id)+'<div class="source-panel"><div><span>Primary registry</span><strong>'+esc(x.source)+'</strong><small>'+esc(x.org)+'</small></div><div><span>Source identity</span><strong>'+esc(x.sourceId)+'</strong><small>'+(x.sourceVariant?'Unresolved source variant':esc(x.indiaReleaseStatus||'Curated record'))+'</small></div>'+(graphAvailable?'<button type="button" id="modal-graph-link" class="modal-graph-link">Explore in graph →</button>':'')+'<a href="'+esc(x.url)+'" target="_blank" rel="noreferrer">Open authoritative metadata ↗</a></div>';
  window.phaosNavigation.bind($('modal-content'));
  $('modal-graph-link')?.addEventListener('click',()=>{ closeModal(); location.hash='knowledge-graph'; graphSelect.value=id; graphSelect.dispatchEvent(new Event('change')); });
  $('modal-backdrop').hidden=false; document.body.style.overflow='hidden'; $('modal-close').focus();
}
function closeModal(){ $('modal-backdrop').hidden=true; document.body.style.overflow=''; }
