# Public Health Analytics-OS — Agile delivery roadmap

**Roadmap ID:** `PHAOS-ROADMAP-001`  
**Version:** 1.0.0  
**Planning baseline:** 12 October 2026  
**Horizon:** one reconciliation sprint plus six delivery sprints  
**Cadence:** Sprint 0 is one week; Sprints 1–6 are two weeks each  
**Authority:** this roadmap operationalizes the [Programme and Workstream Tracker](PROGRAMME-WORKSTREAM-TRACKER.md). Source evidence and adopted governance policies remain authoritative when a conflict appears.

## 1. Product goal

Make Public Health Analytics-OS a trustworthy, source-bounded and reusable discovery system for public-health indicators and related knowledge objects, with explicit provenance, reproducible releases, governed semantics and programme-level depth.

The roadmap protects five non-negotiable boundaries:

1. Official/source indicator names are preserved.
2. Indicators, data elements, outputs, validation rules, report occurrences and observations remain distinct object classes.
3. Coverage is described only within declared source boundaries.
4. No operational identifier, equivalence, formula or guidance is invented where authoritative evidence is unavailable.
5. Public bulk-download controls remain disabled until an explicit governance decision changes that policy.

## 2. Planning baseline

### Completed foundations

- `TRUST-01` governance charter, `TRUST-02` versioned schemas, `TRUST-03` metadata-quality rules and `TRUST-04` identity/lifecycle policy.
- `UNIFY-01` through `UNIFY-09`: unified taxonomy, identity, facets, discovery interface, consolidated read model, report occurrences, reciprocal navigation, result summaries and an observation-ready model.
- Five programme graph/release layers: NTEP, RMNCH+A, Immunization, vector-borne disease foundation and NP-NCD.
- Current validated baseline: 4,743 canonical objects, 4,797 source representations, 3,751 indicators, 1,046 HMIS objects and 560 report-column occurrences.

### Reconciled legacy-plan disposition

| Legacy theme | Decision | Roadmap destination |
|---|---|---|
| Search architecture | Benchmark first; do not replace the working registry by assumption | Sprint 5 |
| Alternative completeness score | Superseded by `PHAOS-MDQ-001` | Archive in Sprint 0 |
| Source verification | Retain and adapt to canonical IDs and current fields | Sprint 2 |
| Crosswalks | Implement as governed graph relationships, not free-form downloads | Sprints 3–4 |
| Disaggregation | Redesign into evidence-separated dimensions | Sprint 3 |
| Programme expansion | Continue VBD; execute IDSP/IHIP before adding lower-priority verticals | Sprint 6 |
| DHIS2 mapping | Blocked pending an authorized, versioned instance export | Blocked backlog |
| Stable URIs and citation | High priority; DOI follows licensing and authorship review | Sprint 4 |

## 3. Prioritization model

| Class | Meaning | Selection rule |
|---|---|---|
| `P0 / Must` | Release safety, identity, evidence or regression protection | Must complete before the dependent release |
| `P1 / Should` | High user value or major trust/utility improvement | Schedule in the stated sprint unless a P0 defect intervenes |
| `P2 / Could` | Useful optimization or expansion | Deliver only after sprint P0/P1 acceptance criteria pass |
| `Blocked` | Requires evidence, authority or infrastructure not available | Keep visible; do not fabricate a substitute |
| `Won't now` | Explicitly outside this roadmap horizon | Reassess at roadmap review, not during a sprint |

Within a priority class, sequence by: patient/public-health risk → data-integrity risk → dependency leverage → user value → effort. Work-in-progress limit is **two active stories per delivery role**.

## 4. Epics

