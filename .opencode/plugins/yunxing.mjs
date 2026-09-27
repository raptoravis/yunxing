import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const engineeringDir = path.resolve(pluginDir, "../../skills/engineering")
const productivityDir = path.resolve(pluginDir, "../../skills/productivity")
const promotedDirs = [engineeringDir, productivityDir]

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/

function readScalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"))
  if (!match) return undefined

  const value = match[1]
  if (value.startsWith('"') && value.endsWith('"')) {
    return JSON.parse(value)
  }
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replaceAll("''", "'")
  }
  return value
}

async function findSkillFiles(root) {
  const files = []
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await findSkillFiles(entryPath)))
    } else if (entry.isFile() && entry.name === "SKILL.md") {
      files.push(entryPath)
    }
  }
  return files
}

// Reads every promoted SKILL.md into a shape both plugin generations use.
async function collectSkills(roots) {
  const skills = []

  for (const root of roots) {
    for (const skillFile of await findSkillFiles(root)) {
      const raw = await fs.readFile(skillFile, "utf8")
      const parsed = raw.match(frontmatterPattern)
      if (!parsed) continue

      const name = readScalar(parsed[1], "name") ?? path.basename(path.dirname(skillFile))
      const description = readScalar(parsed[1], "description")
      const content = raw.slice(parsed[0].length).trimStart()

      skills.push({
        id: name,
        name,
        description,
        slash: readScalar(parsed[1], "slash") === "true",
        autoinvoke: readScalar(parsed[1], "disable-model-invocation") !== "true",
        path: skillFile,
        baseDir: path.dirname(skillFile),
        content,
      })
    }
  }

  return skills
}

function skillTemplate(skill) {
  return [
    skill.content,
    "",
    `Base directory for this skill: ${skill.baseDir}`,
    "Relative paths in this skill (e.g., scripts/, references/) are relative to this base directory.",
  ].join("\n")
}

// OpenCode 2.x exposes two plugin transforms instead of a config hook. A
// skill registered on `ctx.skill` is model-facing; a command of the same name
// registered on `ctx.command` is the visible slash command (/cap, /ask-matt).
// Registering both mirrors the 1.x dual registration below.
async function setup(ctx) {
  const skills = await collectSkills(promotedDirs)

  await ctx.skill.transform((editor) => {
    for (const skill of skills) {
      editor.add({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        autoinvoke: skill.autoinvoke,
        path: skill.path,
        content: skill.content,
      })
    }
  })

  await ctx.command.transform((editor) => {
    for (const skill of skills) {
      if (!skill.slash) continue

      editor.add({
        name: skill.name,
        description: skill.description,
        execute: async ({ sessionID, prompt, delivery }) => {
          const text = `${skillTemplate(skill)}\n\n${prompt.text ?? ""}`
          await ctx.session.prompt({ ...prompt, text, sessionID, delivery })
        },
      })
    }
  })
}

// OpenCode 1.x registers discovered skills as server commands with source
// "skill", then deliberately hides that source from the TUI slash catalog.
// Register equivalent config commands so they have source "command" and are
// visible, while retaining skills.paths for the model-facing skill tool.
async function slashCommands(roots) {
  const commands = {}

  for (const root of roots) {
    for (const skillFile of await findSkillFiles(root)) {
      const raw = await fs.readFile(skillFile, "utf8")
      const parsed = raw.match(frontmatterPattern)
      if (!parsed || readScalar(parsed[1], "slash") !== "true") continue

      const name = readScalar(parsed[1], "name") ?? path.basename(path.dirname(skillFile))
      const description = readScalar(parsed[1], "description")
      const body = raw.slice(parsed[0].length).trimStart()
      const baseDir = path.dirname(skillFile)

      commands[name] = {
        description,
        template: [
          body,
          "",
          `Base directory for this skill: ${baseDir}`,
          "Relative paths in this skill (e.g., scripts/, references/) are relative to this base directory.",
          "",
          "$ARGUMENTS",
        ].join("\n"),
      }
    }
  }

  return commands
}

async function configHook(config) {
  config.skills = config.skills || {}
  config.skills.paths = config.skills.paths || []
  for (const dir of promotedDirs) {
    if (!config.skills.paths.includes(dir)) {
      config.skills.paths.push(dir)
    }
  }

  config.command = config.command || {}
  for (const [name, command] of Object.entries(await slashCommands(promotedDirs))) {
    if (!config.command[name]) {
      config.command[name] = command
    }
  }
}

export default {
  id: "yunxing",
  setup,
  async server() {
    return { config: configHook }
  },
}
