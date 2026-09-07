# Analytics-OS governance decision log

This log records material governance decisions separately from indicator and software change history.

## GOV-DEC-001 — Adopt the project governance charter

- **Date:** 7 September 2026
- **Status:** Adopted
- **Decision owner:** Project Owner, acting under the interim single-maintainer model
- **Decision:** Adopt `PHAOS-GOV-001` version `1.0.0` as the governance charter for Analytics-OS.
- **Reason:** The registry has expanded into a multi-programme knowledge infrastructure and requires explicit authority boundaries, review states, contribution rules, correction handling and succession provisions before formal schema, provenance and interoperability work proceeds.
- **Boundary:** This is project governance only. It does not constitute approval, partnership or stewardship by any ministry, programme, institution or source custodian.
- **Alternatives considered:** Continue with informal repository ownership; defer governance until institutional partners participate. Both were rejected because they would leave current decision rights and limitations undocumented.
- **Consequences:** TRUST-01 is complete. TRUST-02 becomes the next trust-foundation task. Legacy review labels will be audited later under TRUST-05 rather than silently upgraded.
- **Supersedes:** None.

## GOV-DEC-002 — Adopt versioned JSON Schema package 1.0.0

- **Date:** 7 September 2026
- **Status:** Adopted
- **Decision owner:** Project Owner, acting under the interim single-maintainer model
- **Decision:** Adopt JSON Schema Draft 2020-12 package `1.0.0` as the structural contract for indicator manifestations, source documents, HMIS objects, graph nodes and edges, evidence gaps, programme releases, review events and change events.
- **Reason:** Registry, HMIS, programme and graph artifacts require explicit, machine-testable contracts before quality scoring, lifecycle, provenance and automated release gates can be implemented safely.
- **Evidence:** The package was syntax-checked and exercised against the Release 3.7 registry, source catalogue, HMIS catalogue, graph and programme releases using the compatibility rules declared in the versioned manifest.
- **Boundary:** Schema validity is structural only. It does not imply source currency, semantic equivalence, aggregation safety, computability, domain review, custodian approval or institutional endorsement.
- **Alternatives considered:** Immediately force all legacy records into one closed canonical schema; publish permissive schemas without core constraints. Both were rejected because the first would erase source-specific structure and the second would provide little governance value.
- **Affected artifacts:** `indicators/data/schemas/1.0.0`, the schema catalogue, `docs/SCHEMA-GUIDE.md` and the workstream trackers.
- **Migration and review date:** Temporary legacy tuple and graph-review compatibility paths are reviewed under TRUST-05 and TRUST-06; the package is reviewed no later than 7 September 2027.
- **Supersedes:** None.

## GOV-DEC-003 — Adopt metadata-quality profile and relationship vocabulary 1.0.0

- **Date:** 7 September 2026
- **Status:** Adopted
- **Decision owner:** Project Owner, acting under the interim single-maintainer model
- **Decision:** Adopt `PHAOS-MDQ-001` version `1.0.0` as the computed indicator-metadata completeness profile and `PHAOS-REL-001` version `1.0.0` as the graph relationship vocabulary.
- **Reason:** Existing `metadataLevel` and `completeness` fields were assigned across historical releases without one published, reproducible scoring rule. Graph predicates and mapping terms existed but required a consumer-facing direction, evidence and aggregation-safety contract.
- **Evidence:** The validator scored all 3,708 named indicator records, found zero duplicate or critical identity errors, and reproduced the committed aggregate report exactly. The audit found 19 percentage-denominator quality issues and left 43 positional programme tuples unscored because their field meaning is not represented as named object properties.
- **Boundary:** The computed score measures metadata completeness and explicitness only. It does not rate validity, source authority, observed-data quality, comparability, computability, fitness for purpose, domain review or custodian approval.
- **Alternatives considered:** Reinterpret legacy levels as quality grades; overwrite all historical scores; award no credit for explicitly declared gaps; score positional tuples by inferred column position. These were rejected because they would erase provenance, hide uncertainty or create false precision.
- **Affected artifacts:** `docs/METADATA-QUALITY-SPECIFICATION.md`, `indicators/data/governance/metadata-quality-profile.json`, `metadata-quality-report.json`, `relationship-vocabulary.json`, `scripts/validate-metadata-quality.mjs`, the Method page and both workstream trackers.
- **Migration and review date:** Entry-level computed properties and change events are governed under TRUST-05; automated release enforcement is governed under TRUST-06. Review no later than 7 September 2027.
- **Supersedes:** Legacy `metadataLevel` and `completeness` as interpreted quality grades, but not as retained historical fields.

