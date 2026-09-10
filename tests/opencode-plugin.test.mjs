import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import YunxingPlugin from "../.opencode/plugins/yunxing.mjs"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

async function skillNames(bucket) {
  const entries = await fs.readdir(path.join(repoRoot, "skills", bucket), { withFileTypes: true })
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
}

test("registers promoted skills as visible OpenCode slash commands", async () => {
  const config = {}
  const hooks = await YunxingPlugin()

  await hooks.config(config)

  assert.ok(config.command?.["ask-matt"], "missing /ask-matt command")
  assert.ok(config.command?.cap, "missing /cap command")
  assert.match(config.command["ask-matt"].template, /# Ask Matt/)
  assert.match(config.command.cap.template, /# cap: commit & push/)
  assert.doesNotMatch(config.command.cap.template, /^---/)
  assert.match(config.command.cap.template, /Base directory for this skill:/)
  assert.match(config.command.cap.template, /\$ARGUMENTS$/)

  const promoted = [...(await skillNames("engineering")), ...(await skillNames("productivity"))]
  assert.deepEqual(Object.keys(config.command).sort(), promoted.sort())
  assert.equal(config.command["git-guardrails-claude-code"], undefined)
})

test("preserves a user-defined command with the same name", async () => {
  const custom = { description: "custom", template: "custom template" }
  const config = { command: { cap: custom } }
  const hooks = await YunxingPlugin()

  await hooks.config(config)

  assert.equal(config.command.cap, custom)
})
