# Analytics-OS unified registry taxonomy

**Taxonomy:** `PHAOS-OBJECT-TAXONOMY-001` version `1.0.0`  
**Adopted:** 7 September 2026  
**Task:** UNIFY-01

The unified registry uses one discovery taxonomy without flattening unlike public-health objects into “indicators.” Source labels remain attached to each representation; the canonical type supports cross-source filtering and navigation.

| Canonical type | Meaning | Current publication treatment |
|---|---|---|
| Indicator | A measure definition or source-specific indicator manifestation | Canonical object |
| Data element | A captured form or information-system field | Canonical object; not automatically an indicator |
| Published output | A source-published report, table, dashboard output or aggregate product | Canonical object |
| Validation rule | A consistency or data-quality constraint | Canonical object |
| Report field occurrence | A field appearing in a particular report schema | Occurrence linked to a canonical element when evidenced |
| Reporting dimension | A geography, facility, period, identifier or stratification column | Occurrence; canonical promotion is separately governed |
| Source document | A document, catalogue, page or release artifact used as evidence | Governed supporting object |
| Evidence gap | Missing, inaccessible, outdated, conflicting or unresolved evidence | Governed supporting object |
| Observation/aggregate value | A value for an object, geography/reporting unit and period | Reserved; no observed-value dataset is implied |

## Core rules

1. Preserve official and source object labels.
2. Keep source type and canonical discovery type separate.
3. Treat HMIS as an information system/portal facet, not as a health programme.
4. Do not promote data elements, outputs, validation rules or report columns into indicators merely because they are analytically useful.
5. Do not count a version-specific report occurrence as a second canonical data element.
6. Keep candidate fields visible and explicitly non-canonical until evidence and review justify promotion.
7. Keep metadata definitions separate from future observed values.

The machine-readable vocabulary is published at [`object-taxonomy.json`](../indicators/data/governance/object-taxonomy.json).

## Programme and system/portal facets

UNIFY-03 implements Programme and System / portal as separate facets. HMIS is excluded from Programme and mapped to System / portal. An indicator can consequently appear under a service-delivery programme and HMIS at the same time. This broader system filter is not the same as the 54-record HMIS-derived-indicator subset.

The controlled definitions, exclusions and evidence patterns are published in [`discovery-facets.json`](../indicators/data/governance/discovery-facets.json). A system mapping supports discovery only; it does not assert an operational UID, current portal dictionary mapping or interoperability.
