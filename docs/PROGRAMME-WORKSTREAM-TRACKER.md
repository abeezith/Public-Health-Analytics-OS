# Analytics-OS programme and standards workstream tracker

Last updated: 5 September 2026

This document is the persistent task list for programme expansion and its parallel interoperability work. Programme research remains the authority for official names, definitions, denominators, formulas, source versions and evidence boundaries. The FHIR workstream consumes those governed records but does not silently change them or delay their publication.

## Status vocabulary

- `Not started` — no work product exists.
- `In progress` — active work has started.
- `Source-bounded` — complete only for the explicitly declared public-source boundary.
- `Foundation` — a governed subset exists, but deeper programme extraction remains pending.
- `Metadata mapped` — a FHIR representation exists but is not executable.
- `Validated` — the artifact passes the selected FHIR profile and validator.
- `Domain reviewed` — the public-health interpretation and mapping were reviewed.
- `Computable` — executable logic and test cases pass.
- `Custodian approved` — the responsible source authority has approved the representation.
- `Blocked by evidence` — progress requires a source dictionary, rule, decision or authorization not currently available.

FHIR status must always be reported with its achieved stage. `Validated` does not imply `Computable`, and neither implies `Custodian approved`.

## Programme sequence and parallel-work status

| No. | Programme | Registry workstream | Knowledge graph | FHIR workstream | Next controlled action |
|---:|---|---|---|---|---|
| 1 | National Tuberculosis Elimination Programme (NTEP) | Source-bounded deep release complete; restricted/current operational dictionaries remain evidence gaps | Domain-reviewed, source-bounded | Queued | Start repeatable FHIR tasks after foundation tasks FHIR-01–FHIR-11 pass |
| 2 | RMNCH+A | Source-bounded release complete; current portal and specialist dictionaries remain evidence gaps | Domain-reviewed, source-bounded | Queued | Apply the pilot profile to a balanced maternal, newborn, child and adolescent sample |
| 3 | Universal Immunization Programme / Mission Indradhanush | Source-bounded release complete; authenticated U-WIN/eVIN dictionaries remain evidence gaps | Domain-reviewed, source-bounded | Queued | Pilot coverage, dropout, session, stock and AEFI measures without asserting false equivalence |
| 4 | Vector-borne disease control programmes | Foundation of 10 manifestations; deep disease-wise extraction pending | Domain-reviewed foundation | Queued after source boundary selection | Apply FHIR only to the governed subset, then repeat after each disease-wise expansion |
| 5 | National Programme for Prevention and Control of Non-Communicable Diseases (NP-NCD) | Source-bounded release complete; National NCD Portal and disease-specific dictionaries remain evidence gaps | Domain-reviewed, source-bounded | Queued | Pilot screening, diagnostic follow-up, treatment and control measures; retain the diabetes-control wording issue as unresolved |
| 6 | Communicable diseases / IDSP-IHIP | Pending programme execution | Pending | Not started | Establish the programme source boundary before creating FHIR artifacts |

HMIS is tracked as a cross-programme information-system spine, not as a numbered disease programme. Its raw elements, forms, outputs and validation rules require their own FHIR modelling policy and must not all be represented as `Measure`.

## Parallel FHIR foundation workstream

FHIR-00 is the completed evaluation. The remaining tasks are intentionally separate from programme extraction.

