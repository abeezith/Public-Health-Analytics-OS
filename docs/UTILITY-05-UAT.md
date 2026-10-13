# UTILITY-05 UAT — interpretation and response guidance

## Acceptance evidence

| Test | Expected | Result |
|---|---|---|
| Coverage | Every canonical object has an explicit guidance state | Pass |
| Pilot | 30 unique priority indicators expose advisory workflows | Pass |
| Authority separation | Official and advisory actions are structurally distinct | Pass |
| Official evidence | No action is labelled official without an exact protocol locator | Pass — 0 official protocols asserted |
| Workflow | Each pilot record covers verification, indicator-specific review, interpretation and referral | Pass |
| Safety | Clinical care, automatic alerts, sanctions and ranking are prohibited | Pass |
| Discovery | Indicator filter and result summary expose guidance state | Pass |
| Detail view | Workflow, evidence, authority and boundaries are visible | Pass |
| Regression | Integrated release gate passes | Pass — 16/16 blocking checks |
| Local browser | URL state restores 30 pilot results and detail panel exposes all guidance fields | Pass |
| Live smoke | URL filter and detail panel work on GitHub Pages | Pass — 30 results; evidence, authority, workflow and safety text verified |

Deployment evidence: commit `d69de59`; GitHub Actions run `38426587216` passed both the integrated release gate and Pages deployment.

## Review debt

All 30 advisory workflows remain domain-review pending. Future official protocols must be added source by source with version, locator, applicability and lifecycle review; a target alone is insufficient.
