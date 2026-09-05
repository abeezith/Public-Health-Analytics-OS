const state = { indicators: [], filtered: [], visible: 24 };
const $ = (id) => document.getElementById(id);
const fields = ['search','geography','program','component','level','domain','type','measure','source','pillar','sort'];
const programsMenu=$('programs-menu');
const programmeSections=new Set(['india','ntep','rmncha','immunization','vbd','ncd','hmis','hmis-report-schemas']);
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
  else document.querySelector(`.header-nav>a[href="#${CSS.escape(hash)}"]`)?.setAttribute('aria-current','location');
}
window.addEventListener('hashchange',updateNavigationState);
updateNavigationState();

function normalizeLowestReportingLevel(value=''){
  const level=String(value).toLowerCase();
  if(!level)return 'Not specified';
  if(level.includes('community')||level.includes('household')||level.includes('village')||level.includes('gram panchayat')||level.includes('session'))return 'Community';
  if(level.includes('sub-centre')||level.includes('sub-cent'))return 'Sub-centre';
  if(level.includes('facility')||level.includes('laboratory')||level.includes('dmc')||level.includes('phi')||level.includes('specimen collection'))return 'Facility / laboratory';
  if(level.includes('block')||level.includes('planning unit'))return 'Block / planning unit';
  if(level.includes('district'))return 'District';
  if(level.includes('state'))return 'State / UT';
  if(level.includes('national')&&!level.includes('below'))return 'National';
  return 'Source-defined / unresolved';
}

function expandNcdRelease(release) {
  const programme='National Programme for Prevention and Control of Non-Communicable Diseases';
  const guidelines=release.sources.find(x=>x.id==='IND_NPNCD_2023_GUIDELINES'), training=release.sources.find(x=>x.id==='IND_NPNCD_TRAINING_2025');
  return (release.records||[]).map(([id,name,component,measureType,denominator,numerator,definition,reportingLevel,lowestReportingLevel,frequency,whoPillars,sourcePage])=>{
    const source=id>='IND-NPNCD2-040'?training:guidelines, percentage=measureType==='Percentage/proportion', count=measureType==='Count';
    return {id,name,officialIndicatorName:name,officialNameStatus:'Official/source wording preserved',domain:'Noncommunicable diseases',subdomain:component,type:count?'Output / activity':component==='Control and outcomes'||component==='Incidence'?'Outcome / performance':'Process / performance',code:'',definition,displayDefinition:`${definition} Denominator population: ${denominator}.`,numerator,denominator,formula:percentage?'(Numerator / denominator) × 100':count?'Count':'Source-defined status, change or categorical method',unit:percentage?'Percentage':count?'Number':'Source-defined index/status',population:denominator,frequency,dataSource:'National NCD Portal and NP-NCD programme reporting',disaggregation:'Geography; sex; age; disease; facility type and cadre where collected',direction:'Interpret against the official programme target and source-defined method',uses:'Programme monitoring; service-cascade analysis; readiness assessment; local planning; data-quality review',caveats:id==='IND-NPNCD2-038'?'The official label is preserved but appears internally inconsistent: it specifies blood-pressure control for people with diabetes. Custodian clarification is required before computation or comparison.':'Source-table manifestation. Confirm current portal field codes, exclusions, reporting period and validation rules before operational computation.',source:`India — ${source.source}`,org:'Ministry of Health and Family Welfare, Government of India',url:source.url,authority:5,utility:9,group:id.replaceAll('-','_'),confidence:id==='IND-NPNCD2-038'?'Moderate':'High',status:'Active / published',verified:'2026-09-05',collection:'India national programme extension — official source-table release',sourceId:source.id,language:'English',metadataLevel:'A',sourceVariant:false,completeness:94,whoPillars,whoPillarPrimary:whoPillars[0],whoPillarBasis:'Analytical mapping by the Public Health Analytics-OS registry to the WHO health-system building-block framework; not assigned by the source custodian.',country:'India',indiaProgram:programme,programmeTags:[programme],programmeComponent:component,indiaReportingSystem:'National NCD Portal and NP-NCD programme reporting',administrativeLevel:reportingLevel,reportingLevel,lowestReportingLevel,facilityType:lowestReportingLevel==='Facility'?'Programme facility, including AAM/SHC, PHC, CHC or DH as source-defined':lowestReportingLevel==='Community/household'?'Community/household and linked primary-care facility':'Administrative programme unit',reportingUnit:lowestReportingLevel,responsibleCadre:'Source-defined NP-NCD programme team and reporting facility',recordType:'Official programme monitoring manifestation',objectType:'Indicator manifestation',sourceDocument:source.document,sourceSection:sourcePage,sourceItemCode:'',sourceVersion:source.version,sourcePage,indiaReleaseStatus:'Included — source-complete within declared NP-NCD boundary',measureType,scaleDisplay:percentage?'%':count?'count':'source-defined index/status',normalizedFormula:percentage?'(numerator ÷ denominator) × 100':count?'Count of source-defined events or units':'Source-defined; not computable from the cited table alone',denominatorPopulation:denominator,aggregationRule:percentage?'Aggregate by summing compatible numerators and denominators, then recomputing; do not average reported percentages.':count?'Sum only across mutually exclusive reporting units and compatible periods.':'Do not aggregate until the source-defined scoring or change method is obtained.',zeroDenominatorRule:percentage?'If the denominator is zero, report not applicable/undefined; do not report 0%.':'Not applicable unless defined by the source.',relatedElementIds:[],relatedIndicatorIds:id==='IND-NPNCD2-040'?['IND-NPNCD-001']:id==='IND-NPNCD2-041'?['IND-NPNCD-002','IND-NPNCD-005']:id==='IND-NPNCD2-042'?['IND-NPNCD-003']:id==='IND-NPNCD2-043'?['IND-NPNCD-004']:[],crosswalkStatus:'No exact computable HMIS crosswalk asserted; source and HMIS manifestations remain distinct.',lineage:`Community or programme service event → ${lowestReportingLevel} reporting → National NCD Portal / programme aggregation → analytical output`,currentness:'Official source checked 5 September 2026'};
  });
}

