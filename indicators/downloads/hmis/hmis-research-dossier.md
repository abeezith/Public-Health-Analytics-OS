# India HMIS research dossier

**Research cut-off:** 1 September 2026  
**Scope:** MoHFW/NHSRC Health Management Information System (HMIS), with related official NHM and OGD evidence.  
**Registry status:** Research only. Nothing in this pack should be added to the live indicator registry until version reconciliation and QA are completed.

## Executive assessment

India's HMIS is a facility-oriented, monthly routine reporting system used to monitor NHM and other national programmes. The latest MoHFW annual-report evidence describes LGD-linked facility geography; mapping to state, district, subdistrict, rural block or urban local body, constituencies, village/ward and—in participating states—health blocks/subdivisions; GIS, dashboards, standard/live/KPI reports, generic APIs, training on definitions and validation rules, and field verification against source records.

The public evidence is rich but fragmented. It supports a deep research registry of current form fields, historical calculated indicators, analytical guidance and data-quality rules. It does **not** support a claim that every live HMIS field, formula, validation, API or state customization is publicly enumerated.

## Evidence inventory and quantitative census

- Eight revised monthly reporting formats effective April 2025 were located: HWC-SC, HWC-PHC, CHC, Civil Hospital/SDH, District Hospital, Medical College, Block Headquarters and District Headquarters.
- The PDFs contain **3,369 facility-form occurrences**. Consolidating identical titled module/code keys produces **1,441 source-defined form keys**. Consolidating exact labels across facility-specific code shifts produces **700 exact-label research concepts**. All three counts are useful and should not be conflated.
- The public OGD district-level key catalogue contains **202 named fields numbered 1–203; number 164 is absent** in the inspected All India FY 2019-20 resource.
- The public FY 2019-20 item-wise resource contains **410 legacy item codes**.
- NHSRC's indicator training tables yield **54 structured indicator definitions** with numerator, denominator, multiplying factor, suggested level and periodicity.
- NHSRC's data-quality training provides **25 explicit cross-field validation relationships**.

## Current form content

The April-2025 forms cover reproductive, maternal, newborn, child and adolescent health; immunization; family planning; anaemia and nutrition; RBSK; STI/RTI; communicable diseases including TB, leprosy and vector-borne disease; NCD and mental-health items; patient services, OPD/IPD, emergency, referral and surgery; diagnostics; mortality; supplies/equipment; and quality-assurance elements. The exact-label research concepts are distributed as follows:

- Antenatal care and high-risk pregnancy: 135
- Tuberculosis services: 121
- STI/RTI services: 61
- Immunization: 60
- Mortality and death review: 55
- Family planning: 39
- Vector-borne diseases: 35
- Adolescent health: 32
- Delivery and intrapartum care: 31
- Anaemia and nutrition: 28
- Childhood illness: 20
- Patient services and utilization: 18
- Newborn and pregnancy outcomes: 15
- RBSK / child screening: 11
- Medicines, supplies and equipment: 8
- Leprosy services: 7
- Diagnostics and laboratory services: 6
- Elderly and palliative care: 6
- Other HMIS reporting: 6
- Noncommunicable diseases: 3
- Postnatal care: 2
- Mental health: 1

These categories are analyst-assigned for research navigation. They are not official HMIS module names.

## HMIS information architecture

1. **Primary event/record:** a consultation, service, test, birth/death, outreach event, stock state or programme activity is recorded in a primary register or source system.
2. **Facility/reporting unit:** the relevant monthly facility or headquarters format is completed. The April-2025 public formats are facility-type specific.
3. **Administrative aggregation:** facility information is linked through the HMIS location/facility hierarchy and aggregated through block/subdistrict, district and state/UT to national views. Actual state workflows can include state systems and local reporting arrangements.
4. **Portal products:** data-item reports, reporting-status reports, standard/live reports, dashboards, GIS, KPI reports and APIs are described by official sources.
5. **Secondary use:** MoHFW lists PIP preparation, Health Dynamics of India, programme monitoring, facility grading, aspirational district/block monitoring, Mission UTKARSH, NITI Aayog uses, PM Dashboard/Prayas, NPHO, OGD, CRM/supportive supervision, Beti Bachao Beti Padhao, DISHA and Tribal Affairs dashboards.

## Four objects that must remain distinct

- **Raw reporting data element:** a directly entered monthly count or status, such as a service event or stock item.
- **Derived HMIS indicator:** a numerator/denominator calculation, often best computed as a ratio of aggregated numerators and denominators rather than an average of facility percentages.
- **Reporting-quality indicator:** completeness, timeliness, adequacy/field completion, validation-query burden, consistency or concordance with registers.
- **Published analytical output:** a dashboard, scorecard, factsheet, OGD resource or range-wise report tied to a period and publication method.