| Epic | Outcome | Priority | Target |
|---|---|---:|---|
| `E0` Plan reconciliation | One authoritative backlog without duplicate or incompatible work | P0 | Sprint 0 |
| `E1` Release trust gate | Every publication is reproducibly validated against adopted contracts | P0 | Sprint 1 |
| `E2` Provenance and change intelligence | Entry-level review history and source-change triage are visible | P0 | Sprint 2 |
| `E3` Analytical utility | Users can find and interpret governed disaggregation and quality guidance | P1 | Sprint 3 |
| `E4` Semantic publication | Stable identities resolve to validated human- and machine-readable representations | P1 | Sprint 4 |
| `E5` Discovery performance | Search remains fast and complete across every object class and no-JS fallback | P2, conditional | Sprint 5 |
| `E6` Programme expansion | IDSP/IHIP begins under a declared boundary; VBD and mapping policy deepen | P1 | Sprint 6 |
| `E7` Interoperability standards | FHIR and terminology work follows a repeatable, evidence-gated programme template | P1/P2 | Parallel foundation |

## 5. Sprint roadmap

### Sprint 0 — Reconcile and establish the delivery baseline

**Status:** Complete — 12 October 2026. Evidence: [`PHAOS-RECON-001`](LEGACY-PLAN-RECONCILIATION.md), [`PHAOS-BASELINE-2026-10-12`](DELIVERY-BASELINE-2026-10-12.md) and [`PHAOS-BACKUP-2026-10-12-01`](BACKUP-REGISTER.md).

**Sprint goal:** convert the evaluated four-sprint package and current workstream tracker into one executable backlog without merging incompatible code or claims.

| Story / ticket | User story and deliverable | Pri. | SP | Acceptance criteria |
|---|---|---:|---:|---|
| `S0-ST1 / RECON-01` | As product owner, I need every legacy ticket inventoried so no useful work is lost. Create a register of all legacy epics/stories/tickets and files. | P0 | 3 | Every item has source file, proposed epic, dependency and disposition; duplicate files are identified by hash. |
| `S0-ST2 / RECON-02` | As maintainer, I need explicit dispositions. Classify each item as completed, adapt, new, blocked, rejected or superseded. | P0 | 3 | 100% of inventoried items has one disposition and rationale; conflicts cite the adopted policy or current architecture. |
| `S0-ST3 / RECON-03` | As contributor, I need a clean workspace. Quarantine broken/duplicate proposed assets without deleting evidence. | P1 | 2 | Syntax-broken JS, duplicate scripts and incompatible workflows are excluded from production; an archive note preserves traceability. |
| `S0-ST4 / RECON-04` | As release manager, I need a signed baseline. Record counts, schemas, release SHA, known gaps and deployment path. | P0 | 3 | Baseline report reproduces current counts; public-download-disabled rule and blocked mappings are explicit; owner accepts backlog order. |

**Sprint UAT:** compare the reconciliation register with every supplied backlog, log, script and workflow; sample ten dispositions against the repository.  
**Sprint exit:** no unclassified legacy ticket; no legacy code merged into production merely because it exists.

### Sprint 1 — Integrated validation and release gate

**Sprint goal:** complete `UNIFY-10` and `TRUST-06` for the repository’s actual buildless/static architecture.

**Status:** Complete — 12 October 2026. Eight integrated gates, controlled-failure testing, browser UAT and GitHub Actions publication enforcement passed for Release 3.8.

