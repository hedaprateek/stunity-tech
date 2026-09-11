# Stunity Tech

The studio site for Stunity Tech — Prateek Heda's software, UI and fix-it practice.

## What's on it

| Section | What it does |
|---|---|
| Hero | The headline has an **x-ray lens**: move the cursor over it and a blueprint layer shows the real CSS underneath — sizes, weights, colours, spacing — read live from the page |
| 01 Craft | An invoice screen that **builds itself as you scroll**: structure → type → colour → depth → motion → accessibility, ending with contrast ratios measured on the spot |
| 02 Fix-it clinic | Pick a symptom ("we redo the same Excel sheet every week") and a **prescription prints** — diagnosis, treatment, typical time, proof. "Book this fix" carries it into the contact form |
| 03 Revamp | A **before/after slider** between a 2009 enterprise screen and its redesign — same fields, same backend |
| 04 Lab | Three **working tools**: list cleaner, WCAG contrast checker, image shrinker. Nothing is uploaded |
| 05 Work | The live projects, with a preview that follows the cursor |
| 06 The person | Profile card and skills as `prateek.config.ts`, typed in line by line |
| Contact | Opens WhatsApp or email with the message already written |

Press **I** anywhere (or the Inspect button) and the whole site becomes a live
style inspector. The theme toggle ripples the new theme out from the button.
Section headings are drawn as outlines and then painted in, the small labels
decode into place, cards light up along the edge nearest the cursor, and the
footer reports this page's real load — time, files, bytes and third-party
requests — measured in the visitor's own browser.

## Change the details

- **Phone, email, links:** `js/config.js`
- **Clinic problems:** `SYMPTOMS` in `js/clinic.js`
- **Projects:** `PROJECTS` in `js/work.js`
- **Skills card:** `CONFIG` in `js/story.js`
- **Headline, bio, section text:** `index.html`

## Run it

Double-click `index.html`. That's all — no server, no install.

## Publish it

Pushing to `master` deploys to GitHub Pages through
`.github/workflows/pages.yml` (set the repo's Pages source to **GitHub
Actions** once).

## Working on this

Read [CLAUDE.md](CLAUDE.md) first — it covers the stack, the layout, the
conventions and the rules. Past design decisions and their reasoning live in
[docs/DECISIONS.md](docs/DECISIONS.md).

## Licence

MIT — see [LICENSE](LICENSE).
