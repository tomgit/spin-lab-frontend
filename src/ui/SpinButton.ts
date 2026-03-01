// SpinButton.ts
import { UIButton } from "./UIButton";
import { Texture } from "pixi.js";

export class SpinButton extends UIButton {
  private _mode: "start" | "stop" = "start";

  constructor(
    textures: {
      enabled: Texture;
      disabled: Texture;
      hover: Texture;
      pressed: Texture;
    }
  ) {
    super(textures, "START"); 
  }

  set mode(value: "start" | "stop") {
    this._mode = value;
    this.label.text = value === "start" ? "START" : "STOP";
  }

  get mode() {
    return this._mode;
  }
  
}
