# Master Public Health Indicator Registry — Release 1.3 linked HMIS knowledge structure

Cut-off date: 1 September 2026

Release: 1.3.0-hmis-knowledge-structure

## What “bounded-exhaustive” means

This release contains every eligible catalogue record found in four declared global source catalogues at the cut-off date, plus the separately maintained 80-record priority collection. It does not claim to contain every indicator ever used by every programme, country or institution.

## Release 1 contents

| Collection | Records | Inclusion rule |
|---|---:|---|
| WHO Indicator Metadata Registry | 1,320 | Every English-language indicator link visible in the official index |
| World Bank Health Indicators | 658 | Every indicator returned under API topic 8, Health |
| UN Global SDG Indicator Framework | 251 | Every indicator currently returned by the official UNSD API |
| UNICEF Indicator Data Warehouse | 799 | Every code in `CL_UNICEF_INDICATOR` for `GLOBAL_DATAFLOW` |
| Curated priority collection | 80 | Previously validated, decision-oriented public-health indicators |
| India national programme extension | 380 | Verified records from 15 official source families, including NTEP and the formula-defined HMIS indicator layer |
| — NTEP deep vertical | 222 | All eligible records within the declared public KPI, laboratory, DR-TB and Panchayat source boundary |
| — HMIS derived indicators | 54 | Historical formula-defined NHSRC indicators promoted to the main registry |
| **Total** | **3,488** | Source manifestations are retained rather than prematurely merged |

## HMIS linked knowledge layer

| Object class | Objects | Version treatment |
|---|---:|---|
| Derived indicators | 54 | Historical NHSRC technical definitions; retained in the main registry |
| Reporting data elements | 700 | Revised facility/headquarters forms effective April 2025 |
| Published outputs | 202 | Historical FY 2019-20 OGD publication layer |
| Validation rules | 25 | Historical NHSRC data-quality guidance |
| **Total** | **981** | Separate object classes joined by explicit IDs and review-status crosswalks |

Numerator and denominator links to April-2025 data elements are analyst-generated candidates labelled as exact, probable, candidate or unresolved. They are not custodian-approved mappings. Data elements, published outputs and validation rules remain outside the main indicator count because their metadata semantics differ.

## Authoritative acquisition sources

- WHO Indicator Metadata Registry: https://www.who.int/data/gho/indicator-metadata-registry
- World Bank Indicators API: https://api.worldbank.org/v2/topic/8/indicator
- UNSD SDG Indicators API: https://unstats.un.org/SDGAPI/v1/sdg/Indicator/List
- UNICEF Indicator Data Warehouse SDMX API: https://sdmx.data.unicef.org/ws/public/sdmxapi/rest/

## Important limitations

- Many catalogue records provide discovery metadata but not full numerator, denominator, formula, frequency or disaggregation metadata.
- Similar names across sources remain separate source manifestations until equivalence is methodologically reviewed.
- Domain labels for harvested records are search-oriented rule-based classifications, not classifications asserted by the source authority.
- Thirty-four source families are recorded in the Source Census. Four global catalogues are source-complete; all 15 authoritative Indian source families have a verified subset.
- NTEP is deep and source-bounded for its declared sources; restricted Ni-kshay metadata remains outside the release.
- HMIS is public-source-bounded for the declared NHSRC, April-2025 form and OGD sources. The live national dictionary, validation configuration, local/state additions and restricted metadata remain open evidence gaps.

## Maintenance rule

Releases must retain the source identifier, original code, authoritative URL, acquisition date, source boundary and exclusion log. A future refresh must publish additions, revisions and retirements rather than overwriting history without notice.
