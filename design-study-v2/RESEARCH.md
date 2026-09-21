# Round 02: more character, more variety

The brief changed after round 01: “These are a bit too minimalist. rerun the workflow with a more varied set of designs”. This round therefore explores four different compositions, not four palettes applied to the same archive. All retain writing as the purpose, with the CV kept in the About footer.

## Shortlist

**The Sunday Edition** is my recommendation for an expressive but durable writing site. **The Curiosity Cabinet** is the strongest alternative if the priority is a personal space that feels playful and exploratory. These are recommendations, not selected designs.

| Direction                  | Visual identity                                                                   | Homepage structure                                                                      | Article treatment                                                             | Main tradeoff                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 01 — The Sunday Edition    | Slate ink, cream paper, vermilion; big serif masthead, double rules               | Lead essay + harbour photograph + margin notes, then a three-column story section       | Broad headline, photograph, drop cap, narrow reading column and contents rail | More editorial organisation; needs one featured post, but no weekly publishing obligation                  |
| 02 — Field Notes           | Photographic blues, forest green, warm paper; stamped and slightly tilted details | Immersive photographic cover, personal introduction strip, varied-size notebook entries | Green title panel, wide photograph, right-hand contents notes                 | Most dependent on good photography; risks suggesting a travel-only blog if the content mix is not balanced |
| 03 — The Curiosity Cabinet | Deep teal, terracotta, sage and ochre; original illustrations                     | Split introduction and botanical drawing; staggered cards and a personal shelf          | Illustrated heading, soft contents panel and rounded pull quote               | More playful and visually busy; artwork must stay optional to keep posting easy                            |
| 04 — After Hours           | Existing navy roots plus lavender, peach and lime; oversized sans-serif type      | Orbital illustration, large introduction, colourful story tiles and a short-note strip  | Dark reading page, geometric hero, sans-serif body and lavender highlights    | Stronger technology/design association; less suitable if a bookish tone is preferred                       |

## What was researched and borrowed

I reopened the current main-branch source, checked the previous study and MemPalace context, browsed a broader set of personal sites, and captured reference pages in Firefox. These are original compositions using specific ideas from the references; their copy and artwork have not been copied into the prototypes.

- [Austin Kleon](https://austinkleon.com/): personal publishing that combines images, quotations, short observations and longer entries. Borrowed the variety and the feeling of a personal publication for **The Sunday Edition**. The newspaper masthead and column arrangement are original design choices.
- [Craig Mod](https://craigmod.com/): writing, photography and attention to books as physical objects. Borrowed the weight given to photography and book-like presentation for **Field Notes**. The stamped cover and notebook cards are original. His memberships, store and newsletter business are not part of the proposal.
- [Maggie Appleton](https://maggieappleton.com/): a digital garden with illustrated essays, notes, patterns and a library. Borrowed the idea that a personal site can hold ideas at different stages and the combination of illustration and writing for **The Curiosity Cabinet**. The botanical and other vector illustrations were drawn specifically for this study.
- [Josh W. Comeau](https://www.joshwcomeau.com/): a colourful, playful personal writing site with recognisable decorative forms, category browsing and strong reading hierarchy. Borrowed the permission to be expressive without sacrificing readability for **After Hours**. Its navy/lavender palette and orbital illustration are original rather than a copy of his sky motif.

Frank Chimero's current homepage was also reviewed, but its sparse navigation is too close to the restraint rejected in round 01, so it did not become a leading reference. Some additional sites could not be fetched reliably; they are not used as evidence here.

## Continuity with the current website

The current source uses slate blue (#334960), white reading surfaces and a navy dark palette (#10161e / #1c2531). Round 02 carries this forward in different amounts:

- **Sunday Edition:** slate remains the primary ink; warm paper and red details give it an editorial voice.
- **Field Notes:** blue moves into the photography; forest-green text and paper give it a more tactile character. This is the largest palette departure.
- **Curiosity Cabinet:** blue-green replaces plain slate, with new terracotta and botanical tones.
- **After Hours:** the dark navy foundation remains recognisable, while lavender and coloured artwork create a more individual identity.

The latest production domain was previously blocked by Cloudflare; source continuity refers to the locally inspected theme, not a newly verified production rendering.

## Keeping writing easy

The technical recommendation remains [Astro with Markdown content collections](https://docs.astro.build/en/guides/content-collections/) and [static GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/). Round 02 adds visual richness, not a requirement for a database or a production application server. The earlier [publishing comparison](../design-study/RESEARCH.md) still covers alternatives; its quiet-journal recommendation is superseded by this round's shortlist.

For implementation, keep a single post model with title, date and body. Add only optional description, topic, image/alt text and `featured` metadata. A template should supply defaults so publishing a plain text post is still easy. Standard Markdown is enough for prose, images, lists and code; design details belong in reusable templates.

- The Sunday Edition can select the most recent post automatically unless another is featured.
- Field Notes can reuse a site-level cover and display text-only cards when a post has no image.
- The Curiosity Cabinet and After Hours can use a small reusable illustration library; no custom drawing should be required per post.
- Short notes can use the same Markdown collection with an optional `type: note`. The initial launch does not need a separate CMS collection, shelf of books or tag management system.
- The visual local authoring option remains [Front Matter in VS Code](https://frontmatter.codes/docs/getting-started/). A browser-based CMS can be evaluated separately if that becomes the preferred workflow.

All four can preserve the existing CV PDF URLs. A future `/cv/` page can retain the JSON Resume rendering. Names and page titles are working ideas; “Sunday Edition” does not imply a commitment to publish every Sunday.

## How to review

Open [the comparison gallery](index.html). Each direction has a responsive homepage and a long-form article specimen, plus functional topic filtering. Navigation to Writing, Notes and About works; the CV link uses the existing PDF. All sample post titles lead to the same clearly identified reading specimen, so this is not a complete content archive.

Look at the homepage first, then the article: the homepage establishes personality, but the article is where readers will spend most of their time. The prototypes intentionally use the same sample content so differences in presentation can be compared fairly. Sample travel/walking copy is not a proposal to limit Santiago's subjects.

This round uses a deliberate palette per direction rather than light/dark toggles. A selected production design can then receive a complementary accessible colour scheme without flattening this exploration into palette variants.

## Assets and implementation scope

- `assets/harbour.jpg`: [Modern cityscape across a wide blue ocean](https://unsplash.com/photos/modern-cityscape-across-a-wide-blue-ocean-B1T0D56Zq9w), by I P (@ipraudz), downloaded at 1800px for these prototypes under the [Unsplash License](https://unsplash.com/license). Credit appears in the footer. It is a design reference photo, not Santiago's photograph. In production, prefer Santiago's own photographs where available.
- `assets/*.svg`: five original vector illustrations authored in `build.py`: botanical drawing, book and cup, contour paths, geometric collage and orbital diagram. They are ordinary static SVG files.
- `assets/SpaceGrotesk.ttf`: self-hosted [Space Grotesk](https://github.com/google/fonts/tree/main/ofl/spacegrotesk); SIL Open Font License included. Lora and its license are reused from the round 01 directory.
- Portrait and CV PDF are reused from the site's existing `static/` directory.

`build.py` regenerates the eight HTML specimens and five SVG illustrations using only Python's standard library. `style.css` and `ui.js` are shared; layout-specific CSS preserves the four distinct compositions. This is a design-study generator, not a replacement publishing system. No changes were made to the production build, CV data or deployment workflow.

All imagery and fonts are local. The public prototypes require no remote font service, image service, analytics or backend. JavaScript only enhances filtering: with it disabled, every post remains visible and article links work.
