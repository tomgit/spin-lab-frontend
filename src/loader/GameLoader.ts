import { loadGameManifest } from "./loadGameManifest";
import { loadGameAssets } from "./loadGameAssets";
import { setManifest } from "../state/manifestStore";
import type { GameManifest } from "../types/GameManifest";
import { prefixManifestPaths } from "./prefixManifestPaths"

export class GameLoader {
  static async load(gameId: string): Promise<GameManifest> {
    const basePath = `games/${gameId}/`;
    const manifestPath = `${basePath}manifest.json`;

    const manifest = await loadGameManifest(manifestPath);

    // Prefixeljük az asset path-okat
    prefixManifestPaths(manifest, basePath);

    setManifest(manifest);
    await loadGameAssets(manifest);

    return manifest;
  }
}
