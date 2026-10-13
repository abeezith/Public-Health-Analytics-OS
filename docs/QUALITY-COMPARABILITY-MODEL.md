# Quality and comparability model

**Task:** `UTILITY-03` / Sprint 3 `DQ-01`  
**Model:** `PHAOS-DQCOMP-001` version 1.0.0  
**Release:** 4.3 · read model 1.7.0

## Scope

The pilot adds review guidance to 30 priority India indicators: six each for NTEP, RMNCH+A, Immunization, vector-borne diseases and NP-NCD. Every canonical object carries a profile; the other 4,713 explicitly state that they are outside the pilot.

Each pilot profile publishes expected reporting-lag evidence, known issues, common misinterpretations, minimum inputs, validation checks and comparability conditions. Official indicator names and source computation metadata remain unchanged.

## Evidence boundary

- The guidance is analyst-curated and awaits programme-domain review.
- Reporting lag is recorded as “Not stated in cited evidence”; reporting frequency is never used as a proxy for lag.
- Guidance does not assess an observed value, certify validity, authorize aggregation or permit ranking.
- Comparison remains conditional on compatible definition, numerator, denominator, period, geography and source version.
- Primary source and programme protocols control official interpretation.

## Discovery

Registry and HMIS views expose a quality-guidance filter, result count, card/table state and detailed panel. Search includes pilot issues and misinterpretations. URL parameter `quality` preserves the Registry filter.

## Governance

The pilot source file is intentionally compact; `scripts/quality-comparability-profile.mjs` expands it deterministically. `scripts/validate-quality-comparability.mjs` enforces 30 unique resolvable records, six per programme, complete fields and honest review/lag states.
