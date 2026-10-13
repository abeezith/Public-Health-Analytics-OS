# Entry-level provenance and change events

**Control:** `PHAOS-PROVENANCE-001`
**Version:** 1.0.0
**Task:** `TRUST-05` / Sprint 2 `PROV-01..PROV-04`
**Release:** Analytics-OS 3.9

## Purpose

The registry now separates record-level review evidence from source authority. Ten balanced canonical records across global, India programme and HMIS layers carry append-only review and change events. Their detail views expose status, review type, reviewer role, review and source-access dates, method, fields, reason, findings and event identifiers.

## Pilot boundary

- 10 canonical subjects, 10 review events and 10 change events.
- Three reviewer roles; public identity defaults to role-only.
- Official/source names, definitions and formulas are unchanged.
- Each change event adds a provenance summary to representation 1.4.0; it does not claim a source or business-version change.
- A published review does not imply source-custodian approval, computability, semantic equivalence or clinical validity.
- Records outside the pilot explicitly show that entry-level review history is not yet published.

## Contracts and validation

Schema package 1.2.0 strengthens `review-event` and `change-event` requirements while retaining earlier packages as immutable historical contracts. `validate-provenance.mjs` checks subject resolution, dates, status, reviewer-role diversity, append-only policy, version transitions and read-model parity. `validate-verification-queue.mjs` fixture-tests unresolved-language detection across definition, caveat, currentness and source fields.

`TRUST-07` now monitors source fingerprints and creates human review items. It never rewrites registry records automatically.
