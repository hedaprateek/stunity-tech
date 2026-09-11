# Decisions

Why Stunity Tech is the way it is. Newest first.

The point of this file is to stop a future session — yours or an AI's — from
relitigating a choice that was already made for a good reason, or from
"fixing" something that is deliberate. If a decision cost you more than ten
minutes of thought, it belongs here.

Keep entries short. Date, what was chosen, what it was chosen over, and why.
Add one with `/decide`.

---

## 2026-09-11 — Light-theme accent darkened to #C23812

**Chose:** `#C23812` for `--accent` in the light theme, `#666A76` for `--ink-3`.

**Over:** the brighter `#E5431A` and `#7A7E8A` first sketched.

**Why:** white text on `#E5431A` is 4.1:1 and grey `#7A7E8A` on the paper is
3.6:1 — both fail WCAG AA. On a site that measures contrast in front of the
visitor, the site itself has to pass.

**Revisit if:** the brand colour changes — re-check it in the Lab's contrast checker.

## 2026-09-11 — Contrast figures are measured, never typed

**Chose:** craft stage 6 and Inspect mode compute contrast from rendered colours.

**Over:** hard-coded "AAA" labels.

**Why:** a label that drifts from reality after a colour tweak would be worse
than no label on a site selling accessibility work.

## 2026-09-11 — No backend for the contact form

**Chose:** the form opens WhatsApp or the mail app with the message pre-written.

**Over:** Formspree or a similar form service.

**Why:** no account, no third party, nothing to expire. Most local clients
prefer WhatsApp anyway.

**Revisit if:** enquiries need tracking, or visitors without WhatsApp complain.

## 2026-09-11 — System fonts only

**Chose:** Segoe UI Variable / SF Pro / system-ui, with Iowan / Palatino /
Georgia for the italic accents and the platform monospace.

**Over:** Google Fonts.

**Why:** the no-dependency rule. The look comes from scale, tracking and
layout, not from a downloaded face.

**Revisit if:** a specific face is wanted — self-host the woff2 in
`assets/fonts/`, never link a CDN.

## 2026-09-11 — No build step, no dependencies

**Chose:** plain HTML/CSS/JS (or plain Node with no packages), served as-is.

**Over:** a framework with a bundler.

**Why:** this is a small utility that has to keep working unattended for years.
A build step is a thing that rots — a dependency goes unmaintained, a Node
version drops support, and suddenly a two-line fix needs an afternoon of
toolchain archaeology. Plain files have no such failure mode. The cost is more
verbose code, which is a cost worth paying at this size.

**Revisit if:** the project grows past roughly 5,000 lines, or genuinely needs
a reactive UI rather than a handful of independent panels.
