import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputIndex = process.argv.indexOf('--output');
const outputRelative = outputIndex >= 0 ? process.argv[outputIndex + 1] : 'artifacts/release-validation-report.json';
const outputPath = path.resolve(root, outputRelative);
const started = Date.now();
const command = (label, script) => ({ label, executable: process.execPath, args: [script] });
const checks = [
  command('Versioned schema contracts', 'scripts/validate-schema-contracts.mjs'),
  command('Metadata-quality profile', 'scripts/validate-metadata-quality.mjs'),
  command('Canonical identity and lifecycle', 'scripts/validate-unified-identities.mjs'),
  command('Unified read model and relationships', 'scripts/validate-unified-read-model.mjs'),
  command('Observation-ready publication boundary', 'scripts/validate-observation-model.mjs'),
  command('Measure, formula, scale and denominator rules', 'scripts/validate-measure-normalization.mjs'),
  command('Static UI, links and accessibility contract', 'scripts/validate-site-ui.mjs'),
  command('Controlled invalid-fixture rejection', 'scripts/test-release-gate.mjs')
];

const run = check => {
  const checkStarted = Date.now();
  const result = spawnSync(check.executable, check.args, { cwd: root, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  return {
    label: check.label,
    command: `node ${check.args.join(' ')}`,
    status: result.status === 0 ? 'pass' : 'fail',
    exitCode: result.status,
    durationMs: Date.now() - checkStarted,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim()
  };
};

const results = checks.map(run);
const git = args => spawnSync('git', args, { cwd: root, encoding: 'utf8' }).stdout?.trim() || 'unavailable';
const sha256 = relative => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex');
const trackedInputs = [
  'indicators/data/registry/unified-read-model.json',
  'indicators/data/registry/manifest.json',
  'indicators/data/governance/unified-identity-index.json',
  'indicators/data/governance/metadata-quality-profile.json',
  'indicators/data/governance/validation-exceptions.json',
  'indicators/data/observations/manifest.json',
  'indicators/data/schemas/1.1.0/manifest.json',
  'index.html',
  'indicators/index.html',
  'indicators/app.js',
  'indicators/hmis.js',
  'indicators/graph.js',
  'indicators/report-schemas.js',
  'indicators/styles.css',
  'roadmap/index.html'
];
const model = JSON.parse(fs.readFileSync(path.join(root, 'indicators/data/registry/unified-read-model.json'), 'utf8'));
const schemaManifest = JSON.parse(fs.readFileSync(path.join(root, 'indicators/data/schemas/1.1.0/manifest.json'), 'utf8'));
const status = results.every(result => result.status === 'pass') ? 'pass' : 'fail';
const report = {
  metadata: {
    id: 'PHAOS-RELEASE-VALIDATION-REPORT',
    gateVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    commitSha: git(['rev-parse', 'HEAD']),
    branch: git(['branch', '--show-current']),
    status,
    durationMs: Date.now() - started
  },
  releaseBoundary: {
    canonicalObjects: model.records.length,
    representations: model.records.reduce((sum, record) => sum + record.representations.length, 0),
    indicatorMemberships: model.counts.registryMemberships.indicator,
    hmisMemberships: model.counts.registryMemberships.hmis,
    reportOccurrences: model.occurrences.length,
    schemaPackageVersion: schemaManifest.version,
    publicBulkDownloadControls: 'disabled',
    aggregateObservations: 0,
    referenceValues: 0
  },
  inputChecksums: Object.fromEntries(trackedInputs.map(relative => [relative, sha256(relative)])),
  checks: results,
  interpretation: 'A passing gate proves structural and regression checks for the declared release. It does not imply source-custodian approval, semantic equivalence, computability or clinical validity.'
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status, report: path.relative(root, outputPath).replaceAll('\\', '/'), checks: Object.fromEntries(results.map(result => [result.label, result.status])), durationMs: report.metadata.durationMs }, null, 2));
if (status !== 'pass') process.exitCode = 1;