Promise.all([
  fetch('./data/indicators.json?v=ncd-1.0.0', { cache: 'no-store' }).then(r => r.json()),
  fetch('./data/ncd/release.json?v=ncd-1.0.0', { cache: 'no-store' }).then(r => r.json())
]).then(([data,ncd]) => {
  state.indicators = [...(data.indicators || []),...expandNcdRelease(ncd)].map(x=>({...x,normalizedLowestReportingLevel:normalizeLowestReportingLevel(x.lowestReportingLevel)}));
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
  if ($('metric-ncd-new')) $('metric-ncd-new').textContent = ncd.records.length;
  if ($('metric-ncd-sources')) $('metric-ncd-sources').textContent = ncd.sources.length;
  if ($('metric-india')) $('metric-india').textContent = state.indicators.filter(x=>x.country==='India').length;
  if ($('metric-india-sources')) $('metric-india-sources').textContent = (data.coverage?.indiaSourcesWithVerifiedRecords||0)+ncd.sources.length;
  fillSelect('geography', state.indicators.map(x => x.country || 'Global / multi-country'));
  fillSelect('program', state.indicators.flatMap(x => x.programmeTags?.length ? x.programmeTags : [x.indiaProgram]).filter(Boolean));
  fillSelect('component', state.indicators.map(x => x.programmeComponent).filter(Boolean));
  fillSelect('level', state.indicators.map(x => x.normalizedLowestReportingLevel));
  fillSelect('domain', state.indicators.map(x => x.domain));
  fillSelect('type', state.indicators.map(x => x.type));
  fillSelect('measure', state.indicators.map(x => x.measureType || 'Unclassified / source metadata pending'));
  fillSelect('source', state.indicators.map(x => x.source));
  fillSelect('pillar', state.indicators.flatMap(x => x.whoPillars || []));
  filter();
  const applyGlobalRegistry=source=>{ $('search').value=''; ['program','component','level','domain','type','measure','pillar'].forEach(id=>$(id).selectedIndex=0); $('geography').value='Global / multi-country'; source?$('source').value=source:$('source').selectedIndex=0; filter(); };
  document.querySelectorAll('[data-global-filter="all"]').forEach(link=>link.addEventListener('click',()=>applyGlobalRegistry('')));
  document.querySelectorAll('[data-global-source]').forEach(link=>link.addEventListener('click',()=>applyGlobalRegistry(link.dataset.globalSource)));
}).catch(() => { $('indicator-grid').innerHTML = '<div class="empty-state"><h3>Registry data could not be loaded</h3><p>Serve this folder through a web server or GitHub Pages; browsers block local JSON requests from file:// pages.</p></div>'; });

