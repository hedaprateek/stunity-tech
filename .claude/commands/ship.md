---
description: Commit, push, and confirm the deploy actually went out
argument-hint: "[commit message]"
---

Ship the current work to `main`.

Message for this commit, if the user gave one: `$ARGUMENTS`

Do this in order, and stop at the first step that fails rather than pressing on:

1. **Look at what is actually changing.** Run `git status` and `git diff`. If
   anything unintended is staged — a scratch file, a screenshot, an `.env`, a
   pasted API key — stop and say so instead of committing it.

2. **Check the work is done.** Walk the "Definition of done" checklist in
   `CLAUDE.md`. If a visual change has not been screenshot-verified, run
   `/verify` first. Do not take "it should be fine" as verification.

3. **Commit.** Use `$ARGUMENTS` as the message if it was given; otherwise write
   an imperative one-liner describing the effect, not the diff
   (`Add CSV import to the roster table`, not `changed roster.js`).

4. **Push** to `main`.

5. **Confirm it landed.** If the repo has a GitHub Actions workflow, poll
   `gh run list --limit 1` until the run finishes and report its conclusion.
   For a GitHub Pages project, give the user the live URL. If the run failed,
   fetch the log and say what broke — do not report success.

Report what shipped in two lines: the commit subject, and the deploy status.
