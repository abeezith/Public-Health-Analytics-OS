# Proposed Analytics-OS HMIS change set

Target: Release 1.4 candidate (not deployed)

| Change class | Records | Target layer | Decision |
|---|---:|---|---|
| Add schema manifest | 1 | HMIS Report Schemas | Include in Release 1.4 candidate |
| Add report dimensions | 35 | HMIS Report Dimensions | Include as provisional metadata |
| Add measure occurrences | 525 | HMIS Report Schema Columns | Include as observed source occurrences |
| Link canonical elements | 508 | Column-to-element crosswalk | Include with analyst-review status |
| Add label aliases | 37 | Alias catalogue | Include without renaming canonical labels |
| Add schema-specific code lineage | 85 | Code lineage | Include without overwriting canonical codes |
| Hold candidate elements | 17 | Candidate queue | Do not add to canonical dictionary |
| Record absent canonical elements | 192 | Coverage ledger | Mark not observed; do not retire |
| Update derived-indicator evidence | 54 | Indicator impact assessment | Publish assessment; do not change formulas |
| Delete canonical elements | 0 | Canonical data elements | No deletions |

The canonical HMIS data-element count remains 700. Candidate fields are published only in a review queue until the original workbook or an authoritative custodian source confirms them.
