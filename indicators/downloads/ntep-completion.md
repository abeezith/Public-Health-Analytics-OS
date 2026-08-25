# NTEP deep indicator vertical — completion statement

**Release:** 1.2.0-ntep-deep  
**Cut-off:** 25 August 2026  
**Programme:** National Tuberculosis Elimination Programme (NTEP), India

## Status

The NTEP vertical is complete **within the declared, publicly accessible source boundary**. It contains 222 separately traceable indicators and reporting elements from official Central TB Division/MoHFW sources. It is not represented as an exhaustive copy of the restricted Ni-kshay production data dictionary or every historical report table.

## Included records

| Programme theme | Records |
|---|---:|
| NTEP key performance indicators | 9 |
| Case finding, diagnosis and laboratory monitoring | 33 |
| CBNAAT monthly reporting elements | 65 |
| Truenat monthly reporting elements | 73 |
| Annexure M laboratory monthly abstract | 12 |
| Culture and drug-susceptibility laboratory performance | 19 |
| Drug-resistant TB programme monitoring | 5 |
| TB Mukt Panchayat verification | 6 |
| **Total** | **222** |

The registry distinguishes 150 raw reporting elements from 72 source-published calculated measures. Each NTEP record carries programme component, reporting level, lowest reporting level, reporting unit, responsible cadre, source document, source section/page or item code, source-access status, lineage, calculation status, currentness and QA status.

## Operational depth

The source-defined lineage spans community or Gram Panchayat, facility/laboratory, block or tuberculosis unit, district, state and national levels. A record is tagged only at levels supported by its source; the registry does not infer unsupported facility or geographic granularity.

## Declared source boundary

The release reconciles the public material recorded in `ntep-source-ledger.csv`, including:

1. Comprehensive Guidance for External Quality Assessment of TB Laboratories under NTEP.
2. Official CBNAAT monthly laboratory-indicator workbook.
3. Official quarterly laboratory-performance workbook.
4. National Guidelines for Management of Drug-Resistant TB, November 2024.
5. TB Mukt Panchayat Handbook.
6. India TB Report 2024 as a contextual and cross-check source.
7. NTEP performance-report and monitoring pages.
8. Public community-engagement material.

Legacy RNTCP forms and registers are retained in the source ledger as historical context and are not treated as current definitions unless a current NTEP source confirms them.

## Remaining boundary

The following work remains pending because the authoritative operational metadata is not fully public:

- The complete live Ni-kshay field/data dictionary, validation rules, report catalogue and export schema.
- State- or user-role-specific Ni-kshay reports not exposed without authenticated programme access.
- Row-by-row extraction of every historical India TB Report table and superseded form edition.

These items require authorised access and custodian confirmation. When obtained, they should be versioned as a subsequent release rather than silently replacing this public-source release.

## QA rule

A NTEP record is accepted only when it has a stable registry identifier, name, official source URL, exact source location or item code, source-access status, level/unit lineage and WHO health-system building-block mapping. Source-published calculations remain distinct from raw reporting elements, and similarly named records are not merged without a reviewed equivalence decision.
