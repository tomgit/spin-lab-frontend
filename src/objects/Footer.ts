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
  private autoplaySprite!: Sprite;
  private winPanelSprite!: Sprite;
  private winPanelText!: Text;
  private winText!: Text;
  private winLabel!: Text;
  private creditsLabel!: Text;
  private creditsValue!: Text;
  private betLabel!: Text;
  private betValue!: Text;

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
    //this.createCoinPanel(uiSheet);
    //this.createBetPanel(uiSheet);
    this.createWinPanel(uiSheet);
    this.createCredits(uiSheet);
    this.createBet(uiSheet);
    this.setWinPanelVisibility(false);
    this.resize();
    this.app.renderer.on("resize", () => this.resize());
  }

  createCoinPanel(uiSheet: SpriteSheet) {
    const coinTex = uiSheet.getTexture("dt_gui_betpanel");
    const coinPanel = new Sprite(coinTex);
    coinPanel.anchor.set(0.5, 1); 
    coinPanel.y = -160; 
    coinPanel.x = 750;   
    this.container.addChild(coinPanel);
  }

  createBetPanel(uiSheet: SpriteSheet) {
    const coinTex = uiSheet.getTexture("dt_gui_coinpanel");
    const coinPanel = new Sprite(coinTex);
    coinPanel.anchor.set(0.5, 1); 
    coinPanel.y = -160; 
    coinPanel.x = -560;   
    this.container.addChild(coinPanel);
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

    // --- WIN TEXT ---
    const style = new TextStyle({
      fontFamily: "Montserrat",
      fontSize: 78,
      fill: 0xffd700,
      fontWeight: "700",
      stroke: { color: 0x000000, width: 6 },
      align: "center",
    });

    this.winText = new Text({
      text: "0",
      style,
    });
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

    this.winLabel = new Text({
      text: "Win:",
      style: labelStyle,
    });

    this.winLabel.anchor.set(0.5);
    this.winLabel.x = panel.x;
    this.winLabel.y = panel.y - panel.height / 2 - 45;
    this.container.addChild(this.winLabel);
  }

  startWinCounter(targetValue: number) {
    let current = 0;
    const duration = 60; // kb. 1 másodperc (60 frame)
    let frame = 0;
    const update = () => {
      frame++;
      const t = frame / duration;
      const eased = t < 1 ? t * t * (3 - 2 * t) : 1; // smoothstep easing
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

    // LABEL
    this.creditsLabel = new Text({
      text: "CREDITS:",
      style: labelStyle,
    });
    this.creditsLabel.anchor.set(0.5);
    this.creditsLabel.x = -1150;
    this.creditsLabel.y = -270;

    // VALUE
    this.creditsValue = new Text({
      text: "10000",
      style: valueStyle,
    });
    this.creditsValue.anchor.set(0, 0.5);
    this.creditsValue.x = -1030;
    this.creditsValue.y = -270;
    this.container.addChild(this.creditsLabel, this.creditsValue);
  }

  startCreditsCounter(from: number, to: number) {
    let frame = 0;
    const duration = 60; // kb. 1 másodperc
    const update = () => {
      frame++;
      const t = frame / duration;
      const eased = t < 1 ? t * t * (3 - 2 * t) : 1; // smoothstep
      const value = Math.floor(from + (to - from) * eased);
      this.creditsValue.text = String(value);
      if (t >= 1) {
        this.app.ticker.remove(update);
        this.creditsValue.text = String(to);
      }
    };
    this.app.ticker.add(update);
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

    // LABEL
    this.betLabel = new Text({
      text: "BET:",
      style: labelStyle,
    });
    this.betLabel.anchor.set(0.5);
    this.betLabel.x = 1070;
    this.betLabel.y = -270;

    // VALUE
    this.betValue = new Text({
      text: "100",
      style: valueStyle,
    });
    this.betValue.anchor.set(0, 0.5);
    this.betValue.x = 1130;
    this.betValue.y = -270;

    this.container.addChild(this.betLabel, this.betValue);
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
        if (state === GameState.Idle || state === GameState.Spinning) {
          this.setWinPanelVisibility(false)
          if (state === GameState.Spinning) {
            const currentCredits = Number(this.creditsValue.text) || 0; 
            const newCredits = currentCredits - 100; // tét levonása this.startCreditsDecrease(currentCredits, newCredits);
            this.creditsValue.text = newCredits;
          }
        } else 
        if (state === GameState.Win) {
          this.setWinPanelVisibility(true)
          const win = this.controller.lastSpin?.win ?? 0; 
          this.startWinCounter(win);
          // credits animáció (jelenlegi érték → jelenlegi + win) 
          const currentCredits = Number(this.creditsValue.text) || 0; 
          const newCredits = currentCredits + win; 
          this.creditsValue.text = newCredits;
          //this.startCreditsCounter(currentCredits, newCredits);
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
