# Public Health Analytics-OS

An open, modular GitHub Pages workspace for public-health roles, indicators and future analytical products.

## Published structure

- `/` — Public Health Analytics-OS shared home
- `/roles/` — Public Health Roles in India, preserved as an interactive module
- `/indicators/` — bounded-exhaustive Master Public Health Indicator Registry

The registry currently publishes 3,751 indicator manifestations: a 3,108-record global core and 643 India-specific records. It also links 1,046 HMIS knowledge objects and a five-programme knowledge graph. Completeness is asserted only within each declared source boundary; the registry is not yet exhaustive across all public-health authorities or live programme portals. Public download controls are disabled.

## Recommended GitHub Pages address

Create a public repository named `Public-Health-Analytics-OS`. The default project-site address will be:

`https://abeezith.github.io/Public-Health-Analytics-OS/`

In **Settings → Pages**, choose **Deploy from a branch**, then select `main` and `/ (root)`.

The existing `Public-Health-Roles-in-India` repository can remain online during migration. Once the new site is verified, its root page can be replaced with a small redirect or notice pointing to `/Public-Health-Analytics-OS/roles/`.

## Updating modules

Each module is self-contained and uses relative links, so it can be replaced independently without changing the shared home page.

## Programme and standards workstreams

Programme expansion, governance, schemas, provenance, analyst utility, operational mappings, Semantic Web publication, FHIR interoperability, terminology evaluation and derived-product work are coordinated in [the programme workstream tracker](docs/PROGRAMME-WORKSTREAM-TRACKER.md). Its machine-readable status ledger is stored at `indicators/data/governance/workstreams.json`; every future programme receives the same repeatable enrichment checklist, with FHIR retained as a separately gated nested workstream.

The machine-readable contracts are published as a [versioned JSON Schema catalogue](indicators/data/schemas/manifest.json). Consumers should pin [schema package 1.0.0](indicators/data/schemas/1.0.0/manifest.json) and follow the [schema guide](docs/SCHEMA-GUIDE.md); a successful structural validation does not imply source verification, semantic equivalence, computability, domain review or custodian approval.

Computed metadata completeness is governed by [metadata-quality profile `PHAOS-MDQ-001`](docs/METADATA-QUALITY-SPECIFICATION.md). Its [machine-readable profile](indicators/data/governance/metadata-quality-profile.json), [aggregate validation report](indicators/data/governance/metadata-quality-report.json) and [relationship vocabulary](indicators/data/governance/relationship-vocabulary.json) remain separate from historical hand-assigned metadata fields.

Unified discovery is governed by [object taxonomy `PHAOS-OBJECT-TAXONOMY-001`](docs/UNIFIED-REGISTRY-TAXONOMY.md) and [identity policy `PHAOS-IDENTITY-001`](docs/IDENTITY-LIFECYCLE-POLICY.md). The Registry is now the common interface for a 4,743-canonical-object overview, 3,751 indicators, 1,046 HMIS knowledge objects and 560 individually searchable report-column occurrences, while representing the 54 shared registry/HMIS indicators only once canonically. Its generated, versioned [consolidated read model](indicators/data/registry/manifest.json) preserves source-specific metadata and now supports reciprocal navigation among related canonical objects, occurrences, source evidence and matching graph nodes. This is a metadata and identity layer, not a dataset of observed health values.

## Governance and contributions

Analytics-OS is governed by the [Public Health Analytics-OS Governance Charter](docs/GOVERNANCE-CHARTER.md). It defines authority boundaries, review states, decision rights, correction handling, release cadence and continuity. Contribution requirements are documented in [CONTRIBUTING.md](CONTRIBUTING.md), and material governance decisions are retained in the [governance decision log](docs/GOVERNANCE-DECISION-LOG.md).