| Story / ticket | User story and deliverable | Pri. | SP | Acceptance criteria |
|---|---|---:|---:|---|
| `S1-ST1 / VAL-01` | As maintainer, I need one validation entry point. Build an orchestrator for schema, semantic and UI-regression checks. | P0 | 5 | One documented command runs all gates, returns non-zero on failure and writes a machine-readable summary. |
| `S1-ST2 / VAL-02` | As data steward, I need identity and schema integrity. Validate current schema versions, object IDs, manifestations, representations and lifecycle links. | P0 | 5 | Zero duplicate canonical IDs; all required records validate; `replaces/replacedBy` pairs and schema versions are consistent. |
| `S1-ST3 / VAL-03` | As knowledge engineer, I need safe relationships. Validate sources, graph targets, reciprocal links and occurrence links. | P0 | 5 | No unresolved accepted target; candidate links remain target-free; every source-evidence path resolves; relationship direction rules pass. |
| `S1-ST4 / VAL-04` | As analyst, I need formula integrity. Test measure type, scale, numerator, denominator and percentage display rules. | P0 | 5 | Every percentage displays `(numerator ÷ denominator) × 100`; scale is explicit; count/rate/ratio rules flag inconsistent records. |
| `S1-ST5 / VAL-05` | As registry user, I need stable discovery. Add automated checks for counts, filters, card/table parity, deep links, keyboard access and responsive layouts. | P0 | 8 | Golden scenarios pass for indicators, HMIS objects and report fields; card/table counts match; key flows work at mobile and desktop widths. |
| `S1-ST6 / VAL-06` | As release manager, I need reproducible deployment. Run validation before publishing and create a release manifest. | P0 | 5 | Failed gates prevent release; manifest records source SHA, inputs, counts, schema versions, checksums and validation result; GitHub Pages deploy succeeds. |

**Sprint UAT:** UAT-01 to UAT-06 and UAT-12 from section 7.  
**Sprint exit:** no release can bypass a failed P0 gate; current production passes the full gate.

### Sprint 2 — Entry-level provenance and source-change monitoring

**Sprint goal:** complete `TRUST-05` and `TRUST-07`, adapting the useful source-verification work to the current canonical model.

**Status:** Complete — `PROV-01..PROV-04` shipped in Release 3.9; `MON-01..MON-02` shipped in Release 4.0 with 43 governed baselines, a five-source live pilot and a read-only weekly review-queue workflow.

| Story / ticket | User story and deliverable | Pri. | SP | Acceptance criteria |
|---|---|---:|---:|---|
| `S2-ST1 / PROV-01` | As reviewer, I need attributable review events. Extend provenance with reviewer role, method, dates, changed fields, reason and status. | P0 | 5 | Schema is versioned; prior representations remain valid through an explicit compatibility path; reviewer role is allowed where personal identity should not be public. |
| `S2-ST2 / PROV-02` | As steward, I need a realistic pilot. Apply the model to ten balanced, existing canonical records across global, India and HMIS layers. | P0 | 5 | All IDs resolve; two independent review roles are represented; history is append-only; no official wording is silently altered. |
| `S2-ST3 / PROV-03` | As editor, I need the verification queue to inspect the right fields. Repair the paraphrase/verification extractor for definitions, caveats and source notes. | P1 | 3 | Fixture tests detect known flags; zero-result runs distinguish “none found” from a field/configuration error; encoding is UTF-8 clean. |
| `S2-ST4 / PROV-04` | As user, I need to see trust state. Surface review status, last reviewed date, method and evidence in detail views. | P1 | 5 | Provenance is readable but not confused with source authority or custodian approval; unknown values display explicitly. |
| `S2-ST5 / MON-01` | As source curator, I need change detection. Add link status plus content/version fingerprints for governed sources. | P1 | 5 | HTTP success alone never marks meaning unchanged; redirects, content changes and inaccessible sources have distinct states. |
| `S2-ST6 / MON-02` | As programme reviewer, I need a triage queue. Generate human-review items from source changes. | P1 | 5 | Each item identifies affected records, prior/new fingerprint, detection date, severity and disposition; auto-update of definitions is prohibited. |

**Sprint UAT:** reviewers trace three edited and two unchanged sources; a user can distinguish source date, access date and review date.  
**Sprint exit:** pilot records have auditable change events; monitoring creates review work without changing meaning automatically.

### Sprint 3 — Governed discovery and disaggregation

**Sprint goal:** start `UTILITY-01–03` with a redesigned model that separates source evidence from analyst recommendation.

**Status:** In progress — `UTILITY-01..UTILITY-04` shipped through Release 4.4. All 4,743 objects have governed operational, disaggregation and quality-profile states; 20 source-bounded reference values cover 12 LaQshya indicators without mixing targets with observations. Next: `UTILITY-05` and the reviewed 20-record equity pilot (`DISAGG-03`).

