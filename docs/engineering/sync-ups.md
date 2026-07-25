Quickstart:

```bash
npx skills add raptoravis/yunxing --skill=sync-ups
```

```bash
npx skills update sync-ups
```

[Source](https://github.com/raptoravis/yunxing/tree/main/skills/engineering/sync-ups)

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

This fork is rebranded (`yunxing` / `raptoravis/yunxing`). `sync-ups` knows to absorb skill content while preserving fork-specific identity in manifests, marketplace entries, and docs page Source links.
