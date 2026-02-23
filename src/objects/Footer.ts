//Footer.ts
import { Application, Assets, Sprite, Container } from "pixi.js";
import { Background } from "./Background";
import { SpriteSheet } from "./SpriteSheet";
import FontFaceObserver from "fontfaceobserver";
import { UIButton } from "../ui/UIButton";

export async function loadWebFont() { 
    const font = new FontFaceObserver("Montserrat"); 
    await font.load(); 
}

export class Footer {
    container = new Container();
    sprite!: Sprite;

    constructor(
        private app: Application,
        private url: string,
        private background: Background
    ) {}

    async init() {
        await loadWebFont(); // FONT BETÖLTÉSE

        const texture = await Assets.load(this.url);
        this.sprite = new Sprite(texture);

        this.sprite.anchor.set(0.5, 1);
        this.container.addChild(this.sprite);
        this.app.stage.addChild(this.container);

        const uiSheet = new SpriteSheet("/assets/dt_gui.json"); 
        await uiSheet.init(); 

        const playBtn = new UIButton(uiSheet.getTexture("dt_button_enabled"), "PLAY"); 
        playBtn.container.position.set(1140, -this.sprite.height / 2 + 44);
        this.container.addChild(playBtn.container);        

        this.resize();
        this.app.renderer.on("resize", () => this.resize());        
    }

    resize() {
        const screenW = this.app.screen.width;
        const screenH = this.app.screen.height;
        const scale = this.background.scaleValue;
        this.container.scale.set(scale);
        this.container.position.set(screenW / 2, screenH);
    }

}
