# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

## Managed installs first

Lead with installs that update themselves. Fall back to skills.sh, labelled "manual updates", only for agents that have no such install. Call a route managed only if it updates without the user running a command. Put any one-time opt-in beside its install command. Never promise "instant".

Every managed route installs from this repo's own marketplace, `.claude-plugin/marketplace.json` and `plugin.json`. Those routes reinstall only when the `version` in `plugin.json` changes. The Release workflow runs `npm run version`, which copies that field from `package.json`, so users get a release when the version-bump PR merges.

| Agent                | Route                            | Updates itself?                                                  |
| -------------------- | -------------------------------- | ---------------------------------------------------------------- |
| Claude Code          | `@raptoravis` marketplace        | When you re-run install (a marketplace you add yourself does not auto-update by default) |
| Codex                | `@raptoravis` marketplace        | Yes, at startup, by default                                      |
| Copilot CLI          | `@raptoravis` marketplace        | Yes, after a one-time `autoUpdate: true`                         |
| VS Code              | Chat: Install Plugin From Source | Yes, daily, by default                                           |
| OpenCode             | `opencode plugin` (git URL)      | When you re-run install                                          |
| DeepSeek Harness (dsh) | `dsh plugin` (git URL)         | When you re-run the install loop                                 |
| Gemini CLI           | `gemini skills install` (copies) | No. A Gemini extension would need a flat `skills/<name>/` layout |
| Everyone else        | skills.sh                        | No. Run `npx skills update`, and re-run `add` for new skills     |

Sources (2026-10-08): Codex `core-plugins/src/manager.rs`; Copilot [cli-config-dir-reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference); VS Code `pluginAutoUpdate.ts`; Gemini `skillLoader.ts`.

Nobody has run Auggie, Droid, Qwen or Goose against this repo, so they stay on skills.sh until someone does.

## Claude Code

<canonical-block name="claude-code">

```bash
claude plugin marketplace add raptoravis/yunxing
claude plugin install yunxing@yunxing
```

Or, from inside a session:

```
/plugin marketplace add raptoravis/yunxing
/plugin install yunxing@yunxing
```

Updates when you re-run install: a marketplace you add yourself does not auto-update by default.

</canonical-block>

## Codex

<canonical-block name="codex">

```bash
codex plugin marketplace add raptoravis/yunxing
codex plugin add yunxing@yunxing
```

Updates itself at startup.

</canonical-block>

## GitHub Copilot (CLI and VS Code)

Use the marketplace, not `copilot plugin install raptoravis/yunxing`. Copilot has deprecated direct repo installs, and they can't auto-update. The `extraKnownMarketplaces` entry follows the documented schema, but nobody has run it yet.

<canonical-block name="copilot">

```bash
copilot plugin marketplace add raptoravis/yunxing
copilot plugin install yunxing@yunxing
```

Then, once, add to `~/.copilot/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "raptoravis": { "source": { "source": "github", "repo": "raptoravis/yunxing" }, "autoUpdate": true }
  }
}
```

In VS Code, run **Chat: Install Plugin From Source** and enter `https://github.com/raptoravis/yunxing`. It updates daily.

</canonical-block>

## Gemini CLI

Gemini doesn't read `.claude-plugin`, and `--path` takes one bucket. One install per promoted bucket gives exactly the promoted set.

<canonical-block name="gemini">

```bash
gemini skills install https://github.com/raptoravis/yunxing.git --path skills/engineering
gemini skills install https://github.com/raptoravis/yunxing.git --path skills/productivity
```

Re-run both commands to update.

</canonical-block>

## DeepSeek Harness (dsh)

<canonical-block name="dsh">

```bash
# One install per profile: a profile without the bundle serves that session no yunxing skills.
for profile in "${DSH_HOME:-$HOME/.dsh}"/profiles/*/; do
  [ -f "${profile}package.json" ] || continue
  dsh plugin --profile "$(basename "$profile")" add github:raptoravis/yunxing
done
```

The bundle registers the promoted skill directories (`skills/engineering` and `skills/productivity`) as an isolated skill provider. Pin a release with `github:raptoravis/yunxing#vX.Y.Z`, and run the command again after creating a new profile.

</canonical-block>

## OpenCode

<canonical-block name="opencode">

```bash
opencode plugin --global "yunxing@git+https://github.com/raptoravis/yunxing.git"
```

The plugin registers the promoted skills (`skills/engineering` and `skills/productivity`) as model-facing skills and slash commands on OpenCode 1.x and 2.x. Pin a release with `yunxing@git+https://github.com/raptoravis/yunxing.git#vX.Y.Z`.

</canonical-block>

## Every other agent, or editable files (skills.sh)

`-a` preselects the agent. Prefer skills.sh to an agent's own repo installer, such as `amp skill add` or `pi install git:…`, because those also pull in `misc/` and `in-progress/`. `npx skills update` skips skills added upstream since `add`, so the block tells users to re-run `add`.

<canonical-block name="other-agents">

```bash
npx skills@latest add mattpocock/skills -a <agent>  # cursor, devin, windsurf, amp, pi; omit -a to choose
```

When the installer asks which skills to take, include `setup-matt-pocock-skills`. To update, run `npx skills@latest update`, and re-run `add` to pick up new skills.

</canonical-block>

Use the single-skill form wherever one skill is named on its own. `docs/` pages don't use this block, because ai-hero renders the install widget above the page body. See [writing-docs.md](./writing-docs.md).

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add mattpocock/skills --skill=<name>
```

```bash
npx skills@latest update <name>
```

</canonical-block>

`skills@latest` is the pinned spelling everywhere.

## The two routes are exclusive

The plugin is a managed, read-only bundle you subscribe to. skills.sh writes files you own and edit. Installing both leaves the user with every skill twice: always say "pick one".
