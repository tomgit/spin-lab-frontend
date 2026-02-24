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

  // 3) Winline images 
  if (manifest.assets.winlines) { 
    for (const path of manifest.assets.winlines) { 
      assetList.push(path); } 
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