1. **FHIR-00 — Feasibility and role assessment — Complete.** Establish FHIR as an operational interoperability layer alongside the existing Schema.org discovery layer.
2. **FHIR-01 — Version policy — Pending.** Adopt FHIR R4 as the initial India-facing export aligned with the ABDM implementation guide; document the R4-to-R5 transformation policy.
3. **FHIR-02 — Canonical identity policy — Pending.** Define stable canonical URLs, resource identifiers, business versions and rules for source revisions versus Analytics-OS revisions.
4. **FHIR-03 — Source-authority policy — Pending.** Distinguish the original custodian from Analytics-OS as the publisher of a derived FHIR representation; prohibit implied custodian endorsement.
5. **FHIR-04 — Computability maturity model — Pending.** Implement the stages `metadata mapped`, `structurally specified`, `computable`, `tested` and `custodian approved`.
6. **FHIR-05 — Core Measure profile — Pending.** Define the minimum required metadata, official-name preservation, population descriptions, scoring, scale, direction, source reference and aggregation guidance.
7. **FHIR-06 — Registry extensions — Pending.** Minimize and govern extensions for official-name status, metadata completeness, evidence boundary, zero-denominator rule, lowest reporting level and review status.
8. **FHIR-07 — Local vocabularies — Pending.** Define provisional CodeSystems and ValueSets for programme, component, reporting level, WHO building block, measure type, computability stage and review status.
9. **FHIR-08 — ConceptMap policy — Pending.** Translate close, broad, narrow and related mappings with direction tests; reserve equivalence for formally proven cases.
10. **FHIR-09 — HMIS modelling policy — Pending.** Decide when a raw HMIS object becomes Questionnaire content, Observation/ObservationDefinition, StructureDefinition, Library validation logic or Measure.
11. **FHIR-10 — Provenance and source-document pattern — Pending.** Define Organization, RelatedArtifact/DocumentReference, Provenance and optional R5 Citation usage.
12. **FHIR-11 — Security and publication boundary — Pending.** Keep the public implementation guide definition-only and aggregate-only; exclude identifiable patient data from GitHub Pages.
13. **FHIR-12 — Ten-indicator pilot selection — Pending.** Select percentage, population-rate, ratio, count and index examples across NTEP, RMNCH+A, Immunization, NP-NCD and HMIS.
14. **FHIR-13 — Pilot Measure resources — Pending.** Generate metadata-level R4 Measure instances without inventing executable criteria.
15. **FHIR-14 — Pilot ConceptMap and provenance resources — Pending.** Generate mapping assertions, source organizations and transformation provenance.
16. **FHIR-15 — Aggregate MeasureReport examples — Pending.** Create synthetic facility, district and state examples; label all examples as non-production test data.
17. **FHIR-16 — Profiles and validation pipeline — Pending.** Add FHIR Shorthand, SUSHI/IG Publisher inputs and automated base/profile validation.
18. **FHIR-17 — Computable subset — Pending.** Implement CQL/Library logic only for pilot indicators with sufficient authoritative criteria and test data.
19. **FHIR-18 — Domain review — Pending.** Review population logic, denominator exclusions, period, unit, direction, aggregation and stratifiers with public-health experts.
20. **FHIR-19 — Implementation Guide publication — Pending.** Publish the versioned Analytics-OS FHIR R4 implementation guide and machine-readable package.
21. **FHIR-20 — Website integration — Pending.** Link HTML, Schema.org and FHIR representations using the same stable registry identity; do not add public bulk-download controls unless separately authorized.
22. **FHIR-21 — Pilot release gate — Pending.** Release only after identifier, validation, provenance, official-name, no-false-equivalence and privacy gates pass.

## Repeatable FHIR checklist for every programme

Create a programme-specific instance of every task below when a programme is first added to Analytics-OS. Repeat affected tasks whenever its source boundary or official version changes.

1. **PF-01 — Freeze the programme source boundary.** Record included documents, tables, portals, versions, cut-off date and known evidence gaps.
2. **PF-02 — Inventory all programme objects.** Separate indicator manifestations, raw data elements, forms, validation rules, outputs, concepts and source documents.
3. **PF-03 — Assign FHIR eligibility.** Decide whether each object maps to Measure, Questionnaire, ObservationDefinition, Library, ConceptMap, another resource or no FHIR representation.
4. **PF-04 — Preserve identity and authority.** Retain official names and source identifiers; assign stable Analytics-OS canonical URLs and derived-artifact provenance.
5. **PF-05 — Map measure structure.** Represent numerator, denominator, exclusions, exceptions, subject, scoring, unit, direction, period and aggregation rule without guessing missing fields.
6. **PF-06 — Map stratifiers and reporting levels.** Represent age, sex, condition, geography, facility type and other source-defined disaggregations.
7. **PF-07 — Create terminology placeholders.** Use versioned CodeableConcept slots; do not assign SNOMED CT, ICD, LOINC or other external codes until the terminology workstream reviews them.
8. **PF-08 — Generate concept mappings.** Convert the governed knowledge-graph mappings to FHIR ConceptMap relationships with direction and equivalence QA.
9. **PF-09 — Attach sources and provenance.** Connect the FHIR artifact to source documents, custodian, transformation activity and domain-review record.
10. **PF-10 — Assign computability stage.** Keep non-executable measures visibly metadata-only; add Library/CQL only when authoritative criteria are sufficient.
11. **PF-11 — Validate and test.** Run base FHIR, profile, identifier, link, terminology, round-trip and regression tests plus synthetic MeasureReport examples where applicable.
12. **PF-12 — Domain and custodian review.** Record public-health review separately from custodian approval; neither may be inferred from technical validation.
13. **PF-13 — Publish and update this tracker.** Release versioned artifacts, update programme counts and evidence gaps, and retain the previous version for provenance.

## Programme FHIR completion gates

A programme may advance independently through these gates:

| Gate | Required evidence |
|---|---|
| G0 — Registered | Programme row and PF checklist exist |
| G1 — Scoped | Source boundary, versions and evidence gaps recorded |
| G2 — Classified | Every programme object has a FHIR eligibility decision |
| G3 — Metadata mapped | Valid draft resources preserve identity, definitions and source provenance |
| G4 — Validated | Resources pass the declared FHIR profiles and automated QA |
| G5 — Domain reviewed | Public-health interpretation and mapping review complete |
| G6 — Computable | Executable logic and test cases pass for the declared subset |
| G7 — Custodian approved | Explicit approval recorded for the declared artifacts and version |

The programme registry can be source-bounded and published while its FHIR gate remains lower. This prevents interoperability work from overstating source completeness or blocking programme research.

## Deferred terminology standards workstream

SNOMED CT, ICD, LOINC and related standards are deliberately `Not started`. FHIR profiles will reserve properly versioned terminology fields, but no external terminology mapping will be accepted until each standard's role, licensing, release/version policy, mapping direction and validation process are reviewed separately.

