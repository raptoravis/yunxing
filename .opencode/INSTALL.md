# Installing Yunxing Skills for OpenCode

Install the plugin with the `opencode plugin` command:

```bash
opencode plugin --global "yunxing@git+https://github.com/raptoravis/yunxing.git"
```

`--global` writes to your global config (`~/.config/opencode/opencode.json`); drop it to install into the current project's `opencode.json`. To pin a release, append a tag (`...#vX.Y.Z`).

The plugin registers the promoted skills (`skills/engineering` and `skills/productivity`) as both model-facing skills and slash commands, so no separate install step is required. On OpenCode 1.x it uses the `config` hook: `skills.paths` for the model-facing skill tool, plus an equivalent `config.command` entry for each `slash: true` skill, because 1.x hides skill-sourced entries from the `/` catalog. On OpenCode 2.x it registers the same skills and commands through the `skill` and `command` plugin transforms. Either way, `/cap`, `/tdd`, and the rest are visible and runnable from the `/` menu while remaining available to the model.

Equivalently, add Yunxing to the plugin array by hand. OpenCode 1.x reads it from `plugin`; OpenCode 2.x reads it from `plugins`:

```json
{
  "plugin": ["yunxing@git+https://github.com/raptoravis/yunxing.git"]
}
```

Restart OpenCode after changing the config.

## Local Development

This repo's own `opencode.json` declares `"plugin": ["./"]`, so running `opencode` inside the checkout loads the plugin from the local package. No extra config is needed.
