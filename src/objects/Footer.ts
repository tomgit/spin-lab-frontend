// Footer.ts
import { Application, Assets, Sprite, Container, Texture } from "pixi.js";
import { Background } from "./Background";
import { SpriteSheet } from "./SpriteSheet";
import FontFaceObserver from "fontfaceobserver";
import { UIButton } from "../ui/UIButton";
import { SpinButton } from "../ui/SpinButton";
import { GameController } from "../controller/GameController";
import { GameState } from "../state/GameState";
import { SoundManager } from "../engine/SoundManager";

export async function loadWebFont() {
  const font = new FontFaceObserver("Montserrat");
  await font.load();
}

export class Footer {
  container = new Container();
  sprite!: Sprite;
  private stopBlink: (() => void) | null = null;
  private autoplayEnabled = false;
  private autoplaySprite!: Sprite;

  constructor(
    private app: Application,
    private url: string,
    private background: Background,
    private controller: GameController,
  ) {}

  async init() {
    await loadWebFont();
    const texture = await Assets.load(this.url);
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5, 1);
    this.container.addChild(this.sprite);
    this.app.stage.addChild(this.container);
    const uiSheet = new SpriteSheet("/assets/dt_gui.json");
    await uiSheet.init();
    this.createAutoplayButton(uiSheet);
    this.createSpinButton(uiSheet);
    this.resize();
    this.app.renderer.on("resize", () => this.resize());
  }

  // -------------------------------------------------------
  // AUTOPLAY BUTTON
  // -------------------------------------------------------
  createAutoplayButton(uiSheet: SpriteSheet) {
    const autoplayBtn = new UIButton(
      {
        enabled: uiSheet.getTexture("dt_button_enabled"),
        disabled: uiSheet.getTexture("dt_button_disabled"),
        hover: uiSheet.getTexture("dt_button_hover"),
        pressed: uiSheet.getTexture("dt_button_pressed"),
      },
      "Autoplay"
    );

    autoplayBtn.container.position.set(-1135, -this.sprite.height / 2 + 44);
    this.container.addChild(autoplayBtn.container);

    autoplayBtn.container.on("pointerdown", () => {
        SoundManager.getInstance().play("reel_start");
        this.controller.toggleAutoplay();
        autoplayBtn.enabled = this.controller.autoplayEnabled;
    });

    autoplayBtn.enabled = false;
    this.autoplayEnabled = false;
    this.controller.state.onChange((state) => {
        if (this.controller.autoplayEnabled && state === GameState.Idle) {
            this.controller.requestSpin();
        }
    });
  }

  // -------------------------------------------------------
  // SPIN BUTTON
  // -------------------------------------------------------
  createSpinButton(uiSheet: SpriteSheet) {
    const spinBtn = new SpinButton({
      enabled: uiSheet.getTexture("dt_button_enabled2"),
      disabled: uiSheet.getTexture("dt_button_disabled2"),
      hover: uiSheet.getTexture("dt_button_hover2"),
      pressed: uiSheet.getTexture("dt_button_pressed2"),
    });

    spinBtn.container.position.set(1140, -this.sprite.height / 2 + 44);
    this.container.addChild(spinBtn.container);

    const texEnabled = uiSheet.getTexture("dt_button_enabled2");
    const texHover = uiSheet.getTexture("dt_button_hover2");

    this.controller.state.onChange((state) => {
      if (state === GameState.Idle || state === GameState.Win) {
        spinBtn.mode = "start";
        spinBtn.enabled = true;

        if (!this.stopBlink) {
          this.stopBlink = this.startTextureBlink(
            spinBtn.sprite,
            texEnabled,
            texHover
          );
        }
      }

      if (state === GameState.Spinning) {
        spinBtn.mode = "stop";
        spinBtn.enabled = true;
        if (this.stopBlink) {
          this.stopBlink();
          this.stopBlink = null;
        }
      }

      if (/*state === GameState.Win || */state === GameState.Blocked) {
        spinBtn.enabled = false;
        if (this.stopBlink) {
          this.stopBlink();
          this.stopBlink = null;
        }
      }
    });

    // induláskor is villogjon, ha Idle
    if (this.controller.state.state === GameState.Idle) {
      this.stopBlink = this.startTextureBlink(
        spinBtn.sprite,
        texEnabled,
        texHover
      );
    }

    spinBtn.container.on("pointerdown", () => {
      const state = this.controller.state.state;
      if (state === GameState.Idle || state === GameState.Win) {
        this.controller.requestSpin();
      }
      if (state === GameState.Spinning) {
        this.controller.requestStop();
      }
    });
  }

  // -------------------------------------------------------
  // TEXTURE BLINK EFFECT
  // -------------------------------------------------------
  startTextureBlink(sprite: Sprite, texA: Texture, texB: Texture) {
    let t = 0;
    let active = true;
    const fn = () => {
      t += 0.15;
      sprite.texture = Math.sin(t) > 0 ? texA : texB;
    };
    this.app.ticker.add(fn);
    return () => {
      if (!active) return;
      active = false;
      this.app.ticker.remove(fn);
      sprite.texture = texA;
    };
  }

  // -------------------------------------------------------
  // RESIZE
  // -------------------------------------------------------
  resize() {
    const screenW = this.app.screen.width;
    const screenH = this.app.screen.height;
    const scale = this.background.scaleValue;
    this.container.scale.set(scale);
    this.container.position.set(screenW / 2, screenH);
  }

}
