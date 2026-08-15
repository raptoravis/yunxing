Skills are organized into bucket folders under `skills/`:

- `engineering/` — daily code work
- `productivity/` — daily non-code workflow tools
- `misc/` — kept around but rarely used, not promoted
- `in-progress/` — beta: public on purpose, feedback wanted, not shipped in the plugin
- `deprecated/` — no longer used

Every skill in `engineering/` or `productivity/` (the **promoted** buckets) must have a reference in the top-level `README.md` and an entry in the `skills` arrays of `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and `.cursor-plugin/plugin.json`. Skills in `misc/`, `in-progress/`, and `deprecated/` must not appear in any of them.

Install commands are copied verbatim from [.agents/install-block.md](./.agents/install-block.md). The repo is also its own single-plugin marketplace for five agent harnesses:

- **Claude Code** — `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json`
- **Codex** — `.codex-plugin/plugin.json` + `.agents/plugins/marketplace.json`
- **Cursor** — `.cursor-plugin/plugin.json` + `.cursor-plugin/marketplace.json`
- **OpenCode** — `opencode.json` (skills.paths pointing at promoted buckets)
- **DeepSeek Harness (dsh)** — `package.json`'s `dsh.bundle.patch` → `cordis.patch.yml`, a bundle whose `skill-filesystem` row points `customSkillDirs` at the promoted buckets via `.dsh/plugin.mjs`

When bumping the release version, keep `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.cursor-plugin/plugin.json`, and `.cursor-plugin/marketplace.json`'s `metadata.version` in sync with `package.json`'s. The dsh bundle's version is `package.json`'s own `version`, so it needs no separate sync. When a skill is added, removed, renamed, or moved between buckets, update the top-level `README.md`, all three plugin manifests' `skills` arrays, and `opencode.json`/`.dsh/plugin.mjs` when their promoted bucket paths change. Run `claude plugin validate . --strict` after touching either Claude manifest. Why a Claude plugin but not (yet) a Codex one lives in [.agents/adr/0002-ship-as-a-claude-code-plugin.md](./.agents/adr/0002-ship-as-a-claude-code-plugin.md).

Each skill entry in the top-level `README.md` must link the skill name to its `SKILL.md`.

Each bucket folder has a `README.md` that lists every skill in the bucket with a one-line description, with the skill name linked to its `SKILL.md`. The promoted buckets' `README.md`s and the top-level `README.md` group entries into **User-invoked** and **Model-invoked**; non-promoted bucket `README.md`s (`misc/`, `in-progress/`) use a flat list.

Skills in `engineering/` and `productivity/` also have a human-facing docs page at `docs/<bucket>/<skill-name>.md` (the docs tree mirrors those two bucket folders under `skills/`). The published URL is `https://aihero.dev/skills-<skill-name>` regardless of bucket — the docs path is repo organisation only. When you add, rename, or change the behaviour of a skill in `engineering/` or `productivity/`, create or re-sync its docs page following [.agents/writing-docs.md](./.agents/writing-docs.md). A finished page carries four sections — **What it does**, **When to reach for it**, **Common questions**, **It's working if** — and `writing-docs.md` holds the template, the section order, and where to hunt for the questions. Skills in the non-promoted buckets (`misc/`, `in-progress/`, `deprecated/`) get **no** docs page.

Every `SKILL.md` is either user-invoked (`disable-model-invocation: true` plus `policy.allow_implicit_invocation: false` in `agents/openai.yaml`, reachable only by the human) or model-invoked (model- or user-reachable). See [.agents/invocation.md](./.agents/invocation.md).

[`ask-matt`](./skills/engineering/ask-matt/SKILL.md) is the router that maps every user-reachable skill and how they relate. The same trigger that re-syncs a docs page applies to it: whenever you add, rename, remove, or change how a user-reachable skill fits the flows, re-read `ask-matt`'s `SKILL.md` and update it so the map stays accurate — a new skill it never mentions, or a stale one it still routes to, is a router that lies.

Use each harness's plugin mechanism as the sole installation and update path for this repository in Claude Code, Codex, Cursor, OpenCode, and DeepSeek Harness (dsh). `scripts/link-skills.sh` is legacy tooling and must not be run; do not create repository skill links in `~/.claude/skills`, `~/.agents/skills`, `~/.cursor/skills`, `~/.config/opencode/skills`, or `~/.dsh/skills`.

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five default triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo. See `docs/agents/domain.md`.

### Image understanding

For images, screenshots, diagrams, charts, mockups, and other visual-analysis tasks, prefer the model's native vision capability. Do not prioritize or proactively invoke the `vision` skill when the model can inspect the image directly. Use the `vision` skill only when the user explicitly requests it, native vision is unavailable or insufficient, or the task specifically requires an external vision model or endpoint.
