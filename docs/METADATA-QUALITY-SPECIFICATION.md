# Analytics-OS metadata-quality specification

**Specification ID:** `PHAOS-MDQ-001`  
**Version:** `1.0.0`  
**Effective date:** 7 September 2026  
**Governance task:** TRUST-03

This specification makes indicator-metadata completeness reproducible. It defines nine weighted dimensions, missing-value treatment, computed quality levels and the relationship vocabulary used by the knowledge graph. It applies to indicator manifestations represented as named JSON objects.

The score measures metadata completeness and explicitness. It does **not** measure indicator validity, source authority, observed-data quality, comparability, computability, usefulness, domain-review status or custodian approval.

## Reconciliation with legacy fields

Existing records contain `metadataLevel` and `completeness` values assigned during earlier source and programme releases. They are not reproducible from a published rubric: the same level can carry several scores, and the ordering is not a quality grade. TRUST-03 therefore preserves both fields as legacy provenance and introduces separate computed properties:

- `metadataQualityProfile`: `PHAOS-MDQ-001@1.0.0`
- `metadataQualityScore`: integer from 0 to 100
- `metadataQualityLevel`: A to E under the thresholds below

Historical records are not silently rewritten. The validator reports the difference, and TRUST-05 will govern entry-level migration and change events.

## Nine weighted dimensions

| Dimension | Weight | What is checked |
|---|---:|---|
| Identity and classification | 10 | Stable ID, source/official name, domain and subdomain |
| Definition | 15 | Non-empty definition; a label repeated as its own definition earns only partial credit |
| Computation | 20 | Measure type, numerator, denominator, formula/method and denominator population |
| Scale and unit | 10 | Measure type, explicit display scale and unit |
| Population and time | 10 | Reference/denominator population, frequency/period and geographic/reporting scope |
| Source and provenance | 15 | Source title and ID, organization, source URL, verification date and source version/location/code |
| Disaggregation and reporting context | 5 | Disaggregation and lowest reporting, administrative or geographic level |
| Interpretation and potential use | 10 | Direction/interpretation and potential uses |
| Limitations | 5 | Caveats, limitations or an explicit evidence gap |

Weights total 100. Criteria within a dimension contribute equally. The weighted total is rounded once, to the nearest whole number.

## Criterion states and missing values

| State | Factor | Rule |
|---|---:|---|
| Complete | 1.00 | Specific, usable metadata is present |
| Not applicable | 1.00 | An explicit N/A statement is consistent with the measure type; for example, the denominator of an absolute count |
| Partial | 0.50 | Metadata is informative but incomplete or label-only |
| Explicit gap | 0.25 | The record transparently says not reported, not located, unavailable, pending validation or directs the user to authoritative metadata |
| Missing | 0.00 | Field is absent, null or blank |
| Invalid | 0.00 | Value conflicts with a conditional rule and creates a validation issue |

Explicit gaps receive limited credit because declaring uncertainty is better than hiding it, but it is not equivalent to supplying metadata. “Not applicable” receives full credit only when context supports it. It must not be used as a generic substitute for unknown information.

Conditional checks include:

- percentages must use `%`, state a denominator and show multiplication by 100;
- a source locator must be an HTTP(S) URL;
- verification dates must be ISO dates;
- an ID must satisfy the versioned schema pattern; and
- duplicate IDs are critical validation errors.

## Computed levels

| Level | Score | Interpretation |
|---|---:|---|
| A | 90–100 | Very high metadata completeness |
| B | 75–89 | High metadata completeness |
| C | 60–74 | Moderate metadata completeness |
| D | 40–59 | Limited metadata completeness |
| E | 0–39 | Minimal metadata completeness |

Levels describe completeness only. An A-level record can still be outdated, non-computable or inappropriate for comparison. A lower-level source manifestation remains discoverable and should carry explicit gaps rather than fabricated detail.

## Relationship vocabulary

The machine-readable [`relationship-vocabulary.json`](../indicators/data/governance/relationship-vocabulary.json) publishes every graph predicate with allowed source and target node types, meaning and required evidence. It also governs mapping relations and assertion status.

Three rules apply throughout:

1. Every edge is directional from `source` to `target`; an inverse is never assumed.
2. `exactMatch`, `closeMatch`, `broadMatch`, `narrowMatch` and `relatedMatch` describe semantic relationship, not permission to pool values.
3. Numerical aggregation requires `aggregationSafe: true` plus evidence of compatible definitions, populations, periods, units and versions.

## Validation and publication

Run:

```text
node scripts/validate-metadata-quality.mjs
```

Use `--json` to produce the aggregate report structure. The committed validation summary publishes counts, average dimension scores, issue counts and legacy reconciliation without adding a public record-level download. A non-zero exit indicates a critical identity failure or duplicate ID. Formula, scale and evidence issues remain visible quality gaps and become automated release gates under TRUST-06.

Programme releases that still store positional tuples are not assigned computed record scores. They must first migrate to named objects so that every score is traceable to named fields. This is a deliberate safeguard against scoring inferred column meaning.
