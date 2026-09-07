# Analytics-OS versioned JSON Schema guide

**Schema package:** `1.0.0`  
**JSON Schema dialect:** Draft 2020-12  
**Adopted:** 7 September 2026  
**Governance task:** TRUST-02

The package under [`indicators/data/schemas/1.0.0`](../indicators/data/schemas/1.0.0/) defines the first explicit structural contracts for Analytics-OS. The unversioned [`manifest.json`](../indicators/data/schemas/manifest.json) is only a discovery pointer. Production consumers must pin the versioned manifest or a versioned schema `$id`.

## Contract inventory

| Contract | Governs |
|---|---|
| `common.schema.json` | Shared identifiers, dates, WHO building blocks, measure types, mapping relations, review states, actors and evidence references |
| `indicator-manifestation.schema.json` | Source-specific registry manifestations, official-name preservation and normalized analytical metadata |
| `source-document.schema.json` | Master source catalogue entries and programme-release source references |
| `hmis-object.schema.json` | Version-bounded HMIS data elements, derived indicators, outputs and validation rules |
| `graph-node.schema.json` | Typed knowledge-graph entities and canonical URIs |
| `graph-edge.schema.json` | Directed graph predicates, assertion status and reviewed mapping metadata |
| `evidence-gap.schema.json` | Missing, inaccessible, outdated or unresolved evidence and its resolution route |
| `programme-release.schema.json` | Programme source boundary, source list, evidence gaps and programme payloads |
| `review-event.schema.json` | Independent source, technical, domain, semantic, computability, governance and custodian reviews |
| `change-event.schema.json` | Append-only, field-level change descriptions and version transitions |

## Design rules

1. **Source and normalized metadata remain separate.** The source name and definition are not overwritten by `measureType`, `scaleDisplay`, `normalizedFormula` or other Analytics-OS interpretations.
2. **Percentage structure is explicit.** When `measureType` is `Percentage/proportion`, the schema requires `%`, a normalized formula containing the factor 100 and a stated denominator population.
3. **Authority is not inferred.** Structural validity does not establish that a source is current, a mapping is equivalent, a measure is computable, a domain reviewer agrees or a custodian approves.
4. **Graph mappings are directional.** A `manifestationOf` edge requires mapping relation, rationale, aggregation-safety decision and review status. Similarity alone never authorizes pooling values.
5. **HMIS objects retain their class.** A data element, output or validation rule does not become an indicator merely because it is useful for indicator computation.
6. **Evidence gaps are first-class records.** Missing dictionaries, restricted portals and unresolved definitions remain visible and carry a resolution action.
7. **Events are append-only.** Review and change events refer to the subject and its version. They do not silently mutate or erase earlier released evidence.

## Compatibility boundary in 1.0.0

The first package is deliberately compatible with Release 3.7. `additionalProperties` is allowed so programme- and source-specific metadata can be retained without data loss. A null `measureType` means normalized classification is pending, not that the source supplied a null measure. Older WHO building-block labels beginning `Access to essential medicines` are retained as compatibility aliases, while new mappings use `Medical products, vaccines and technologies`. Empty source strings remain distinguishable from absent required fields and will be scored by TRUST-03 rather than invented during structural validation. Existing NP-NCD tuple records are accepted as a documented legacy payload; new programme records should use named indicator objects. The legacy graph review label beginning `Domain-reviewed` remains accepted until TRUST-05 migrates entry-level review history.

This compatibility policy is not permission to add arbitrary fields indefinitely. TRUST-03 now publishes the separate [`PHAOS-MDQ-001`](METADATA-QUALITY-SPECIFICATION.md) computed quality profile without rewriting legacy fields. TRUST-04 will settle identity and lifecycle rules, TRUST-05 will populate entry-level quality/review/change properties, and TRUST-06 will make release validation an automated gate.

## Versioning policy

- Patch versions clarify constraints or fix schema defects without invalidating conformant records.
- Minor versions add backward-compatible fields, definitions or enum members.
- Major versions may remove compatibility paths, close extension points or change required semantics.
- Released version directories are immutable. A change is published in a new version and the catalogue pointer is updated only after governance review.
- Data release versions, upstream source versions and schema package versions are independent and must not be substituted for one another.

Until TRUST-04 is complete, this is an interim schema-version policy rather than the full persistent-identity and lifecycle policy.

## Validation profiles

| Profile | Meaning |
|---|---|
| Schema syntax | Each contract is valid Draft 2020-12 JSON Schema |
| Record structure | A record has the required identity, type and provenance fields for its contract |
| Cross-record integrity | IDs, graph endpoints, source references and release counts reconcile; implemented under TRUST-06 |
| Semantic review | Definition, denominator, formula, mapping direction and public-health interpretation were reviewed separately |
| Computability | Executable logic and test cases exist for the declared subset |
| Custodian approval | Explicit source-custodian approval is recorded; never inferred from another profile |

## Consumer guidance

Resolve relative `$ref` values against the selected version directory and enable format checking for `date`, `date-time` and `uri`. Validate individual records with their record schema and programme release files with `programme-release.schema.json`. Do not treat the unversioned catalogue as a stable validation URL, and do not treat a successful schema result as evidence that values from two indicators can be compared or aggregated.
