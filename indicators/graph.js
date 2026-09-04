const kg = { graph: null, cy: null, focusId: 'CONCEPT-RMNCHA-EARLY-ANC', programmeId: 'PROGRAMME-RMNCHA', selectedId: null, history: [], historyIndex: -1, reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches };
const kg$ = id => document.getElementById(id);
const kgEsc = (value = '') => {
  const div = document.createElement('div');
  div.textContent = String(value);
  return div.innerHTML;
};
const kgShort = (value = '', limit = 46) => value.length > limit ? `${value.slice(0, limit - 1).trim()}…` : value;

const modePredicates = {
  lineage: new Set(['definedBy', 'publishedBy', 'manifestationOf']),
  computation: new Set(['manifestationOf', 'hasMeasureType', 'usesDataElement', 'relatedHmisObject', 'relatedIndicator']),
  programme: new Set(['partOfProgramme', 'hasProgrammeComponent', 'supportsBuildingBlock', 'lowestReportingLevel', 'limitsCompletenessOf', 'reportedThrough']),
  all: null
};

fetch('./data/graph/graph.json?v=ncd-1.0.0', { cache: 'no-store' })
  .then(response => response.json())
  .then(graph => {
    kg.graph = graph;
    kg$('kg-node-count').textContent = graph.metadata.counts.nodes;
    kg$('kg-edge-count').textContent = graph.metadata.counts.edges;
    kg$('kg-concept-count').textContent = graph.metadata.counts.concepts;
    kg$('kg-review-count').textContent = graph.metadata.counts.reviewedMappings;
    kg$('kg-close-count').textContent = graph.metadata.mappingRelations?.closeMatch || 0;
    kg$('kg-broad-count').textContent = graph.metadata.mappingRelations?.broadMatch || 0;
    kg$('kg-related-count').textContent = graph.metadata.mappingRelations?.relatedMatch || 0;
    populateProgrammes(graph.metadata.programmes || []);
    populateFocus(graph.nodes);
    populateConceptShortcuts();
    initializeGraph();
    setFocus(kg.focusId);
  })
  .catch(() => {
    kg$('kg-canvas').innerHTML = '<div class="empty-state"><h3>Knowledge graph could not be loaded</h3><p>The registry remains available above. Reload the page or verify the graph release files.</p></div>';
  });

function populateProgrammes(programmes) {
  const select = kg$('kg-programme');
  for (const programme of programmes) select.append(new Option(`${programme.label} · ${programme.indicatorCount} indicators`, programme.id));
  select.value = kg.programmeId;
}

function populateFocus(nodes) {
  const select = kg$('kg-focus');
  const groups = [
    ['IndicatorConcept', 'Domain-reviewed concepts'],
    ['Programme', 'Programme layers'],
    ['DataSystem', 'Cross-programme systems'],
    ['IndicatorManifestation', 'Indicator manifestations'],
    ['HmisObject', 'HMIS knowledge objects'],
    ['SourceDocument', 'Sources'],
    ['EvidenceGap', 'Evidence gaps']
  ];
  for (const [type, label] of groups) {
    const rows = nodes.filter(node => node.type === type).sort((a, b) => a.label.localeCompare(b.label));
    if (!rows.length) continue;
    const group = document.createElement('optgroup');
    group.label = label;
    for (const node of rows) group.append(new Option(`${node.label} · ${node.id}`, node.id));
    select.append(group);
  }
  select.value = kg.focusId;
}

function populateConceptShortcuts() {
  const shell = kg$('kg-concept-shortcuts');
  shell.innerHTML = '';
  for (const node of kg.graph.nodes.filter(item => item.type === 'IndicatorConcept' && item.data?.programmeId === kg.programmeId)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.nodeId = node.id;
    button.textContent = node.label;
    button.addEventListener('click', () => setFocus(node.id));
    shell.append(button);
  }
}

