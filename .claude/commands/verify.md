---
description: Render the app headless and actually look at the screenshots
argument-hint: "[what changed]"
---

Verify the UI by looking at it. What changed: `$ARGUMENTS`

**Why this command exists:** a DOM assertion suite once passed 49 checks on a
page that rendered as a solid black screen. Every check was green. The page was
unusable. Assertions confirm that nodes exist; they say nothing about whether a
human can see or use the result. So render it and look.

Steps:

1. **Serve it.** From the project root, start a static server in the background:
   `python -m http.server 8080`. Opening `file://` also works for simple pages
   but breaks module loading and service workers, so prefer the server.

2. **Screenshot both themes.** Use headless Chrome:

   ```powershell
   & "C:\Program Files\Google\Chrome\Application\chrome.exe" `
     --headless --disable-gpu --hide-scrollbars `
     --screenshot=".verify\dark.png" --window-size=1280,900 `
     "http://localhost:8080"
   ```

   For light mode, append whatever the app uses to select it — typically
   `?theme=light` or a `localStorage` seed via `--virtual-time-budget`.

3. **Screenshot narrow.** Repeat at `--window-size=390,844`. Layouts break at
   phone width far more often than at desktop width.

4. **Read the images.** Actually open each PNG and look at it. Check:
   - Is anything rendered at all, or is it a blank/black rectangle?
   - Is text legible against its background in *both* themes?
   - Does anything overflow, overlap, or get clipped at 390px?
   - Are the controls the change was about visibly present?

5. **Check the console.** Re-run with `--enable-logging --v=1` or load the page
   and dump `console` errors. A clean console is part of done.

6. **Clean up.** Stop the server. `.verify/` is gitignored, so the PNGs can stay
   for the user to look at.

Report what you saw, not what you expected to see. If a screenshot looks wrong,
say so and fix it — do not describe the intended design as though it rendered.
