// Preloader.ts
import { Container, Sprite, Graphics, Text, Assets, Application } from "pixi.js";

export class Preloader {
    container = new Container();
    bg!: Sprite;
    barBg!: Graphics;
    barFill!: Graphics;
    label!: Text;

    constructor(private app: Application) {}

    async init() {
        // háttér betöltése
        this.container.zIndex = 9999;
        const tex = await Assets.load("/assets/preloader_bg.png");
        this.bg = new Sprite(tex);
        this.bg.anchor.set(0.5);
        this.bg.position.set(this.app.screen.width / 2, this.app.screen.height / 2);

        // progress bar töltés
        this.barFill = new Graphics()
            .roundRect(0, 0, 1, 20, 10)
            .fill(0x00ff66);

        // felirat
        this.label = new Text({
            text: "0%",
            style: {
                fontFamily: "Montserrat",
                fontSize: 32,
                fill: "#ffffff"
            }
        });
        this.label.anchor.set(0.5);

        // pozicionálás
        const barX = this.app.screen.width / 2 - 755;
        const barY = this.app.screen.height / 2 - 75;

        this.barFill.position.set(barX, barY);
        this.label.position.set(this.app.screen.width / 2, barY + 160);

        // containerbe rakjuk
        this.container.addChild(this.bg, this.barFill, this.label);

        // overlay a stage-re
        this.app.stage.addChild(this.container);
    }

    updateProgress(p: number) {
        this.barFill.width = 1491 * p;
        this.label.text = `${Math.round(p * 100)}%`;
    }

    hide() {
        this.container.destroy({ children: true });
    }
}
