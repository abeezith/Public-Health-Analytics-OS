# UTILITY-02 UAT record

**Release:** 4.2

**Read model:** 1.6.0

**Disaggregation model:** `PHAOS-DISAGG-001` 1.0.0

## Acceptance evidence

- [x] All 4,743 canonical objects carry a governed disaggregation profile.
- [x] Each assertion has a controlled dimension, claim type, status, evidence, applicability and review state.
- [x] Source-required, system-available and analyst-recommended states are structurally and visually distinct.
- [x] Recommendations explicitly state that availability is unverified.
- [x] System availability is limited to a named, versioned observed report-schema artefact.
- [x] Zero source-required assertions are published without explicit object-level evidence.
- [x] Unknown and no-evidence states remain visible rather than being dropped.
- [x] Indicator filters participate in result counts, active-filter summaries, clear-all behavior and URL state.
- [x] Indicator and HMIS cards/details expose the governed profile; indicator table view exposes its evidence state.
- [x] Desktop browser UAT: the indicator view restored `Age or life-course group` + `Analyst-recommended` from its URL and returned 636 records.
- [x] Desktop browser UAT: the HMIS view opened with all 1,046 objects and returned 506 data elements for `Administrative geography` + `System-available`.
- [x] Desktop browser UAT: `HMIS-DE-0001` showed zero source-required, six artefact-bounded system-available and zero analyst-recommended assertions, including evidence and applicability.
- [x] Desktop browser UAT: table view exposed `Disaggregation evidence`; browser console contained no warnings or errors.
- [x] Integrated release gate passed all 13 checks after the browser-discovered default-filter defect was corrected.
- [x] Narrow-viewport UAT at 390 × 844 px showed no document overflow (`383 px` document width within a `390 px` viewport); filter and result regions remained within the content width.
- [x] GitHub Actions validation run `38406392026` passed for release commit `f4704f2`.
- [x] Live GitHub Pages smoke test returned all 1,046 HMIS objects by default and 506 objects for `Administrative geography` + `System-available`, with no browser warnings or errors.

Passing UAT proves evidence-separated metadata assertions. It does not prove that a dimension is populated, complete, comparable, privacy-safe or available outside the cited artefact.
