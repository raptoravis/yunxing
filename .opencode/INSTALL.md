# Installing Yunxing Skills for OpenCode

Install the plugin with the `opencode plugin` command:

```bash
opencode plugin --global "yunxing@git+https://github.com/raptoravis/yunxing.git"
```

`--global` writes to your global config (`~/.config/opencode/opencode.json`); drop it to install into the current project's `opencode.json`. To pin a release, append a tag (`...#vX.Y.Z`).

The plugin registers the promoted skill directories (`skills/engineering` and `skills/productivity`) — no separate install step required.

Equivalently, add Yunxing to the `plugin` array by hand:

```json
{
  "plugin": ["yunxing@git+https://github.com/raptoravis/yunxing.git"]
}
```

Restart OpenCode after changing the config.

## Local Development

This repo's own `opencode.json` declares `"plugin": ["./"]`, so running `opencode` inside the checkout loads the plugin from the local package. No extra config is needed.
