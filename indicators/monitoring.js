const monitoringEsc=value=>{const node=document.createElement('div');node.textContent=String(value??'');return node.innerHTML;};
Promise.all([
  fetch('./data/monitoring/source-snapshots.json?v=trust-07-1.0.0',{cache:'no-store'}).then(response=>response.json()),
  fetch('./data/monitoring/review-queue.json?v=trust-07-1.0.0',{cache:'no-store'}).then(response=>response.json())
]).then(([release,queue])=>{
  const counts=release.counts,pilot=release.snapshots.filter(item=>item.pilotLiveProbe);
  document.getElementById('monitor-source-count').textContent=counts.declaredSources;
  document.getElementById('monitor-linked-count').textContent=counts.sourcesWithRegistryRecords;
  document.getElementById('monitor-pilot-count').textContent=counts.pilotSources;
  document.getElementById('monitor-queue-count').textContent=queue.counts.open;
  document.getElementById('monitor-pilot-rows').innerHTML=pilot.map(item=>`<tr><td><strong>${monitoringEsc(item.sourceName)}</strong><small>${monitoringEsc(item.sourceId)}</small></td><td><span class="monitor-state state-${monitoringEsc(item.linkState)}">${monitoringEsc(item.linkState)}</span><small>${item.httpStatus?`HTTP ${monitoringEsc(item.httpStatus)}`:'No HTTP result'}</small></td><td>${monitoringEsc(item.comparisonState)}</td><td>${item.affectedRecordIds.length.toLocaleString()}</td><td>${monitoringEsc(item.observedOn)}</td></tr>`).join('');
  const queueElement=document.getElementById('monitor-review-queue');
  queueElement.innerHTML=queue.items.length?queue.items.map(item=>`<article><span>${monitoringEsc(item.severity)}</span><h4>${monitoringEsc(item.sourceName)}</h4><p>${monitoringEsc(item.changeState)} · ${item.affectedRecordIds.length} affected records</p><strong>${monitoringEsc(item.disposition)}</strong></article>`).join(''):'<div class="monitor-empty"><strong>No production change asserted at baseline</strong><p>The first observation establishes fingerprints; it cannot prove that meaning is unchanged. Future weekly probe artifacts create human-review items for redirects, access loss, content or declared-version changes.</p></div>';
}).catch(()=>{document.getElementById('monitor-review-queue').innerHTML='<div class="monitor-empty"><strong>Monitoring data unavailable</strong><p>Reload the page or inspect the governed monitoring artifacts.</p></div>';});
