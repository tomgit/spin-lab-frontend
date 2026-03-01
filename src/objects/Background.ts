//Background.ts
import { Application, Sprite } from "pixi.js";
import { getManifest } from "../state/manifestStore";

export class Background {
  sprite!: Sprite;
  public scaleValue = 1;

  constructor(private app: Application) {}

  async init() {
    const manifest = getManifest();
    this.sprite = Sprite.from(manifest.assets.images.background);
    this.sprite.anchor.set(0.5);
    this.app.stage.addChildAt(this.sprite, 0);
    this.app.renderer.on("resize", this.resize, this);
    this.resize();
  }

  resize() {
    const screenW = this.app.screen.width;
    const screenH = this.app.screen.height;
    const texW = this.sprite.texture.orig.width;
    const texH = this.sprite.texture.orig.height;
    const scaleByHeight = screenH / texH;
    const scaleByWidth = screenW / texW;
    const scale = Math.min(scaleByHeight, scaleByWidth);
    this.scaleValue = scale;
    this.sprite.scale.set(scale);
    this.sprite.position.set(screenW / 2, screenH / 2);
  }

  destroy() {
    this.app.renderer.off("resize", this.resize, this);
    this.sprite.destroy();
  }
  
}