| Story / ticket | User story and deliverable | Pri. | SP | Acceptance criteria |
|---|---|---:|---:|---|
| `S3-ST1 / DISC-01` | As analyst, I need operational discovery fields. Add frequency, cadre, availability, review status, lifecycle and computability maturity facets. | P1 | 5 | Facets use controlled values; “unknown” is not dropped; result counts and URL/deep-link state remain correct. |
| `S3-ST2 / DISAGG-01` | As equity analyst, I need disaggregation claims separated. Create source-required, system-available and analyst-recommended assertions. | P0 | 8 | Each assertion has dimension ID, status, evidence source/version, geography/applicability and review state; recommendation cannot masquerade as availability. |
| `S3-ST3 / DISAGG-02` | As steward, I need governed dimensions. Publish vocabularies for age, sex, geography, social category, facility type, disease and programme stratifiers. | P1 | 5 | Stable IDs, definitions, parent relationships and “not stated/unknown/not applicable” semantics are documented and validated. |
| `S3-ST4 / DISAGG-03` | As reviewer, I need an evidence-backed pilot. Map 20 existing canonical records across five domains. | P0 | 8 | All records resolve; every “available” claim has evidence; privacy/small-cell risks are recorded; two-person review reaches stated disposition. |
| `S3-ST5 / DISAGG-04` | As registry user, I need to inspect and filter dimensions. Add discovery and detail presentation. | P1 | 5 | UI visually distinguishes required, available and recommended; filters return the correct canonical records; mobile/keyboard UAT passes. |
| `S3-ST6 / DQ-01` | As analyst, I need interpretation safeguards. Add source-aware quality/comparability notes to 30 priority indicators. | P1 | 8 | Each record covers lag, common misinterpretation, minimum inputs, validation checks and comparability limits or explicitly records unavailable guidance. |

**Sprint UAT:** equity/public-health analysts test five questions involving sex, age, geography and facility type; privacy reviewer assesses pilot assertions.  
**Sprint exit:** no display collapses recommendation, source requirement and system availability into one field.

### Sprint 4 — Stable identifiers, semantic publication and citation

**Sprint goal:** deliver `SEM-01–04` and safe citation/publication foundations.

| Story / ticket | User story and deliverable | Pri. | SP | Acceptance criteria |
|---|---|---:|---:|---|
| `S4-ST1 / SEM-01` | As knowledge engineer, I need formal mapping semantics. Bind exact/close/broad/narrow/related mappings to SKOS predicates. | P0 | 5 | Direction, evidence and no-false-equivalence tests pass; mappings do not imply aggregation safety. |
| `S4-ST2 / SEM-02` | As machine user, I need reusable RDF. Publish versioned JSON-LD and Turtle distributions using Schema.org, SKOS, PROV-O and DCAT. | P1 | 8 | Distributions preserve canonical identity, source evidence, version and relationship direction; checksums and media types are published. |
| `S4-ST3 / SEM-03` | As release manager, I need semantic validation. Add SHACL shapes and reports. | P0 | 8 | Required identity, provenance, mapping and vocabulary shapes pass; failures block semantic distribution release. |
| `S4-ST4 / SEM-04` | As user or agent, I need resolvable identities. Implement `/id/{canonicalObjectId}` representations. | P0 | 8 | Every sampled URI resolves to human-readable HTML and links to versioned machine representations; retired IDs remain resolvable and disclose status. |
| `S4-ST5 / CITE-01` | As reuser, I need accurate credit and rights. Reconcile authorship, affiliation, third-party metadata rights and citation text. | P0 | 5 | No placeholder ORCID/DOI; licenses distinguish original code/content from third-party metadata; claims match validation and coverage evidence. |
| `S4-ST6 / PUB-01` | As publisher, I need a release candidate. Package the semantic release without enabling bulk-download UI. | P1 | 3 | Release notes, manifest and validation evidence are present; public UI exposes representations only through approved routes; no download control appears. |

