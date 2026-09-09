import path from "node:path"
import { fileURLToPath } from "node:url"

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const engineeringDir = path.resolve(pluginDir, "../../skills/engineering")
const productivityDir = path.resolve(pluginDir, "../../skills/productivity")

// OpenCode turns a skill into a /name slash command only through the v1
// config.skills.paths route: the command system registers every v1 skill
// unconditionally. The v2 ctx.skill.transform API loads skills into the v2
// SkillV2 system instead, reachable only via the `skill` tool, so it never
// becomes a slash command. Use the v1 config hook.
export default async () => ({
  config: async (config) => {
    config.skills = config.skills || {}
    config.skills.paths = config.skills.paths || []
    for (const dir of [engineeringDir, productivityDir]) {
      if (!config.skills.paths.includes(dir)) {
        config.skills.paths.push(dir)
      }
    }
  },
})
