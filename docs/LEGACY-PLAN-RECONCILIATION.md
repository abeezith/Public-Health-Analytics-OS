# Legacy four-sprint package reconciliation

**Ledger ID:** `PHAOS-RECON-001`  
**Reviewed:** 12 October 2026  
**Source boundary:** the 27 top-level files and 10 extracted files supplied in `D:\01OneDrive\Analytics_OS`  
**Current authority:** [`PHAOS-ROADMAP-001`](AGILE-ROADMAP.md), the [workstream tracker](PROGRAMME-WORKSTREAM-TRACKER.md), adopted contracts and the [delivery baseline](DELIVERY-BASELINE-2026-10-12.md)

## 1. Disposition vocabulary

| Disposition | Meaning |
|---|---|
| Completed | Current production already provides the intended outcome; later tickets may strengthen its validation |
| Adapt | Useful intent retained, but implementation must use current identities, schemas and static architecture |
| New | Valid work not yet represented elsewhere; added to the governed roadmap |
| Blocked | Cannot proceed without authoritative evidence, approval or infrastructure |
| Rejected | Conflicts with current policy, architecture or safety boundaries |
| Superseded | Replaced by a stronger adopted contract or completed workstream |
| Deferred | Potentially useful but sequenced beyond the current roadmap commitment |

Statements marked “done” in the source package were treated as claims requiring repository evidence. File existence alone did not establish completion.

## 2. Ticket reconciliation — 56 legacy tickets

