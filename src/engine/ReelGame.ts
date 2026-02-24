//Footer.ts
import { Application, Sprite, Container } from "pixi.js";
import { Background } from "../objects/Background";
import FontFaceObserver from "fontfaceobserver";
import { getManifest } from "../state/manifestStore";
import { Footer } from "../objects/Footer";

export async function loadWebFont() { 
    const font = new FontFaceObserver("Montserrat"); 
    await font.load(); 
    console.log("Font loaded!"); 
}

export class ReelGame {
    container = new Container();
    header!: Sprite;
    reelBG!: Sprite;
    reelFG!: Sprite;

    constructor(
        private app: Application,
        private background: Background,
        private footer: Footer
    ) {}

    async init() {
        const manifest = getManifest();

        //reelBG
        this.reelBG = Sprite.from(manifest.assets.images.reelBG);
        this.reelBG.scale.set(3.5);
        this.reelBG.anchor.set(0.5, 0.5);
        this.container.addChild(this.reelBG);
        this.app.stage.addChild(this.container);

        //reelFG
        this.reelFG = Sprite.from(manifest.assets.images.reelFG);
        this.reelFG.scale.set(3.5);
        this.reelFG.anchor.set(0.5, 0.5);
        this.container.addChild(this.reelFG);
        this.app.stage.addChild(this.container);

        //header
        this.header = Sprite.from(manifest.assets.images.header);
        this.header.scale.set(4);
        this.header.anchor.set(0.5);
        this.header.position.set(0, -this.reelBG.height / 2);
        this.container.addChild(this.header);

        this.resize();
        this.app.renderer.on("resize", () => this.resize());        
    }

    resize() {
        const screenW = this.app.screen.width;
        const screenH = this.app.screen.height;
        const scale = this.background.scaleValue;
        this.container.scale.set(scale);
        // Real height of the footer
        const footerHeight = this.footer.sprite.height * this.footer.container.scale.y;
        // ReelGame do not go under the footer
        const bottomLimit = screenH - footerHeight;
        // ReelGame height (scaled)
        const reelHeight = this.reelBG.height * scale;
        // New Y position
        const newY = bottomLimit - reelHeight / 2;
        this.container.position.set(screenW / 2, newY);
        // In this case set Y position to the midde
        if (screenH > this.background.sprite.height + 80 ) {
            this.container.position.set(screenW / 2, screenH / 2);
        }        
    }

}
