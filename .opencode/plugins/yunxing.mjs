import path from "node:path"
import { fileURLToPath } from "node:url"

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const engineeringDir = path.resolve(pluginDir, "../../skills/engineering")
const productivityDir = path.resolve(pluginDir, "../../skills/productivity")

export default {
  id: "yunxing",
  async setup(ctx) {
    await ctx.skill.transform((draft) => {
      // Register the promoted skill buckets as directory sources. OpenCode
      // reads each SKILL.md's `slash` frontmatter to expose skills whose
      // `slash: true` as /name slash commands.
      draft.source({ type: "directory", path: engineeringDir })
      draft.source({ type: "directory", path: productivityDir })
    })
  },
}
