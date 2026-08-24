# Master Public Health Indicator Registry — bounded-exhaustive Release 1

Cut-off date: 24 August 2026  
Release: 1.0.0-bounded

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
| **Total** | **3,108** | Source manifestations are retained rather than prematurely merged |

## Authoritative acquisition sources

- WHO Indicator Metadata Registry: https://www.who.int/data/gho/indicator-metadata-registry
- World Bank Indicators API: https://api.worldbank.org/v2/topic/8/indicator
- UNSD SDG Indicators API: https://unstats.un.org/SDGAPI/v1/sdg/Indicator/List
- UNICEF Indicator Data Warehouse SDMX API: https://sdmx.data.unicef.org/ws/public/sdmxapi/rest/

## Important limitations

- Many catalogue records provide discovery metadata but not full numerator, denominator, formula, frequency or disaggregation metadata.
- Similar names across sources remain separate source manifestations until equivalence is methodologically reviewed.
- Domain labels for harvested records are search-oriented rule-based classifications, not classifications asserted by the source authority.
- Nineteen authorities are recorded in the Source Census. Four global catalogues are source-complete in Release 1; specialist, regional and national extensions remain scheduled for later releases.

## Maintenance rule

Releases must retain the source identifier, original code, authoritative URL, acquisition date, source boundary and exclusion log. A future refresh must publish additions, revisions and retirements rather than overwriting history without notice.
