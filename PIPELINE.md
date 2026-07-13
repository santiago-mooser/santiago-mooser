# How this site works

`resume.json` is the single source of truth. Everything else is generated.

```
resume.json ──> theme/ (vendored JSON Resume theme) ──> dist/index.html
static/     ──────────────────────────────────────────> dist/ (favicon, robots, 404, CV PDFs, …)
```

On push to `main`, `.github/workflows/publish.yml` spellchecks, validates,
builds, and deploys `dist/` to GitHub Pages (source: GitHub Actions — no
generated files are committed to the repo).

## Editing

- Content: edit `resume.json` (bump `meta.lastModified`).
- CV PDF: hand-maintained. Replace BOTH `static/cv.pdf` and
  `static/cv_santiago_espinosa_mooser.pdf` (same file, legacy URL) and keep
  them in sync with `resume.json` — they will not update themselves.
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
```

Open `dist/index.html` in a browser.

## Scheduled maintenance

`maintenance.yml` runs a monthly link check (lychee, LinkedIn excluded — it
blocks bots) and opens a quarterly "is the resume still current?" issue.

## Licensing

Resume content: all rights reserved. Workflow/theme/script code: reuse freely.
