# Installing Yunxing Skills for OpenCode

Add Yunxing to the `plugin` array in your global (`~/.config/opencode/opencode.json`) or project `opencode.json`:

```json
{
  "plugin": ["yunxing@git+https://github.com/raptoravis/yunxing.git"]
}
```

Restart OpenCode after changing the config. The plugin registers the promoted skill directories (`skills/engineering` and `skills/productivity`) — no separate install step required.

To pin a release, add a tag. Replace `X.Y.Z` with the release you want:

```json
{
  "plugin": ["yunxing@git+https://github.com/raptoravis/yunxing.git#vX.Y.Z"]
}
```

## Local Development

From this checkout, point OpenCode at the package path:

```json
{
  "plugin": ["/path/to/yunxing"]
}
```

Restart OpenCode after changing the package source.
