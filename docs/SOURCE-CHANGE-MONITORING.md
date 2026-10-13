# Governed source-change monitoring

**Control:** `PHAOS-SOURCE-MONITORING-001`
**Version:** 1.0.0
**Task:** `TRUST-07` / Sprint 2 `MON-01..MON-02`
**Release:** Analytics-OS 4.0

## Operating model

The complete 43-source catalogue receives metadata and declared-version fingerprints. Five sources form the initial live-probe pilot. A weekly GitHub Actions workflow records initial/final URL, access state, HTTP status and a SHA-256 prefix-content fingerprint as a retained artifact. It then compares the observation with the released baseline and creates a machine-readable human-review queue.

The workflow has read-only repository permission. It cannot commit, open issues, alter source records or rewrite indicator names, definitions, formulas or mappings.

## Interpretation rules

- HTTP success is an access observation, never proof of unchanged meaning.
- Redirect, content change, declared-version change, combined change, access loss and indeterminate evidence are distinct states.
- The first comparable observation establishes a baseline and never creates a change claim.
- A review item identifies the source, prior/current fingerprint, detection date, severity, disposition and affected canonical records.
- Human disposition is required before any governed record change.
- Content hashing covers at most the first 2 MiB and is explicitly labelled as a prefix fingerprint.

## Initial baseline

The first production baseline covers 43 source families, of which 29 are linked to registry records. Five sources were live-probed on 13 October 2026: three were accessible, while two returned distinct HTTP access errors. These access states are baseline evidence, not semantic-change claims; therefore the initial production review queue contains zero items.

Controlled fixtures independently prove two unchanged sources and three review-producing states: content change, redirect and inaccessible source.
