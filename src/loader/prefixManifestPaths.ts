import type { GameManifest } from "../types/GameManifest";

export function prefixManifestPaths(manifest: GameManifest, basePath: string) {

  const groups = manifest.assets;

  for (const groupName of Object.keys(groups)) {

    const group = groups[groupName as keyof typeof groups];

    if (Array.isArray(group)) {

      for (let i = 0; i < group.length; i++) {
        group[i] = basePath + group[i];
      }
      
    } else {

      for (const key of Object.keys(group)) {
        group[key] = basePath + group[key];
      }

    }
  }

}

