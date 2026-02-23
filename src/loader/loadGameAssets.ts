// loadGameAssets.ts
import { Assets } from "pixi.js"; 
import type { GameManifest } from "../types/GameManifest";

export async function loadGameAssets(
  manifest: GameManifest,
  onProgress?: (progress: number) => void
) { 
  const assetList: string[] = [];

  for (const key in manifest.assets.images) { 
    assetList.push(manifest.assets.images[key]); 
  }

  const total = assetList.length;
  let loaded = 0;

  for (const asset of assetList) {
    await Assets.load(asset);
    loaded++;

    if (onProgress) {
      onProgress(loaded / total);
    }
  }
}
