# Analytics-OS programme and standards workstream tracker

Last updated: 7 September 2026

This document is the persistent task list for programme expansion and all parallel trust, analytical-utility and interoperability work. It reconciles the September 2026 multi-expert evaluation with the work already completed in Analytics-OS Release 3.7. Programme research remains the authority for official names, definitions, denominators, formulas, source versions and evidence boundaries. Graph, FHIR, terminology and analytical-product workstreams consume governed records but do not silently change them or delay source-bounded registry publication.

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

## Expert-evaluation reconciliation

The evaluation is treated as review evidence, not as an instruction set. Recommendations are accepted only after comparison with the current repository.

| Evaluation area | Reconciled position | Disposition |
|---|---|---|
| Machine-readable publication | JSON, JSON-LD, graph contract and controlled vocabularies exist; formal JSON Schema, RDF distributions and query services remain pending | Adapted |
| Persistent identity | `PHAOS-IDENTITY-001` now governs canonical, manifestation, representation and occurrence identities plus lifecycle and version separation; resolvable entry pages remain pending under SEM-04 | Adapted |
| Graph semantics | Relationship vocabulary exists; formal SKOS predicates, direction tests and SHACL validation remain pending | Adapted |
| Per-entry provenance | Verification date and India source version are present; named reviewer, method and change-event history remain pending | Adapted |
| Disaggregation and responsible cadre | Present across most India programme records; controlled source-versus-recommended dimensions and remaining cadre gaps require remediation | Adapted |
| PM-JAY and ABDM | Small verified subsets exist; HWC/CPHC and deep programme extraction remain pending | Adapted |
| Clinical terminology | Map only terminology-eligible clinical concepts or observations with licensing, version and mapping evidence; never map every indicator by assumption | Adapted |
| Static FHIR API | GitHub Pages may publish static resources and packages but cannot provide `$lookup`, `$expand` or `$validate-code`; executable operations require a terminology server | Adapted |
| Governance, formal schemas, lifecycle, data-quality guidance and change monitoring | Governance, schemas, lifecycle and metadata-quality rules are complete; entry-level provenance, release automation and source-change monitoring remain | Adapted |

## Integrated execution sequence

This is the master order for future task-by-task execution. A later task may start early only when its listed dependencies are satisfied.

1. **RECON-00 — Expert-evaluation reconciliation ledger — Complete.** Record each recommendation as already implemented, accepted, adapted, deferred or rejected and connect it to an existing or new workstream.
2. **TRUST-01–TRUST-07 — Trust foundation — In progress.** TRUST-01 governance, TRUST-02 schemas, TRUST-03 metadata-quality rules and TRUST-04 persistent identity/lifecycle are complete. Next add entry-level provenance under TRUST-05, followed by automated release validation and source-change monitoring.
3. **UNIFY-01–UNIFY-10 — Unified registry — In progress.** UNIFY-01 object taxonomy, UNIFY-02 persistent identity, UNIFY-03 programme-versus-system filtering and UNIFY-04 single discovery interface are complete. Next replace browser-side federation with the published consolidated read model under UNIFY-05.
4. **UTILITY-01–UTILITY-06 — Analyst and programme utility — Pending.** Improve discovery, controlled disaggregation, data-quality and comparability guidance, versioned targets, source-backed response guidance and tested calculations.
5. **OPMAP-01–OPMAP-04 — Operational-system mappings — Pending.** Define an instance/version-aware mapping policy, then pilot HMIS/DHIS2, NTEP and NP-NCD operational mappings without inventing restricted identifiers.
6. **SEM-01–SEM-04 — Semantic Web publication — Pending.** Formalize SKOS mapping semantics, publish RDF, validate with SHACL and make canonical identities resolvable.
7. **FHIR-01–FHIR-21 — FHIR foundation and pilot — Pending after the relevant TRUST and SEM policies.** Publish the correct resource type for each object and distinguish metadata mapping, validation, computability and custodian approval.
8. **TERM-01–TERM-05 — Terminology evaluation and pilot — Deferred until FHIR terminology slots and licensing policy exist.** Assess ICD, SNOMED CT, LOINC and other standards separately; map only eligible concepts.
9. **Programme 4 deepening and Programme 6 execution — Pending.** Complete VBD disease-wise sources, then execute communicable diseases/IDSP-IHIP using the repeatable programme enrichment checklist.
10. **Programme expansion queue — Pending after the current six-programme sequence.** Add Ayushman Bharat family, POSHAN 2.0/ICDS and the National Mental Health Programme as separately bounded verticals.
11. **PRODUCT-01–PRODUCT-04 — Derived analytical products — Deferred until their metadata prerequisites pass.** Build programme briefs, dashboard audit, calculation assistance and a source-change review queue.

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

