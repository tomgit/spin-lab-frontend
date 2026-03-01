// loadGameAssets.ts
import { Assets } from "pixi.js";
import type { GameManifest } from "../types/GameManifest";

export async function loadGameAssets(
  manifest: GameManifest,
  onProgress?: (progress: number) => void
) {
  const assetList: any[] = [];

  // 1) Images
  for (const key in manifest.assets.images) {
    assetList.push({ alias: key, src: manifest.assets.images[key] });
  }

  // 2) Atlases (JSON spritesheets)
  if (manifest.assets.atlases) {
    for (const key in manifest.assets.atlases) {
      const url = manifest.assets.atlases[key];
      assetList.push({ alias: key, src: url });
    }
  }

  // 3) Winline images
  if (manifest.assets.winlines) {
    for (const path of manifest.assets.winlines) {
      assetList.push(path);
    }
  }

  const total = assetList.length;
  let loaded = 0;

  for (const asset of assetList) {
    await Assets.load(asset);
    loaded++;
    onProgress?.(loaded / total);
  }
}