## Data-quality model

NHSRC identifies completeness, timeliness and accuracy as core dimensions. For modern research use, add internal consistency, external consistency/concordance, uniqueness/duplication, validity, plausibility and metadata currentness.

Critical semantics:

- **Zero is not blank.** The NHSRC rule is to report zero when a service is available but no service/beneficiary occurred, and leave blank when the service is unavailable. Current portal behavior must be verified before operational use.
- Assess completeness both by facilities reporting and by data elements populated; also examine completeness including and excluding zero.
- Validation failures are **queries**, not automatic proof of error. Referral patterns, stock-outs, outbreaks, catchment flows and genuine programme change can violate simple relationships.
- Facility percentages should not be arithmetically averaged unless the indicator specification explicitly calls for it; prefer ratio-of-sums using retained numerators and denominators.
- Population denominators, expected pregnancies/live births, catchment overlap, migration, private-sector omission and referral facilities can materially distort rates.
- Mortality fields are particularly vulnerable to under-reporting, misclassification and small-number instability.
- Current field evidence continues to show gaps in completeness, timeliness, staff training and concordance between physical registers and portals in some locations; this argues for facility-level provenance and QA metadata.

## Version reconciliation

The evidence spans incompatible generations:

- **Current context:** MoHFW Annual Reports 2024-25 and 2025-26; live portal; 2025 CRM evidence.
- **Current public form candidate:** April-2025 revised formats hosted by NHM Himachal Pradesh.
- **Historical calculated outputs:** OGD resources, primarily FY 2019-20 and older range-wise products.
- **Historical technical definitions:** NHSRC training material publicly hosted in 2021 but containing older schedules and terminology (for example TT, three ANC visits, 100 IFA tablets and older immunization schedules).
- **Legacy architecture:** 2010 HMIS User Guidelines.

No historical formula should be attached to an April-2025 field merely because the label is similar. Crosswalks need one of four statuses: exact current match, probable successor, historical-only or unresolved.

## Access and evidence gaps

The following cannot yet be claimed as publicly complete:

1. Current national portal data dictionary with every live field identifier and definition.
2. Current validation-rule catalogue, warning/error severity and override workflow.
3. Complete current KPI formula library, numerator/denominator field IDs and aggregation rules.
4. Public API specification, authentication, rate limits and stable metadata endpoints.
5. Current master facility-type taxonomy and public facility registry extract aligned to HMIS IDs.
6. State/UT additions, suppressed fields, local mappings and implementation dates.
7. Revision history linking legacy OGD items to April-2025 fields.
8. Definitive rules for zero, blank, not applicable, late revision, freeze dates and back-entry in HMIS 2.0.
9. Exact linkage rules with RCH, U-WIN, NCD, Ni-kshay, IHIP, eVIN/DVDMS and state systems.
10. Current national denominator tables and update procedures for expected-event indicators.

## Recommended custodian questions

- Can MoHFW/NHSRC provide the April-2025 national HMIS data dictionary in machine-readable form, including field IDs and facility applicability?
- What is the authoritative change log and effective-date mechanism?
- Which validation rules are hard errors, soft warnings or analytical plausibility checks?
- Which indicators are calculated by the portal, with what aggregation rule and denominator source?
- Which fields are entered directly, imported from another platform or derived?
- Which reports/APIs are intended for public reuse, and what are their refresh/revision policies?
- How should state-specific additions and facility reclassification be represented?

## Integration gate for the later master registry

Do not merge this research into the master registry until each candidate has: an object class; exact source/version; source code; facility applicability; lowest reporting level; reporting period; aggregation behavior; official or explicitly non-official definition status; calculation provenance; zero/blank semantics; validation status; currentness; and an access/caveat statement.

The correct near-term release would be called **“HMIS public-source-bounded research release”**, not “complete national HMIS dictionary.”

## Files in this research pack

- `hmis-2025-form-element-census.csv` — {len(concept_rows)} exact-label concepts with facilities, modules, codes and pages.
- `hmis-2025-facility-coverage.csv` — form coverage by facility type.
- `nhsrc-indicator-dictionary.csv` — 54 historical technical indicator definitions.
- `hmis-validation-rule-catalogue.csv` — 25 historical validation relationships.
- `hmis-ogd-key-output-census.csv` — {len(key_rows)} historical published key outputs, classified as aggregate or derived.
- `hmis-ogd-legacy-item-census.csv` — {len(legacy_rows)} legacy FY 2019-20 OGD item codes and observed variants.
- `hmis-source-ledger.csv` — source authority, period, scope and research treatment.
- `hmis-metadata-model.csv` — metadata requirements for later integration.
- `hmis-research-gap-log.csv` — unresolved evidence and proposed resolution route.
