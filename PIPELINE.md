# How this site works

`resume.json` is the single source of truth. Everything else is generated.

```
resume.json ──> theme/ (vendored JSON Resume theme) ──> dist/index.html
static/     ──────────────────────────────────────────> dist/ (favicon, robots, sitemap, PDFs, …)
dist/index.html ──> headless Chrome ──> dist/cv.pdf (+ legacy cv_santiago_espinosa_mooser.pdf)
```

On push to `main`, `.github/workflows/publish.yml` spellchecks, validates,
builds, renders the PDF, and deploys `dist/` to GitHub Pages (source:
GitHub Actions — no generated files are committed to the repo).

## Editing

- Content: edit `resume.json` (bump `meta.lastModified`). The PDF is generated
  from the same file — never upload a hand-made PDF.
- Styling/markup: edit `theme/` (`resume.template`, `style.css`, `print.css`,
  `index.js`). The theme is vendored here; the old npm package
  `jsonresume-theme-mooser` is no longer part of the build.
- This repo's README doubles as the GitHub profile page — keep ops notes here,
  not there.

## Local preview

```sh
npm ci
npm run validate   # resume.json against the JSON Resume schema
npm run build      # renders dist/
npm run pdf        # needs Chrome; on NixOS: nix-shell -p chromium --command 'npm run pdf'
```

Open `dist/index.html` in a browser.

## Scheduled maintenance

`maintenance.yml` runs a monthly link check (lychee, LinkedIn excluded — it
blocks bots) and opens a quarterly "is the resume still current?" issue.

## Licensing

Resume content: all rights reserved. Workflow/theme/script code: reuse freely.