function initializeGraph() {
  kg.cy = cytoscape({
    container: kg$('kg-canvas'),
    elements: [],
    minZoom: 0.3,
    maxZoom: 2.4,
    style: [
      { selector: 'node', style: { 'label': 'data(shortLabel)', 'font-family': 'Arial, sans-serif', 'font-size': 10, 'text-wrap': 'wrap', 'text-max-width': 118, 'text-valign': 'bottom', 'text-margin-y': 8, 'color': '#243d3f', 'background-color': '#78908d', 'width': 31, 'height': 31, 'border-width': 2, 'border-color': '#f8faf7', 'transition-property': 'opacity, border-width, border-color', 'transition-duration': '150ms' } },
      { selector: 'node[type="IndicatorManifestation"]', style: { 'background-color': '#087f71', 'shape': 'ellipse', 'width': 39, 'height': 39 } },
      { selector: 'node[type="IndicatorConcept"]', style: { 'background-color': '#bc7b19', 'shape': 'diamond', 'width': 49, 'height': 49, 'font-weight': 700 } },
      { selector: 'node[type="HmisObject"]', style: { 'background-color': '#47758f', 'shape': 'round-rectangle', 'width': 37, 'height': 31 } },
      { selector: 'node[type="SourceDocument"]', style: { 'background-color': '#6c5c87', 'shape': 'rectangle', 'width': 35, 'height': 35 } },
      { selector: 'node[type="Organization"]', style: { 'background-color': '#45565a', 'shape': 'hexagon' } },
      { selector: 'node[type="Programme"]', style: { 'background-color': '#9b5149', 'shape': 'star', 'width': 45, 'height': 45 } },
      { selector: 'node[type="ProgrammeComponent"]', style: { 'background-color': '#7b6b3e', 'shape': 'round-rectangle' } },
      { selector: 'node[type="WHOBuildingBlock"]', style: { 'background-color': '#648458', 'shape': 'hexagon' } },
      { selector: 'node[type="ReportingLevel"]', style: { 'background-color': '#7c756b', 'shape': 'triangle' } },
      { selector: 'node[type="MeasureType"]', style: { 'background-color': '#5f739b', 'shape': 'tag' } },
      { selector: 'node[type="EvidenceGap"]', style: { 'background-color': '#b24b49', 'shape': 'vee' } },
      { selector: 'node[focus="true"]', style: { 'border-width': 6, 'border-color': '#092f31', 'width': 58, 'height': 58, 'font-size': 12, 'text-max-width': 165 } },
      { selector: 'node:selected', style: { 'border-width': 6, 'border-color': '#f0bd52', 'z-index': 20 } },
      { selector: '.kg-muted', style: { 'opacity': 0.14 } },
      { selector: '.kg-neighbor', style: { 'opacity': 1, 'border-width': 4, 'border-color': '#d9b263' } },
      { selector: 'edge', style: { 'width': 1.4, 'line-color': '#9fb0ad', 'target-arrow-color': '#9fb0ad', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'arrow-scale': 0.75, 'label': '', 'font-size': 8, 'color': '#405354', 'text-background-color': '#fffef9', 'text-background-opacity': 0.95, 'text-background-padding': 3, 'text-rotation': 'autorotate', 'transition-property': 'opacity, width', 'transition-duration': '150ms' } },
      { selector: 'edge.kg-label-visible', style: { 'label': 'data(label)' } },
      { selector: 'edge.kg-edge-selected', style: { 'label': 'data(label)', 'width': 4, 'z-index': 30, 'color': '#102f31' } },
      { selector: 'edge[assertionStatus="official"]', style: { 'line-color': '#345e5a', 'target-arrow-color': '#345e5a', 'width': 2 } },
      { selector: 'edge[assertionStatus="curated"]', style: { 'line-color': '#bc7b19', 'target-arrow-color': '#bc7b19' } },
      { selector: 'edge[predicate="manifestationOf"]', style: { 'line-color': '#bc7b19', 'target-arrow-color': '#bc7b19', 'width': 2.7 } },
      { selector: 'edge[predicate="usesDataElement"]', style: { 'line-color': '#47758f', 'target-arrow-color': '#47758f', 'width': 2 } },
      { selector: 'edge[assertionStatus="normalized"]', style: { 'line-style': 'dashed' } },
      { selector: 'edge[assertionStatus="candidate"]', style: { 'line-style': 'dotted', 'line-color': '#b24b49', 'target-arrow-color': '#b24b49' } }
    ]
  });
  kg.cy.on('tap', 'node', event => showNodeDetail(event.target.id()));
  kg.cy.on('dbltap', 'node', event => setFocus(event.target.id()));
  kg.cy.on('tap', 'edge', event => showEdgeDetail(event.target.id()));
  kg.cy.on('mouseover', 'edge', event => event.target.addClass('kg-label-visible'));
  kg.cy.on('mouseout', 'edge', event => { if (!kg$('kg-edge-labels').checked && !event.target.hasClass('kg-edge-selected')) event.target.removeClass('kg-label-visible'); });
  kg.cy.on('tap', event => { if (event.target === kg.cy) clearHighlight(); });
}

