# Gotchas

Common failure modes when translating git history into reports, and how to avoid them.

## 1. Ambiguous time windows

Relative dates with a clear time offset (e.g. "最近一个礼拜", "last week", "过去3天") should be resolved to `YYYY-MM-DD` automatically using the resolution table in the main SKILL.md. Only stop and ask when the expression has no time anchor (e.g. "recently", "a while ago", "some time back").

## 2. Not in a git repo

If `git rev-parse --show-toplevel` fails, confirm a readable repo path and prefix every command with `git -C /path/to/repo`. Do not silently run against the wrong directory.

## 3. Technical commit subjects

Titles like "refactor worker queue" or "migrate to new ORM" don't explain value to a non-technical audience. Inspect the changed files first, then translate into what the change enables or improves.

## 4. Feature spread across commits

When many commits touch the same workflow or feature area, merge them into one accomplishment and summarize the outcome once. A report with ten sections for ten commits is just a reformatted git log.

## 5. Internal-only work

Housekeeping, dependency bumps, CI edits, or internal refactors should be omitted or kept to one modest "Stability and Foundations" section. Don't pad the report with work the audience doesn't care about.

## 6. Overclaiming value

Avoid promising faster conversions, higher reliability, or better performance without evidence in the diff. State what changed, not speculative results.
