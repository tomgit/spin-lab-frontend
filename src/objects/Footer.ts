import { Application, Assets, Sprite, Container } from "pixi.js";
import { Background } from "./Background";
import { SpriteSheet } from "./SpriteSheet";
import { Text } from "pixi.js";
import FontFaceObserver from "fontfaceobserver";

export async function loadWebFont() { 
    const font = new FontFaceObserver("Montserrat"); 
    await font.load(); 
    console.log("Font loaded!"); 
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

        // a sprite a container gyereke
        this.container.addChild(this.sprite);

        // container mehet a stage-re
        this.app.stage.addChild(this.container);

        const uiSheet = new SpriteSheet("/assets/dt_gui.json"); 
        await uiSheet.init(); 
        const playBtn = uiSheet.create("dt_button_enabled"); 
        playBtn.anchor.set(.5, 0.5); 
        playBtn.position.set(1140, -this.sprite.height / 2 + 44);
        this.addButton(playBtn);

        // SZÖVEG A GOMBON
        const label = new Text({
        text: "PLAY",
        style: {
            fontFamily: "Montserrat",
            fontSize: 54,
            fill: 0xffffff,
            align: "center",
            fontWeight: "700", // vagy "bold"
        }
        });

        label.anchor.set(0.5);
        label.position.set(playBtn.x, playBtn.y);
        this.container.addChild(label);

        this.resize();
        this.app.renderer.on("resize", () => this.resize());        
    }

    resize() {
        const screenW = this.app.screen.width;
        const screenH = this.app.screen.height;
        const scale = this.background.scaleValue;
        // a container skálázása
        this.container.scale.set(scale);
        // a container pozicionálása
        this.container.position.set(screenW / 2, screenH);
    }

    addButton(btn: Sprite) {
        // a gombot a containerbe tesszük
        this.container.addChild(btn);
    }
}
