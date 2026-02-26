import { Container, Sprite, Texture } from "pixi.js";
import { gsap } from "gsap";

export class Winline {
    container = new Container();
    private lines: Sprite[] = [];
    private yPositions: number[] = [420, 220, 620, 380, 450, 340, 480, 504, 325, 260];

    constructor(private textures: Texture[]) {
        this.init();
    }

    private init() {
        for (let i = 0; i < this.textures.length; i++) {
            const sprite = new Sprite(this.textures[i]);
            sprite.visible = false;
            sprite.alpha = 0;
            sprite.anchor.set(0.5);
            sprite.scale.set(0.6);
            sprite.x = 960;   // játék középpontja (ha 1920 széles)
            sprite.y = this.yPositions[i];
            this.container.addChild(sprite);
            this.lines.push(sprite);
        }
        //this.showLine(9);
        //this.showAll();
    }


    showLine(index: number) {
        const line = this.lines[index];
        if (!line) return;

        line.visible = true;
        gsap.to(line, { alpha: 1, duration: 0.3 });
    }

    hideLine(index: number) {
        const line = this.lines[index];
        if (!line) return;

        gsap.to(line, { alpha: 0, duration: 0.3, onComplete: () => {
            line.visible = false;
        }});
    }

    hideAll() {
        for (const line of this.lines) {
            line.visible = false;
            line.alpha = 0;
        }
    }

    showAll() {
        for (const line of this.lines) {
            line.visible = true;
            line.alpha = 1;
        }
    }    
}
