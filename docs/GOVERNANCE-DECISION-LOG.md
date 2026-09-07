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
