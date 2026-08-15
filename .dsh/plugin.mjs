import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pluginDir = dirname(fileURLToPath(import.meta.url));

export const name = "yunxing";

export function apply(ctx) {
  ctx.provide("yunxingSkills", {
    engineering: resolve(pluginDir, "../skills/engineering"),
    productivity: resolve(pluginDir, "../skills/productivity"),
  });
}
