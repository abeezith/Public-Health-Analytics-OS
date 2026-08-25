# India public-health indicator coverage audit and expansion plan

**Audit date:** 25 August 2026  
**Registry release:** 1.1 India verified subset, 3,236 records

## Finding

Release 1.1 contains **128 India-source-specific discovery records** governed by MoHFW, NHM, DGHS, NHA, NACO, NCDC, NCVBDC, NHSRC, IIPS or CBHI. All 15 registered Indian source families are represented. The ingestion is a verified official subset and is not yet a source-complete extraction of every programme form, dashboard, table and historical edition.

Indian source manifestations remain separate from similar global indicators until a reviewed crosswalk establishes equivalence. Every India record carries country, programme, reporting system, administrative level, record type, source version, official URL and WHO building-block tags.

## Why an India extension is required

Indian programmes often specify operational numerators, denominators, reporting periods, facility types, administrative levels, targets and reporting systems that differ from global metadata. India-source manifestations must therefore be retained as separate records until a reviewed crosswalk demonstrates equivalence.

## Authoritative source census

| Priority | System or programme | Authoritative custodian | Initial source | Intended boundary |
|---|---|---|---|---|
| 1 | HMIS | MoHFW | https://www.data.gov.in/catalog/performance-key-hmis-indicators-upto-district-level-all-indicators | Current data elements, calculated key indicators, forms and definitions |
| 1 | RMNCH+A, RCH, RBSK and RKSK | NHM, MoHFW | https://nhm.gov.in/ | All current programme indicators and reporting formats |
| 1 | UIP and Mission Indradhanush | NHM, MoHFW | https://nhm.gov.in/New_Updates_2018/NHM_Components/Immunization/Guildelines_for_immunization/Mission_Indradhanush_Guidelines.pdf | Routine, campaign, cold-chain and AEFI indicators |
| 1 | NTEP | Central TB Division, MoHFW | https://tbcindia.mohfw.gov.in/monitoring-and-evaluation/ | Detection, notification, diagnostics, treatment, prevention, benefit and management indicators |
| 1 | NACP V | NACO, MoHFW | https://naco.mohfw.gov.in/sankalak/ | Prevention, testing, treatment, viral suppression, key-population, STI, blood-safety and system indicators |
| 1 | Vector-borne disease programmes | NCVBDC, DGHS | https://ncvbdc.mohfw.gov.in/index1.php?lang=1&level=1&lid=3686&sublinkid=5899&theme=Cream | Malaria, dengue, chikungunya, JE, kala-azar and lymphatic-filariasis indicators |
| 1 | NLEP | DGHS, MoHFW | https://dghs.mohfw.gov.in/nlep.php | Prevalence, detection, child cases, disability, treatment and performance indicators |
| 1 | IDSP/IHIP | NCDC, MoHFW | https://ncdc.mohfw.gov.in/includes/About/CentresAndDivision/IDSP.php | Syndromic, presumptive, laboratory, outbreak, timeliness, completeness and response indicators |
| 1 | NP-NCD | MoHFW | https://www.mohfw.gov.in/sites/default/files/NP-NCD%20Operational%20Guidelines.pdf | Screening, diagnosis, treatment, control, follow-up, readiness and management indicators |
| 2 | NQAS | NHSRC, MoHFW | https://qps.nhsrcindia.org/national-quality-assurance-standards/nqas-tools | Facility assessment measures and outcome indicators |
| 2 | Free Drugs and Diagnostics/DVDMS | NHM, MoHFW | https://nhm.gov.in/images/pdf/NHM/NHM-Guidelines/Free_Drugs_Service_Intitiative.pdf | Availability, stock-out, expiry, lead-time, fulfilment and prescription-audit indicators |
| 2 | ABDM | National Health Authority | https://abdm.gov.in/ | ABHA, HFR, HPR, linked-record, adoption and interoperability indicators |
| 2 | PM-JAY | National Health Authority | https://insights.pmjay.gov.in/ | Beneficiary, hospitalization, claim, hospital, portability and financial-protection indicators |
| 2 | NFHS | MoHFW and IIPS | https://www.nfhsiips.in/nfhsuser/nfhs5.php | All published indicators with survey-wave and geographic provenance |
| 2 | National Health Profile | CBHI, DGHS | https://cbhidghs.mohfw.gov.in/publications/national-health-profile | Demography, morbidity, mortality, finance, workforce and infrastructure indicators by edition |

## Implementation status and remaining plan

### Completed in Release 1.1

1. Established `IND-*` identifier namespaces and added 128 official-source records.
2. Added country, India programme, reporting system, administrative level, facility type, record type, source version, target and source-location fields.
3. Added geography and India programme filters alongside the six-pillar WHO building-block filter.
4. Updated JSON, CSV, source census, coverage ledger and XLSX workbook.

### Phase 0 — governance and version control

1. Freeze the source census and record the official URL, custodian, access method, publication/version date and archival copy for each source.
2. Define an India identifier namespace such as `IND-HMIS-*`, `IND-NTEP-*` and `IND-NACP-*`.
3. Add India-specific metadata fields: programme, scheme/component, reporting system, administrative level, facility type, reporting frequency, financial year, target, target year, state applicability, source version and supersession status.
4. Publish inclusion, exclusion and source-change rules before harvesting.

**Gate:** every planned source has a named custodian, an explicit boundary and a versioned acquisition route.

### Phase 1 — core national programme extraction

Extract HMIS/RMNCH+A/UIP first, followed by NTEP, NACP, NCVBDC, NLEP, IDSP/IHIP and NP-NCD. Preserve each published data element and calculated indicator separately. Capture official definitions verbatim only where licensing permits; otherwise provide a faithful paraphrase and a direct source link.

**Gate:** source-row reconciliation equals the eligible source count; every record has programme, definition status, numerator/denominator status, frequency, geography, source version and authoritative URL.

### Phase 2 — health-system and survey sources

Add NQAS, Free Drugs/Diagnostics and DVDMS, ABDM, PM-JAY, NFHS and National Health Profile. Keep checklist measures, operational dashboard counts, survey estimates and stable indicator definitions as distinct record types.

**Gate:** the registry identifies whether a record is a data element, calculated indicator, assessment measure, dashboard metric, survey estimate or target.

### Phase 3 — reviewed crosswalks

Create concept links between Indian and global manifestations using four states: exact equivalent, compatible with transformation, related but non-equivalent, and no match. Review high-use indicators with programme and measurement experts before merging or presenting combined results.

**Gate:** no automated deduplication; every equivalence decision records reviewer, date, rationale and version.

### Phase 4 — completeness and maintenance

Publish per-source completeness, stale-link checks, version diffs, superseded indicators, unresolved definitions and annual refresh dates. Add state-specific indicators only under declared state boundaries rather than treating one state as nationally representative.

**Gate:** each release can be reproduced from its source ledger and reports both additions and removals.

## WHO health-system building-block classification

All current records now carry one or more analytical tags from WHO's six building blocks: service delivery; health workforce; health information systems; medical products, vaccines and technologies; health-system financing; and leadership/governance. The framework source is https://www.who.int/publications/b/31426.

The mapping is deterministic and multi-label, using registry domains and metadata text. It is a discovery aid, **not an official classification by WHO or the original indicator custodian**. New Indian records should receive an initial rule-based tag followed by human review for programme dashboards and policy use.

## Recommended release claim

Describe the registry as: **“Globally bounded-exhaustive for four Release 1 catalogues; India Release 1.1 is a verified official subset across 15 national source families and is not yet source-complete.”**
