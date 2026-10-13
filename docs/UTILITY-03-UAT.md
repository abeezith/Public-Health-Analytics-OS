# UTILITY-03 UAT record

**Release:** 4.3  
**Read model:** 1.7.0  
**Date:** 13 October 2026

## Acceptance evidence

- [x] Exactly 30 indicator profiles resolve to canonical records.
- [x] NTEP, RMNCH+A, Immunization, VBD and NCD each contribute six profiles.
- [x] Every pilot profile has reporting-lag state, known issues, misinterpretations, minimum inputs, validation checks and comparability conditions.
- [x] Unknown lag is stated rather than inferred.
- [x] All 4,713 non-pilot objects retain an explicit outside-pilot state.
- [x] Registry filter, URL state, cards, table and detail view expose the profile.
- [x] HMIS view exposes the eight shared pilot indicator manifestations.
- [x] Release validation includes a dedicated quality/comparability gate.
- [ ] Programme-domain reviewers have accepted the analyst guidance.

## Interpretation boundary

Passing UAT proves publication structure and interface behaviour. It does not validate observed data, establish custodian approval, or make two values comparable.

## Deployment evidence

- Release commit: `31c70e5c422f3c5b9b5de9b18ff630c548a012c8`
- GitHub Actions run `38412639326`: integrated 14-check release gate and Pages deployment passed.
- Live smoke test: the `quality=Pilot profile available` URL restored the filter, returned 30 indicators, displayed Release 4.3 and produced no browser warnings or errors.
