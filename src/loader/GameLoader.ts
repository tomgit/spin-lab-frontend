// GameLoader.ts
import { loadGameManifest } from "./loadGameManifest";
import { loadGameAssets } from "./loadGameAssets";
import { setManifest } from "../state/manifestStore";
import { prefixManifestPaths } from "./prefixManifestPaths";

export class GameLoader {
  static async load(gameId: string, onProgress?: (p: number) => void) {
    const basePath = `games/${gameId}/`;
    const manifestPath = `${basePath}manifest.json`;
    const manifest = await loadGameManifest(manifestPath);

    prefixManifestPaths(manifest, basePath);
    setManifest(manifest);

    await loadGameAssets(manifest, onProgress);

    return manifest;
  }
}
