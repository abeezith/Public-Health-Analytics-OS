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

This package is bounded-exhaustive Release 1: 3,108 records from four source-complete global catalogues plus the curated priority collection. Its source census also identifies authorities scheduled for later thematic, regional and national extensions. See the site's coverage section and downloadable source census for the exact inclusion rules and limitations.
