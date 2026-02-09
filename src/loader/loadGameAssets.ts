import { Assets } from "pixi.js"; 
import type { GameManifest } from "../types/GameManifest";

export async function loadGameAssets(manifest: GameManifest) { 
  const assetList = []; // képek 
   for (const key in manifest.assets.images) { 
     assetList.push(manifest.assets.images[key]); 
  }

  await Assets.load(assetList);
}