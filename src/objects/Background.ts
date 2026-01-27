import { Application, Assets, Sprite } from "pixi.js";

export class Background {

    sprite!: Sprite;
    scaleValue = 1;

    constructor(private app: Application, private url: string) {}

    async init() {
        const texture = await Assets.load(this.url);
        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5, 0.5); // To the middle
        this.app.stage.addChildAt(this.sprite, 0);
        this.app.renderer.on("resize", () => this.resize());
        this.resize();
    }

    resize() {
        const screenW = this.app.screen.width;
        const screenH = this.app.screen.height;
        const texW = this.sprite.texture.width;
        const texH = this.sprite.texture.height;
        // skála a magasság alapján (hogy a teljes magasság látszódjon)
        const scaleByHeight = screenH / texH;
        // skála a szélesség alapján (hogy a teljes szélesség látszódjon)
        const scaleByWidth = screenW / texW;
        // végső skála: a kisebbiket választjuk → így a kép mindig teljes egészében látszik
        const scale = Math.min(scaleByHeight, scaleByWidth);
        this.scaleValue = Math.min(scaleByHeight, scaleByWidth);
        this.sprite.scale.set(scale);
        // pozicionálás: középre vízszintesen, középre függőlegesen
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.set(screenW / 2, screenH / 2);
        // pozicionálás: középre vízszintesen, alulra függőlegesen
        //this.sprite.anchor.set(0.5, 1);
        //this.sprite.position.set(screenW / 2, screenH);
    }
    
}
