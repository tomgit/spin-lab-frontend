import type { GameManifest } from "../types/GameManifest";

export function prefixManifestPaths(manifest: GameManifest, basePath: string) {
  const groups = manifest.assets;

  type AssetGroupName = keyof typeof groups;

  for (const groupName of Object.keys(groups) as AssetGroupName[]) {
    const group = groups[groupName];

    for (const key in group) {
      group[key] = basePath + group[key];
    }
  }
}
