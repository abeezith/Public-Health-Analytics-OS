# Integrated release-validation gate

**Control:** `PHAOS-RELEASE-GATE-001`
**Version:** 1.4.0
**Tasks:** `UNIFY-10`, `TRUST-05..TRUST-07`, `UTILITY-01..UTILITY-03`, Sprint 1 `VAL-01..VAL-06`, Sprint 2 `PROV-01..MON-02`, Sprint 3 `DISC-01..DQ-01`

## Purpose

Every governed release must prove that its schemas, identities, relationships, normalized measures, publication boundaries and critical user-interface contracts remain internally consistent. The gate matches the repository's static GitHub Pages architecture and adds no npm, Astro or Pagefind dependency.

## Run locally

```text
node scripts/validate-release.mjs --output artifacts/release-validation-report.json
```

The command writes a machine-readable report and exits non-zero when any blocking check fails. The report records the commit, branch, counts, schema package, input checksums, validator outputs and public-publication boundary.

## Blocking checks

1. Versioned JSON Schema package integrity and representation-level required fields.
2. `PHAOS-MDQ-001` metadata-quality critical checks.
3. Canonical, representation and occurrence identity/lifecycle rules.
4. Unified read-model counts, links, reciprocal relationships and checksum.
5. Entry-level review/change-event integrity, subject resolution, dates, reviewer roles and read-model parity.
6. Verification-queue extraction against controlled flagged and clean fixtures.
7. Source baselines, fingerprints, comparison states, controlled change fixtures and automatic-mutation prohibition.
8. Operational-discovery controlled values and non-overclaiming boundaries.
9. Controlled disaggregation dimensions, evidence, applicability and separation of required, available and recommended claims.
10. Observation/reference-value privacy and publication boundary.
11. Official-name preservation where an explicit official name exists; normalized measure type, scale, formula and denominator rules.
12. Core-page links, fragments, form labels, button names, image alternatives, required interface IDs, current counts, JavaScript syntax and disabled-download controls.
13. A controlled invalid fixture that must be rejected with the expected error codes.

## Governed exceptions

An exception is allowed only for a named, source-bounded evidence gap in `validation-exceptions.json`. It must state the rule, reason and remediation target. It remains a warning and does not become a valid computation. A new silent gap or unregistered exception fails the release.

The first exception set contains 19 NTEP C&DST laboratory-performance records whose captured public labels do not state denominator populations. Their percentage formula and scale are retained, but computation remains blocked pending programme/source review.

## Continuous integration and deployment

GitHub Actions executes the same command on pull requests, pushes to `main` and manual dispatch. The JSON report is retained as a 90-day workflow artifact even when validation fails.

GitHub Pages must use the Actions deployment workflow. The deploy job depends on the validation job, so a failed gate cannot publish a new Pages version. Direct legacy branch deployment is not an accepted release route after migration.

## Interpretation boundary

A passing result establishes structural and regression integrity for the declared inputs. It does not establish source-custodian approval, semantic equivalence, aggregation safety, computability, clinical validity or absence of all accessibility defects. Browser UAT and domain review remain distinct evidence.
