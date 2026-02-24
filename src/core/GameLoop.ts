//GameLoop.ts
import { Application } from "pixi.js";

export class GameLoop {

  private updatables: Array<{ update: (delta: number) => void }> = [];

  constructor(private app: Application) {
    this.app.ticker.maxFPS = 60;
    this.app.ticker.add((ticker) => {
      this.update(ticker.deltaTime);
    });
  }

  add(obj: { update: (delta: number) => void }) {
    this.updatables.push(obj);
  }

  update(delta: number) {
    for (const obj of this.updatables) {
      obj.update(delta);
    }
  }

}