| Legacy ticket | Condensed intent | Disposition | Governed destination / rationale |
|---|---|---|---|
| `TICKET-01.1.1` | Evaluate static search | Adapt | `PERF-01/02`; benchmark current discovery before selecting architecture |
| `TICKET-01.1.2` | Generate search index | Adapt | `PERF-03`, conditional on failed thresholds and complete object-class coverage |
| `TICKET-01.1.3` | Pre-render initial results | Adapt | `PERF-04`; preserve a no-JS/basic-access route without replacing current UI blindly |
| `TICKET-01.2.1` | Repair filter bindings | Completed | `UNIFY-03/04`; retain regression coverage in `VAL-05` |
| `TICKET-01.2.2` | Free-text search | Completed | Current unified interface searches each governed class; benchmark in Sprint 5 |
| `TICKET-01.3.1` | Result cards | Completed | Card and table views exist for indicators and HMIS objects |
| `TICKET-01.3.2` | Pagination/load more | Completed | Current result views implement progressive loading |
| `TICKET-01.4.1` | Mobile/accessibility filters | Adapt | `VAL-05` first; UI redesign only for evidenced failures |
| `TICKET-02.1.1` | Define completeness rubric | Superseded | `PHAOS-MDQ-001` version 1.0.0 is adopted |
| `TICKET-02.1.2` | Completeness scorer | Superseded | Current metadata-quality validator scores 3,708 named records |
| `TICKET-02.1.3` | Scorer in pipeline | Adapt | `VAL-01/06`; integrate adopted validator into the release gate |
| `TICKET-02.2.1` | Completeness badge | Adapt | `DISC-01`; expose governed quality/review fields without relabelling legacy completeness |
| `TICKET-02.2.2` | Completeness dashboard | Adapt | Future quality reporting after integrated validation; current coverage page is not a substitute |
| `TICKET-03.1.1` | Extract paraphrase queue | Adapt | `PROV-03`; scan definitions, caveats and source notes in the current model |
| `TICKET-03.1.2` | Select 20 priority records | Adapt | `PROV-02` and `DISAGG-03` use balanced samples of resolving canonical IDs |
| `TICKET-03.2.1` | Verification workflow | Adapt | `PROV-01/02`; retain useful SOP concepts with versioned review events |
| `TICKET-03.2.2` | Resolve batch 1 | Adapt | Ten-record provenance pilot; legacy IDs must resolve before review |
| `TICKET-03.2.3` | Resolve batch 2 | Deferred | Schedule after the first pilot demonstrates review quality and effort |
| `TICKET-03.3.1` | Paraphrase-prevention gate | Adapt | `TRUST-05/06`; source evidence and change events become release checks |
| `TICKET-04.1.1` | Crosswalk schema | Adapt | `SEM-01` plus governed relationship vocabulary and identity policy |
| `TICKET-04.1.2` | Crosswalk authoring tool | Deferred | Authoring workflow follows formal mapping policy; a spreadsheet alone is insufficient |
| `TICKET-04.2.1` | Maternal/child mappings | Adapt | Later governed mapping pilot; exact/close/broad/narrow semantics required |
| `TICKET-04.2.2` | TB/NCD/UHC mappings | Adapt | Later governed mapping pilot; aggregation safety remains separate |
| `TICKET-04.3.1` | Crosswalk detail panel | Completed | `UNIFY-07` reciprocal relationship navigation; extend after `SEM-01` |
| `TICKET-04.3.2` | Crosswalk download | Rejected | Public bulk-download controls are explicitly disabled |
| `TICKET-04.4.1` | Crosswalk filter | Adapt | Add only after governed mapping semantics and tested discovery fields |
| `TICKET-05.1.1` | Disaggregation schema | Adapt | `DISAGG-01`; redesign separates required, available and recommended dimensions |
| `TICKET-05.1.2` | Auto-populate disaggregation | Rejected | Source availability and recommendations cannot be inferred from generic profiles |
| `TICKET-05.2.1` | Populate 20 records | Adapt | `DISAGG-03`; use current IDs, evidence and privacy review |
| `TICKET-05.3.1` | Equity filter | Adapt | `DISAGG-04`, after the governed assertion model exists |
| `TICKET-05.3.2` | Equity detail panel | Adapt | `DISAGG-04`; visually distinguish three evidence states |
| `TICKET-06.1.1` | Research HIV programme | Deferred | Programme expansion queue after current Programme 6 unless reprioritized |
| `TICKET-06.1.2` | Build first HIV release | Deferred | Depends on a declared source boundary and completed research |
| `TICKET-06.1.3` | HIV source ledger | Deferred | Required when programme research starts |
| `TICKET-06.2.1` | Research vector-borne programme | Adapt | Existing foundation accepted; `VBD-01` deepens one disease-wise slice |
| `TICKET-06.2.2` | Build vector-borne release | Adapt | No arbitrary record target; completeness is source-table bounded |
| `TICKET-06.3.1` | Research NCD vertical | Completed | NP-NCD source-bounded release exists; authenticated system gaps remain |
| `TICKET-06.3.2` | Build NCD release | Completed | Current 51-manifestation release replaces the proposed arbitrary target |
| `TICKET-06.4.1` | Add programme navigation | Completed | India/Global programme navigation and five programme releases are live |
| `TICKET-06.4.2` | NCD cascade view | Adapt | Existing graph/detail flows provide pathway context; test need before bespoke UI |
| `TICKET-07.1.1` | Map to DHIS2 schema | Blocked | `OPMAP-02`; requires authorized instance/version metadata |
| `TICKET-07.1.2` | Generate DHIS2 package | Blocked | No generator without a valid instance-aware mapping and import target |
| `TICKET-07.1.3` | DHIS2 import guide | Blocked | Documentation must describe a verified package, not a hypothetical one |
| `TICKET-07.2.1` | Add DHIS2 download | Rejected | Evidence is unavailable and public downloads remain disabled |
| `TICKET-08.1.1` | Repair proposed state catalogue | Deferred | External catalogue is not an adopted registry layer; provenance and ownership review required |
| `TICKET-08.1.2` | Crosswalk proposed state catalogue | Deferred | Requires identity, source/version and mapping policy before any import |
| `TICKET-08.2.1` | Add state implementation layer | Deferred | Model only after governance, lifecycle and legitimate publication basis are established |
| `TICKET-08.2.2` | Import state implementation data | Rejected | Direct import would bypass current source, identity and privacy gates |
| `TICKET-09.1.1` | Stable indicator pages | Adapt | `SEM-04`; canonical path is `/id/{canonicalObjectId}`, not `/indicators/{id}/` |
| `TICKET-09.2.1` | Zenodo DOI | Blocked | `DOI-01`; authorship, affiliation, licensing and release semantics first |
| `TICKET-09.2.2` | Per-indicator citation | Adapt | `CITE-01` and `SEM-04`; citation must not overclaim verification or rights |
| `TICKET-10.1.1` | Institutional proposal | Deferred | Prepare only after validation evidence and a clear review ask exist |
| `TICKET-10.1.2` | Initiate institutional contact | Deferred | External outreach requires a reviewed proposal and explicit user authorization |
| `TICKET-10.2.1` | HMIS co-validation workflow | Adapt | `REVIEW-01`; separate expert review, custodian approval and publication state |
| `TICKET-10.2.2` | International endorsement pathway | Deferred | Begin after domestic validation workflow demonstrates value |
| `TICKET-10.3.1` | Joint publication plan | Deferred | Reassess after provenance, semantic release and programme validation milestones |

