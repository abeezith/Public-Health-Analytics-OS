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

The current package is Release 1.3: 3,488 main-registry indicators, including 380 India-source-specific records. HMIS is represented through a linked, version-aware knowledge layer rather than by mixing all object types into the indicator table: 54 derived indicators, 700 April-2025 form data elements, 202 historical OGD outputs and 25 validation rules.

Official/source indicator names, definitions and formulas are preserved. Separate normalized metadata fields classify measure type, show the calculation scale explicitly, standardize percentage expressions as `(numerator ÷ denominator) × 100`, and state the denominator population. Records without sufficient source metadata remain visibly unclassified rather than being guessed.

The HMIS layer is exhaustive only for its declared public sources. It does not claim to reproduce the current live national HMIS data dictionary, validation configuration, local additions or restricted portal metadata. See the coverage section, source census and HMIS downloads for provenance and open evidence gaps.

## Release 1.4 candidate — observed report schemas

The site contains a separately versioned HMIS Report Schemas layer. Its first package reconciles a 560-column default State report header extract observed on 1 September 2026: 35 context dimensions, 525 measure occurrences, 508 canonical links and 17 unverified candidate fields. The canonical 700-element dictionary is unchanged. Public download controls are disabled; the evidence layer is presented for interactive review.
