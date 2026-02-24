//GameManifest.ts
export interface GameManifest {
  id: string;
  name: string;
  version: string;

  assets: {
    images: Record<string, string>;
    symbols: Record<string, string>;
    atlases: Record<string, string>;
    sounds: Record<string, string>;
    fonts: Record<string, string>;
  };
  symbolNames: string[];
  settings: {
    reels: number;
    rows: number;
    paylines: number;
  };
}