**Sprint UAT:** resolve 25 canonical IDs, including shared HMIS identities and one retired fixture; validate RDF with SHACL and inspect citation language.  
**Sprint exit:** canonical identifiers are durable and dereferenceable; Zenodo/DOI remains gated until ownership and licensing sign-off is recorded.

### Sprint 5 — Discovery performance and resilience (conditional)

**Sprint goal:** optimize only if evidence shows the current interface misses agreed performance or resilience thresholds.

| Story / ticket | User story and deliverable | Pri. | SP | Acceptance criteria |
|---|---|---:|---:|---|
| `S5-ST1 / PERF-01` | As product owner, I need evidence before architectural change. Benchmark load, first result, filtering and memory on reference devices. | P1 | 3 | Reproducible results cover all 4,743 canonical objects/4,797 representations/560 occurrences; thresholds and device profiles are recorded. |
| `S5-ST2 / PERF-02` | As architect, I need a justified decision. Compare current browser filtering with a complete static index. | P1 | 5 | ADR addresses completeness, hosting, accessibility, maintenance and rollback; no framework is selected by popularity alone. |
| `S5-ST3 / PERF-03` | As user, I need fast complete search. If thresholds fail, implement an index covering every discoverable object class. | P2 | 8 | Search does not regress HMIS objects or occurrences; indexed counts reconcile to read-model counts; relevance fixtures pass. |
| `S5-ST4 / PERF-04` | As low-bandwidth/no-JS user, I need basic access. Provide a resilient browsable fallback. | P1 | 5 | Core coverage/method information and a paged object index remain accessible without client JS; enhanced filters degrade honestly. |
| `S5-ST5 / PERF-05` | As release manager, I need regression evidence. Run performance, accessibility and discovery UAT. | P0 | 5 | Agreed budgets pass or the change is rolled back; keyboard/screen-reader flows and counts remain valid. |

**Sprint UAT:** reference-device performance run, no-JS test, relevance test and full-object-class count reconciliation.  
**Sprint exit:** either the benchmark proves the current approach sufficient, or the replacement demonstrates measurable benefit with no coverage regression.

### Sprint 6 — Programme 6 and controlled programme deepening

**Sprint goal:** establish and begin the Communicable Diseases/IDSP-IHIP vertical while deepening VBD and governing operational mappings.

| Story / ticket | User story and deliverable | Pri. | SP | Acceptance criteria |
|---|---|---:|---:|---|
| `S6-ST1 / PRG6-01` | As programme expert, I need an explicit IDSP/IHIP boundary. Inventory authoritative public documents, versions, tables and access restrictions. | P0 | 5 | Source ledger records authority, version/date, access date, exact tables and exclusions; restricted portal gaps are visible. |
| `S6-ST2 / PRG6-02` | As analyst, I need official communicable-disease measures. Extract the first reviewed batch with full normalized metadata. | P1 | 8 | Official name preserved; numerator/denominator/scale/frequency/level/source location captured where stated; unknowns are not inferred. |
| `S6-ST3 / PRG6-03` | As knowledge-graph user, I need safe relationships. Map concepts, manifestations, sources and programme structure. | P1 | 5 | All graph edges use governed predicates and evidence; disease-specific measures are not falsely equated. |
| `S6-ST4 / VBD-01` | As VBD analyst, I need more than the foundation set. Complete one disease-wise public-source slice. | P1 | 8 | Declared source table is complete; lowest level, denominator and surveillance context are explicit; boundary statement is updated. |
| `S6-ST5 / OPMAP-01` | As interoperability lead, I need safe operational mappings. Adopt an instance/version-aware mapping policy. | P0 | 5 | Policy requires system/instance, version, field/UID, direction, confidence, evidence and validity; DHIS2 UIDs are never treated as universal. |
| `S6-ST6 / REVIEW-01` | As programme custodian, I need a repeatable validation route. Define external expert review and disposition without implying endorsement. | P1 | 3 | Reviewer brief, conflict declaration, evidence capture, response SLA and accept/reject/defer dispositions exist; publication status is separate from custodian approval. |

