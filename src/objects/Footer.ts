// Footer.ts
import { Application, Assets, Sprite, Container, Texture, Text, TextStyle } from "pixi.js";
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
  private winPanelSprite!: Sprite;
  private winText!: Text;
  private winLabel!: Text;
  private creditsLabel!: Text;
  private creditsValue!: Text;
  private betLabel!: Text;
  private betValue!: Text;
  private stopRequested = false;

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
    this.createWinPanel(uiSheet);
    this.createCredits(uiSheet);
    this.createBet(uiSheet);

    this.setWinPanelVisibility(false);
    this.resize();
    this.app.renderer.on("resize", () => this.resize());

    // AUTOPLAY LOGIKA – külön listenerben
    this.controller.state.onChange((state) => {
      if (this.controller.autoplayEnabled && state === GameState.Idle) {
        this.controller.requestSpin();
      }
    });
  }

  setWinPanelVisibility(b: boolean) {
    this.winText.visible = b;
    this.winPanelSprite.visible = b;
    this.winLabel.visible = b;
  }

  createWinPanel(uiSheet: SpriteSheet) {
    const panelTex = uiSheet.getTexture("winpanel_bg");
    const panel = new Sprite(panelTex);
    this.winPanelSprite = panel;

    panel.anchor.set(0.5, 1);
    panel.y = -160;
    panel.x = 0;
    this.container.addChild(panel);

    const style = new TextStyle({
      fontFamily: "Montserrat",
      fontSize: 78,
      fill: 0xffd700,
      fontWeight: "700",
      stroke: { color: 0x000000, width: 6 },
      align: "center",
    });

    this.winText = new Text({ text: "0", style });
    this.winText.anchor.set(0.5);
    this.winText.x = panel.x;
    this.winText.y = panel.y - panel.height / 2 + 20;
    this.container.addChild(this.winText);

    const labelStyle = new TextStyle({
      fontFamily: "Montserrat",
      fontSize: 50,
      fill: 0xffffff,
      fontWeight: "700",
      stroke: { color: 0x000000, width: 6 },
      align: "center",
    });

    this.winLabel = new Text({ text: "Win:", style: labelStyle });
    this.winLabel.anchor.set(0.5);
    this.winLabel.x = panel.x;
    this.winLabel.y = panel.y - panel.height / 2 - 45;
    this.container.addChild(this.winLabel);
  }

  startWinCounter(targetValue: number) {
    let current = 0;
    const duration = 60;
    let frame = 0;

    const update = () => {
      frame++;
      const t = frame / duration;
      const eased = t < 1 ? t * t * (3 - 2 * t) : 1;
      current = Math.floor(targetValue * eased);
      this.winText.text = String(current);

      if (t >= 1) {
        this.app.ticker.remove(update);
        this.winText.text = String(targetValue);
      }
    };

    this.app.ticker.add(update);
  }

  createCredits(uiSheet: SpriteSheet) {
    const labelStyle = new TextStyle({
      fontFamily: "Montserrat",
      fontSize: 42,
      fill: 0xffd700,
      fontWeight: "700",
      stroke: { color: 0x000000, width: 5 },
    });

    const valueStyle = new TextStyle({
      fontFamily: "Montserrat",
      fontSize: 52,
      fill: 0xffffff,
      fontWeight: "700",
      stroke: { color: 0x000000, width: 6 },
    });

    this.creditsLabel = new Text({ text: "CREDITS:", style: labelStyle });
    this.creditsLabel.anchor.set(0.5);
    this.creditsLabel.x = -1150;
    this.creditsLabel.y = -270;

    this.creditsValue = new Text({ text: "10000", style: valueStyle });
    this.creditsValue.anchor.set(0, 0.5);
    this.creditsValue.x = -1030;
    this.creditsValue.y = -270;

    this.container.addChild(this.creditsLabel, this.creditsValue);

    // Credits frissítése state alapján
    this.controller.state.onChange((state) => {
      if (state === GameState.Spinning) {
        const current = Number(this.creditsValue.text) || 0;
        this.creditsValue.text = String(current - 100);
        this.setWinPanelVisibility(false);
      }

      if (state === GameState.Win) {
        const win = this.controller.lastSpin?.win ?? 0;
        const current = Number(this.creditsValue.text) || 0;
        this.creditsValue.text = String(current + win);
        this.startWinCounter(win);
        this.setWinPanelVisibility(true);
      }
    });
  }

  createBet(uiSheet: SpriteSheet) {
    const labelStyle = new TextStyle({
      fontFamily: "Montserrat",
      fontSize: 42,
      fill: 0xffd700,
      fontWeight: "700",
      stroke: { color: 0x000000, width: 5 },
    });

    const valueStyle = new TextStyle({
      fontFamily: "Montserrat",
      fontSize: 52,
      fill: 0xffffff,
      fontWeight: "700",
      stroke: { color: 0x000000, width: 6 },
    });

    this.betLabel = new Text({ text: "BET:", style: labelStyle });
    this.betLabel.anchor.set(0.5);
    this.betLabel.x = 1070;
    this.betLabel.y = -270;

    this.betValue = new Text({ text: "100", style: valueStyle });
    this.betValue.anchor.set(0, 0.5);
    this.betValue.x = 1130;
    this.betValue.y = -270;

    this.container.addChild(this.betLabel, this.betValue);
  }

  createAutoplayButton(uiSheet: SpriteSheet) {
    const autoplayBtn = new UIButton(
      {
        enabled: uiSheet.getTexture("dt_button_enabled"),
        disabled: uiSheet.getTexture("dt_button_pressed"),
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
      autoplayBtn.enabled = !this.controller.autoplayEnabled;
    });
  }

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

    // SPIN BUTTON STATE LISTENER (tiszta)
    this.controller.state.onChange((state) => {
      if (state === GameState.Idle || state === GameState.Win) {
        spinBtn.mode = "start";
        spinBtn.enabled = true;
        this.stopRequested = false;

        if (!this.stopBlink) {
          this.stopBlink = this.startTextureBlink(spinBtn.sprite, texEnabled, texHover);
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

      if (state === GameState.Blocked) {
        spinBtn.enabled = false;

        if (this.stopBlink) {
          this.stopBlink();
          this.stopBlink = null;
        }
      }
    });

    // induláskor villogjon
    if (this.controller.state.state === GameState.Idle) {
      this.stopBlink = this.startTextureBlink(spinBtn.sprite, texEnabled, texHover);
    }

    // POINTERDOWN LOGIKA
    spinBtn.container.on("pointerdown", () => {
      const state = this.controller.state.state;

      if (state === GameState.Idle || state === GameState.Win) {
        this.controller.requestSpin();
      }

      if (state === GameState.Spinning) {
        if (!this.stopRequested) {
          this.stopRequested = true;
          this.controller.requestStop();
        }
      }
    });
  }

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

  resize() {
    const screenW = this.app.screen.width;
    const screenH = this.app.screen.height;
    const scale = this.background.scaleValue;

    this.container.scale.set(scale);
    this.container.position.set(screenW / 2, screenH);
  }
}