### Disposition totals

| Disposition | Count |
|---|---:|
| Completed | 8 |
| Adapt | 26 |
| Superseded | 2 |
| Deferred | 12 |
| Blocked | 4 |
| Rejected | 4 |
| **Total** | **56** |

## 3. Source-asset inventory — 37 supplied/extracted files

The files remain external review evidence. None was copied into production. “Quarantine” below is a logical integration state, not deletion or movement of the user’s originals.

| Source asset | Assessment | Integration disposition |
|---|---|---|
| `BACKLOG_Part1_Framework_Epic01_Epic02.md` | Useful intent; search architecture and quality model conflict with current state | Reconciled into this ledger |
| `BACKLOG_Part2_Epic03_Epic04.md` | Useful verification/crosswalk concepts | Adapt under provenance and semantic epics |
| `BACKLOG_Part3_Epic05_Epic06.md` | High-value disaggregation/programme intent; model and ordering need redesign | Adapt under analytical utility and Programme 6 |
| `BACKLOG_Part4_Epic07to10_SprintPlan.md` | Useful long-range themes; several evidence/authority dependencies | Split across blocked, semantic and review work |
| `build-search.yml` | Assumes npm/Astro/Pagefind and paths absent from current repository | Quarantine; do not merge |
| `CITATION.cff` | Contains placeholder/stale/overbroad claims requiring rights review | Quarantine; input to `CITE-01` |
| `CROSSCHECK_REPORT.md` | Valuable inventory but treats files as completed integration | Evidence only; claims not authoritative |
| `files.zip` | Archive duplicates the extracted `files/` payload | Duplicate evidence; retain externally, do not import |
| `filter-fix.js` | Targets DOM architecture that is not current | Quarantine; test current filters under `VAL-05` |
| `generate_search_index.py` | Duplicate of `generate_search_index1.py`; assumes CSV/Astro build | Quarantine; benchmark before reuse |
| `generate_search_index1.py` | Byte-identical duplicate | Superseded duplicate |
| `HMIS_Decision_Architecture_Training_Deck.pptx` | Context/training artifact, not executable product evidence | Retain as reference only |
| `index (1).html` | Alternative shell not reconciled with current unified registry | Quarantine; do not replace production home |
| `indicator-ui.css` | Styles target proposed, not current, markup | Quarantine; mine patterns only after UI need is evidenced |
| `indicator-ui.js` | Expects nonexistent DOM IDs and incomplete three-class data coverage | Quarantine; do not merge |
| `package-json-patch.md` | Assumes a package/npm architecture not adopted | Reject for current static architecture |
| `PHAnalytics-OS · Sprint Log S1+S2.md` | Useful intent but completion claims are not supported by current repo | Evidence only; tickets reconciled above |
| `PHAnalytics-OS · Sprint Log S3+S4.md` | Useful provenance/disaggregation inputs with schema conflicts | Evidence only; adapt under Sprints 2–3 |
| `RELEASE-1.4.md` | Describes an unintegrated alternative release | Historical proposal, not a product release record |
| `search-init-fix.js` | JavaScript syntax failure caused by the opening comment; wrong DOM contract | Quarantine |
| `search-init-fix1.js` | Byte-identical duplicate of the syntax-failing file | Superseded duplicate |
| `Sprint 1 Work Log — PHAnalytics-OS.md` | Alternative work log with unsupported completion claims | Evidence only |
| `SPRINT_LOG.md` | Proposed implementation log, not current release evidence | Evidence only |
| `SPRINT_LOG1.md` | Additional proposed log with overlapping claims | Evidence only |
| `T-01.1.1-spike-search-architecture.md` | Useful comparison, but predates unified read model and all object classes | Adapt as input to `PERF-02` |
| `UAT-EPIC-01.md` | Useful scenarios limited to proposed search implementation | Adapt into roadmap UAT and `VAL-05` |
| `zenodo-deposit-guide.md` | Useful process outline; premature and contains unresolved metadata | Quarantine until `CITE-01`/`DOI-01` gates pass |
| `files/build-with-scorer.yml` | Same incompatible npm/Astro assumptions plus alternate scorer | Quarantine; replace with Sprint 1 gate |
| `files/completeness-rubric.md` | Conflicts with adopted `PHAOS-MDQ-001` and contains internal correction history | Superseded by TRUST-03 |
| `files/disaggregation-20core.csv` | 19 rows, unresolved IDs, invalid enum strings and encoding defects | Quarantine; do not import |
| `files/disaggregation.schema.json` | Availability/recommendation/evidence/privacy collapsed into strings | Superseded by planned `DISAGG-01` redesign |
| `files/extract_paraphrase_queue.py` | Scans the wrong current field and can falsely report zero | Adapt under `PROV-03`; do not run as release evidence |
| `files/populate_disaggregation.py` | Generic auto-population can invent availability/recommendations | Rejected for production use |
| `files/score_completeness.py` | Implements an alternate rubric | Superseded by current metadata-quality validator |
| `files/source-verification-sop.md` | Valuable workflow concepts | Adapt under `PROV-01/02` |
| `files/SPRINT_LOG.md` | Duplicate/alternate sprint evidence | Reference only |
| `files/verified-batch1.csv` | Ten records; four IDs do not resolve in current registry | Quarantine; rebuild pilot with current IDs |

