// Preloader.ts
import { Container, Sprite, Graphics, Text, Assets, Application } from "pixi.js";

export class Preloader {
    container = new Container();
    bg!: Sprite;
    barBg!: Graphics;
    barFill!: Graphics;
    label!: Text;

    private resizeHandler!: () => void;

    constructor(private app: Application) {}

    async init() {
        this.container.zIndex = 9999;

        // background
        const tex = await Assets.load("/assets/preloader_bg.png");
        this.bg = new Sprite(tex);
        this.bg.anchor.set(0.5);

        // progress bar
        this.barFill = new Graphics()
            .roundRect(0, 0, 1, 20, 10)
            .fill(0x00ff66);

        // label
        this.label = new Text({
            text: "0%",
            style: {
                fontFamily: "Montserrat",
                fontSize: 32,
                fill: "#ffffff"
            }
        });
        this.label.anchor.set(0.5);

        this.container.addChild(this.bg, this.barFill, this.label);
        this.app.stage.addChild(this.container);

        this.resize();
        this.resizeHandler = () => this.resize(); 
        this.app.renderer.on("resize", this.resizeHandler);        
    }

    resize() {
        const screenW = this.app.screen.width;
        const screenH = this.app.screen.height;

        // preloader háttér eredeti mérete
        const texW = this.bg.texture.orig.width;
        const texH = this.bg.texture.orig.height;

        // skála kiszámítása (hogy beleférjen a képernyőbe)
        const scaleByWidth = screenW / texW;
        const scaleByHeight = screenH / texH;
        const scale = Math.min(scaleByWidth, scaleByHeight);

        // container scale
        this.container.scale.set(scale);

        // container to the middle
        this.container.position.set(screenW / 2, screenH / 2);

        // progress bar position
        const barY = texH * 0.15 - 290;  
        this.barFill.position.set(-texW * 0.5 + 526, barY);
        this.label.position.set(0, barY + 160);
    }

    updateProgress(p: number) {
        this.barFill.width = 1491 * p;
        this.label.text = `${Math.round(p * 100)}%`;
    }

    hide() {
        this.app.renderer.off("resize", this.resizeHandler);
        this.container.destroy({ children: true });
    }
}
