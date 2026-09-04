const kg = { graph: null, cy: null, focusId: 'IND-UIP3-003', selectedId: null };
const kg$ = id => document.getElementById(id);
const kgEsc = (value = '') => {
  const div = document.createElement('div');
  div.textContent = String(value);
  return div.innerHTML;
};

const modePredicates = {
  lineage: new Set(['definedBy', 'publishedBy', 'manifestationOf']),
  computation: new Set(['manifestationOf', 'hasMeasureType', 'usesDataElement', 'relatedHmisObject', 'relatedIndicator']),
  programme: new Set(['partOfProgramme', 'hasProgrammeComponent', 'supportsBuildingBlock', 'lowestReportingLevel', 'limitsCompletenessOf']),
  all: null
};

fetch('./data/graph/graph.json?v=kg-0.1.1', { cache: 'no-store' })
  .then(response => response.json())
  .then(graph => {
    kg.graph = graph;
    kg$('kg-node-count').textContent = graph.metadata.counts.nodes;
    kg$('kg-edge-count').textContent = graph.metadata.counts.edges;
    kg$('kg-concept-count').textContent = graph.metadata.counts.concepts;
    populateFocus(graph.nodes);
    initializeGraph();
    renderNeighborhood();
  })
  .catch(() => {
    kg$('kg-canvas').innerHTML = '<div class="empty-state"><h3>Knowledge graph could not be loaded</h3><p>The registry remains available above. Reload the page or verify the graph release files.</p></div>';
  });

