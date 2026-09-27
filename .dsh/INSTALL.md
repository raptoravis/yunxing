# Installing Yunxing Skills for DeepSeek Harness (dsh)

dsh installs plugins per profile, and every profile keeps its own directory under
`$DSH_HOME/profiles` (default `~/.dsh/profiles`). Install the bundle into every
profile on the machine:

```bash
# One install per profile: a profile without the bundle serves that session no yunxing skills.
for profile in "${DSH_HOME:-$HOME/.dsh}"/profiles/*/; do
  [ -f "${profile}package.json" ] || continue
  dsh plugin --profile "$(basename "$profile")" add github:raptoravis/yunxing
done
```

On Windows, in PowerShell:

```powershell
$dshHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
Get-ChildItem (Join-Path $dshHome 'profiles') -Directory -ErrorAction SilentlyContinue |
  Where-Object { Test-Path (Join-Path $_.FullName 'package.json') } |
  ForEach-Object { dsh plugin --profile $_.Name add github:raptoravis/yunxing }
```

The bundle registers the promoted skill directories (`skills/engineering` and
`skills/productivity`) as an isolated skill provider, so there is no separate
install step and no skill link to create. A session booted from a profile the
bundle never reached lists no yunxing skills, which is what a hardcoded
`--profile web` caused for anyone whose everyday profile was a different one.
Run the install again after creating a new profile.

## One profile at a time

When you know which profile you boot, name it instead of looping:

```bash
dsh plugin --profile <profile> add github:raptoravis/yunxing
```

The directory names under `$DSH_HOME/profiles` are the profile names.

## Pin a release

Append the tag to the spec:

```bash
dsh plugin --profile <profile> add github:raptoravis/yunxing#vX.Y.Z
```

## Local development

Link a checkout instead of the published repository:

```bash
dsh plugin --profile <profile> add link:/path/to/yunxing
```

## Verify

A profile that carries the bundle shows its two rows in the composed tree:

```bash
dsh --profile <profile> --dump-config | grep -A4 '== yunxing'
```
