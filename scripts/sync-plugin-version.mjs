#!/usr/bin/env node
// Copies package.json's version into the Claude and Codex plugin manifests.
// Runs as part of `npm run version`, immediately after `changeset version`.
// With --check it changes nothing and exits 1 if any version differs.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const pluginPaths = [
  join(repo, ".claude-plugin", "plugin.json"),
  join(repo, ".codex-plugin", "plugin.json"),
];

const { version } = JSON.parse(readFileSync(join(repo, "package.json"), "utf8"));
const plugins = pluginPaths.map((pluginPath) => {
  const source = readFileSync(pluginPath, "utf8");
  return { pluginPath, source, plugin: JSON.parse(source) };
});
const mismatches = plugins.filter(({ plugin }) => plugin.version !== version);

if (mismatches.length === 0) {
  console.log(`plugin manifest versions are ${version} — already in sync`);
  process.exit(0);
}

if (process.argv.includes("--check")) {
  for (const { pluginPath, plugin } of mismatches) {
    console.error(`${pluginPath} is ${plugin.version}, package.json is ${version}.`);
  }
  console.error("Run `node scripts/sync-plugin-version.mjs`.");
  process.exit(1);
}

for (const { pluginPath, source, plugin } of mismatches) {
  // Rewrite only the version line, to keep the key order and formatting.
  const updated = source.replace(
    /("version"\s*:\s*")[^"]*(")/,
    `$1${version}$2`,
  );

  if (JSON.parse(updated).version !== version) {
    console.error(`Could not find a version field to replace in ${pluginPath}.`);
    process.exit(1);
  }

  writeFileSync(pluginPath, updated);
  console.log(`${pluginPath} version ${plugin.version} -> ${version}`);
}
