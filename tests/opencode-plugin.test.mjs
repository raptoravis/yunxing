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

function makeMockCtx() {
  const skills = []
  const commands = []
  const prompts = []
  const ctx = {
    skill: {
      async transform(callback) {
        callback({ add: (skill) => skills.push(skill) })
      },
    },
    command: {
      async transform(callback) {
        callback({ add: (command) => commands.push(command) })
      },
    },
    session: {
      async prompt(input) {
        prompts.push(input)
      },
    },
  }
  return { ctx, skills, commands, prompts }
}

test("registers promoted skills as visible OpenCode 1.x slash commands", async () => {
  const config = {}
  const hooks = await YunxingPlugin.server()

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

test("preserves a user-defined command with the same name (1.x)", async () => {
  const custom = { description: "custom", template: "custom template" }
  const config = { command: { cap: custom } }
  const hooks = await YunxingPlugin.server()

  await hooks.config(config)

  assert.equal(config.command.cap, custom)
})

test("registers promoted skills and commands through the OpenCode 2.x transforms", async () => {
  const { ctx, skills, commands } = makeMockCtx()

  await YunxingPlugin.setup(ctx)

  const promoted = [...(await skillNames("engineering")), ...(await skillNames("productivity"))]
  assert.deepEqual(skills.map((s) => s.id).sort(), promoted.sort())
  assert.deepEqual(commands.map((c) => c.name).sort(), promoted.sort())

  const capSkill = skills.find((s) => s.id === "cap")
  assert.ok(capSkill, "missing cap skill")
  assert.equal(capSkill.name, "cap")
  assert.equal(capSkill.autoinvoke, false, "cap is user-invoked, not model-invoked")
  assert.match(capSkill.content, /# cap: commit & push/)
  assert.doesNotMatch(capSkill.content, /^---/)
  assert.ok(path.isAbsolute(capSkill.path))

  const capCommand = commands.find((c) => c.name === "cap")
  assert.ok(capCommand, "missing /cap command")
  assert.equal(typeof capCommand.execute, "function")
})

test("a 2.x command forwards the skill body and user arguments", async () => {
  const { ctx, commands, prompts } = makeMockCtx()

  await YunxingPlugin.setup(ctx)

  const cap = commands.find((c) => c.name === "cap")
  await cap.execute({
    sessionID: "ses_1",
    prompt: { text: "with a detailed message" },
    delivery: "steer",
  })

  assert.equal(prompts.length, 1)
  const submitted = prompts[0]
  assert.equal(submitted.sessionID, "ses_1")
  assert.equal(submitted.delivery, "steer")
  assert.match(submitted.text, /# cap: commit & push/)
  assert.match(submitted.text, /Base directory for this skill:/)
  assert.match(submitted.text, /with a detailed message$/)
})
