const state = { indicators: [], filtered: [], visible: 24 };
const $ = (id) => document.getElementById(id);
const fields = ['search','domain','type','source','sort'];

fetch('./data/indicators.json').then(r => r.json()).then(data => {
  state.indicators = data.indicators || [];
  $('metric-indicators').textContent = state.indicators.length;
  $('metric-domains').textContent = new Set(state.indicators.map(x => x.domain)).size;
  if (data.coverage) $('metric-sources').textContent = data.coverage.sourceCompleteCatalogues;
  fillSelect('domain', state.indicators.map(x => x.domain));
  fillSelect('type', state.indicators.map(x => x.type));
  fillSelect('source', state.indicators.map(x => x.source));
  filter();
}).catch(() => { $('indicator-grid').innerHTML = '<div class="empty-state"><h3>Registry data could not be loaded</h3><p>Serve this folder through a web server or GitHub Pages; browsers block local JSON requests from file:// pages.</p></div>'; });

function fillSelect(id, values) { [...new Set(values)].sort().forEach(value => $(id).add(new Option(value, value))); }
fields.forEach(id => $(id).addEventListener(id === 'search' ? 'input' : 'change', filter));
$('clear').addEventListener('click', () => { $('search').value=''; $('domain').selectedIndex=0; $('type').selectedIndex=0; $('source').selectedIndex=0; filter(); });
$('load-more').addEventListener('click', () => { state.visible += 24; render(); });
$('modal-close').addEventListener('click', closeModal);
$('modal-backdrop').addEventListener('mousedown', e => { if(e.target === $('modal-backdrop')) closeModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

function filter() {
  state.visible = 24;
  const q = $('search').value.trim().toLowerCase(), domain=$('domain').value, type=$('type').value, source=$('source').value, sort=$('sort').value;
  state.filtered = state.indicators.filter(x => {
    const text=[x.id,x.name,x.domain,x.subdomain,x.code,x.definition,x.source,x.org,x.uses].join(' ').toLowerCase();
    return (!q || text.includes(q)) && (domain==='All domains'||x.domain===domain) && (type==='All types'||x.type===type) && (source==='All sources'||x.source===source);
  }).sort((a,b)=>sort==='domain'?a.domain.localeCompare(b.domain)||a.name.localeCompare(b.name):sort==='id'?a.id.localeCompare(b.id):a.name.localeCompare(b.name));
  $('clear').hidden = !(q || domain!=='All domains' || type!=='All types' || source!=='All sources');
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
function card(x){ return '<article class="indicator-card"><div class="card-top"><span>'+esc(x.id)+'</span>'+(x.code?'<span>'+esc(x.code)+'</span>':'')+'</div><div class="card-domain">'+esc(x.domain)+'</div><h3>'+esc(x.name)+'</h3><p>'+esc(x.definition)+'</p><dl><div><dt>Collection</dt><dd>'+esc(x.collection)+'</dd></div><div><dt>Metadata</dt><dd>Level '+esc(x.metadataLevel)+' · '+esc(x.completeness)+'%</dd></div></dl><button data-open="'+esc(x.id)+'">View full metadata <span>→</span></button></article>'; }
function meta(title,value,wide=false){ return '<div class="meta-item'+(wide?' wide':'')+'"><span>'+title+'</span><p>'+esc(value||'Not reported')+'</p></div>'; }
function openModal(id){
  const x=state.indicators.find(item=>item.id===id); if(!x)return;
  $('modal-content').innerHTML='<div class="modal-kicker"><span>'+esc(x.id)+'</span><span>'+esc(x.status)+'</span><span>Verified '+esc(x.verified)+'</span></div><p class="eyebrow">'+esc(x.domain)+' · '+esc(x.subdomain)+'</p><h2 id="modal-title">'+esc(x.name)+'</h2><div class="modal-lead"><p>'+esc(x.definition)+'</p><div><span>Collection</span><strong>'+esc(x.collection)+'</strong></div><div><span>Framework</span><strong>'+esc(x.code||'Not assigned')+'</strong></div></div><div class="metadata-grid">'+meta('Numerator',x.numerator)+meta('Denominator',x.denominator)+meta('Formula or method',x.formula)+meta('Unit',x.unit)+meta('Reference population',x.population)+meta('Frequency',x.frequency)+meta('Preferred data source',x.dataSource)+meta('Recommended disaggregation',x.disaggregation)+meta('Direction',x.direction)+meta('Potential uses',x.uses)+meta('Key limitations',x.caveats,true)+meta('Metadata quality','Level '+x.metadataLevel+' · '+x.completeness+'% core-field completeness')+'</div><div class="source-panel"><div><span>Primary registry</span><strong>'+esc(x.source)+'</strong><small>'+esc(x.org)+'</small></div><div><span>Source identity</span><strong>'+esc(x.sourceId)+'</strong><small>'+(x.sourceVariant?'Unresolved source variant':'Curated record')+'</small></div><a href="'+esc(x.url)+'" target="_blank" rel="noreferrer">Open authoritative metadata ↗</a></div>';
  $('modal-backdrop').hidden=false; document.body.style.overflow='hidden'; $('modal-close').focus();
}
function closeModal(){ $('modal-backdrop').hidden=true; document.body.style.overflow=''; }
