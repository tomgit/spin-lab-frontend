import type { Application } from "pixi.js";

export class GameLoop {
    constructor(private app: Application) {
        this.app.ticker.minFPS = 60; 
        this.app.ticker.maxFPS = 60;
    }

    add(fn: (delta: number) => void) {
        this.app.ticker.add((time) => fn(time.deltaTime));
    }
}
