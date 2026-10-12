# Sprint 1 UAT — integrated validation and release gate

**Release:** Analytics-OS 3.8  
**Tasks:** `UNIFY-10`, `TRUST-06`, `VAL-01..VAL-06`  
**Test date:** 12 October 2026  
**Result:** Pass

## Automated acceptance

Command: `node scripts/validate-release.mjs --output artifacts/release-validation-report.json`

| Gate | Result |
|---|---|
| Versioned schema contracts | Pass |
| Metadata-quality profile | Pass |
| Canonical identity and lifecycle | Pass |
| Unified read model and reciprocal relationships | Pass |
| Observation publication boundary | Pass |
| Measure, formula, scale and denominator rules | Pass |
| Static UI, links and accessibility contract | Pass |
| Controlled invalid-fixture rejection | Pass |

The controlled fixture was rejected with all expected percentage-rule errors. The read model reconciled 4,743 canonical objects, 4,797 representations, 3,751 indicator manifestations, 1,046 HMIS objects and 560 report occurrences. Its SHA-256 is `67d87d86c00c1dbef798ff8105fba708d25e5c7eb105516fafb7ade747b0a773`.

## Browser acceptance

| Scenario | Expected | Observed | Result |
|---|---|---|---|
| Programme/system semantics | HMIS excluded from Programme and present under System / portal | Correct; HMIS system facet returned 130 indicators | Pass |
| WHO building-block facet | Exactly six canonical values | Six unique canonical labels | Pass |
| Indicator search | Exact search remains discoverable | `ANC registration rate` returned one result | Pass |
| Card/table parity | Same filtered result in table mode | One filtered result and one visible table row | Pass |
| HMIS object-class filter | Data-element total remains stable | 765 | Pass |
| Report occurrence status | Held candidates remain separate | 17 candidate occurrences | Pass |
| Normalized percentage metadata | Official name retained; `%`, formula and denominator explicit | `%`; `(numerator ÷ denominator) × 100`; `Estimated pregnancies` | Pass |
| Reciprocal navigation | Related objects and sources available from detail | Nine related canonical paths and two source-evidence paths shown | Pass |
| Public download boundary | No public download control | None present | Pass |
| Graph integrity | Counts and graph controls render | 1,766 nodes, 7,169 relationships; expand/fit controls present | Pass |

## Usability and accessibility cross-check

- No duplicate element IDs or unlabelled form controls were found by the static interface validator.
- Registry content types remain keyboard-addressable tabs with selected state.
- Card and table modes expose accessible button names and table captions.
- Core local links, fragments, scripts and styles resolve.
- The graph retains an accessible image label and explicit expand/fit controls.
- Desktop page width remained within the viewport during browser UAT; responsive CSS and required mobile breakpoints passed static contract checks.

## Accepted boundaries

- Nineteen source-bounded NTEP C&DST percentage labels remain governed exceptions because the captured public labels do not specify denominator populations. They remain non-computable pending source/domain review.
- Passing UAT does not imply custodian approval, semantic equivalence, clinical validity or exhaustive accessibility conformance.
- No observed health values or public bulk-download controls are introduced.

## Production verification

- GitHub Actions run `38288048955` passed the integrated gate before the dependent Pages deployment job.
- GitHub Pages is configured for workflow deployment; the validated commit was `93f67b8`.
- Live smoke tests passed for the home, Registry, graph and roadmap. The live release shows Release 3.8, 3,751 indicators, 1,046 HMIS objects, 560 occurrences, six canonical WHO pillars, 1,766 graph nodes and 7,169 relationships.
- The live roadmap shows Sprint 1 completed, Sprint 2 active and all 52 tickets present.
