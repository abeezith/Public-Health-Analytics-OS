# TRUST-05 UAT record

**Release:** 3.9
**Read model:** 1.4.0
**Schema package:** 1.2.0

## Acceptance evidence

- [x] Ten pilot subjects resolve across global, India programme and HMIS layers.
- [x] Ten review events and ten append-only change events validate.
- [x] At least two independent reviewer roles are present; three are published.
- [x] Official/source wording remains unchanged.
- [x] Indicator and HMIS detail views show review status, reviewer role, method, separate review/source-access dates, reviewed fields, reason, findings and event IDs.
- [x] Non-pilot detail views explicitly show that review history is not yet published.
- [x] UI states that Analytics-OS review does not imply custodian approval, authority or computability.
- [x] Verification-extractor fixtures flag known unresolved language and leave the clean fixture unflagged.
- [x] Schema, provenance, read-model, UI and integrated ten-check release validators pass.
- [x] Local browser UAT passes for reviewed indicator, non-pilot pending state and reviewed HMIS object.
- [x] Narrow-layout check shows a single-column provenance grid with no page overflow; browser console has no warnings or errors.
- [x] GitHub Actions run `38293721641` passed and deployed commit `6d64316`; live Release 3.9 footer, versioned scripts and reviewed-indicator provenance were smoke-tested with zero browser warnings or errors.

## Browser scenarios

1. Open `PRI-0001`; confirm the governed review panel and role-only reviewer disclosure.
2. Open `PRI-0004`; confirm explicit pending review history.
3. Open `HMIS-DE-0003`; confirm the HMIS record displays the same provenance contract.
4. Check desktop and narrow viewport readability, modal scrolling and source/navigation actions.

Passing UAT establishes internal traceability only. It does not establish source-custodian approval or computability.
