# Yunxing Skills

Agent skills for real engineering, maintained by [raptoravis](https://github.com/raptoravis). They are small, composable, and designed to work with any model.

## Installation

A plugin updates itself. Pick one harness below.

<details>
<summary><strong>Claude Code</strong></summary>

Inside Claude Code:

```
/plugin marketplace add raptoravis/yunxing
/plugin install yunxing@yunxing
```

Or from your shell:

```bash
claude plugin marketplace add raptoravis/yunxing
claude plugin install yunxing@yunxing
```

</details>

<details>
<summary><strong>Codex</strong></summary>

```bash
codex plugin marketplace add raptoravis/yunxing
codex plugin add yunxing@yunxing
```

</details>

<details>
<summary><strong>Cursor</strong></summary>

Add this repository as a plugin marketplace in Cursor and install `yunxing` from it. The marketplace manifest is [`.cursor-plugin/marketplace.json`](./.cursor-plugin/marketplace.json).

</details>

<details>
<summary><strong>Grok Build</strong></summary>

Add this repository as a plugin marketplace in Grok Build and install `yunxing` from it. The marketplace manifest is [`.grok-plugin/marketplace.json`](./.grok-plugin/marketplace.json).

</details>

<details>
<summary><strong>GitHub Copilot</strong> (CLI and VS Code)</summary>

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

</details>

<details>
<summary><strong>Gemini CLI</strong> (manual updates)</summary>

```bash
gemini skills install https://github.com/raptoravis/yunxing.git --path skills/engineering
gemini skills install https://github.com/raptoravis/yunxing.git --path skills/productivity
```

Re-run both commands to update.

</details>

<details>
<summary><strong>OpenCode</strong></summary>

```bash
opencode plugin --global "yunxing@git+https://github.com/raptoravis/yunxing.git"
```

</details>

<details>
<summary><strong>DeepSeek Harness (dsh)</strong></summary>

```bash
# One install per profile: a profile without the bundle serves that session no yunxing skills.
for profile in "${DSH_HOME:-$HOME/.dsh}"/profiles/*/; do
  [ -f "${profile}package.json" ] || continue
  dsh plugin --profile "$(basename "$profile")" add github:raptoravis/yunxing
done
```

The bundle registers `skills/engineering` and `skills/productivity` as an isolated skill provider. Pin a release with `github:raptoravis/yunxing#vX.Y.Z`, and run the command again after creating a new profile. See [`.dsh/INSTALL.md`](./.dsh/INSTALL.md) for details.

</details>

<details>
<summary><strong>For tinkerers and other agents</strong></summary>

Use the skills.sh installer on any Agent Skills-compatible harness:

```bash
npx skills@latest add raptoravis/yunxing
```

Pick the skills you want and which coding agents to install them on.

</details>

## Skills

### Engineering

**User-invoked**

- **[new-raw](./skills/engineering/new-raw/SKILL.md)**: Capture a raw requirement exactly as given, with no clarification or dialogue. Files it as a GitHub or GitLab issue when the matching CLI is available, otherwise as a local Markdown file.
- **[vision](./skills/engineering/vision/SKILL.md)**: Send an image to a configured external vision provider when native vision is not available or not sufficient.

**Model-invoked**

- **[report-from-commits](./skills/engineering/report-from-commits/SKILL.md)**: Turn git history since an exact date into a copy-pastable, non-technical report grouped by feature, in Chinese.
- **[playwright-tester](./skills/engineering/playwright-tester/SKILL.md)**: Automated UI testing with Playwright's native runner: writes persistent `.spec.ts` files, runs them at zero AI tokens, and fixes failures in an automated loop.

### Productivity

**User-invoked**

- **[cap](./skills/productivity/cap/SKILL.md)**: Commit all changes, push, and walk through pull, merge, resolve, and push again when the remote is ahead.

## Documentation

Each skill has a human-facing page under [`docs/`](./docs/):

- [new-raw](./docs/engineering/new-raw.md)
- [vision](./docs/engineering/vision.md)
- [report-from-commits](./docs/engineering/report-from-commits.md)
- [playwright-tester](./docs/engineering/playwright-tester.md)
- [cap](./docs/productivity/cap.md)

## License

MIT. See [LICENSE](./LICENSE).