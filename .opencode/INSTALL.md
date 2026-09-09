# Installing Yunxing Skills for OpenCode

Install the plugin with the `opencode plugin` command:

```bash
opencode plugin --global "yunxing@git+https://github.com/raptoravis/yunxing.git"
```

`--global` writes to your global config (`~/.config/opencode/opencode.json`); drop it to install into the current project's `opencode.json`. To pin a release, append a tag (`...#vX.Y.Z`).

The plugin is an OpenCode v2 plugin: it registers the promoted skill directories (`skills/engineering` and `skills/productivity`) as skill sources, so no separate install step is required. Each skill whose `SKILL.md` frontmatter carries `slash: true` (every promoted skill) is exposed as a `/name` slash command, so `/cap`, `/tdd`, and the rest are reachable directly.

Equivalently, add Yunxing to the `plugin` array by hand:

```json
{
  "plugin": ["yunxing@git+https://github.com/raptoravis/yunxing.git"]
}
```

Restart OpenCode after changing the config.

## Local Development

This repo's own `opencode.json` declares `"plugin": ["./"]`, so running `opencode` inside the checkout loads the plugin from the local package. No extra config is needed.
