const schemaRoot = document.getElementById('hmis-report-schemas');

if (schemaRoot) {
  fetch('./data/hmis/report-schemas/index.json?v=hmis-1.4-candidate', {cache: 'no-store'})
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(payload => renderReportSchemas(payload.schemas || []))
    .catch(() => {
      document.getElementById('schema-content').innerHTML = '<div class="empty-state"><h3>Report-schema data could not be loaded</h3><p>The HMIS registry remains available above; reload to retry this candidate layer.</p></div>';
    });
}

function schemaEscape(value = '') {
  const node = document.createElement('div');
  node.textContent = String(value);
  return node.innerHTML;
}

function renderReportSchemas(schemas) {
  const target = document.getElementById('schema-content');
  if (!schemas.length) {
    target.innerHTML = '<div class="empty-state"><h3>No observed report schemas</h3><p>No schema package is included in this release.</p></div>';
    return;
  }
  target.innerHTML = schemas.map(schema => {
    const c = schema.counts || {};
    return `<article class="schema-record">
      <div class="schema-heading"><div><span class="schema-state">${schemaEscape(schema.state)} · observed ${schemaEscape(schema.downloadDate)}</span><h3>${schemaEscape(schema.title)}</h3><p>${schemaEscape(schema.schemaId)}</p></div><span class="qa-pass">QA ${schema.qaPassed ? 'passed' : 'review'}</span></div>
      <div class="schema-metrics">
        <div><strong>${c.totalColumns}</strong><span>columns</span></div><div><strong>${c.dimensions}</strong><span>dimensions</span></div><div><strong>${c.measureOccurrences}</strong><span>measures</span></div><div><strong>${c.canonicalLinks}</strong><span>canonical links</span></div><div><strong>${c.candidateNewFields}</strong><span>held candidates</span></div><div><strong>${c.canonicalElementsNotObserved}</strong><span>not observed</span></div><div><strong>${c.schemaSpecificCodeOccurrences}</strong><span>new code occurrences</span></div><div><strong>${c.derivedIndicatorsAssessed}</strong><span>indicators assessed</span></div>
      </div>
      <div class="schema-boundary"><strong>Interpretation boundary</strong><p>${schemaEscape(schema.interpretationBoundary)}</p></div>
      <div class="schema-decisions"><div><b>508 links</b><span>471 exact labels, 34 controlled equivalents and 3 reviewed aliases</span></div><div><b>17 candidates held</b><span>No automatic promotion to the canonical 700-element dictionary</span></div><div><b>Row-dependent applicability</b><span>Facility, format and outreach context require data rows</span></div></div>
      <p class="schema-access-note">Interactive review only · download options disabled</p>
    </article>`;
  }).join('');
}
