import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const model = read('indicators/data/governance/provenance-model.json');
const manifest = read('indicators/data/provenance/manifest.json');
const reviews = read('indicators/data/provenance/review-events.json').events || [];
const changes = read('indicators/data/provenance/change-events.json').events || [];
const registry = read('indicators/data/registry/unified-read-model.json');
const errors = [];
const assert = (condition, code, message) => { if (!condition) errors.push({code,message}); };
const date = /^\d{4}-\d{2}-\d{2}$/;
const subjects = new Map((registry.records || []).map(record => [record.canonicalObjectId,record]));
const unique = (items,key,label) => {
  const values = items.map(item => item[key]);
  assert(values.length === new Set(values).size, 'DUPLICATE_EVENT_ID', `Duplicate ${label} ID.`);
};

assert(model.id === 'PHAOS-PROVENANCE-001' && model.version === '1.0.0', 'MODEL_VERSION', 'Unexpected provenance model.');
assert(manifest.schemaPackage === '1.2.0', 'SCHEMA_PACKAGE', 'Provenance release must use schema package 1.2.0.');
assert(manifest.appendOnly === true, 'APPEND_ONLY', 'Provenance release must be append-only.');
assert(reviews.length === 10 && changes.length === 10, 'PILOT_COUNT', 'Expected ten review and ten change events.');
unique(reviews,'id','review event');
unique(changes,'id','change event');

for (const event of reviews) {
  assert(subjects.has(event.subjectId), 'UNKNOWN_SUBJECT', `${event.id} references unknown ${event.subjectId}.`);
  assert(model.reviewTypes.includes(event.reviewType), 'REVIEW_TYPE', `${event.id} has invalid review type.`);
  assert(model.reviewStatuses.includes(event.status), 'REVIEW_STATUS', `${event.id} has invalid review status.`);
  assert(date.test(event.sourceAccessedOn) && date.test(event.reviewedOn), 'REVIEW_DATES', `${event.id} has invalid dates.`);
  assert(event.sourceAccessedOn <= event.reviewedOn, 'DATE_ORDER', `${event.id} predates source access.`);
  assert(Boolean(event.reviewer?.role || event.reviewer?.name), 'REVIEWER', `${event.id} lacks reviewer role/name.`);
  assert(Boolean(event.method && event.reason && event.reviewedFields?.length), 'REVIEW_DETAIL', `${event.id} lacks method, reason or fields.`);
  assert(event.publicIdentityPolicy === 'role-only' ? Boolean(event.reviewer?.role) : true, 'ROLE_ONLY', `${event.id} violates role-only policy.`);
}
for (const event of changes) {
  assert(subjects.has(event.subjectId), 'UNKNOWN_SUBJECT', `${event.id} references unknown ${event.subjectId}.`);
  assert(model.changeStatuses.includes(event.status), 'CHANGE_STATUS', `${event.id} has invalid status.`);
  assert(model.versionScopes.includes(event.versionScope), 'VERSION_SCOPE', `${event.id} has invalid version scope.`);
  assert(Boolean(event.actor?.role || event.actor?.name), 'CHANGE_ACTOR', `${event.id} lacks actor.`);
  assert(Boolean(event.method && event.reason && event.changedFields?.length), 'CHANGE_DETAIL', `${event.id} lacks method, reason or fields.`);
  assert(event.versionBefore !== event.versionAfter, 'VERSION_CHANGE', `${event.id} does not advance a version.`);
}

const reviewSubjects = new Set(reviews.map(event => event.subjectId));
const changeSubjects = new Set(changes.map(event => event.subjectId));
assert(reviewSubjects.size === 10 && changeSubjects.size === 10, 'SUBJECT_COUNT', 'Pilot must cover ten distinct subjects.');
assert([...reviewSubjects].every(id => changeSubjects.has(id)), 'SUBJECT_PARITY', 'Review/change subject sets differ.');
assert(new Set(reviews.map(event => event.reviewer.role)).size >= 2, 'REVIEWER_ROLE_DIVERSITY', 'Pilot needs at least two reviewer roles.');
for (const id of reviewSubjects) {
  const summary = subjects.get(id)?.provenance;
  assert(Boolean(summary), 'READ_MODEL_SUMMARY', `${id} lacks read-model provenance summary.`);
  assert(summary?.reviewEventIds?.some(eventId => reviews.some(event => event.id === eventId)), 'REVIEW_LINK', `${id} lacks review-event link.`);
  assert(summary?.changeEventIds?.some(eventId => changes.some(event => event.id === eventId)), 'CHANGE_LINK', `${id} lacks change-event link.`);
}

const report = {status:errors.length?'fail':'pass',model:model.id,modelVersion:model.version,schemaPackage:manifest.schemaPackage,reviewEvents:reviews.length,changeEvents:changes.length,subjects:reviewSubjects.size,reviewerRoles:new Set(reviews.map(event=>event.reviewer.role)).size,errors};
console.log(JSON.stringify(report,null,2));
if (errors.length) process.exitCode = 1;
