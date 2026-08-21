#!/usr/bin/env node
// Copies package.json's version into every versioned plugin manifest.
// Runs as part of `npm run version`, immediately after `changeset version`.
// With --check it changes nothing and exits 1 if any version differs.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestTargets = [
  {
    manifestPath: join(repo, ".claude-plugin", "plugin.json"),
    getVersion: (manifest) => manifest.version,
  },
  {
    manifestPath: join(repo, ".codex-plugin", "plugin.json"),
    getVersion: (manifest) => manifest.version,
  },
  {
    manifestPath: join(repo, ".cursor-plugin", "plugin.json"),
    getVersion: (manifest) => manifest.version,
  },
  {
    manifestPath: join(repo, ".cursor-plugin", "marketplace.json"),
    getVersion: (manifest) => manifest.metadata?.version,
  },
];

const { version } = JSON.parse(readFileSync(join(repo, "package.json"), "utf8"));
const manifests = manifestTargets.map(({ manifestPath, getVersion }) => {
  const source = readFileSync(manifestPath, "utf8");
  const manifest = JSON.parse(source);
  return { manifestPath, source, getVersion, currentVersion: getVersion(manifest) };
});
const mismatches = manifests.filter(
  ({ currentVersion }) => currentVersion !== version,
);

if (mismatches.length === 0) {
  console.log(`plugin manifest versions are ${version} (already in sync)`);
  process.exit(0);
}

if (process.argv.includes("--check")) {
  for (const { manifestPath, currentVersion } of mismatches) {
    console.error(`${manifestPath} is ${currentVersion}, package.json is ${version}.`);
  }
  console.error("Run `node scripts/sync-plugin-version.mjs`.");
  process.exit(1);
}

for (const { manifestPath, source, getVersion, currentVersion } of mismatches) {
  // Rewrite only the version line, to keep the key order and formatting.
  const updated = source.replace(
    /("version"\s*:\s*")[^"]*(")/,
    `$1${version}$2`,
  );

  if (getVersion(JSON.parse(updated)) !== version) {
    console.error(`Could not find a version field to replace in ${manifestPath}.`);
    process.exit(1);
  }

  writeFileSync(manifestPath, updated);
  console.log(`${manifestPath} version ${currentVersion} -> ${version}`);
}
