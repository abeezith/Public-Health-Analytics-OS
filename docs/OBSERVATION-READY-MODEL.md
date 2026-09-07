# Analytics-OS observation-ready model

**Model:** `PHAOS-OBSERVATION-001` version `1.0.0`
**Schema package:** `1.1.0`
**Adopted:** 7 September 2026
**Task:** UNIFY-09

## Purpose and present state

This model defines how Analytics-OS may ingest and publish aggregate public-health results later without mixing values into indicator definitions. It also separates targets, benchmarks and thresholds into reference-value records. The current observation manifest intentionally publishes **zero aggregate observations, zero reference values and zero public distributions**.

The model is therefore observation-ready, not an observed-health-data release.

## Grain and identity

One aggregate observation represents one governed indicator or data element × one geography or reporting unit × one period × one exact disaggregation set × one source/version. `observationKey` remains stable for that grain. Every correction or revision is append-only: it receives a new immutable `id`, increments `revisionNumber`, and points to the prior record with `replacesObservationId`.

The linked definition is identified by `canonicalObjectId`; `definitionBusinessVersion` may pin the meaning used during computation. A definition update never silently rewrites earlier observations.

## Required information

| Area | Required meaning |
|---|---|
| Subject | Resolvable canonical indicator or data-element identity |
| Context | Geography or reporting unit, plus an explicit point or interval period |
| Stratification | Exact source disaggregations, retaining labels and codes where available |
| Value | Numeric quantity and unit, or an explicit suppressed/unavailable/not-applicable state |
| Status | Provisional, final, revised or corrected, with append-only revision information |
| Provenance | Source/version, retrieval date, acquisition method, lineage and optional checksum/import batch |
| Privacy | Aggregate/access class, disclosure-review status and applicable small-cell rule |
| Quality | Flags, completeness, validation rules and notes without converting these into source facts |

## Privacy and publication gates

- Person-level records and direct personal identifiers are outside this model.
- Public values must be public aggregates and have disclosure review marked `not-required` or `passed`.
- Suppressed values contain no `valueQuantity` and must state a suppression reason.
- Restricted and sensitive aggregates are not exposed through GitHub Pages.
- Redistribution rights, source terms and access class must be reviewed before ingestion.
- A schema-valid record is not automatically comparable, accurate, current or suitable for analysis.

## Reference values

Targets, benchmarks, alert thresholds and reference ranges use `reference-value.schema.json`. Each record links to an indicator, states its geography/population applicability and effective period, and cites the issuing authority. Reference values do not overwrite indicator metadata and are never counted as observed results. Populating and analytically using this layer remains governed under UTILITY-04.

## Ingestion workflow

1. Confirm the source and redistribution boundary.
2. Resolve the indicator or data element to a canonical Analytics-OS identity.
3. Declare the observation grain and source-version lineage.
4. Verify unit, scale and denominator compatibility with the pinned definition version.
5. Preserve source disaggregations; do not invent unavailable strata.
6. Apply privacy, disclosure and suppression rules.
7. Validate schema, dates, identity links, revisions and replacement chains.
8. Perform domain and analytical review separately from structural validation.
9. Publish only an authorized aggregate distribution and update the observation manifest counts.

## Machine-readable artifacts

- `indicators/data/schemas/1.1.0/aggregate-observation.schema.json`
- `indicators/data/schemas/1.1.0/reference-value.schema.json`
- `indicators/data/observations/manifest.json`
- `scripts/validate-observation-model.mjs`

Public bulk-download controls remain disabled. The machine-readable files are governance artifacts, not a user-facing data-download feature.