## GOV-DEC-004 — Adopt unified object taxonomy and persistent identity policy

- **Date:** 7 September 2026
- **Status:** Adopted
- **Decision owner:** Project Owner, acting under the interim single-maintainer model
- **Decision:** Adopt `PHAOS-OBJECT-TAXONOMY-001` version `1.0.0` and `PHAOS-IDENTITY-001` version `1.0.0`. Existing released IDs become initial canonical object IDs; source manifestations, serialized representations and report-schema occurrences receive separate identities.
- **Reason:** The main indicator registry and HMIS knowledge layer expose different object classes. A common taxonomy and persistent identity layer are required to combine discovery without calling every object an indicator or displaying shared HMIS indicators twice.
- **Evidence:** The generated baseline reconciles 3,751 indicators, 765 HMIS data elements, 202 published outputs and 25 validation rules into 4,743 canonical objects. It retains 4,797 representations, resolves 54 shared registry/HMIS identities, and records 560 report-column occurrences with 508 canonical links and 17 non-canonical candidates.
- **Boundary:** Identity reconciliation does not establish semantic equivalence, aggregation safety, computability, source currency, observed-value availability or source-custodian approval.
- **Alternatives considered:** Flatten every HMIS object into the indicator registry; assign new IDs to all historical records; merge records by label similarity. These were rejected because they would create type confusion, break stable links or assert unsupported equivalence.
- **Affected artifacts:** `docs/UNIFIED-REGISTRY-TAXONOMY.md`, `docs/IDENTITY-LIFECYCLE-POLICY.md`, `indicators/data/governance/object-taxonomy.json`, `identity-policy.json`, `unified-identity-index.json`, generation and validation scripts, and both workstream trackers.
- **Migration and review date:** UI consolidation proceeds under UNIFY-03–UNIFY-10. Resolvable entry representations remain governed by SEM-04. Review no later than 7 September 2027.
- **Supersedes:** The interim persistent-identity gap recorded after GOV-DEC-002; it does not supersede existing source IDs.

## GOV-DEC-005 — Separate programme and system/portal discovery facets

- **Date:** 7 September 2026
- **Status:** Adopted
- **Decision owner:** Project Owner, acting under the interim single-maintainer model
- **Decision:** Adopt `PHAOS-DISCOVERY-FACETS-001` version `1.0.0`. Programme represents a policy or service-delivery vertical; System / portal represents an information or reporting platform. HMIS is excluded from Programme and included under System / portal.
- **Reason:** The prior Programme → HMIS option returned only the 54 HMIS-derived indicators and implied that HMIS was a programme and that the result was the whole HMIS knowledge layer.
- **Evidence:** Browser validation confirms that Programme no longer contains HMIS, System / portal does, the unfiltered registry retains 3,751 indicators and the HMIS system facet retrieves 130 indicators whose governed metadata explicitly references HMIS.
- **Boundary:** System/portal tagging is for discovery. It does not establish an operational field mapping, platform UID, current authenticated dictionary, semantic equivalence or data availability.
- **Affected artifacts:** Registry filters, card/table/detail metadata, `indicators/data/governance/discovery-facets.json`, the unified taxonomy documentation and both workstream trackers.
- **Migration and review date:** The consolidated object read model under UNIFY-05 will consume the machine-readable facet vocabulary and add automated drift checks under UNIFY-10. Review no later than 7 September 2027.
- **Supersedes:** The former UI treatment of Health Management Information System as an India programme facet.

## GOV-DEC-006 — Make Registry the common discovery interface

- **Date:** 7 September 2026
- **Status:** Adopted
- **Decision owner:** Project Owner, acting under the interim single-maintainer model
- **Decision:** Make `#registry` the common entry point for the canonical overview, indicator explorer, HMIS knowledge-object explorer and observed report-schema view. Preserve type-specific filters and metadata rather than flattening records into one generic card.
- **Reason:** Separate page sections obscured the relationship between 3,751 indicators, 1,046 HMIS objects and 560 report-column occurrences and made the 54 shared indicator identities appear to represent the whole HMIS layer.
- **Evidence:** Browser tests verify the 4,743-object overview, 3,751-indicator view, 1,046-object HMIS view, 765-element filter, card/table modes, report-schema view, legacy anchors, Registry navigation state and zero page errors.
- **Boundary:** UNIFY-04 federates the existing source arrays in one interface. It does not yet replace them with a published consolidated read model; that is UNIFY-05. Report occurrences remain summarized until UNIFY-06.
- **Affected artifacts:** `indicators/index.html`, `app.js`, `hmis.js`, `styles.css`, and both workstream trackers.
- **Migration and review date:** Build and validate the consolidated read model under UNIFY-05, then expose occurrence-level discovery under UNIFY-06. Review no later than 7 September 2027.
- **Supersedes:** The separate HMIS and report-schema discovery sections as primary navigation destinations; their anchors remain compatibility routes.