function fillSelect(id, values) { [...new Set(values)].sort().forEach(value => $(id).add(new Option(value, value))); }
fields.forEach(id => $(id).addEventListener(id === 'search' ? 'input' : 'change', filter));
$('clear').addEventListener('click', () => { $('search').value=''; ['geography','program','component','level','domain','type','measure','source','pillar'].forEach(id => $(id).selectedIndex=0); filter(); });
$('load-more').addEventListener('click', () => { state.visible += 24; render(); });
$('modal-close').addEventListener('click', closeModal);
$('modal-backdrop').addEventListener('mousedown', e => { if(e.target === $('modal-backdrop')) closeModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

function filter() {
  state.visible = 24;
  const q = $('search').value.trim().toLowerCase(), geography=$('geography').value, program=$('program').value, component=$('component').value, level=$('level').value, domain=$('domain').value, type=$('type').value, measure=$('measure').value, source=$('source').value, pillar=$('pillar').value, sort=$('sort').value;
  state.filtered = state.indicators.filter(x => {
    const geo=x.country || 'Global / multi-country';
    const normalizedMeasure=x.measureType||'Unclassified / source metadata pending';
    const text=[x.id,x.name,x.officialIndicatorName,x.domain,x.subdomain,x.code,x.definition,x.displayDefinition,x.source,x.org,x.uses,x.country,x.indiaProgram,(x.programmeTags||[]).join(' '),x.indiaReportingSystem,x.programmeComponent,x.reportingLevel,x.lowestReportingLevel,x.normalizedLowestReportingLevel,x.reportingUnit,x.responsibleCadre,x.measureType,x.scaleDisplay,x.normalizedFormula,x.denominatorPopulation].join(' ').toLowerCase();
    return (!q || text.includes(q)) && (geography==='All geographies'||geo===geography) && (program==='All India programmes'||(x.programmeTags?.length?x.programmeTags:[x.indiaProgram]).includes(program)) && (component==='All programme components'||x.programmeComponent===component) && (level==='All lowest reporting levels'||x.normalizedLowestReportingLevel===level) && (domain==='All domains'||x.domain===domain) && (type==='All types'||x.type===type) && (measure==='All measure types'||normalizedMeasure===measure) && (source==='All sources'||x.source===source) && (pillar==='All WHO pillars'||(x.whoPillars||[]).includes(pillar));
  }).sort((a,b)=>sort==='domain'?a.domain.localeCompare(b.domain)||a.name.localeCompare(b.name):sort==='id'?a.id.localeCompare(b.id):a.name.localeCompare(b.name));
  $('clear').hidden = !(q || geography!=='All geographies' || program!=='All India programmes' || component!=='All programme components' || level!=='All lowest reporting levels' || domain!=='All domains' || type!=='All types' || measure!=='All measure types' || source!=='All sources' || pillar!=='All WHO pillars');
  render();
}
function render() {
  $('result-count').textContent=state.filtered.length;
  const rows=state.filtered.slice(0,state.visible);
  $('indicator-grid').innerHTML=rows.length?rows.map(card).join(''):'<div class="empty-state"><h3>No matching indicators</h3><p>Try a broader term or clear one of the filters.</p></div>';
  document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>openModal(button.dataset.open)));
  $('load-more').hidden=state.visible>=state.filtered.length;
  if(!$('load-more').hidden) $('load-more').textContent='Load '+Math.min(24,state.filtered.length-state.visible)+' more indicators';
}
function esc(v=''){ const div=document.createElement('div'); div.textContent=String(v); return div.innerHTML; }
function card(x){ return '<article class="indicator-card"><div class="card-top"><span>'+esc(x.id)+'</span>'+(x.country?'<span class="india-badge">'+esc(x.country)+'</span>':x.code?'<span>'+esc(x.code)+'</span>':'')+'</div><div class="card-tags"><span class="card-domain">'+esc(x.domain)+'</span><span class="pillar-tag">'+esc(x.whoPillarPrimary||'Unclassified')+'</span><span class="measure-tag">'+esc(x.measureType||'Unclassified')+'</span><span class="scale-tag">'+esc(x.scaleDisplay||'Not specified')+'</span></div><h3>'+esc(x.name)+'</h3><p>'+esc(x.displayDefinition||x.definition)+'</p><dl><div><dt>'+(x.indiaProgram?'India programme':'Collection')+'</dt><dd>'+esc(x.indiaProgram||x.collection)+'</dd></div><div><dt>WHO pillars</dt><dd>'+esc((x.whoPillars||[]).join('; ')||'Not classified')+'</dd></div></dl><button data-open="'+esc(x.id)+'">View full metadata <span>→</span></button></article>'; }
function meta(title,value,wide=false){ return '<div class="meta-item'+(wide?' wide':'')+'"><span>'+title+'</span><p>'+esc(value||'Not reported')+'</p></div>'; }
function openModal(id){
  const x=state.indicators.find(item=>item.id===id); if(!x)return;
  const graphSelect=$('kg-focus');
  const graphAvailable=graphSelect&&[...graphSelect.options].some(option=>option.value===id);
  const indiaMeta=x.country?meta('Country / scope',x.country)+meta('India programme',x.indiaProgram)+meta('Programme tags',x.programmeTags,true)+meta('Programme component',x.programmeComponent)+meta('Object type',x.objectType||x.recordType)+meta('Official-name status',x.officialNameStatus)+meta('Reporting system',x.indiaReportingSystem)+meta('Normalized lowest reporting level',x.normalizedLowestReportingLevel)+meta('Source-reported lowest level',x.lowestReportingLevel)+meta('Full reporting levels',x.reportingLevel)+meta('Reporting unit',x.reportingUnit)+meta('Responsible cadre',x.responsibleCadre)+meta('Administrative level',x.administrativeLevel)+meta('Facility type',x.facilityType)+meta('Record type',x.recordType)+meta('Source document',x.sourceDocument)+meta('Source section',x.sourceSection)+meta('Source item code',x.sourceItemCode)+meta('Source version',x.sourceVersion)+meta('Aggregation rule',x.aggregationRule,true)+meta('Zero-denominator rule',x.zeroDenominatorRule,true)+meta('Linked HMIS data elements',x.relatedElementIds,true)+meta('Related registry indicators',x.relatedIndicatorIds,true)+meta('Crosswalk status',x.crosswalkStatus,true)+meta('Data lineage',x.lineage,true)+meta('Currentness',x.currentness,true)+meta('Source location',x.sourcePage,true):'';
  $('modal-content').innerHTML='<div class="modal-kicker"><span>'+esc(x.id)+'</span><span>'+esc(x.status)+'</span><span>Verified '+esc(x.verified)+'</span></div><p class="eyebrow">'+esc(x.domain)+' · '+esc(x.subdomain)+'</p><h2 id="modal-title">'+esc(x.name)+'</h2><div class="modal-lead"><p>'+esc(x.displayDefinition||x.definition)+'</p><div><span>Collection</span><strong>'+esc(x.collection)+'</strong></div><div><span>Framework</span><strong>'+esc(x.code||'Not assigned')+'</strong></div></div><div class="metadata-grid">'+meta('Measure type',x.measureType)+meta('Scale',x.scaleDisplay)+meta('Normalized formula',x.normalizedFormula,true)+meta('Denominator population',x.denominatorPopulation,true)+indiaMeta+meta('WHO health-system pillars',(x.whoPillars||[]).join('; '),true)+meta('Numerator',x.numerator)+meta('Denominator',x.denominator)+meta('Official / source formula or method',x.formula)+meta('Unit',x.unit)+meta('Reference population',x.population)+meta('Frequency',x.frequency)+meta('Preferred data source',x.dataSource)+meta('Recommended disaggregation',x.disaggregation)+meta('Direction',x.direction)+meta('Potential uses',x.uses)+meta('Key limitations',x.caveats,true)+meta('Pillar classification note',x.whoPillarBasis,true)+meta('Metadata quality','Level '+x.metadataLevel+' · '+x.completeness+'% core-field completeness')+'</div><div class="source-panel"><div><span>Primary registry</span><strong>'+esc(x.source)+'</strong><small>'+esc(x.org)+'</small></div><div><span>Source identity</span><strong>'+esc(x.sourceId)+'</strong><small>'+(x.sourceVariant?'Unresolved source variant':esc(x.indiaReleaseStatus||'Curated record'))+'</small></div>'+(graphAvailable?'<button type="button" id="modal-graph-link" class="modal-graph-link">Explore in graph →</button>':'')+'<a href="'+esc(x.url)+'" target="_blank" rel="noreferrer">Open authoritative metadata ↗</a></div>';
  $('modal-graph-link')?.addEventListener('click',()=>{ closeModal(); location.hash='knowledge-graph'; graphSelect.value=id; graphSelect.dispatchEvent(new Event('change')); });
  $('modal-backdrop').hidden=false; document.body.style.overflow='hidden'; $('modal-close').focus();
}
function closeModal(){ $('modal-backdrop').hidden=true; document.body.style.overflow=''; }