## 4. Quarantine rules

1. Quarantined files remain in the external review location and are not copied to the repository.
2. No proposed script or workflow may run in CI until its inputs, object coverage, output path and failure behavior match the current architecture.
3. Proposed CSV rows may not be imported until all canonical IDs resolve and the relevant current schema validates them.
4. Completion claims in logs are historical assertions, not accepted delivery evidence.
5. Duplicate files are retained externally for traceability but represented once in this ledger.
6. Rejected public download features remain outside production.

## 5. Sprint 0 acceptance record

| Ticket | Evidence | Result |
|---|---|---|
| `RECON-01` inventory legacy work | 56-ticket ledger and 37-file asset inventory above | Pass |
| `RECON-02` assign dispositions | Every ticket and asset has a governed disposition and rationale | Pass |
| `RECON-03` quarantine incompatible assets | Section 3/4 identifies syntax failures, duplicates, incompatible workflows and unsafe imports; none merged | Pass |
| `RECON-04` freeze delivery baseline | [`PHAOS-BASELINE-2026-10-12`](DELIVERY-BASELINE-2026-10-12.md) plus verified backup register | Pass |

Sprint 0 is complete. The next authorized delivery unit is **Sprint 1: `UNIFY-10` + `TRUST-06` integrated validation and release gate**.
