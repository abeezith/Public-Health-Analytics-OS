# Public Health Analytics-OS Governance Charter

Charter ID: `PHAOS-GOV-001`  
Version: `1.0.0`  
Effective date: 7 September 2026  
Status: Adopted for project governance  
Review cycle: At least annually and whenever decision rights materially change

## 1. Purpose and scope

This charter governs the Public Health Analytics-OS repository, Master Public Health Indicator Registry, knowledge graph, programme releases, HMIS knowledge objects, normalized metadata, interoperability artifacts and derived analytical products.

It establishes who may make which decisions, how evidence is reviewed, how corrections and disputes are handled, and how the project remains recoverable and understandable if maintainers change.

This charter does not transfer authority from any ministry, agency, programme, statistical organization or other source custodian. Analytics-OS publishes curated representations of public evidence; it does not speak for source custodians or imply their endorsement.

## 2. Governing principles

1. **Source authority is preserved.** Official names, codes, definitions, formulas and versions remain attributable to the organization that published them.
2. **Curated assertions are labelled.** Normalizations, crosswalks, WHO building-block classifications, concept mappings and interpretations are distinguished from source assertions.
3. **No false equivalence.** Similar indicators remain separate until equivalence is supported by definition, population, period, scale, exclusions and operational context.
4. **Completeness is bounded.** Every completeness claim names its source boundary, version and cut-off date.
5. **Missing evidence is visible.** Restricted dictionaries, unresolved mappings and unavailable rules remain explicit gaps; they are not guessed.
6. **Privacy by design.** Public artifacts contain definitions, metadata and aggregate or synthetic examples only. Identifiable or sensitive person-level data is out of scope.
7. **Reproducibility and reversibility.** Material releases are versioned, validated and recoverable from repository history.
8. **Proportional review.** Review depth increases with the consequence of the assertion, especially for formulas, semantic equivalence, computability and action guidance.

## 3. Governance boundary

Analytics-OS may:

- transcribe and cite public source metadata;
- assign stable Analytics-OS identifiers and normalized discovery metadata;
- publish evidence-qualified mappings, quality notes and implementation artifacts;
- record source-bounded completeness and evidence gaps; and
- correct its own transcription, transformation or interpretation errors.

Analytics-OS may not:

- alter an official indicator name while presenting the alteration as official;
- claim custodian endorsement without an explicit, recorded approval;
- publish restricted operational dictionaries or licensed terminology content without authority;
- infer missing operational identifiers, formulas, thresholds or response protocols;
- publish identifiable health data; or
- describe technical validation as proof of public-health validity, computability or official approval.

## 4. Roles and present operating model

One person may hold more than one role during the interim project phase. Each material review record must identify the role under which the decision was made. Role separation is a maturity objective, not something the project will falsely claim to have achieved.

| Role | Responsibilities | Decision rights |
|---|---|---|
| Project Owner | Holds repository accountability, appoints maintainers, adopts governance changes and manages continuity | Final project-governance decisions and release authorization |
| Lead Curator | Maintains source boundaries, official metadata, evidence gaps and release content | Accepts source-grounded content changes within this charter |
| Programme Domain Reviewer | Reviews definitions, denominator logic, interpretation, programme context, mappings and action guidance | May grant `Domain reviewed` only with recorded identity/role, scope, date and evidence |
| Technical Maintainer | Maintains schemas, build logic, validation, identifiers, graph and interoperability artifacts | Accepts technically valid implementations that do not change source meaning |
| Contributor | Proposes corrections, evidence, mappings, code or documentation | No unilateral approval right |
| Source Custodian | External organization responsible for the original source | Controls only its own official definitions and may explicitly approve a derived representation |
| Advisory or Stewardship Group | Not currently constituted | No authority may be attributed until membership, mandate and decision rules are published |

The repository owner is the interim Project Owner and may perform Lead Curator and Technical Maintainer duties. This is a disclosed key-person dependency. It must not be represented as multi-institutional governance.

## 5. Decision classes and review requirements

| Decision class | Minimum evidence | Required decision |
|---|---|---|
| Editorial correction with no semantic change | Before/after text and reason | Lead Curator or Technical Maintainer |
| Source transcription, addition or retirement | Citable source, version, source location and boundary impact | Lead Curator; automated validation must pass |
| Normalized analytical metadata | Preserved source value, normalization rule and rationale | Lead Curator; domain review when interpretation is material |
| Concept mapping or comparability assertion | Definitions, direction, differences, confidence and aggregation-safety decision | Programme Domain Reviewer for `Domain reviewed`; otherwise remain `Curated` or `Candidate` |
| Formula or computability assertion | Complete population logic, exclusions, period, aggregation rule and tests | Programme Domain Reviewer plus Technical Maintainer |
| Response guidance or threshold | Explicit official SOP/guideline and applicable version/context | Programme Domain Reviewer; no guidance is inferred when evidence is absent |
| Custodian approval | Explicit approval, scope, artifact version and approving authority | Recorded as a separate state; never inferred |
| Governance or policy change | Written proposal, impact analysis and decision record | Project Owner after an open review period unless an urgent safety correction is required |