## Programme expansion queue after the current six

| Queue | Programme family | Current evidence | Required next action |
|---:|---|---|---|
| 7 | Ayushman Bharat | Seven PM-JAY and four ABDM registry records exist; HWC/CPHC is not a deep vertical | Scope PM-JAY, ABDM and HWC/CPHC as connected but non-interchangeable components |
| 8 | POSHAN 2.0 / ICDS | Programme-specific source boundary not established | Identify public indicator tables, Poshan Tracker metadata availability and restricted-system gaps |
| 9 | National Mental Health Programme | Programme-specific source boundary not established | Inventory NMHP/DMHP and applicable HWC mental-health sources before extraction |

## Cross-cutting trust foundation

1. **TRUST-01 — Governance charter — Complete.** Published the [Governance Charter](GOVERNANCE-CHARTER.md), [contribution workflow](../CONTRIBUTING.md), [decision log](GOVERNANCE-DECISION-LOG.md) and issue templates. The adopted interim model documents single-maintainer dependency, role-based decision rights, review states, corrections, conflicts, cadence and succession without implying institutional stewardship or custodian approval.
2. **TRUST-02 — Versioned JSON Schemas — Complete.** Published Draft 2020-12 package `1.0.0` with contracts for indicator manifestations, source documents, HMIS objects, graph nodes and edges, evidence gaps, programme releases and review/change events. The [schema guide](SCHEMA-GUIDE.md) documents compatibility, versioning and the boundary between structural validation, semantic review, computability and custodian approval. Legacy tuple and graph-review compatibility paths are explicit and temporary rather than silent normalization.
3. **TRUST-03 — Metadata-quality specification — Complete.** Adopted `PHAOS-MDQ-001` version `1.0.0`: nine weighted dimensions, criterion states, missing-value rules and A–E computed quality levels. The validator scored 3,708 named records with zero critical identity errors and published an aggregate report; 43 positional NP-NCD tuples remain deliberately unscored pending named-object migration. The governed relationship vocabulary publishes direction, allowed node types, evidence requirements and no-automatic-aggregation rules. Legacy `metadataLevel` and `completeness` values are retained as historical release metadata rather than silently relabelled as computed quality.
4. **TRUST-04 — Persistent identity and lifecycle policy — Complete.** Adopted [`PHAOS-IDENTITY-001`](IDENTITY-LIFECYCLE-POLICY.md), retaining existing released IDs, separating canonical, manifestation, representation and report-occurrence identity, and governing business/source/schema versions plus `effectiveDate`, `retirementDate`, `replaces` and `replacedBy`. The generated baseline validates 4,743 canonical objects, 4,797 representations and 560 report-column occurrences.
5. **TRUST-05 — Entry-level provenance and change events — Pending.** Add reviewer identity or role, review method, review date, source-access date, changed fields, change reason and review status while preserving prior versions.
6. **TRUST-06 — Automated release validation — Pending.** Validate schemas, unique IDs, source links, formula/scale/denominator consistency, graph integrity, lifecycle rules and release counts in CI.
7. **TRUST-07 — Source-change monitoring — Pending.** Combine link checks, source-version/content fingerprints and a human review queue; a successful HTTP response alone must not imply unchanged meaning.

## Unified registry workstream

