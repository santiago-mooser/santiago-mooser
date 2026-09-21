# From CV to personal publishing

Prepared 21 September 2026. Recommendation: **Astro, plain Markdown, GitHub Pages, and direction 01 (the quiet journal).** This is a research and design proposal; the production site and publishing pipeline have not been migrated.

## What exists

Inspected origin/main at c0107ea. `resume.json` feeds a vendored Mustache theme; `scripts/build.js` creates `dist/`, which GitHub Actions deploys to GitHub Pages. The current palette is slate blue (#334960), white and charcoal, with a dark variant (#10161e / #1c2531). The large portrait, professional headline and dense résumé columns make work the primary subject. Retain the palette and restrained styling; change the hierarchy, width and typography.

The live domain returned a Cloudflare challenge (403), so current-theme assessment uses the latest repository source and a local render, not a verified live screenshot. MemPalace searches did not return useful website-specific decisions.

## Publishing options

| Approach                            | Fit                                                                           | Tradeoff                                                                           | Verdict                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Astro + Markdown content collection | Custom layouts, metadata validation, static HTML, optional richer posts later | New template conventions and Node dependencies                                     | Best balance for this redesign                                  |
| Eleventy + Markdown                 | Small, flexible static publishing system; fits existing Node setup            | More choices around templates and content validation                               | Excellent runner-up if minimum framework structure matters most |
| Hugo + Markdown                     | Dedicated static generator with established content conventions               | Go template syntax and a different build toolchain                                 | Solid, but no clear migration advantage here                    |
| Extend the current Mustache script  | Can reuse much of the current renderer                                        | We would own Markdown integration, routing, archives, feeds and draft filtering    | More custom maintenance than this needs                         |
| Hosted Bear Blog                    | Writing-focused interface and attractive simplicity                           | Hosted publishing platform rather than the requested repository-owned static build | Useful visual inspiration, not the recommended architecture     |

Technical sources: [Astro collections](https://docs.astro.build/en/guides/content-collections/), [Astro on GitHub Pages](https://docs.astro.build/en/guides/deploy/github/), [Eleventy Markdown](https://www.11ty.dev/docs/languages/markdown/), [Hugo content formats](https://gohugo.io/content-management/formats/), [Bear Blog](https://bearblog.dev/). Rankings are my assessment for this repository, not benchmark results.

## What writing would feel like

Start with a normal Markdown editor and local site preview. A post should require only a title, date and body, with an optional description, tags and draft flag. One folder per post keeps images next to the writing:

```text
src/content/posts/a-small-discovery/
  index.md
  photo.jpg
```

```markdown
---
title: "A small discovery"
date: 2026-09-21
description: "Something I wanted to remember."
draft: true
tags: [life]
---

Write naturally here. **Emphasis**, links, lists and images are ordinary Markdown.

![A descriptive caption](./photo.jpg)
```

Proposed workflow: create a post from a template → run `npm run dev` → write with live preview → set `draft: false` → commit/push through the normal branch workflow → merge to main → Actions builds and publishes. These are implementation requirements, not commands newly implemented by this study. Date alone does not schedule publication: future-dated posts need a scheduled rebuild if scheduling is added.

Markdown is rendered during the build, not fetched and converted in readers’ browsers. Use standard Markdown first; opt into MDX only for posts that actually need components. There is no required production Node server, database, Kubernetes service or new storage volume.

For a visual local interface, [Front Matter CMS](https://frontmatter.codes/docs/getting-started/) runs inside VS Code and provides a content dashboard, post metadata controls and Astro content-collection integration. This is my preferred optional editing layer if you use VS Code: it keeps ordinary files and does not require a production CMS server. An editor-neutral Markdown workflow should remain available.

For the cleanest editor-neutral authoring experience, implement a small `new-post` command that creates the metadata and opens the file. The public website needs only reading controls; editing controls belong in the author's workflow.

If editing from any browser becomes essential, [Decap CMS](https://decapcms.org/docs/intro/) supplies an editing UI that commits content to Git. Its [GitHub backend](https://decapcms.org/docs/github-backend/) requires an authentication arrangement; a static Pages deployment alone is not a complete authenticated editor. [Keystatic](https://keystatic.com/docs/introduction) is another file/Git-backed UI worth evaluating separately. Neither is needed for Markdown publishing. My recommendation is to defer a CMS until the file workflow proves inconvenient.

## Three design directions

Open `index.html` for the visual comparison and clickable prototypes. Each includes a home, reading and About page, mobile layout, and appearance toggle. Sample copy and dates are illustrative, not Santiago's published work. All sample titles link to the same reading specimen within their direction. The toggle is a preview control and is not persisted between pages.

### 01 — The quiet journal (recommended)

A warm, near-white page; slate navigation; generous spacing; expressive Lora serif titles; a simple chronological list with short descriptions. Article text is approximately 65 characters wide. A small name replaces the résumé masthead. The homepage says “A place to think out loud.”

References: [Manu Moreale](https://manuelmoreale.com/) for treating thoughts as the centre of the site and [Tom MacWright](https://macwright.com/) for letting personal and technical writing coexist. Borrow the content priorities, not their copy or exact layouts.

Best for essays, opinions and everyday observations. Closest to the requested change in identity. Tradeoff: fewer posts visible at once than the compact index. Carry forward your slate colour and dark palette, while introducing warmer paper and serif reading typography.

### 02 — The writing index

Deep blue-black canvas from the existing dark theme, a compact name/navigation row, strong sans-serif heading, dates in a narrow column, and understated dividing lines. Writing feels like a durable collection rather than a feed of cards.

Reference: [Guillermo Rauch](https://rauchg.com/) for the direct dated index and small About link. Omit view counts: they would shift attention from the writing to popularity.

Best for technical notes and an archive that will grow over years. Tradeoff: slightly more austere, with less room for a personal introduction. A light variant remains available.

### 03 — The open notebook

Pale slate background, a short personal introduction in a left column and individual writing sheets on the right. On mobile, the introduction moves above the posts. It feels more like visiting someone's space.

Reference: [Tom MacWright](https://macwright.com/) for multiple personal interests and short/long writing; [Manu Moreale](https://manuelmoreale.com/) for informal personal publishing. The prototype keeps a single feed initially; separate Notes or Reading collections can be added only when there is content for them.

Best for mixed-length posts and a more visibly personal homepage. Tradeoff: more layout and navigation decisions; the card treatment is less minimal than direction 01.

## Recommended information architecture

- `/`: short personal introduction and recent writing; no employment history or skill badges.
- `/writing/`: complete chronological archive, with pagination when needed.
- `/writing/<slug>/`: stable post URLs and a comfortable reading layout.
- `/about/`: personal biography first; a quiet CV link near the end.
- `/cv/`: preserve the generated résumé from `resume.json` if desired.
- `/cv.pdf` and `/cv_santiago_espinosa_mooser.pdf`: preserve both existing download URLs.
- `/rss.xml`: generated feed; no newsletter service required.

Launch with Writing and About in the navigation. Add tags, search, Now or a separate Notes section only when enough writing exists to justify them. Use a simple email reply link if desired; comments require an additional service and are not necessary for launch.

## Implementation and acceptance plan

1. Introduce Astro in static output mode. Preserve the domain, static assets, `.well-known` contents and both CV PDFs. Keep the résumé renderer available at `/cv/`.
2. Define validated post metadata; reject missing/invalid dates and duplicate slugs. Exclude draft and future posts from **every** production route, archive, feed and sitemap. Drafts in a public Git repository remain publicly readable as source; keep sensitive drafts outside it or use a private content source.
3. Implement the selected home, article and About layouts. Use semantic HTML, visible keyboard focus, 18–20px reading text, roughly 60–70ch measure, responsive images and horizontally scrollable code. Respect OS appearance and reduced-motion settings; persist a manual theme preference.
4. Generate RSS, sitemap, canonical URLs and per-post social metadata. Copy required existing public files; map old résumé section fragments where practical. Do not invent a biography or publish the sample prose.
5. Update Actions path filters for new content and Astro files. Maintain a lockfile, supported Node runtime and pinned workflow actions. Validate metadata, build, and check links before Pages deployment.
6. Verify a real Markdown fixture with headings, image, link, code and metadata; verify draft/future exclusion, CV URLs, feed validity, mobile and desktop reading, keyboard navigation, both colour schemes and core reading with JavaScript disabled. Publish a reviewed first post only after the selected design is implemented.

## Scope and review

This branch contains standalone HTML/CSS design specimens and this research. No framework migration has been performed. The specimens use shared styling and a small appearance toggle, need no build step, and work when opened locally. For HTTP preview from the repository root: `python -m http.server 8765 --bind 127.0.0.1`, then visit `/design-study/`.

## Design asset provenance

Lora is self-hosted in `fonts/Lora.ttf`, obtained from the [Google Fonts source repository](https://github.com/google/fonts/tree/main/ofl/lora), with its SIL Open Font License included in `fonts/OFL.txt`. System fonts serve navigation and the archive direction. The prototypes make no font-service requests.
