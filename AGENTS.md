# Agent Skills

Skills are organized into bucket folders under `skills/`:

- `engineering/`: daily code work
- `productivity/`: daily non-code workflow tools

Every skill in these two promoted buckets must have a reference in the top-level `README.md`, an entry in the `skills` arrays of `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`, and `.grok-plugin/plugin.json`, a line in its bucket `README.md`, and a human-facing page at `docs/<bucket>/<skill-name>.md`.

The repo is its own single-plugin marketplace for six agent harnesses:

- **Claude Code**: `.claude-plugin/plugin.json` plus `.claude-plugin/marketplace.json`
- **Codex**: `.codex-plugin/plugin.json` plus `.agents/plugins/marketplace.json`
- **Cursor**: `.cursor-plugin/plugin.json` plus `.cursor-plugin/marketplace.json`
- **Grok Build**: `.grok-plugin/plugin.json` plus `.grok-plugin/marketplace.json`
- **OpenCode**: `.opencode/plugins/yunxing.mjs` (package.json `main` points at the plugin entry)
- **DeepSeek Harness (dsh)**: `package.json`'s `dsh.bundle.patch` points at `cordis.patch.yml`, a bundle whose `skill-filesystem` row points `customSkillDirs` at the promoted buckets via `.dsh/plugin.mjs`

Install commands live in the top-level `README.md`. Do not duplicate them anywhere else.

When bumping the release version, keep `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`, `.grok-plugin/plugin.json`, and `.cursor-plugin/marketplace.json`'s `metadata.version` in sync with `package.json`'s version. `scripts/sync-plugin-version.mjs` copies it and `--check` verifies it. The dsh bundle uses `package.json`'s own version, so it needs no separate sync.

When a skill is added, removed, renamed, or moved between buckets, update the top-level `README.md`, the bucket `README.md`, all four plugin manifests' `skills` arrays, and the docs page. The OpenCode and dsh plugins discover whole buckets, so they need a change only when a bucket path changes. Run `claude plugin validate . --strict` after touching either Claude manifest.

Each bucket `README.md` groups entries into **User-invoked** and **Model-invoked**, with the skill name linked to its `SKILL.md` and a one-line description.

Each `SKILL.md` is either user-invoked (`disable-model-invocation: true` plus `policy.allow_implicit_invocation: false` in `agents/openai.yaml`, reachable only by the human) or model-invoked (model- or user-reachable).

Docs pages carry four sections: **What it does**, **When to reach for it**, **Common questions**, and **It's working if**.

No em-dashes anywhere in this repo's prose (`SKILL.md` files, docs, `README.md`, `CHANGELOG.md`, changesets, code comments). Where a sentence reaches for one, rewrite it instead with a comma, colon, period, parentheses, or a conjunction, whichever the sentence actually wants; never do a blind character substitution.

Use each harness's plugin mechanism as the sole installation and update path. Do not create repository skill links in `~/.claude/skills`, `~/.agents/skills`, `~/.cursor/skills`, `~/.config/opencode/skills`, or `~/.dsh/skills`.

## Tests

Run `npm test` for the OpenCode plugin tests, and `node scripts/sync-plugin-version.mjs --check` to verify manifest versions.
