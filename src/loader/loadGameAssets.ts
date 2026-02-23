// loadGameAssets.ts
import { Assets } from "pixi.js"; 
import type { GameManifest } from "../types/GameManifest";

export async function loadGameAssets(
  manifest: GameManifest,
  onProgress?: (progress: number) => void
) { 
  const assetList: string[] = [];

  // 1) Images
  for (const key in manifest.assets.images) { 
    assetList.push(manifest.assets.images[key]); 
  }

  // 2) Atlases (JSON spritesheets)
  if (manifest.assets.atlases) {
    for (const key in manifest.assets.atlases) {
      assetList.push(manifest.assets.atlases[key]);
    }
  }

  const total = assetList.length;
  let loaded = 0;

  // Egyenként töltjük, hogy legyen progress
  for (const asset of assetList) {
    await Assets.load(asset);
    loaded++;

    if (onProgress) {
      onProgress(loaded / total);
    }
  }
}