1. **UNIFY-01 — Unified object taxonomy — Complete.** Adopted [`PHAOS-OBJECT-TAXONOMY-001`](UNIFIED-REGISTRY-TAXONOMY.md) for indicators, data elements, published outputs, validation rules, report-field occurrences, reporting dimensions, source documents, evidence gaps and a reserved observation/aggregate-value class. Source labels remain separate from Analytics-OS discovery classes.
2. **UNIFY-02 — Persistent cross-registry identity — Complete.** Published the [identity and lifecycle policy](IDENTITY-LIFECYCLE-POLICY.md), machine-readable policy and generated identity index. Fifty-four shared HMIS indicator IDs resolve to one canonical object with two representations rather than duplicate objects.
3. **UNIFY-03 — Programme versus system/portal facets — Complete.** Adopted `PHAOS-DISCOVERY-FACETS-001`, removed HMIS from the Programme facet, added a System / portal filter and retained source-reported labels separately. The HMIS system facet currently retrieves 130 indicator records across programmes; the 54-record HMIS-derived subset remains a distinct object/source classification.
4. **UNIFY-04 — Single discovery interface — Complete.** Registry is now the common entry point for the deduplicated content overview, 3,751 indicators, 1,046 HMIS knowledge objects and 560 report-column occurrences. Indicator and HMIS views retain class-appropriate filters and both provide card/table modes; legacy HMIS anchors activate their Registry subviews, and graph hand-off remains available. The interface is federated in the browser pending UNIFY-05 rather than claiming one consolidated data payload.
5. **UNIFY-05 — Consolidated read model — Pending.** Build the UI-facing record index from canonical identities and source representations without copying or overwriting source metadata.
6. **UNIFY-06 — Report-schema occurrence layer — Pending.** Surface 560 version-specific report columns, their canonical links, dimensions and candidate status without inflating canonical data-element counts.
7. **UNIFY-07 — Relationship navigation — Pending.** Add reciprocal navigation among indicators, data elements, outputs, rules, occurrences, sources and graph nodes.
8. **UNIFY-08 — Result summaries — Pending.** Show object-type and system counts clearly so “54 HMIS indicators” is not mistaken for the complete HMIS knowledge layer.
9. **UNIFY-09 — Observation-ready model — Pending.** Define a separate privacy- and provenance-aware structure for future aggregate values; do not imply that metadata definitions contain observed values.
10. **UNIFY-10 — Validation and release — Pending.** Add automated count, identity, linkage, filter, accessibility and regression gates while keeping public bulk-download controls disabled.

## Analyst and programme-utility workstream

1. **UTILITY-01 — Discovery fields — Pending.** Surface reporting frequency, responsible cadre, data availability, review status, lifecycle and computability maturity as filters or prominent metadata.
2. **UTILITY-02 — Controlled disaggregation model — Pending.** Separate source-required, system-available and analyst-recommended dimensions for age, sex, geography, social category, facility type, disease and programme-specific stratifiers.
3. **UTILITY-03 — Data-quality and comparability pilot — Pending.** Add known issues, expected reporting lag, common misinterpretations, validation checks, minimum data requirements and source-aware comparability notes for 30–50 priority India indicators.
4. **UTILITY-04 — Targets and reference values — Pending.** Model target and observed values as separate versioned entities carrying geography, period, authority and source; do not overwrite the indicator definition with a single current value.
5. **UTILITY-05 — Response guidance — Pending.** Link actions and thresholds only to an explicit official SOP or guideline; otherwise mark guidance unavailable or advisory.
6. **UTILITY-06 — Tested calculation templates — Pending.** Create pseudocode and SQL examples with inputs, exclusions, period, aggregation, zero-denominator rules and test cases for 20–30 priority computable indicators.

## Operational-system mapping workstream

1. **OPMAP-01 — Mapping policy — Pending.** Require system/instance namespace, metadata version, field or UID, category combination, mapping direction, confidence, evidence and validity period. Treat DHIS2 identifiers as instance-specific unless authority proves otherwise.
2. **OPMAP-02 — HMIS/DHIS2 pilot — Blocked by evidence.** Apply the policy to an authorized current metadata export; retain public-source labels where operational UIDs are unavailable.
3. **OPMAP-03 — NTEP operational mapping — Blocked by evidence.** Map Ni-kshay fields only from an authorized versioned dictionary or export.
4. **OPMAP-04 — NP-NCD operational mapping — Blocked by evidence.** Map National NCD Portal, AMRIT and CBAC fields only from authoritative versioned evidence.

## Semantic Web workstream

**SEM-00 — Existing semantic asset inventory — Complete.** The registry already publishes JSON-LD, a Schema.org profile, a canonical namespace, a graph contract and controlled vocabularies.

