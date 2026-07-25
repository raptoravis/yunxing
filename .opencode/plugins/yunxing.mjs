import path from "path"
import { fileURLToPath } from "url"

const pluginDir = path.dirname(fileURLToPath(import.meta.url))
const engineeringDir = path.resolve(pluginDir, "../../skills/engineering")
const productivityDir = path.resolve(pluginDir, "../../skills/productivity")

export const YunxingPlugin = async () => ({
  config: async (config) => {
    config.skills = config.skills || {}
    config.skills.paths = config.skills.paths || []

    // Register only the promoted skill buckets
    for (const dir of [engineeringDir, productivityDir]) {
      if (!config.skills.paths.includes(dir)) {
        config.skills.paths.push(dir)
      }
    }
  },
})

export default YunxingPlugin
