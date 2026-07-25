# Ship a native Codex plugin now that Codex supports `skills` arrays

ADR 0002 deferred a native Codex plugin because Codex only accepted a single path string for `skills`, which couldn't express the promoted subset of a bucketed `skills/` layout. On 2026-06-18, [openai/codex#28790](https://github.com/openai/codex/pull/28790) landed support for `skills` as an array of paths in `.codex-plugin/plugin.json`, removing that constraint.

## The original constraint (now resolved)

ADR 0002 laid out the problem:

> `.codex-plugin/plugin.json` accepts `skills` only as a **single path string** (arrays are rejected). There is no way to name two bucket folders, or to curate a subset, from one path.

With arrays now supported, a Codex plugin manifest can list promoted skills one-by-one — exactly as the Claude Code manifest does.

## Decision

- Ship `.codex-plugin/plugin.json` with the same `skills` array as `.claude-plugin/plugin.json`.
- Ship `.agents/plugins/marketplace.json` so the repo is a self-serve Codex marketplace — `codex plugin marketplace add mattpocock/skills` → `codex plugin add mattpocock-skills@mattpocock`.
- Also add `opencode.json` with `skills.paths` pointing at the two promoted buckets (`./skills/engineering`, `./skills/productivity`). OpenCode auto-discovers skills from `.claude/skills/` and `.agents/skills/` already, so this is additive — it lets project-level OpenCode config see the skills without any symlink setup.
- Extend `scripts/link-skills.sh` to also populate `~/.config/opencode/skills/`.

## Invariants

- The `skills` arrays in `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` must stay in sync — adding or removing a promoted skill requires touching both.
- `opencode.json`'s `skills.paths` must cover every promoted bucket.
- `package.json`, `.claude-plugin/plugin.json`, and `.codex-plugin/plugin.json` share a single version; bump them together on release.
