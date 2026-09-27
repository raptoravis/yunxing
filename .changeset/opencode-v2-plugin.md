---
"yunxing": minor
---

Add OpenCode 2.x support to the plugin. 2.x drops the `config` hook, so `.opencode/plugins/yunxing.mjs` now registers the promoted skills through the 2.x `skill` and `command` transforms in `setup`, mapping `disable-model-invocation: true` to `autoinvoke: false`, while keeping the 1.x `config` hook (`skills.paths` plus `config.command`) reachable through the `server()` export.
