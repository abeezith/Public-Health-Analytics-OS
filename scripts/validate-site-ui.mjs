import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const assert = (condition, code, message) => { if (!condition) errors.push({ code, message }); };
const corePages = ['index.html', 'indicators/index.html', 'roadmap/index.html'];
const requiredIds = {
  'index.html': ['top', 'workspace', 'products', 'principles', 'roadmap'],
  'indicators/index.html': ['registry', 'registry-indicators', 'coverage', 'knowledge-graph', 'method', 'india', 'hmis', 'hmis-report-schemas', 'indicator-grid', 'hmis-grid', 'occurrence-grid', 'modal-backdrop'],
  'roadmap/index.html': ['query', 'sprint-filter', 'epic-filter', 'priority-filter', 'board', 'visible-count', 'ticket-total']
};

const stripTags = value => value.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
const idsFor = html => [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const htmlCache = new Map();
const readHtml = relative => {
  if (!htmlCache.has(relative)) htmlCache.set(relative, fs.readFileSync(path.join(root, relative), 'utf8'));
  return htmlCache.get(relative);
};

function resolveLocalTarget(currentFile, href) {
  const clean = href.split('?')[0];
  const [targetPath, fragment = ''] = clean.split('#');
  if (!targetPath) return { file: currentFile, fragment };
  let absolute = path.resolve(path.dirname(path.join(root, currentFile)), targetPath);
  if (targetPath.endsWith('/') || (fs.existsSync(absolute) && fs.statSync(absolute).isDirectory())) absolute = path.join(absolute, 'index.html');
  return { file: path.relative(root, absolute).replaceAll('\\', '/'), fragment };
}

for (const relative of corePages) {
  const absolute = path.join(root, relative);
  assert(fs.existsSync(absolute), 'PAGE_MISSING', `Missing core page ${relative}.`);
  if (!fs.existsSync(absolute)) continue;
  const html = readHtml(relative);
  assert(/<html[^>]+lang="en"/i.test(html), 'HTML_LANG', `${relative} must declare lang="en".`);
  assert(/<meta[^>]+name="viewport"/i.test(html), 'VIEWPORT', `${relative} is missing its viewport meta tag.`);
  assert(/<title>[^<]+<\/title>/i.test(html), 'PAGE_TITLE', `${relative} is missing a non-empty title.`);
  assert(/<main\b/i.test(html), 'MAIN_LANDMARK', `${relative} is missing a main landmark.`);
  const ids = idsFor(html);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  assert(!duplicates.length, 'DUPLICATE_ID', `${relative} has duplicate IDs: ${duplicates.join(', ')}.`);
  for (const id of requiredIds[relative]) assert(ids.includes(id), 'REQUIRED_UI_ID', `${relative} is missing #${id}.`);

  for (const match of html.matchAll(/<(?:input|select|textarea)\b[^>]*>/gi)) {
    const tag = match[0];
    const id = tag.match(/\bid="([^"]+)"/i)?.[1];
    const labelled = /\baria-label="[^"]+"/i.test(tag) || /\baria-labelledby="[^"]+"/i.test(tag);
    const withinLabel = id && new RegExp(`<label[^>]*>[\\s\\S]*?\\bid="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?<\\/label>`, 'i').test(html);
    assert(labelled || withinLabel, 'CONTROL_LABEL', `${relative} control ${id || tag.slice(0, 45)} has no accessible label.`);
  }
  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const attributes = match[1];
    const text = stripTags(match[2]);
    assert(Boolean(text) || /\baria-label="[^"]+"/i.test(attributes), 'BUTTON_NAME', `${relative} contains a button without an accessible name.`);
  }
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) assert(/\balt="[^"]*"/i.test(match[0]), 'IMAGE_ALT', `${relative} contains an image without alt text.`);
  assert(!/<[^>]+\bdownload(?:\s|=|>)/i.test(html), 'DOWNLOAD_CONTROL', `${relative} contains a public download attribute.`);
  assert(!/<(?:button|a)\b[^>]*>\s*(?:<[^>]+>\s*)*Download\b/i.test(html), 'DOWNLOAD_CONTROL', `${relative} contains a public Download control.`);

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/gi)) {
    const value = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(value)) continue;
    const { file, fragment } = resolveLocalTarget(relative, value);
    assert(fs.existsSync(path.join(root, file)), 'LOCAL_LINK', `${relative} points to missing ${value} (${file}).`);
    if (fragment && fs.existsSync(path.join(root, file)) && file.endsWith('.html')) {
      const targetIds = idsFor(readHtml(file));
      assert(targetIds.includes(decodeURIComponent(fragment)), 'FRAGMENT_LINK', `${relative} points to missing #${fragment} in ${file}.`);
    }
  }
}

const indicatorsHtml = readHtml('indicators/index.html');
const model = JSON.parse(fs.readFileSync(path.join(root, 'indicators/data/registry/unified-read-model.json'), 'utf8'));
const expectedText = [
  ['indicator count', String(model.counts.canonicalObjectTypes.Indicator)],
  ['HMIS object count', String(model.counts.registryMemberships.hmis)],
  ['occurrence count', String(model.counts.reportColumnOccurrences)]
];
for (const [label, value] of expectedText) assert(indicatorsHtml.includes(`>${Number(value).toLocaleString('en-US')}<`) || indicatorsHtml.includes(`>${value}<`), 'STATIC_COUNT', `Indicator page does not expose the current ${label} ${value}.`);

for (const relative of ['indicators/app.js', 'indicators/hmis.js', 'indicators/graph.js', 'indicators/report-schemas.js']) {
  const result = spawnSync(process.execPath, ['--check', relative], { cwd: root, encoding: 'utf8' });
  assert(result.status === 0, 'JAVASCRIPT_SYNTAX', `${relative} failed syntax check: ${(result.stderr || result.stdout || '').trim()}`);
}

const report = {
  status: errors.length ? 'fail' : 'pass',
  pagesChecked: corePages.length,
  requiredUiIds: Object.values(requiredIds).flat().length,
  staticCounts: Object.fromEntries(expectedText),
  javascriptFilesChecked: 4,
  publicDownloadControls: 'disabled',
  warnings,
  errors
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
