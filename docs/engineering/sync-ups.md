## What it does

`sync-ups` keeps this fork in sync with upstream [`mattpocock/skills`](https://github.com/mattpocock/skills). It detects new, modified, and deleted skills since the last sync, absorbs them, and updates every downstream reference — plugin manifests, READMEs, docs pages, and symlinks — so nothing drifts out of date.

It tracks a baseline (`.sync/upstream-baseline`) so each run is incremental: only the upstream diff since the last sync is processed.

## When to reach for it

Type `/sync-ups` whenever you want to pull upstream changes. Run it:

- When you notice upstream shipped a new skill
- After upstream releases a new version (watch the [CHANGELOG](https://github.com/mattpocock/skills/blob/main/CHANGELOG.md))
- On a schedule (weekly, monthly) to prevent drift

First run saves a baseline and does nothing else — it just records "we're caught up to this point." The second run is where actual syncing begins.

## What gets synced

| Upstream change | What happens |
|---|---|
| New skill added | Copied to the fork, registered in all manifests and READMEs, docs page created |
| Skill modified | Changes merged (three-way merge preserves local edits), descriptions updated everywhere |
| Skill deleted | Reported for confirmation, then removed from all references if approved |
| Non-skill files changed (`CLAUDE.md`, scripts, etc.) | Reviewed case-by-case — manifest files are never auto-overwritten (they carry our rebranding) |

## Rebranding awareness

This fork is rebranded (`yunxing` / `raptoravis/yunxing`). `sync-ups` absorbs skill content while preserving fork-specific identity in manifests, marketplace entries, installation guidance, and local-only skill registrations.

## Common questions

**Does it merge the whole upstream repository every time?**

No. `.sync/upstream-baseline` records the last absorbed upstream commit, so each run handles only the next upstream diff.

**What happens when upstream deletes a skill?**

Deletion always pauses for confirmation. Keeping the directory makes it explicitly fork-only; approving deletion removes the skill and all of its registrations together.

## It's working if

- The saved baseline advances only after the upstream changes are handled.
- Local branding and fork-only skills remain intact.
- Both plugin manifests list the same skills and strict Claude plugin validation passes.
- Upstream deletions and `CLAUDE.md` changes are surfaced for a human decision.

## Where it fits

`sync-ups` is periodic maintenance for this fork, not part of the idea-to-ship chain. It uses [resolving-merge-conflicts](https://aihero.dev/skills-resolving-merge-conflicts)' intent-first discipline when both sides changed the same content. [ask-matt](https://aihero.dev/skills-ask-matt) maps the complete set.
