//UIBUtton.ts
import { Sprite, Container, Texture, Text } from "pixi.js";

export class UIButton {
  container = new Container();
  sprite: Sprite;
  label: Text;

  constructor(texture: Texture, text: string) {
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);

    this.label = new Text({
      text,
      style: {
        fontFamily: "Montserrat",
        fontSize: 54,
        fontWeight: "700",
        fill: "#ffffff",
      },
    });
    this.label.anchor.set(0.5);
    this.container.addChild(this.sprite, this.label);
    this.container.interactive = true;
    //this.container.on("pointerdown", () => this.onClick());
  }

  onClick() {
    alert("clicked");
  }
}