## GOV-DEC-007 — Publish a consolidated discovery read model

- **Date:** 7 September 2026
- **Status:** Adopted
- **Decision owner:** Project Owner, acting under the interim single-maintainer model
- **Decision:** Generate and publish `PHAOS-UNIFIED-READ-MODEL` version `1.0.0` from the canonical identity index and governed source artifacts. Use it as the sole browser source for indicator and HMIS record arrays while preserving source-specific indicator and HMIS metadata in separate namespaces.
- **Reason:** Browser-side expansion and federation duplicated build rules, allowed discovery facets to drift from their governed vocabulary, and made it difficult to verify that all interface views used the same identity baseline.
- **Evidence:** The validator resolves 4,743 canonical objects, 4,797 representations, 3,751 indicator memberships, 1,046 HMIS memberships, 54 shared identities and 560 occurrences; all 508 canonical occurrence links resolve, all 17 candidates remain non-canonical, and the HMIS system facet retains 130 indicator manifestations.
- **Boundary:** The read model is a static discovery projection, not a new source of truth or observed-value dataset. Consolidation does not assert semantic equivalence, aggregation safety, computability, source currency or custodian approval. Public bulk-download controls remain disabled.
- **Alternatives considered:** Continue assembling five record sources in each browser; flatten shared indicator/HMIS records into one generic object. These were rejected because they preserve runtime drift or erase source-specific meaning.
- **Affected artifacts:** `indicators/data/registry`, the read-model build and validation scripts, `app.js`, `hmis.js`, documentation and workstream trackers.
- **Migration and review date:** Expose occurrence-level discovery under UNIFY-06 and include the model validator in automated release gates under UNIFY-10. Review no later than 7 September 2027.
- **Supersedes:** The browser-federated implementation boundary recorded in GOV-DEC-006; it does not supersede the canonical identity index or source artifacts.

## GOV-DEC-008 — Surface report columns as first-class occurrences

- **Date:** 7 September 2026
- **Status:** Adopted
- **Decision owner:** Project Owner, acting under the interim single-maintainer model
- **Decision:** Expose every version-specific report column as a searchable occurrence record within Registry, separately classifying measures and reporting dimensions and retaining canonical-link, candidate and review evidence.
- **Reason:** A schema-level summary disclosed counts but did not let users discover the individual data points, dimension keys or reconciliation decisions represented by the observed report.
- **Evidence:** Browser and model validation return 560 occurrences: 525 measures, 35 dimensions, 508 accepted canonical links and 17 held candidates. Card and table views, filters and occurrence details work without changing the 4,743 canonical-object or 765 HMIS data-element counts.
- **Boundary:** An occurrence is a field appearance in one observed schema, not another canonical object. Candidate fields remain unpromoted, reporting applicability remains row-dependent where source data are unavailable, and publication does not imply national/current applicability or custodian approval.
- **Alternatives considered:** Promote all unmatched fields; mix occurrences into canonical HMIS search results; retain only schema-level counts. These were rejected because they would inflate identities, obscure version context or leave individual report data points undiscoverable.
- **Affected artifacts:** Consolidated read model 1.1.0, report-schema Registry interface, validation script, styles, documentation and workstream trackers.
- **Migration and review date:** Add reciprocal canonical-object and occurrence navigation under UNIFY-07. Review no later than 7 September 2027.
- **Supersedes:** The occurrence-summary-only boundary recorded in GOV-DEC-006 and GOV-DEC-007.

## GOV-DEC-009 — Publish reciprocal evidence navigation

