# Tasks 6–18 reconciliation QA

Schema: HMIS-RPTSCHEMA-JHARKHAND-20260901-001

## Counts

- Measure occurrences: 525
- Canonical links: 508
- Unique canonical elements observed: 508
- Candidate new/version-specific fields: 17
- Canonical elements not observed: 192
- Label aliases: 37
- New schema-specific code occurrences: 85
- Derived indicators assessed: 54

## Gates

- allMeasureOccurrencesHaveOneStatus: PASS
- matchedPlusCandidatesEqualsMeasures: PASS
- observedPlusAbsentEqualsCanonical: PASS
- noCandidateAutomaticallyPromoted: PASS
- allMatchedElementsExist: PASS
- allCodeDifferencesPreservedAsLineage: PASS
- allDimensionsAndMeasuresAccounted: PASS
- allDerivedIndicatorsAssessed: PASS
- allMeasuresHaveAggregationNullPolicy: PASS
- noCanonicalElementDeleted: PASS

## Boundary

- The original spreadsheet, data rows, portal path, report period and selected facility/format scope remain unavailable.
- Candidate new fields are supported only by the checksum-preserved user-supplied header extract.
- No candidate field is promoted to the canonical 700-element dictionary.
- Deterministic links and code-lineage decisions remain subject to MoHFW/NHSRC/HMIS custodian validation.
