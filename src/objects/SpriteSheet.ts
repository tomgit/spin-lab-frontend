//SpriteSheet.ts
import { Assets, Sprite, Texture } from "pixi.js";

export class SpriteSheet {
  private sheet: any;

  constructor(private url: string) {}

  async init() {
    this.sheet = await Assets.load(this.url);
    if (!this.sheet?.textures) {
      throw new Error(`Spritesheet ${this.url} has no textures`);
    }
  }

  getTexture(name: string): Texture {
    const tex = this.sheet.textures[name];
    if (!tex) {
      throw new Error(`Texture "${name}" not found in ${this.url}`);
    }
    return tex;
  }

  create(name: string): Sprite {
    return new Sprite(this.getTexture(name));
  }
  
}