function renderNeighborhood() {
  if (!kg.graph || !kg.cy) return;
  const mode = kg$('kg-mode').value;
  const allowed = modePredicates[mode];
  const direct = kg.graph.edges.filter(edge => (edge.source === kg.focusId || edge.target === kg.focusId) && (!allowed || allowed.has(edge.predicate)));
  const edgeSet = new Map(direct.slice(0, 85).map(edge => [edge.id, edge]));
  const nodeSet = new Set([kg.focusId]);
  for (const edge of edgeSet.values()) { nodeSet.add(edge.source); nodeSet.add(edge.target); }

  if (mode === 'lineage' || mode === 'all') {
    const sourceIds = [...nodeSet].filter(id => kg.graph.nodes.find(node => node.id === id)?.type === 'SourceDocument');
    for (const edge of kg.graph.edges.filter(item => sourceIds.includes(item.source) && item.predicate === 'publishedBy')) {
      edgeSet.set(edge.id, edge); nodeSet.add(edge.target);
    }
  }
  if (mode === 'computation' || mode === 'all') {
    const conceptIds = [...nodeSet].filter(id => kg.graph.nodes.find(node => node.id === id)?.type === 'IndicatorConcept');
    for (const edge of kg.graph.edges.filter(item => conceptIds.includes(item.target) && item.predicate === 'manifestationOf').slice(0, 40)) {
      edgeSet.set(edge.id, edge); nodeSet.add(edge.source);
    }
  }
  for (const edge of kg.graph.edges) {
    if (nodeSet.has(edge.source) && nodeSet.has(edge.target) && (!allowed || allowed.has(edge.predicate))) edgeSet.set(edge.id, edge);
  }

  const visibleNodes = kg.graph.nodes.filter(node => nodeSet.has(node.id));
  const visibleEdges = [...edgeSet.values()];
  const elements = [
    ...visibleNodes.map(node => ({ group: 'nodes', data: { id: node.id, label: node.label, shortLabel: kgShort(node.label), type: node.type, focus: String(node.id === kg.focusId) } })),
    ...visibleEdges.map(edge => ({ group: 'edges', data: { ...edge } }))
  ];
  kg.cy.elements().remove();
  kg.cy.add(elements);
  if (kg$('kg-edge-labels').checked) kg.cy.edges().addClass('kg-label-visible');
  const focusNode = kg.graph.nodes.find(node => node.id === kg.focusId);
  const isConceptHub = focusNode?.type === 'IndicatorConcept' && mode === 'computation';
  const layout = isConceptHub
    ? { name: 'concentric', concentric: node => node.id() === kg.focusId ? 100 : (node.data('type') === 'IndicatorManifestation' ? 50 : 10), levelWidth: () => 35, minNodeSpacing: 55, avoidOverlap: true, animate: !kg.reducedMotion, animationDuration: 420, animationEasing: 'ease-out-cubic', fit: true, padding: 70 }
    : visibleNodes.length <= 28
      ? { name: 'breadthfirst', roots: kg.cy.$id(kg.focusId), directed: false, circle: false, spacingFactor: 1.35, animate: !kg.reducedMotion, animationDuration: 420, animationEasing: 'ease-out-cubic', fit: true, padding: 60 }
      : { name: 'cose', animate: !kg.reducedMotion && visibleNodes.length <= 45, animationDuration: 460, animationEasing: 'ease-out-cubic', fit: true, padding: 50, nodeRepulsion: 9200, idealEdgeLength: 110, gravity: 0.5 };
  kg.cy.layout(layout).run();
  if (!kg.reducedMotion) {
    const focus = kg.cy.$id(kg.focusId);
    focus.delay(430).animate({ style: { 'border-color': '#f0bd52', 'border-width': 9 } }, { duration: 180 }).animate({ style: { 'border-color': '#092f31', 'border-width': 6 } }, { duration: 260 });
  }
  kg$('kg-status').textContent = `${visibleNodes.length} nodes · ${visibleEdges.length} typed relationships · select a line for evidence · double-click a node to refocus`;
  showNodeDetail(kg.focusId);
  updateNavigation();
  updateConceptShortcuts();
}

function clearHighlight() {
  if (!kg.cy) return;
  kg.cy.elements().removeClass('kg-muted kg-neighbor kg-edge-selected');
  if (!kg$('kg-edge-labels').checked) kg.cy.edges().removeClass('kg-label-visible');
}

