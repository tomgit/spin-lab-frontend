//loadGameManifest.ts
import type { GameManifest } from "../types/GameManifest";

export async function loadGameManifest(path: string): Promise<GameManifest> {

  const response = await fetch(path);
  return await response.json();
  
}
