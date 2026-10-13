# UTILITY-01 UAT record

**Release:** 4.1

**Read model:** 1.5.0

**Operational discovery model:** `PHAOS-OPDISC-001` 1.0.0

## Acceptance evidence

- [x] All 4,743 canonical objects carry a governed operational-discovery profile.
- [x] Frequency, cadre, data availability, review status, lifecycle and computability use controlled values.
- [x] `Not stated`, `Unknown` and `Review pending` semantics are retained rather than dropped.
- [x] Source frequency and responsible-cadre wording remain visible beside normalized values.
- [x] No record claims validated computability or custodian approval.
- [x] Data availability explicitly states that Analytics-OS publishes metadata and zero observed health values.
- [x] Indicator cards, table rows and detail views expose the operational profile; HMIS cards and details expose the same canonical profile.
- [x] Operational filters participate in result counts, active-filter summaries, clear-all behavior and URL state.
- [x] Desktop browser UAT confirms filtering, URL-state restoration, clear-all behavior, table presentation, indicator/HMIS detail profiles, home navigation and roadmap status.
- [x] Narrow-viewport UAT confirms no horizontal overflow at the in-app browser's 666 px minimum viewport; responsive rules are also covered by the static UI gate.
- [x] Integrated release gate passes all 12 checks.
- [ ] GitHub Actions deployment and live smoke test recorded after publication.

Passing UAT proves controlled discovery and filtering. It does not prove that an upstream operational system contains data, that a formula implementation is correct, or that a source custodian has approved an Analytics-OS normalization.