function highlightElement(element) {
  clearHighlight();
  kg.cy.elements().addClass('kg-muted');
  if (element.isNode()) {
    element.removeClass('kg-muted').addClass('kg-neighbor');
    element.connectedEdges().removeClass('kg-muted');
    element.neighborhood('node').removeClass('kg-muted').addClass('kg-neighbor');
  } else {
    element.removeClass('kg-muted').addClass('kg-edge-selected kg-label-visible');
    element.connectedNodes().removeClass('kg-muted').addClass('kg-neighbor');
  }
}

function showNodeDetail(id) {
  const node = kg.graph.nodes.find(item => item.id === id);
  if (!node) return;
  kg.selectedId = id;
  const cyNode = kg.cy.$id(id);
  if (cyNode.length) { kg.cy.$(':selected').unselect(); cyNode.select(); highlightElement(cyNode); }
  const visibleIds = new Set(kg.cy.nodes().map(item => item.id()));
  const connected = kg.graph.edges.filter(edge => (edge.source === id || edge.target === id) && visibleIds.has(edge.source) && visibleIds.has(edge.target));
  const facts = node.data || {};
  const preferredFacts = [
    ['Official name', facts.officialIndicatorName], ['Object type', facts.objectType], ['Measure', facts.measureType], ['Scale', facts.scaleDisplay],
    ['Formula', facts.normalizedFormula], ['Denominator', facts.denominatorPopulation], ['Programme component', facts.programmeComponent || facts.component],
    ['Lowest level', facts.lowestReportingLevel], ['Source', facts.source || facts.sourceName], ['Version', facts.sourceVersion || facts.version],
    ['Review status', facts.status || facts.versionStatus], ['Mapping direction', facts.mappingDirection]
  ].filter(([, value]) => value);
  const neighbors = connected.slice(0, 12).map(edge => {
    const neighborId = edge.source === id ? edge.target : edge.source;
    const neighbor = kg.graph.nodes.find(item => item.id === neighborId);
    return `<button type="button" data-kg-node="${kgEsc(neighborId)}"><b>${kgEsc(kgShort(neighbor?.label || neighborId, 72))}</b><small>${kgEsc(edge.label)} · ${kgEsc(edge.assertionStatus)}</small></button>`;
  }).join('');
  kg$('kg-detail').innerHTML = `<p class="eyebrow">Selected node</p><div class="kg-type-chip">${kgEsc(node.type.replace(/([a-z])([A-Z])/g, '$1 $2'))}</div><h3>${kgEsc(node.label)}</h3><p>${kgEsc(node.description || 'No additional description supplied.')}</p><dl>${preferredFacts.map(([label, value]) => `<div><dt>${kgEsc(label)}</dt><dd>${kgEsc(value)}</dd></div>`).join('')}</dl>${neighbors ? `<div class="kg-relations"><strong>Visible connections</strong><div class="kg-neighbor-list">${neighbors}</div></div>` : ''}${id !== kg.focusId ? '<button id="kg-refocus" class="kg-secondary">Explore from this node</button>' : ''}${node.url ? `<a class="kg-source-link" href="${kgEsc(node.url)}" target="_blank" rel="noreferrer">Open official source ↗</a>` : ''}`;
  animateDetail();
  kg$('kg-refocus')?.addEventListener('click', () => setFocus(id));
  kg$('kg-detail').querySelectorAll('[data-kg-node]').forEach(button => button.addEventListener('click', () => showNodeDetail(button.dataset.kgNode)));
}

