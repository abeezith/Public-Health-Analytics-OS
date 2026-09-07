# Analytics-OS persistent identity and lifecycle policy

**Policy:** `PHAOS-IDENTITY-001` version `1.0.0`  
**Adopted:** 7 September 2026  
**Tasks:** UNIFY-02 and TRUST-04

Analytics-OS assigns stable identities independently of the file, UI view, schema version and upstream source version in which an object appears. Existing released record IDs are retained as the first canonical IDs; this avoids breaking registry, HMIS and graph links.

## Identity layers

| Field | Purpose |
|---|---|
| `canonicalObjectId` | Stable identity of one governed Analytics-OS object |
| `canonicalUri` | Persistent URI under `https://abeezith.github.io/Public-Health-Analytics-OS/id/` |
| `sourceManifestationId` | Identifier used by the source-layer record |
| `representationId` | Identity of a particular registry, HMIS, graph or interoperability serialization |
| `occurrenceId` | Identity of a field appearance in a specific report schema |
| `businessVersion` | Version of the governed object meaning |
| `sourceVersion` | Version or reporting period asserted by the source |
| `schemaVersion` | Version of the serialization contract |

These versions are independent. A source update does not automatically change the Analytics-OS business version, and a schema migration does not create a new indicator.

## Lifecycle

Allowed states are `draft`, `active`, `retired` and `superseded`. An ID is never reused for another meaning. Editorial corrections retain the canonical ID. A material change to the measured population, event, numerator, denominator, scale, time window or intended interpretation requires an explicit new identity or supersession decision. Retired identities remain resolvable, and `replaces`/`replacedBy` links must be reciprocal.

The initial `businessVersion: 1.0.0` means first governed identity assignment in Analytics-OS; it does not claim that an object is the first version issued by its source custodian.

## Current reconciliation baseline

The generated identity index contains:

- 4,743 canonical objects;
- 4,797 source-layer representations;
- 54 objects with both main-registry and HMIS representations;
- 560 report-column occurrences, comprising 525 measure occurrences and 35 dimensions;
- 508 reviewed occurrence-to-canonical links and 17 non-canonical candidate occurrences.

The 54 shared HMIS indicator IDs resolve to one canonical object each. Label similarity alone does not merge any other records.

Machine-readable artifacts:

- [`identity-policy.json`](../indicators/data/governance/identity-policy.json)
- [`unified-identity-index.json`](../indicators/data/governance/unified-identity-index.json)

The index is a discovery and deduplication artifact. It is not a semantic-equivalence assertion, calculation specification, custodian approval or dataset of observed values.
