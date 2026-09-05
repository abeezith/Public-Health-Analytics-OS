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

Programme expansion, knowledge-graph work, FHIR interoperability and the deferred terminology evaluations are tracked in [the programme workstream tracker](docs/PROGRAMME-WORKSTREAM-TRACKER.md). Its machine-readable status ledger is stored at `indicators/data/governance/workstreams.json` so every future programme can receive the same repeatable interoperability checklist.
