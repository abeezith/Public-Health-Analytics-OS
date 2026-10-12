# Public Health Analytics-OS delivery baseline

**Baseline ID:** `PHAOS-BASELINE-2026-10-12`  
**Roadmap:** `PHAOS-ROADMAP-001`  
**Baseline commit:** `1ff44d505664ad836b19fad174176263c4ac0ce6`  
**Deployment evidence:** GitHub Pages run `38280142353`, completed successfully  
**Checkpoint:** [`PHAOS-BACKUP-2026-10-12-01`](BACKUP-REGISTER.md)

## 1. Purpose

Freeze the authoritative starting state for roadmap execution. Later releases must reconcile against this baseline rather than against claims in the evaluated legacy sprint package.

## 2. Product and data baseline

| Measure | Verified value |
|---|---:|
| Canonical objects | 4,743 |
| Source representations | 4,797 |
| Indicator records | 3,751 |
| HMIS knowledge objects | 1,046 |
| Shared indicator/HMIS identities | 54 |
| Report-column occurrences | 560 |
| HMIS-tagged indicators | 130 |
| Aggregate observations | 0 |
| Reference values | 0 |
| Public value distributions | 0 |
| Public bulk-download controls | Disabled |

The metadata-quality validator scores 3,708 named records with zero critical identity errors. Forty-three positional legacy programme tuples remain deliberately unscored pending named-object migration.

## 3. Adopted contracts

- `PHAOS-OBJECT-TAXONOMY-001` — object classes remain distinct.
- `PHAOS-IDENTITY-001` — canonical, manifestation, representation and occurrence identity plus lifecycle.
- `PHAOS-MDQ-001` version 1.0.0 — nine-dimension metadata-quality model.
- `PHAOS-DISCOVERY-FACETS-001` — programme and system/portal are separate facets.
- `PHAOS-OBSERVATION-001` version 1.0.0 — future aggregate observations and separate reference values.
- JSON Schema package version 1.1.0 — 12 contracts.
- Governed graph relationship vocabulary — evidence and direction are required.

## 4. Architecture baseline

- Directly deployed static HTML/CSS/JavaScript on GitHub Pages.
- Consolidated, generated read model is the browser source for indicator and HMIS record arrays.
- Registry is the single discovery interface for indicators, HMIS objects and report occurrences.
- Current search/filtering is browser-side; no Astro, npm build or Pagefind dependency is adopted.
- Knowledge graph, methods and coverage are linked from the common Analytics-OS home.
- The Agile roadmap is available as Markdown and an interactive Kanban view.

## 5. Programme baseline

| Programme | Current state |
|---|---|
| NTEP | Source-bounded deep release complete; restricted/current operational dictionary gaps remain |
| RMNCH+A | Source-bounded release complete; portal and specialist dictionary gaps remain |
| Immunization | Source-bounded release complete; authenticated operational dictionary gaps remain |
| Vector-borne diseases | Governed foundation; disease-wise deep extraction pending |
| NP-NCD | Source-bounded release complete; authenticated portal and disease-specific gaps remain |
| Communicable diseases / IDSP-IHIP | Not started; first action is source-boundary definition |
| HMIS | Cross-programme information-system spine, not a numbered disease programme |

## 6. Non-negotiable release rules

1. Preserve official/source indicator names.
2. State formula, scale and denominator explicitly; percentages use `(numerator ÷ denominator) × 100`.
3. Do not flatten unlike object types or count representations as canonical objects.
4. Do not infer operational identifiers, equivalence, computability or custodian approval.
5. Keep restricted or unavailable evidence as an explicit gap.
6. Keep public bulk-download controls disabled.
7. Do not publish observed values: the current product is metadata- and observation-ready, not a value repository.
8. Retain source/version and lifecycle history through change.

## 7. Known blockers

- HMIS/DHIS2 operational mapping requires an authorized, versioned instance export.
- Ni-kshay operational mapping requires an authorized, versioned dictionary or export.
- National NCD operational mapping requires authoritative portal/AMRIT/CBAC evidence.
- DOI publication requires authorship, affiliation, licensing and release-semantics approval.
- Executable FHIR terminology operations require infrastructure beyond static GitHub Pages.

## 8. Execution order

Sprint 0 reconciliation precedes `UNIFY-10` and `TRUST-06`. Provenance, disaggregation, semantic publication, performance changes and programme expansion follow only when their roadmap dependencies pass. The user instruction to start the detailed roadmap authorizes this order; individual external endorsements and custodian approvals remain separate decisions.

## 9. Baseline verification commands

The following validators passed at baseline:

```text
node scripts/validate-metadata-quality.mjs
node scripts/validate-observation-model.mjs
node scripts/validate-unified-identities.mjs
node scripts/validate-unified-read-model.mjs
```

Any later baseline comparison must run the same checks plus the integrated gate delivered under Sprint 1.