**Sprint UAT:** programme reviewer verifies a stratified sample against exact source locations; surveillance analyst tests reporting-level and denominator interpretation.  
**Sprint exit:** IDSP/IHIP has a declared, reviewable first release; VBD depth increases; restricted operational mappings remain blocked rather than guessed.

## 6. Parallel interoperability workstream

This workstream is repeatable for every programme and begins only when its TRUST/SEM dependencies pass.

| Ticket | Deliverable | Priority | Dependency | Acceptance criteria |
|---|---|---:|---|---|
| `FHIR-01` | Adopt India-facing FHIR R4 version policy and R4→R5 transformation note | P1 | TRUST-02, SEM-04 | Version and canonical URL rules are explicit; no claim of ABDM conformance without validation. |
| `FHIR-02` | Publish object-to-resource decision matrix | P1 | UNIFY taxonomy | Indicator, observation, definition, value set and evidence objects map to appropriate resource types; not everything becomes `Measure`. |
| `FHIR-03` | Create a programme mapping template | P1 | FHIR-01/02 | Template covers identifiers, subject, population, scoring, period, evidence, computability and known gaps. |
| `FHIR-04` | Validate one balanced pilot per programme | P2 | Relevant programme release | Status is explicitly one of metadata mapped, validated, domain reviewed, computable or custodian approved; stages are not conflated. |
| `TERM-01` | Assess ICD, SNOMED CT, LOINC and other terminology slots | P2 | FHIR-02, licensing policy | Only terminology-eligible clinical concepts are mapped; edition/version/license and match type are recorded. |
| `FHIR-REP` | Apply the checklist to each new programme | P1 | Programme source boundary | Every programme release records applicability, non-applicability, validation evidence and deferred operational dependencies. |

## 7. UAT plan

### UAT roles

| Role | Primary concern |
|---|---|
| Product owner/public-health analyst | usefulness, priority, programme meaning and release acceptance |
| Programme domain reviewer | official wording, denominator, formula, level and evidence boundary |
| Data steward | identity, provenance, lifecycle, quality and versioning |
| Knowledge engineer | graph direction, semantic mappings, URI and validation |
| Accessibility tester | keyboard, focus, labels, contrast, zoom and screen-reader flow |
| Release manager | reproducibility, manifests, regression results and deployment |

### UAT scenarios

| ID | Scenario | Expected result |
|---|---|---|
| `UAT-01` | Search an official indicator name and switch card/table views | Same record set and count; official name unchanged |
| `UAT-02` | Filter Programme and System/portal independently | Programme and reporting system semantics are not conflated |
| `UAT-03` | Open an HMIS shared identity | One canonical object exposes distinct indicator/HMIS representations |
| `UAT-04` | Follow a report occurrence to its accepted canonical object and back | Reciprocal link resolves; candidate occurrence has no false target |
| `UAT-05` | Inspect a percentage measure | Formula shows `(numerator ÷ denominator) × 100`, denominator population and `%` scale |
| `UAT-06` | Navigate core flows by keyboard at 200% zoom | No keyboard trap, clipped critical content or missing focus indication |
| `UAT-07` | Inspect a provenance change | Reviewer role, method, dates, fields and reason are understandable and historical version remains available |
| `UAT-08` | Compare required, available and recommended disaggregation | Three states are visually and semantically distinct and evidence is accessible |
| `UAT-09` | Resolve a canonical ID as HTML and machine representation | Identity, lifecycle, source and version agree across representations |
| `UAT-10` | Search under no-JS or constrained network conditions | Declared fallback works; missing enhanced behavior is explicit |
| `UAT-11` | Review an IDSP/IHIP or VBD batch against source locations | Sample matches official tables; unsupported metadata remains unknown |
| `UAT-12` | Introduce a controlled invalid fixture | Release gate fails with actionable location and rule; valid production data remains unaffected |