function populateFocus(nodes) {
  const select = kg$('kg-focus');
  const groups = [
    ['IndicatorConcept', 'Curated concepts'],
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

function initializeGraph() {
  kg.cy = cytoscape({
    container: kg$('kg-canvas'),
    elements: [],
    minZoom: 0.35,
    maxZoom: 2.2,
    style: [
      { selector: 'node', style: { 'label': 'data(label)', 'font-family': 'Arial, sans-serif', 'font-size': 10, 'text-wrap': 'ellipsis', 'text-max-width': 105, 'text-valign': 'bottom', 'text-margin-y': 8, 'color': '#243d3f', 'background-color': '#78908d', 'width': 30, 'height': 30, 'border-width': 2, 'border-color': '#f8faf7' } },
      { selector: 'node[type="IndicatorManifestation"]', style: { 'background-color': '#087f71', 'shape': 'ellipse', 'width': 38, 'height': 38 } },
      { selector: 'node[type="IndicatorConcept"]', style: { 'background-color': '#bc7b19', 'shape': 'diamond', 'width': 46, 'height': 46 } },
      { selector: 'node[type="HmisObject"]', style: { 'background-color': '#47758f', 'shape': 'round-rectangle', 'width': 36, 'height': 30 } },
      { selector: 'node[type="SourceDocument"]', style: { 'background-color': '#6c5c87', 'shape': 'rectangle', 'width': 34, 'height': 34 } },
      { selector: 'node[type="Organization"]', style: { 'background-color': '#45565a', 'shape': 'hexagon' } },
      { selector: 'node[type="Programme"]', style: { 'background-color': '#9b5149', 'shape': 'star', 'width': 44, 'height': 44 } },
      { selector: 'node[type="ProgrammeComponent"]', style: { 'background-color': '#7b6b3e', 'shape': 'round-rectangle' } },
      { selector: 'node[type="WHOBuildingBlock"]', style: { 'background-color': '#648458', 'shape': 'hexagon' } },
      { selector: 'node[type="ReportingLevel"]', style: { 'background-color': '#7c756b', 'shape': 'triangle' } },
      { selector: 'node[type="MeasureType"]', style: { 'background-color': '#5f739b', 'shape': 'tag' } },
      { selector: 'node[type="EvidenceGap"]', style: { 'background-color': '#b24b49', 'shape': 'vee' } },
      { selector: 'node[focus = "true"]', style: { 'border-width': 5, 'border-color': '#092f31', 'width': 54, 'height': 54, 'font-size': 12, 'font-weight': 700, 'text-max-width': 150 } },
      { selector: 'node:selected', style: { 'border-width': 5, 'border-color': '#d6a13c' } },
      { selector: 'edge', style: { 'width': 1.4, 'line-color': '#9fb0ad', 'target-arrow-color': '#9fb0ad', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'arrow-scale': 0.75, 'label': 'data(label)', 'font-size': 8, 'color': '#5d6b6b', 'text-background-color': '#f7faf7', 'text-background-opacity': 0.88, 'text-background-padding': 2, 'text-rotation': 'autorotate' } },
      { selector: 'edge[assertionStatus="official"]', style: { 'line-color': '#345e5a', 'target-arrow-color': '#345e5a', 'width': 2 } },
      { selector: 'edge[predicate="manifestationOf"]', style: { 'line-color': '#bc7b19', 'target-arrow-color': '#bc7b19', 'width': 2.5 } },
      { selector: 'edge[predicate="usesDataElement"]', style: { 'line-color': '#47758f', 'target-arrow-color': '#47758f', 'width': 2 } },
      { selector: 'edge[assertionStatus="normalized"]', style: { 'line-style': 'dashed' } }
    ]
  });
  kg.cy.on('tap', 'node', event => showNodeDetail(event.target.id()));
  kg.cy.on('dbltap', 'node', event => setFocus(event.target.id()));
}

function renderNeighborhood() {
  if (!kg.graph || !kg.cy) return;
  const mode = kg$('kg-mode').value;
  const allowed = modePredicates[mode];
  const direct = kg.graph.edges.filter(edge => (edge.source === kg.focusId || edge.target === kg.focusId) && (!allowed || allowed.has(edge.predicate)));
  const edgeSet = new Map(direct.slice(0, 80).map(edge => [edge.id, edge]));
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
    for (const edge of kg.graph.edges.filter(item => conceptIds.includes(item.target) && item.predicate === 'manifestationOf').slice(0, 35)) {
      edgeSet.set(edge.id, edge); nodeSet.add(edge.source);
    }
  }
  for (const edge of kg.graph.edges) {
    if (nodeSet.has(edge.source) && nodeSet.has(edge.target) && (!allowed || allowed.has(edge.predicate))) edgeSet.set(edge.id, edge);
  }

  const visibleNodes = kg.graph.nodes.filter(node => nodeSet.has(node.id));
  const visibleEdges = [...edgeSet.values()];
  const elements = [
    ...visibleNodes.map(node => ({ group: 'nodes', data: { id: node.id, label: node.label, type: node.type, focus: String(node.id === kg.focusId), description: node.description } })),
    ...visibleEdges.map(edge => ({ group: 'edges', data: { id: edge.id, source: edge.source, target: edge.target, label: edge.label, predicate: edge.predicate, assertionStatus: edge.assertionStatus } }))
  ];
  kg.cy.elements().remove();
  kg.cy.add(elements);
  const layout = visibleNodes.length <= 25
    ? { name: 'breadthfirst', roots: kg.cy.$id(kg.focusId), directed: false, circle: false, spacingFactor: 1.25, animate: false, fit: true, padding: 55 }
    : { name: 'cose', animate: false, fit: true, padding: 45, nodeRepulsion: 8500, idealEdgeLength: 105, gravity: 0.55 };
  kg.cy.layout(layout).run();
  kg$('kg-status').textContent = `${visibleNodes.length} nodes and ${visibleEdges.length} typed relationships shown · double-click a node to explore from it`;
  showNodeDetail(kg.focusId);
}

function showNodeDetail(id) {
  const node = kg.graph.nodes.find(item => item.id === id);
  if (!node) return;
  kg.selectedId = id;
  const connected = kg.graph.edges.filter(edge => edge.source === id || edge.target === id);
  const relationSummary = [...new Set(connected.map(edge => `${edge.label} (${edge.assertionStatus})`))].slice(0, 8);
  const facts = node.data || {};
  const preferredFacts = [
    ['Official name', facts.officialIndicatorName],
    ['Object type', facts.objectType],
    ['Measure', facts.measureType],
    ['Scale', facts.scaleDisplay],
    ['Formula', facts.normalizedFormula],
    ['Denominator', facts.denominatorPopulation],
    ['Programme component', facts.programmeComponent || facts.component],
    ['Lowest level', facts.lowestReportingLevel],
    ['Source', facts.source || facts.sourceName],
    ['Version', facts.sourceVersion || facts.version],
    ['Status', facts.status || facts.versionStatus],
    ['Priority', facts.priority]
  ].filter(([, value]) => value);
  kg$('kg-detail').innerHTML = `<p class="eyebrow">${kgEsc(node.type.replace(/([a-z])([A-Z])/g, '$1 $2'))}</p><h3>${kgEsc(node.label)}</h3><p>${kgEsc(node.description || 'No additional description supplied.')}</p><dl>${preferredFacts.map(([label, value]) => `<div><dt>${kgEsc(label)}</dt><dd>${kgEsc(value)}</dd></div>`).join('')}</dl><div class="kg-relations"><strong>Connected through</strong><p>${kgEsc(relationSummary.join(' · ') || 'No visible relationships in this view')}</p></div>${id !== kg.focusId ? '<button id="kg-refocus" class="kg-secondary">Explore from this node</button>' : ''}${node.url ? `<a class="kg-source-link" href="${kgEsc(node.url)}" target="_blank" rel="noreferrer">Open source ↗</a>` : ''}`;
  kg$('kg-refocus')?.addEventListener('click', () => setFocus(id));
}

function setFocus(id) {
  kg.focusId = id;
  const option = [...kg$('kg-focus').options].find(item => item.value === id);
  if (option) kg$('kg-focus').value = id;
  renderNeighborhood();
}

kg$('kg-focus').addEventListener('change', event => setFocus(event.target.value));
kg$('kg-mode').addEventListener('change', renderNeighborhood);
kg$('kg-fit').addEventListener('click', () => kg.cy?.fit(undefined, 45));
