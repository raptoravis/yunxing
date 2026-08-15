# Installing Yunxing Skills for DeepSeek Harness (dsh)

Install the bundle into a dsh profile with `dsh plugin`:

```bash
dsh plugin --profile web add github:raptoravis/yunxing
```

The bundle registers the promoted skill directories (`skills/engineering` and
`skills/productivity`) as an isolated skill provider — no separate install
step required.

To pin a release, add the tag:

```bash
dsh plugin --profile web add github:raptoravis/yunxing#vX.Y.Z
```

For local development, link this checkout:

```bash
dsh plugin --profile web add link:/path/to/yunxing
```