- **Date:** 7 September 2026
- **Status:** Adopted
- **Decision owner:** Project Owner, acting under the interim single-maintainer model
- **Decision:** Generate reciprocal, resolvable navigation from governed metadata and reviewed crosswalks among canonical indicators, HMIS objects, report occurrences, source evidence and matching graph nodes. Preserve relationship direction, status and evidence.
- **Reason:** IDs and relationships existed across separate views, but users could not reliably follow them in both directions or distinguish curated relationships from candidates.
- **Evidence:** Read-model validation resolves 536 assertions as 1,072 reciprocal relationship entries, 508 canonical-to-occurrence reverse paths, 4,797 source-evidence paths and 1,564 graph-node links with zero unresolved relationship targets. Browser tests complete the indicator → data element → occurrence → canonical object → graph → Registry loop on desktop and mobile.
- **Boundary:** Navigation exposes existing evidence; it does not upgrade candidate matches, assert semantic equivalence, authorize aggregation, establish computability or promote report candidates. External source links identify evidence but do not make Analytics-OS the source custodian.
- **Alternatives considered:** Infer links from labels at runtime; display only outbound relations; merge graph and Registry identities indiscriminately. These were rejected because they would be non-reproducible, incomplete or semantically unsafe.
- **Affected artifacts:** Consolidated read model 1.2.0, indicator/HMIS/occurrence modals, graph detail panel, navigation styles, validators, documentation and workstream trackers.
- **Migration and review date:** Add result-level relationship summaries under UNIFY-08 and automated navigation gates under UNIFY-10. Review no later than 7 September 2027.
- **Supersedes:** One-way and view-local navigation behavior through UNIFY-06.

## GOV-DEC-010 — Publish class-aware, filter-aware result summaries

- **Date:** 7 September 2026
- **Status:** Adopted
- **Decision owner:** Analytics-OS maintainer
- **Decision:** Every primary Registry discovery view must summarize its current filtered result with the applicable object classes, active filters and leading categories. Each summary must state its counting boundary; the HMIS view must distinguish its 54 derived indicators from all 1,046 HMIS knowledge objects.
- **Reason and evidence:** A result count without its object class can make a filtered indicator subset appear to be the complete knowledge layer. Dynamic summaries make the existing taxonomy and identity model visible at the point of interpretation.
- **Alternatives considered:** Static explanatory copy alone was rejected because it does not reflect active filters. Combining indicators, HMIS objects and report occurrences into one undifferentiated count was rejected because their identities and analytical roles differ.
- **Affected artifacts or decision rights:** Registry interface, styles, result-count language, workstream tracker and documentation. No source record, canonical identity, evidence status or quality score is changed.
- **Migration and review date:** Add automated result-summary count and accessibility gates under UNIFY-10. Review no later than 7 September 2027.
- **Supersedes:** Ambiguous view-local result counts through UNIFY-07.

## GOV-DEC-011 — Separate definitions, aggregate observations and reference values

- **Date:** 7 September 2026
- **Status:** Adopted
- **Decision owner:** Analytics-OS maintainer
- **Decision:** Adopt `PHAOS-OBSERVATION-001` and schema package 1.1.0. Aggregate observations receive independent immutable version IDs and stable grain keys; they link to a governed indicator or data element and require context, period, provenance, revision, privacy and suppression metadata. Targets and thresholds use a separate reference-value contract. Person-level records are prohibited.
- **Reason and evidence:** Indicator definitions describe what to measure, while observations report a value and reference values describe an expected or decision threshold. Combining them would obscure provenance, period, applicability, revision and privacy boundaries.
- **Alternatives considered:** Embedding latest values or targets into indicator records was rejected because it rewrites history and collapses distinct authorities. Publishing an empty generic value field was rejected because it lacks grain, lineage, revision and disclosure controls.
- **Affected artifacts or decision rights:** Object taxonomy 1.1.0, schema package 1.1.0, observation manifest, validator, Registry method display and workstream tracker. Data ingestion still requires source, privacy, licensing, domain and analytical review.
- **Migration and review date:** No value migration is needed because zero observations and zero reference values are published. Reassess at the first authorized ingestion and no later than 7 September 2027.
- **Supersedes:** The reserved but undefined observation class in taxonomy 1.0.0.

## Decision record template

- **ID and title:**
- **Date:**
- **Status:** Proposed / Adopted / Superseded / Retired
- **Decision owner:**
- **Reviewers and declared interests:**
- **Decision:**
- **Reason and evidence:**
- **Alternatives considered:**
- **Affected artifacts or decision rights:**
- **Migration and review date:**
- **Supersedes / superseded by:**
