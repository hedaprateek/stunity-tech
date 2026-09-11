# Stunity Tech

The studio site for Stunity Tech — Prateek Heda's software, UI and fix-it practice.

This file is the briefing for anyone — human or AI — opening this repo cold.
Read it before touching code; it answers the questions you would otherwise
spend a session rediscovering.

<!-- STACK:BEGIN -->
## Stack

A single-page site. Plain HTML, CSS and JavaScript — **no build step, no
framework, no dependencies, not even web fonts** (system font stacks only).
Opens from `file://`; deployed to GitHub Pages by
`.github/workflows/pages.yml` on every push to `master`.

The JS is ES5-flavoured — `var`, IIFEs, no modules — so it runs from
`file://` without a server. Everything hangs off `window.STUNITY` (aliased
`A` inside each file). Scripts load in order at the bottom of `index.html`;
`boot.js` is last and starts every section inside its own try/catch.

## Layout

```
index.html        the whole page, section by section (hero → contact)
css/base.css      tokens for both themes, nav, ruler, fields, footer, inspector
css/hero.css      hero + x-ray lens; the craft "device" and its six stages
css/sections.css  clinic, revamp, work, person, contact
css/lab.css       the three lab tools
js/config.js      ← contact details + studio credit. Edit this first.
js/util.js        $ / $$ / store / toast / copy, colour + WCAG contrast maths
js/theme.js       light/dark, with a ripple via View Transitions
js/xray.js        clones the hero into a blueprint layer under a cursor lens
js/inspect.js     "Inspect" mode / I key: live style inspector for any element
js/assembly.js    invoice screen that builds itself as the craft steps scroll
js/clinic.js      SYMPTOMS data → printed prescription receipts
js/revamp.js      before/after slider (legacy screen vs revamp)
js/lab.js         list cleaner, contrast checker, image shrinker
js/work.js        PROJECTS data → index list with floating previews
js/story.js       CONFIG (skills from Prateek's résumé) + hero stat counters
js/contact.js     fills data-cfg fields, credit, WhatsApp/email form
js/effects.js     decoding labels, painted headings, spotlight edges, footer vitals
js/boot.js        reveals, nav state, ruler, magnetic buttons, then every init
```

## Where content lives

| To change | Edit |
|---|---|
| Phone, email, LinkedIn, GitHub | `js/config.js` |
| Clinic problems and fixes | `SYMPTOMS` in `js/clinic.js` |
| Portfolio projects | `PROJECTS` in `js/work.js` |
| Skills card | `CONFIG` in `js/story.js` |

The hero's "Products shipped" counts `PROJECTS`, so it updates itself. Prateek
removed the career timeline, the awards and the Academy Dashboard (Report
Generator) project on purpose — don't bring them back.
| Hero, section headings, bio | `index.html` |

## Gotchas

- **The x-ray layer is a clone of `#heroFinal` made at boot.** Edit the hero
  markup, never the clone. Its annotations are read from computed styles, so
  after changing hero CSS, hover the headline and check the tags still sit well.
- **Contrast numbers are measured, not typed** — craft stage 6 and the
  inspector both compute them from rendered colours. The light-theme `--accent`
  and both `--ink-3` values were picked to pass AA; don't lighten them.
- **The craft device has its own light palette** in both site themes.
- **`zoom`, not `transform`, shrinks the device on phones**, so its layout box
  shrinks too and the step text has room below it.
- **Section headings are transparent while they paint in** (outline, then a
  background-clip sweep). `effects.js` adds `.painted` after ~1.9s to hand
  back solid text; if a heading ever looks hollow, that class never landed.
- **`[hidden]` needs `!important`** (top of `base.css`) — the lab tabs rely on it.
- **`?theme=light|dark`** forces a theme without touching storage; that's how
  screenshots get both themes.

## Verifying

Headless Chrome over the DevTools protocol (Node 24 has a global WebSocket,
so no packages): 1440×900 dark and light, 390×844 mobile with touch; scroll to
each section, drive the lens / clinic / inspector, capture, and fail on any
console error or horizontal overflow.
<!-- STACK:END -->

## Standing rules

These are not preferences. They are the constraints the project is built
around, and breaking one usually means rewriting the change.

1. **No build step.** No bundler, no transpiler, no `npm run build`. What is in
   the repo is what runs. If a change requires a build, it is the wrong change.

2. **No runtime dependencies.** No CDN links, no `npm install` to make it work.
   This has to keep working on a laptop with no network, on venue Wi-Fi that
   drops, and in five years when the CDN is gone.

3. **Everything works offline.** State lives in `localStorage`; there is no
   server and no account. Assume the network is unavailable and the page still
   has to do its job.

4. **Verify UI by screenshot, not by DOM assertions.** A DOM test suite has
   passed 49 checks on a page that rendered as a solid black screen. Render it
   headless and *look at the image* before claiming a visual change works.
   See `/verify`.

5. **Degrade, never crash.** A missing key, a corrupt import, private-browsing
   mode with no `localStorage` — each returns a fallback and tells the user in
   plain language. No unhandled exception should ever reach the console.

6. **Comment the *why*, never the *what*.** `// increment i` is noise.
   `// Safari never fires afterprint, so restore on a timer too` is the reason
   the next person does not "simplify" the code back into a bug.

## Definition of done

A change is finished when all of these are true — not when the code is written.

- [ ] It works from a cold load with empty storage (open a private window)
- [ ] It works with the network disabled
- [ ] Both light and dark themes look right — verified by screenshot
- [ ] It is usable at 380px wide
- [ ] The console is clean: no errors, no warnings
- [ ] Anything non-obvious is recorded in `docs/DECISIONS.md`

## Conventions

- **Two-space indent**, single quotes, semicolons. `.editorconfig` is committed;
  match it.
- **Comments explain the why.** See rule 6.
- **Commit messages** are imperative and describe the effect, not the diff:
  `Add CSV import to the roster table`, not `changed roster.js`.
- **One concern per file.** When a file starts doing two things, split it.

## Commands

| Command | Does |
|---|---|
| `/ship` | Commit, push, and confirm the deploy actually went out |
| `/verify` | Render the app headless and screenshot it |
| `/decide` | Append a dated entry to `docs/DECISIONS.md` |

## Before you ask me a question

Check whether it is already answered here or in `docs/DECISIONS.md`. If it is
not, and the answer turned out to matter, add it — that is how this file stays
worth reading.
