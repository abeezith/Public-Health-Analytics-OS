# Versioned targets and reference values

**Model:** `PHAOS-REFERENCE-001` v1.0.0  
**Task:** `UTILITY-04`  
**Schema package:** 1.4.0  
**Release:** 4.4

## Purpose

Targets, benchmarks, alert thresholds and reference ranges are independent evidence records. They link to—but never overwrite—an indicator definition and are never represented as observed results.

## Required semantics

- immutable record identity and business version;
- canonical indicator link and definition version;
- reference type, applicability, authority and publication boundary;
- exactly one value form: absolute quantity, range or baseline-relative change;
- calendar or programme-relative effective period without fabricated dates;
- lifecycle and replacement links for revision history;
- independent records for source-stated alternatives.

## Pilot boundary

The pilot contains 20 numeric targets linked to 12 LaQshya indicators from Annexure C of the 2017 operational guidelines: 12 absolute targets and eight baseline-relative alternatives. Compliance-status and reporting-frequency statements were not coerced into numeric targets. No aggregate observations or person-level records are published.

The cited guideline is version-specific. Users must verify current programme guidance before operational use. Structural validation does not establish currentness, clinical validity, comparability or custodian approval. Public bulk-download controls remain disabled.
