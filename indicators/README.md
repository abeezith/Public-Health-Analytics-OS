# Public Health Indicator Registry — GitHub Pages

This folder is a self-contained static website. No server-side application or database is required.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload **the contents of this folder** to the repository root. `index.html` must be at the root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)`, then save.

GitHub will show the public website address after deployment completes.

## Updating the data

The source project includes a build command that refreshes the packaged data and downloads:

```text
npm run build:github-pages
```

The current maintenance package is Release 3.7: 3,751 published indicator manifestations, comprising a 3,108-record global core and 643 India-specific records. HMIS is represented through a linked, version-aware knowledge layer rather than by mixing all object types into the indicator table; the live explorer exposes 1,046 linked HMIS objects. Public download controls are disabled.

Programme 2 expands the package to Release 2.0 with 3,649 main-registry records, including 541 India-specific records. The RMNCH+A filter exposes 215 records: 161 newly extracted official source-table indicators, 46 linked HMIS-derived indicators, and 8 earlier programme records. The completed source boundary covers all 42 RMNCH+A Strategy scorecard indicators, all 20 LaQshya Annexure C facility targets, and all 99 RKSK indicator-table rows. Restricted/current portal dictionaries and newer child-health manuals remain declared evidence gaps.

Programme 3 expands the package to Release 3.0 with 3,708 main-registry records, including 600 India-specific records. The Immunization filter exposes 76 records: 59 newly extracted official monitoring indicators and 17 earlier UIP, HMIS, NFHS and RMNCH+A records. The source boundary covers all 21 IMI 2017 monitoring indicators, 24 IMI 2.0 dashboard/data-quality indicators, 8 AEFI 2024 performance indicators and 6 routine coverage/dropout measures; 102 HMIS knowledge objects are linked separately. Authenticated U-WIN, eVIN and NCCMIS dictionaries remain declared evidence gaps.

The current knowledge graph spans NTEP, RMNCH+A, Immunization, vector-borne diseases and NP-NCD, with HMIS as a shared data spine. It uses typed and evidence-qualified relationships, normalized six-building-block and reporting-level vocabularies, a machine-readable graph contract, Schema.org/JSON-LD publication metadata and automated graph-integrity QA. Source-neutral concepts support discovery without authorizing aggregation.

Official/source indicator names, definitions and formulas are preserved. Separate normalized metadata fields classify measure type, show the calculation scale explicitly, standardize percentage expressions as `(numerator ÷ denominator) × 100`, and state the denominator population. Records without sufficient source metadata remain visibly unclassified rather than being guessed.

The HMIS layer is exhaustive only for its declared public sources. It does not claim to reproduce the current live national HMIS data dictionary, validation configuration, local additions or restricted portal metadata. See the coverage section, source census and HMIS downloads for provenance and open evidence gaps.

## Release 1.4 candidate — observed report schemas

The site contains a separately versioned HMIS Report Schemas layer. Its first package reconciles a 560-column default State report header extract observed on 1 September 2026: 35 context dimensions, 525 measure occurrences, 508 canonical links and 17 unverified candidate fields. The canonical 700-element dictionary is unchanged. Public download controls are disabled; the evidence layer is presented for interactive review.
