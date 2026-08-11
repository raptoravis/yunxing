---
name: sync-ups
description: Sync this fork forward from the upstream mattpocock/skills repo — pull new skills, merge changes to existing ones, absorb deletions, and keep all references (plugin manifests, READMEs, docs pages) in lockstep. Tracks a baseline so each run syncs only the upstream diff.
disable-model-invocation: true
---

# Sync Upstream

Sync this fork (`raptoravis/yunxing`) with new and changed content from upstream (`mattpocock/skills`).

## Quickstart

```
/sync-ups
```

First run saves a baseline. Every run after that diffs upstream from the baseline, applies changes, and saves a new baseline — incremental, not a full re-sync.

## How It Works

1. **Add upstream remote** — `git remote add upstream https://github.com/mattpocock/skills.git` if not present.
2. **Fetch** — `git fetch upstream main`.
3. **Baseline** — read `.sync/upstream-baseline`. If it doesn't exist, this is the first run: save `upstream/main` HEAD and stop (baseline only). Next run will detect the diff.
4. **Diff** — `git diff --name-status <baseline>..upstream/main` to find what changed upstream.
5. **Apply** — absorb each change per its type (see below).
6. **Register** — update every file that references skills (manifests, READMEs, docs pages).
7. **Save** — write the new `upstream/main` HEAD to `.sync/upstream-baseline`.

## Change Types

### A — New skill added

A new directory under `skills/<bucket>/<name>/` appears upstream.

1. Copy the skill directory into the fork at the same path.
2. Register in **all** the places below (see Registration).
3. Create a docs page at `docs/<bucket>/<name>.md` following `.agents/writing-docs.md`. Rewrite any links into the copied skill so they point at **our fork** (`raptoravis/yunxing`), not upstream.
4. Re-run `scripts/link-skills.sh`.

### M — Existing skill modified

Upstream changed files inside an existing skill directory.

1. For `SKILL.md`: apply the upstream diff. If the local copy has diverged (our own edits), do a three-way merge: `git diff <baseline>..HEAD -- <path>` shows our changes; `git diff <baseline>..upstream/main -- <path>` shows theirs. Merge both sets, flag conflicts with markers, and report what you merged.
2. For supporting files (`.env.example`, `scripts/*`, etc.): same approach — merge upstream changes, preserve local edits.
3. If the `description` in the SKILL.md frontmatter changed, update the corresponding entry in `skills/<bucket>/README.md`, `README.md`, and the docs page.
4. If upstream added or removed supporting files inside the skill directory, mirror those additions/deletions.

### D — Skill deleted upstream

Upstream removed a skill directory.

1. Report the deletion to the user — name the skill, its bucket, and how many local files it has.
2. **Ask** before removing. Do not auto-delete.
3. If confirmed: remove from all plugin manifests, `README.md`, `skills/<bucket>/README.md`, and delete the local skill directory. Delete the docs page. Re-run `scripts/link-skills.sh`.
4. If the user wants to keep it: leave everything as-is and note that this skill is now fork-only.

### Other files changed

Upstream may change files outside `skills/` — `CLAUDE.md`, scripts, config, etc.

1. **`CLAUDE.md`** — do NOT auto-merge. Show the diff to the user, flag any changed sections that overlap with our local additions (plugin maintenance rules, multi-manifest references, etc.), and ask the user what to keep.
2. **Scripts** (`scripts/link-skills.sh`, etc.) — apply changes. These are unlikely to have fork-specific edits that conflict.
3. **Config files** — review each diff. Our fork's `.claude-plugin/`, `.codex-plugin/`, `.agents/plugins/`, and `opencode.json` must NOT be overwritten (they use our rebranded names).
4. **Docs pages** (`docs/`) — merge upstream rewrites while preserving fork-specific content. Upstream docs may reference `mattpocock/skills`; keep issue and external-source links upstream, but rewrite links into copied skill files and any plugin branding to point at this fork.

## Registration

When a skill is added (or its description changed), update every one of these:

| File | What to update |
|------|---------------|
| `.claude-plugin/plugin.json` | Add/update entry in `skills` array |
| `.codex-plugin/plugin.json` | Add/update entry in `skills` array |
| `skills/<bucket>/README.md` | Add/update entry under the right section (User-invoked or Model-invoked) |
| `README.md` | Add/update entry under the right section |
| `docs/<bucket>/<name>.md` | Create or update docs page |

The `skills` arrays in `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` must stay identical. After every registration, verify with:

```powershell
$claude = Get-Content .claude-plugin/plugin.json -Raw -Encoding UTF8 | ConvertFrom-Json
$codex = Get-Content .codex-plugin/plugin.json -Raw -Encoding UTF8 | ConvertFrom-Json
$diff = Compare-Object ($claude.skills | Sort-Object) ($codex.skills | Sort-Object)
if ($diff) { Write-Host "MISMATCH" } else { Write-Host "OK: $($claude.skills.Count) skills" }
```

`opencode.json` covers whole buckets (`./skills/engineering`, `./skills/productivity`), so new skills inside those buckets are auto-discovered — no per-skill change needed.

## Rebranding Awareness

This fork is rebranded from `mattpocock-skills` / `mattpocock/skills` to `yunxing` / `raptoravis/yunxing`. When absorbing upstream content:

- **Do** absorb: skill bodies, frontmatter (`name`, `description`), supporting scripts, `.env.example` templates.
- **Do NOT** revert: our plugin names in manifests, our `author` / `repository` / `homepage` fields, our marketplace entries, or fork-specific docs content.
- **Review carefully**: any new file that contains `mattpocock` in its content — decide case-by-case whether it's a brand reference (replace with ours) or an external link (keep).

## After Every Sync

1. Run `claude plugin validate . --strict` — must pass.
2. Verify skills arrays match (one-liner above).
3. Run `scripts/link-skills.sh` to refresh symlinks.
4. Summarise what changed: new skills absorbed, modified skills merged, deletions handled, any conflicts flagged.