1. **SEM-01 — SKOS mapping policy — Pending.** Bind exact, close, broad, narrow and related mappings to formal SKOS predicates with direction and no-false-equivalence tests.
2. **SEM-02 — RDF distributions — Pending.** Publish versioned JSON-LD/Turtle distributions using Schema.org, SKOS, PROV-O and DCAT while preserving Analytics-OS evidence and aggregation-safety assertions.
3. **SEM-03 — SHACL validation — Pending.** Define and execute shapes for required identities, source provenance, mapping direction, evidence status and controlled vocabularies.
4. **SEM-04 — Resolvable canonical representations — Pending.** Make each canonical URI return or link to human-readable HTML and versioned machine-readable representations.

## Parallel FHIR foundation workstream

FHIR-00 is the completed evaluation. The remaining tasks are intentionally separate from programme extraction.

1. **FHIR-00 — Feasibility and role assessment — Complete.** Establish FHIR as an operational interoperability layer alongside the existing Schema.org discovery layer.
2. **FHIR-01 — Version policy — Pending.** Adopt FHIR R4 as the initial India-facing export aligned with the ABDM implementation guide; document the R4-to-R5 transformation policy.
3. **FHIR-02 — Canonical identity implementation — Pending; TRUST-04 dependency satisfied.** Apply the shared canonical URL, resource identifier, business-version and source-revision policy to FHIR artifacts.
4. **FHIR-03 — Source-authority policy — Pending.** Distinguish the original custodian from Analytics-OS as the publisher of a derived FHIR representation; prohibit implied custodian endorsement.
5. **FHIR-04 — Computability maturity model — Pending.** Implement the stages `metadata mapped`, `structurally specified`, `computable`, `tested` and `custodian approved`.
6. **FHIR-05 — Core Measure profile — Pending.** Define the minimum required metadata, official-name preservation, population descriptions, scoring, scale, direction, source reference and aggregation guidance.
7. **FHIR-06 — Registry extensions — Pending.** Minimize and govern extensions for official-name status, metadata completeness, evidence boundary, zero-denominator rule, lowest reporting level and review status.
8. **FHIR-07 — Local vocabularies — Pending.** Define provisional CodeSystems and ValueSets for programme, component, reporting level, WHO building block, measure type, computability stage and review status.
9. **FHIR-08 — ConceptMap policy — Pending; depends on SEM-01.** Translate reviewed close, broad, narrow and related mappings with direction tests; reserve equivalence for formally proven cases.
10. **FHIR-09 — HMIS modelling policy — Pending.** Decide when a raw HMIS object becomes Questionnaire content, Observation/ObservationDefinition, StructureDefinition, Library validation logic or Measure.
11. **FHIR-10 — Provenance and source-document pattern — Pending; depends on TRUST-05.** Reuse the shared provenance model in Organization, RelatedArtifact/DocumentReference, Provenance and optional R5 Citation representations.
12. **FHIR-11 — Security and publication boundary — Pending.** Keep the public implementation guide definition-only and aggregate-only; exclude identifiable patient data from GitHub Pages.
13. **FHIR-12 — Ten-indicator pilot selection — Pending.** Select percentage, population-rate, ratio, count and index examples across NTEP, RMNCH+A, Immunization, NP-NCD and HMIS.
14. **FHIR-13 — Pilot Measure resources — Pending.** Generate metadata-level R4 Measure instances without inventing executable criteria.
15. **FHIR-14 — Pilot ConceptMap and provenance resources — Pending.** Generate mapping assertions, source organizations and transformation provenance.
16. **FHIR-15 — Aggregate MeasureReport examples — Pending.** Create synthetic facility, district and state examples; label all examples as non-production test data.
17. **FHIR-16 — Profiles and validation pipeline — Pending.** Add FHIR Shorthand, SUSHI/IG Publisher inputs and automated base/profile validation.
18. **FHIR-17 — Computable subset — Pending.** Implement CQL/Library logic only for pilot indicators with sufficient authoritative criteria and test data.
19. **FHIR-18 — Domain review — Pending.** Review population logic, denominator exclusions, period, unit, direction, aggregation and stratifiers with public-health experts.
20. **FHIR-19 — Implementation Guide publication — Pending.** Publish the versioned Analytics-OS FHIR R4 implementation guide and static machine-readable package. Static publication is not described as a FHIR REST or terminology service.
21. **FHIR-20 — Website integration — Pending.** Link HTML, Schema.org, RDF and FHIR representations using the same stable registry identity; do not add public bulk-download controls unless separately authorized.
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