### UAT entry criteria

- Story acceptance criteria pass in the automated test environment.
- Test data, source versions and expected counts are frozen in the release candidate manifest.
- No open severity-1 defect; known limitations are documented.
- Reviewer receives the exact source boundary and scenario script.

### Defect severity and response

| Severity | Definition | Release rule |
|---|---|---|
| S1 | Wrong identity, source, formula, denominator, unsafe equivalence, data exposure or unusable primary flow | Stop release |
| S2 | Materially wrong filter/result, inaccessible critical flow or missing provenance | Stop release unless fixed and retested |
| S3 | Non-critical usability/content defect with safe workaround | May release only with owner acceptance and tracked ticket |
| S4 | Cosmetic improvement | Backlog |

### UAT exit criteria

- All sprint-mandatory scenarios pass and evidence is attached to the release record.
- Zero open S1/S2 defects; accepted S3 defects have owner, target sprint and workaround.
- Product owner and at least one relevant domain/data reviewer sign off.
- Release manifest matches deployed commit and production smoke test.

## 8. Definition of Ready

A story may enter a sprint only when:

- user value, scope and non-goals are stated;
- authoritative source/evidence boundary is known or the ticket is explicitly an evidence-discovery task;
- dependencies and affected object classes are identified;
- testable acceptance criteria and UAT owner exist;
- privacy, licensing, accessibility and public-download implications are assessed;
- estimate is agreed and the story fits within the sprint WIP limit.

## 9. Definition of Done

A ticket is Done only when all applicable conditions pass:

1. Acceptance criteria and automated tests pass.
2. Official names and evidence boundaries are preserved.
3. Schemas, controlled vocabularies, documentation and examples are version-aligned.
4. Identity, source, graph, occurrence and lifecycle integrity validations pass.
5. Accessibility and responsive behavior are tested for changed user flows.
6. No secrets, private source material or unauthorized operational identifiers are published.
7. Public bulk-download controls remain disabled.
8. UAT evidence and reviewer disposition are recorded.
9. Counts, checksums, schema versions and commit SHA appear in the release manifest.
10. Tracker, decision log, release notes and known gaps are updated.
11. GitHub Pages deployment succeeds and a production smoke test passes.
12. A rollback point exists and no unrelated user work is overwritten.

## 10. Release governance and reporting

- **Sprint planning:** confirm capacity, dependencies, evidence owners and the sprint goal.
- **Twice-weekly refinement:** split oversized stories and review evidence blockers.
- **Sprint review:** demonstrate against UAT scenarios, not screenshots alone.
- **Retrospective:** record one keep, one change and one measurable experiment.
- **Roadmap review:** after Sprint 3 and Sprint 6, re-score priorities using risk, user value and evidence availability.
- **Metrics:** gate pass rate, escaped S1/S2 defects, provenance coverage, unresolved evidence gaps, median filter response, accessibility defects, source-change queue age and percentage of programme records with reviewed denominators.

## 11. Explicitly blocked and out of scope

- HMIS/DHIS2, Ni-kshay and National NCD Portal operational UIDs without authorized, versioned dictionaries or exports.
- Claims of exhaustive national portal coverage beyond declared public sources.
- Automatic alteration of official definitions from source-change detection.
- Blanket SNOMED CT/ICD/LOINC mapping of all indicators.
- Observed patient/facility values or public value distributions; the model is observation-ready but currently contains none.
- Zenodo DOI until authorship, affiliation, licensing and release semantics are approved.
- Public CSV/JSON/crosswalk download controls.

## 12. Recommended immediate commitment

Sprints 0–2 and `UTILITY-01..UTILITY-04` are complete. Continue with **`UTILITY-05` interpretation and action guidance** while completing the reviewed `DISAGG-03` equity pilot and programme-domain review of the 30 `DQ-01` profiles.
