import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = spawnSync(process.execPath, ['scripts/validate-measure-normalization.mjs', '--fixture', 'scripts/fixtures/invalid-percentage.json'], { cwd: root, encoding: 'utf8' });
const combined = `${result.stdout || ''}\n${result.stderr || ''}`;
const expectedCodes = ['PERCENT_SCALE', 'PERCENT_FORMULA', 'PERCENT_DENOMINATOR', 'PERCENT_DISPLAY_DENOMINATOR'];
const missingCodes = expectedCodes.filter(code => !combined.includes(code));
if (result.status === 0 || missingCodes.length) {
  console.error(JSON.stringify({ status: 'fail', validatorExitCode: result.status, missingExpectedErrorCodes: missingCodes }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: 'pass', assertion: 'Controlled invalid percentage metadata was rejected.', validatorExitCode: result.status, expectedErrorCodes: expectedCodes }, null, 2));

