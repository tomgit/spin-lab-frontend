// UIButton.ts
import { Sprite, Container, Texture, Text } from "pixi.js";

export class UIButton {
  container = new Container();
  sprite: Sprite;
  label: Text;

  private textures: {
    enabled: Texture;
    disabled: Texture;
    hover: Texture;
    pressed: Texture;
  };

  private _enabled = true;

  constructor(
    textures: {
      enabled: Texture;
      disabled: Texture;
      hover: Texture;
      pressed: Texture;
    },
    text: string
  ) {
    this.textures = textures;
    this.sprite = new Sprite(textures.enabled);
    this.sprite.anchor.set(0.5);
    this.label = new Text({
      text,
      style: {
        fontFamily: "Montserrat",
        fontSize: 48,
        fontWeight: "700",
        fill: "#ffffff",
      },
    });
    this.label.anchor.set(0.5);
    this.container.addChild(this.sprite, this.label);
    this.container.eventMode = "static";
    this.container.cursor = "pointer";
    this.registerEvents();
  }

  private registerEvents() {

    this.container.on("pointerover", () => {
      if (!this._enabled) return;
      this.sprite.texture = this.textures.hover;
    });

    this.container.on("pointerout", () => {
      if (!this._enabled) return;
      this.sprite.texture = this.textures.enabled;
    });

    this.container.on("pointerdown", () => {
      if (!this._enabled) return;
      this.sprite.texture = this.textures.pressed;
    });

    this.container.on("pointerup", () => {
      if (!this._enabled) return;
      this.sprite.texture = this.textures.hover;
    });
  
  }

  set enabled(v: boolean) {
    this._enabled = v;
    this.sprite.texture = v ? this.textures.enabled : this.textures.disabled;
    this.container.cursor = v ? "pointer" : "default";
  }

  get enabled() {
    return this._enabled;
  }
  
}