## Repeatable enrichment checklist for every programme

Instantiate this checklist for each new programme and repeat affected tasks when its source boundary changes. PF-01–PF-13 remains the nested FHIR checklist.

1. **PR-01 — Freeze the source boundary.** Record documents, tables, portals, versions, cut-off date, inclusion rule, exclusions and restricted evidence gaps.
2. **PR-02 — Inventory and classify objects.** Separate official indicator manifestations, raw elements, forms, outputs, validation rules, concepts, targets and source documents.
3. **PR-03 — Preserve official metadata.** Retain official name, definition, code, source organization, source location and version without silent rewriting.
4. **PR-04 — Add normalized measure metadata.** Classify measure type, scale, numerator, denominator population, formula, aggregation and zero-denominator rule only when supported.
5. **PR-05 — Map operational context.** Record reporting frequency and levels, reporting unit, responsible cadre, facility/community applicability and controlled disaggregations.
6. **PR-06 — Document analytical cautions.** Add source-aware data-quality issues, comparability notes, expected lag, minimum data requirements and common misinterpretations.
7. **PR-07 — Model targets and response guidance separately.** Attach versioned targets, reference values and official response protocols without changing indicator identity.
8. **PR-08 — Map operational systems when evidenced.** Apply OPMAP-01 and retain unavailable or restricted identifiers as explicit gaps.
9. **PR-09 — Extend and review the knowledge graph.** Add concepts and typed mappings with rationale, direction, evidence, review status and aggregation safety.
10. **PR-10 — Execute the programme FHIR checklist.** Instantiate PF-01–PF-13 after the programme source boundary is governed.
11. **PR-11 — Attach provenance and lifecycle.** Apply TRUST-04 and TRUST-05, including supersession and entry-level change events.
12. **PR-12 — Validate, release and update trackers.** Run programme, registry and graph QA; publish only the achieved maturity and preserve previous versions.

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

SNOMED CT, ICD, LOINC and related standards remain deliberately deferred. FHIR profiles will reserve properly versioned terminology fields, but no external terminology mapping will be accepted until each standard's role, licensing, release/version policy, mapping direction and validation process are reviewed separately. Financing, governance, service-coverage and programme-performance indicators must not be forced into clinical terminology systems.

1. **TERM-01 — Standards role and licence assessment — Deferred.** Evaluate each terminology independently and document permitted use and publication.
2. **TERM-02 — Terminology eligibility model — Deferred.** Decide which clinical conditions, procedures, observations or specimens are eligible and explicitly allow `no appropriate mapping`.
3. **TERM-03 — Small programme pilot — Deferred.** Map a reviewed NTEP/RMNCH+A subset with terminology version, mapping relation and evidence.
4. **TERM-04 — Validation and domain review — Deferred.** Test codes against the declared edition or licensed service and obtain clinical/informatics review.
5. **TERM-05 — Publication policy — Deferred.** Publish only licence-compliant mappings with provenance and validity dates.

## Derived analytical-products workstream

1. **PRODUCT-01 — Programme Officer's Brief pilot — Deferred; depends on UTILITY-03–UTILITY-05.** Generate a source-aware brief for one programme without implying access to current values that are not in Analytics-OS.
2. **PRODUCT-02 — Dashboard configuration audit — Deferred; depends on OPMAP-02 and UTILITY-06.** Compare an authorized DHIS2 configuration export with registry identities, formulas and disaggregations.
3. **PRODUCT-03 — Indicator calculation assistant — Deferred; depends on TRUST-02 and UTILITY-06.** Provide tested computation guidance with explicit evidence and computability status.
4. **PRODUCT-04 — Source-change review queue — Deferred; depends on TRUST-07.** Present detected upstream changes for human review and controlled release decisions.

A future terminology server is an infrastructure decision after TERM-01–TERM-05 and the FHIR pilot. GitHub Pages may host static artifacts but cannot execute FHIR terminology operations such as `$lookup`, `$expand` or `$validate-code`.