## 6. Maturity states are independent

The following states answer different questions and must not be collapsed:

- `Source verified` — the representation is traceable to the cited source.
- `Curated` — Analytics-OS has added a labelled analytical assertion.
- `Technically validated` — the artifact passes its declared schema or profile.
- `Domain reviewed` — an identified reviewer has assessed the stated public-health scope.
- `Computable` — executable logic and declared test cases pass for the bounded version.
- `Custodian approved` — the source authority has explicitly approved the stated artifact.

Legacy review labels remain visible, but TRUST-05 must audit them against the evidence requirements introduced by this charter.

## 7. Contribution and change workflow

1. **Propose.** Open a documented issue or change request using the appropriate repository template.
2. **Declare evidence.** Provide the source authority, title, version/date, URL or citation, exact location and requested change.
3. **Triage.** Classify the request as correction, source update, new manifestation, normalization, mapping, software change or governance proposal.
4. **Assess impact.** Identify affected records, graph edges, programme counts, schemas, downstream artifacts and prior releases.
5. **Draft.** Preserve official wording and place curated additions in separate fields or assertions.
6. **Validate.** Run the applicable schema, identifier, formula, link, graph, privacy and regression checks.
7. **Review.** Obtain the review required by the decision class. Unavailable review remains an explicit maturity limitation.
8. **Decide.** Accept, request revision, defer, reject or mark blocked by evidence; record the rationale.
9. **Release.** Update versions, cut-off dates, trackers and change records; retain prior history.

Detailed submission requirements are in [CONTRIBUTING.md](../CONTRIBUTING.md).

## 8. Corrections and urgent issues

Corrections are prioritized by potential harm:

- **Critical:** privacy exposure, materially wrong formula, false source attribution or a misleading official-approval claim. Flag or remove the affected publication promptly, preserve evidence privately when required, and publish a correction record.
- **High:** wrong denominator, unit, population, mapping direction, lifecycle state or action threshold. Mark the record under review and block downstream computability or equivalence claims until resolved.
- **Routine:** spelling, presentation, non-semantic link replacement or documentation clarification. Correct in the next maintenance release.

No contributor should submit patient-level, confidential or credential-bearing material through a public issue. Sensitive information is outside the public repository's scope.

## 9. Disagreement, conflict of interest and appeals

1. Evidence and explicit source language take precedence over seniority or preference.
2. Material disagreement is recorded with the competing interpretations and the unresolved evidence needed.
3. A contributor or reviewer declares relevant employment, authorship, commercial or institutional interests and recuses when impartial review is not credible.
4. The Lead Curator makes source-representation decisions; the Project Owner makes governance decisions.
5. A disputed semantic or programme interpretation remains `Candidate` or `Blocked by evidence` until an appropriate Domain Reviewer resolves it.
6. Any decision may be appealed with new evidence. The appeal and outcome are recorded in the governance decision log.

## 10. Release and review cadence

- **Correction releases:** as needed for critical or high-impact errors.
- **Programme and feature releases:** event-driven after the declared release gates pass.
- **Review queue:** reviewed at least quarterly once TRUST-07 monitoring is operational; until then, reviewed during each release.
- **Governance review:** at least annually or when ownership, decision rights, privacy boundary or publication architecture changes.
- **Source re-verification:** according to the source's publication cadence, detected change or programme review—not merely a global date refresh.

Dates indicate when evidence was checked; they do not guarantee that an upstream source has not changed subsequently.

## 11. Continuity and succession

The Git repository and published tracker are the system of record. Continuity requires:

- versioned, documented releases and recoverable tags or backups;
- no essential governance rule stored only in private conversation;
- documented build and validation procedures;
- least-privilege control of publication credentials;
- a transition record identifying the incoming Project Owner and maintainers; and
- preservation of previous identifiers, source boundaries, decisions and correction history.

The project should seek at least one additional qualified maintainer and independent domain reviewers. Until that occurs, the single-maintainer dependency remains disclosed in the coverage and governance documentation.

## 12. Transparency records

The project publishes:

- this charter and its version history;
- the programme and workstream tracker;
- machine-readable workstream status;
- material governance decisions;
- declared source boundaries and evidence gaps; and
- release-level and, after TRUST-05, entry-level change events.

The initial governance decision is recorded in [GOVERNANCE-DECISION-LOG.md](GOVERNANCE-DECISION-LOG.md).

## 13. Amendments

Governance amendments require a written proposal describing the change, reason, affected decision rights, migration impact and effective date. Non-urgent proposals remain open for review for at least 14 calendar days. Urgent privacy or materially misleading-publication corrections may take effect immediately but require a retrospective decision record.

## 14. TRUST-01 completion record

TRUST-01 is complete when this charter, the contribution workflow, issue templates, decision log and human/machine task trackers are published together. Completion establishes the governance framework; it does not imply multi-institutional governance, independent review coverage or source-custodian approval.
