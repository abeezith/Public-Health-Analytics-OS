# Operational discovery profile

**Control:** `PHAOS-OPDISC-001`

**Version:** 1.0.0

**Task:** `UTILITY-01` / Sprint 3 `DISC-01`
**Adopted:** 13 October 2026

## Purpose

Make operational context discoverable without changing official names or implying that metadata, data availability, review and computability are the same thing. Every canonical record receives controlled frequency, cadre, availability, review, lifecycle and computability fields in read model 1.5.0.

## Interpretation rules

- Source wording is preserved beside normalized frequency and cadre categories.
- `Not stated`, `Unknown` and `Review pending` remain visible and filterable.
- Availability describes this publication: Analytics-OS exposes metadata and publishes zero observed health values.
- `C2` means a formula is stated and its implementation is unvalidated; it is not a claim of operational mapping, analytical validation or custodian approval.
- `C1` means a method is stated but the published inputs are incomplete.
- `C0` means computability has not been established from the governed metadata.
- Non-indicator object classes retain `Not applicable to this object class` rather than being forced into indicator maturity.

## User experience

The Indicator view exposes all six facets, includes active selections in result summaries, and stores non-default selections in the URL. Cards, tables and indicator/HMIS details show the profile. Public download controls remain disabled.

## Boundary

The profile is an Analytics-OS discovery normalization. It does not replace source wording, prove data existence in an operational system, validate a calculation or confer source-custodian approval. Tested templates are reserved for `UTILITY-06`.
