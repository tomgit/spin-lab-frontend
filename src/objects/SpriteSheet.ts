import { Assets, Sprite } from "pixi.js";

export class SpriteSheet {

    sheet: any;

    constructor(private url: string) {}

    async init() {
        this.sheet = await Assets.load(this.url);
    }

    create(name: string): Sprite {
        return new Sprite(this.sheet.textures[name]);
    }
    
}
