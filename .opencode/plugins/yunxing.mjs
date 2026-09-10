import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const engineeringDir = path.resolve(pluginDir, "../../skills/engineering")
const productivityDir = path.resolve(pluginDir, "../../skills/productivity")

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

// OpenCode 1.x registers discovered skills as server commands with source
// "skill", then deliberately hides that source from the TUI slash catalog.
// Register equivalent config commands so they have source "command" and are
// visible, while retaining skills.paths for the model-facing skill tool.
export default async () => ({
  config: async (config) => {
    config.skills = config.skills || {}
    config.skills.paths = config.skills.paths || []
    const promotedDirs = [engineeringDir, productivityDir]
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
  },
})