function showEdgeDetail(id) {
  const edge = kg.graph.edges.find(item => item.id === id);
  if (!edge) return;
  const cyEdge = kg.cy.$id(id);
  if (cyEdge.length) highlightElement(cyEdge);
  const source = kg.graph.nodes.find(node => node.id === edge.source);
  const target = kg.graph.nodes.find(node => node.id === edge.target);
  const reviewed = edge.predicate === 'manifestationOf';
  const facts = [
    ['Predicate', edge.predicate], ['Assertion', edge.assertionStatus], ['SKOS relation', edge.mappingRelation], ['Review status', edge.reviewStatus],
    ['Comparison class', edge.comparisonClass], ['Aggregation safe', typeof edge.aggregationSafe === 'boolean' ? (edge.aggregationSafe ? 'Yes' : 'No') : 'Not assessed'],
    ['Inverse direction', edge.inverseDirection ? 'Yes' : null], ['Source page', edge.sourcePage], ['Reviewed', edge.reviewedOn]
  ].filter(([, value]) => value !== undefined && value !== null && value !== '');
  const differences = (edge.differences || []).map(item => `<li>${kgEsc(item)}</li>`).join('');
  kg$('kg-detail').innerHTML = `<p class="eyebrow">Selected relationship</p><div class="kg-type-chip ${kgEsc(edge.assertionStatus)}">${kgEsc(edge.assertionStatus)}</div><h3>${kgEsc(edge.label)}</h3><div class="kg-edge-route"><button type="button" data-kg-node="${kgEsc(edge.source)}">${kgEsc(source?.label || edge.source)}</button><span>→</span><button type="button" data-kg-node="${kgEsc(edge.target)}">${kgEsc(target?.label || edge.target)}</button></div>${edge.rationale ? `<div class="kg-review-callout"><strong>${reviewed ? 'Domain-review judgment' : 'Relationship basis'}</strong><p>${kgEsc(edge.rationale)}</p></div>` : ''}<dl>${facts.map(([label, value]) => `<div><dt>${kgEsc(label)}</dt><dd>${kgEsc(value)}</dd></div>`).join('')}</dl>${differences ? `<div class="kg-differences"><strong>Why it cannot be pooled</strong><ul>${differences}</ul></div>` : ''}${edge.sourceUrl ? `<a class="kg-source-link" href="${kgEsc(edge.sourceUrl)}" target="_blank" rel="noreferrer">Open official source ↗</a>` : ''}`;
  animateDetail();
  kg$('kg-detail').querySelectorAll('[data-kg-node]').forEach(button => button.addEventListener('click', () => showNodeDetail(button.dataset.kgNode)));
}

function animateDetail() {
  if (kg.reducedMotion) return;
  const detail = kg$('kg-detail');
  detail.classList.remove('kg-detail-enter');
  requestAnimationFrame(() => detail.classList.add('kg-detail-enter'));
}

function setFocus(id, historyAction = 'push') {
  kg.focusId = id;
  if (historyAction === 'push') {
    kg.history = kg.history.slice(0, kg.historyIndex + 1);
    if (kg.history.at(-1) !== id) kg.history.push(id);
    kg.historyIndex = kg.history.length - 1;
  }
  const option = [...kg$('kg-focus').options].find(item => item.value === id);
  if (option) kg$('kg-focus').value = id;
  renderNeighborhood();
}

function updateNavigation() {
  kg$('kg-back').disabled = kg.historyIndex <= 0;
  kg$('kg-forward').disabled = kg.historyIndex >= kg.history.length - 1;
}

function navigateHistory(delta) {
  const next = kg.historyIndex + delta;
  if (next < 0 || next >= kg.history.length) return;
  kg.historyIndex = next;
  setFocus(kg.history[next], 'history');
}

function updateConceptShortcuts() {
  kg$('kg-concept-shortcuts').querySelectorAll('button').forEach(button => button.classList.toggle('active', button.dataset.nodeId === kg.focusId));
}

function setExpanded(expanded) {
  const section = kg$('knowledge-graph');
  const button = kg$('kg-expand');
  section.classList.toggle('kg-expanded', expanded);
  document.body.classList.toggle('kg-graph-open', expanded);
  button.setAttribute('aria-pressed', String(expanded));
  button.innerHTML = expanded ? '<span aria-hidden="true">×</span> Exit expanded view' : '<span aria-hidden="true">⛶</span> Expand graph';
  window.setTimeout(() => {
    kg.cy?.resize();
    kg.cy?.fit(undefined, expanded ? 70 : 50);
  }, 80);
}

kg$('kg-focus').addEventListener('change', event => setFocus(event.target.value));
kg$('kg-programme').addEventListener('change', event => {
  kg.programmeId = event.target.value;
  populateConceptShortcuts();
  const first = kg.graph.nodes.find(node => node.type === 'IndicatorConcept' && node.data?.programmeId === kg.programmeId);
  setFocus(first?.id || kg.programmeId);
});
kg$('kg-mode').addEventListener('change', renderNeighborhood);
kg$('kg-fit').addEventListener('click', () => kg.cy?.fit(undefined, 50));
kg$('kg-expand').addEventListener('click', () => setExpanded(!kg$('knowledge-graph').classList.contains('kg-expanded')));
kg$('kg-back').addEventListener('click', () => navigateHistory(-1));
kg$('kg-forward').addEventListener('click', () => navigateHistory(1));
kg$('kg-edge-labels').addEventListener('change', event => kg.cy?.edges().toggleClass('kg-label-visible', event.target.checked));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && kg$('knowledge-graph').classList.contains('kg-expanded')) setExpanded(false);
});
