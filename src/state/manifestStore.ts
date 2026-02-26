//manifestStore.ts
import type { GameManifest } from "../types/GameManifest";

let manifest: GameManifest | null = null;

export function setManifest(m: GameManifest) {
  manifest = m;
}

export function getManifest(): GameManifest {
  if (!manifest) {
    throw new Error("Manifest has not been loaded yet!");
  }
  return manifest;
}
