---
description: Record a design decision in docs/DECISIONS.md
argument-hint: "<what was decided>"
---

Record this decision so it does not get relitigated: `$ARGUMENTS`

Append a new entry to the **top** of the list in `docs/DECISIONS.md` (newest
first, directly under the `---` separator), in exactly this shape:

```markdown
## YYYY-MM-DD — <short title>

**Chose:** <what we are doing>

**Over:** <the alternative that was seriously considered>

**Why:** <the reasoning — the part that is expensive to reconstruct later>

**Revisit if:** <the condition that would change the answer>
```

Rules for a good entry:

- **Name the road not taken.** A decision with no alternative is just a
  description. The value is in knowing what was already ruled out and why.
- **Record the reasoning, not the conclusion.** "We use localStorage" is
  worthless in a year. "We use localStorage because the venue Wi-Fi cannot be
  relied on and a server would make the tool useless exactly when it is needed
  most" survives.
- **Keep it under six lines.** If it needs more, it is a design doc, not a
  decision entry.
- **Use today's real date.** Check it rather than guessing.

If `$ARGUMENTS` is thin, ask the user what the alternative was and why it lost
before writing — those two facts are the whole point of the entry.
