# Controlled disaggregation assertion model

**Control:** `PHAOS-DISAGG-001`

**Version:** 1.0.0

**Task:** `UTILITY-02` / Sprint 3 `DISAGG-01`, `DISAGG-02`, `DISAGG-04`

## Purpose

The model prevents three materially different statements from being collapsed:

1. **Source-required:** a cited source explicitly requires a dimension for the object.
2. **System-available:** a dimension is observed in a named, versioned system artefact applicable to the object.
3. **Analyst-recommended:** a useful analytical dimension; availability remains unverified.

Every assertion carries a stable identifier, controlled dimension, claim type, status, exact evidence wording, authority, source/version, locator, geography, reporting level, facility applicability, population and review state.

## Release 4.2 implementation

- All 4,743 canonical objects carry a `PHAOS-DISAGG-001` profile.
- Existing registry `disaggregation` text is retained as legacy source wording and normalized only into **analyst-recommended** assertions.
- Six dimensions observed in the versioned HMIS report-schema occurrence layer are represented as **system-available in that artefact**, with value-domain and broader implementation validation still pending.
- No **source-required** claim is made without explicit object-level evidence.
- Absence means “not evidenced in this release”, never “unavailable”.

## Legacy-asset reconciliation

The supplied draft schema and 19-row CSV were evaluated but not imported. They combine recommendation, survey availability, operational-system availability and contextual notes in single fields, use non-versioned availability labels and contain claims that require fresh source verification. Their dimension ideas informed the controlled vocabulary; their record-level assertions remain quarantined until the planned reviewed equity pilot.

## Publication boundary

This is metadata only. It publishes no person-level data, aggregate observations or public bulk-download controls. System availability applies only to the named evidence artefact and does not establish national portal implementation, data quality or publication access.
