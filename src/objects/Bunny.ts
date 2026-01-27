import { Application, Assets, Sprite } from "pixi.js";

export class Bunny {

    sprite!: Sprite;

    constructor(private app: Application) {}

    async init() {
        const texture = await Assets.load("/assets/bunny.png");
        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.center();
        this.app.stage.addChild(this.sprite);

        // resize handler
        this.app.renderer.on("resize", () => this.center());
    }

    center() {
        this.sprite.position.set(
            this.app.screen.width / 2,
            this.app.screen.height / 2
        );
    }

    update(delta: number) {
        this.sprite.rotation += 0.1 * delta;
    }
    
}
