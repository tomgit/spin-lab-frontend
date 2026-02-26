// ReelGame.ts
import { Application, Sprite, Container, Assets, Graphics } from "pixi.js";
import { Background } from "../objects/Background";
import { getManifest } from "../state/manifestStore";
import { Footer } from "../objects/Footer";
import { GameManifest } from "../types/GameManifest";
import { Reel } from "../objects/Reel";
import { GameController } from "../controller/GameController";
import { GameLoop } from "../core/GameLoop";
import { SymbolAnimator } from "./SymbolAnimator";

export class ReelGame {
    container = new Container();
    reelArea = new Container();

    header!: Sprite;
    reelBG!: Sprite;
    reelFG!: Sprite;

    manifest!: GameManifest;
    private resizeHandler!: () => void;

    reelObjects: Reel[] = [];

    symbolAnimator!: SymbolAnimator;

    constructor(
        private app: Application,
        private background: Background,
        private footer: Footer,
        private controller: GameController,
        private gameloop: GameLoop
    ) {}

    async init() {
        this.controller.onMessage((msg) => this.handleMessage(msg));
        this.app.stage.addChild(this.container);
        this.manifest = getManifest();
        this.createBG();
        this.container.addChild(this.reelArea);
        this.createFG();
        this.createReels();
        this.createSymbolAnimator();
        this.createMask();
        this.createHeader();
        this.resize();
        this.resizeHandler = () => this.resize();
        this.app.renderer.on("resize", this.resizeHandler);
        // PIXI ticker → minden frame-ben frissítjük a tárcsákat
        this.app.ticker.add((ticker) => this.update(ticker.deltaTime));
    }

    createSymbolAnimator() {
        const symbolAnimator = new SymbolAnimator(this.reelObjects);
        this.reelArea.addChild(symbolAnimator.container);
        this.symbolAnimator = symbolAnimator;
    }

    update(delta: number) {
        for (const reel of this.reelObjects) {
            reel.update(delta);
        }
    }

    handleMessage(msg: any) {
        if (msg.type === "spinStart") {
            this.symbolAnimator.stopAll();
            this.startReels(msg);
        }

        if (msg.type === "spinResult") {
            this.stopReels(msg.reels);
            this.updateUI(msg.win, msg.credits);
        }
    }

    startReels(msg: any) {
        //console.log(msg);
        for (let i = 0; i < this.reelObjects.length; i++) {
            const reel = this.reelObjects[i];
            reel.startSpin(26, msg.reels[i].reverse()); 
            //reel.startSpin(8, msg.reels[i]); 
        }
        /*
        setTimeout(() => {
           this.startReels(msg) 
        }, 2800);
        */
    }

    onSpinStop() {
        this.symbolAnimator.playForSymbol(7, 0, 0, true);
        this.symbolAnimator.playForSymbol(7, 1, 0, true);
        this.symbolAnimator.playForSymbol(7, 2, 0, true);        
    }

    stopReel(id: number) {
        const reel = this.reelObjects[id];
        const symbols = ["SYM1", "SYM2", "SYM3"];
        this.reelObjects[id].stopSpin(symbols);
    }

    stopReels(reelSymbols: string[][]) {
        for (let i = 0; i < this.reelObjects.length; i++) {
            const reel = this.reelObjects[i];
            const symbols = reelSymbols[i];
            const delay = 5000 + i * 200;
            reel.stopSpin(symbols);
        }
    }

    updateUI(_win: number, _credits: number) {}

    // HEADER
    createHeader() {
        this.header = Sprite.from(this.manifest.assets.images.header);
        this.header.scale.set(4);
        this.header.anchor.set(0.5);
        this.header.position.set(0, -this.reelBG.height / 2);
        this.container.addChild(this.header);
    }

    // BACKGROUND
    createBG() {
        this.reelBG = Sprite.from(this.manifest.assets.images.reelBG);
        this.reelBG.scale.set(3.5);
        this.reelBG.anchor.set(0.5);
        this.container.addChild(this.reelBG);
    }

    // FOREGROUND
    createFG() {
        this.reelFG = Sprite.from(this.manifest.assets.images.reelFG);
        this.reelFG.scale.set(3.5);
        this.reelFG.anchor.set(0.5);
        this.container.addChild(this.reelFG);
        this.reelFG.visible = false;
    }

    // MASK
    createMask() {
        const mask = new Graphics();
        mask.fill(0xffffff);

        mask.rect(
            this.reelBG.x - this.reelBG.width / 2,
            this.reelBG.y - this.reelBG.height / 2 + 50,
            this.reelBG.width,
            this.reelBG.height - 100
        );

        mask.fill();
        this.container.addChild(mask);
        this.reelArea.mask = mask;
    }

    // REELS
    createReels() {
        const reelCount = 5;
        const visibleSymbols = 3;
        const spacing = 300;
        const atlas = this.manifest.assets.atlases.symbols;
        const sheet = Assets.get(atlas);
        const strip = this.manifest.symbolNames; 
        const reelSpacing = 324;
        const startX = -((reelCount - 1) * reelSpacing) / 2;

        for (let i = 0; i < reelCount; i++) {
            const reel = new Reel(this, sheet, strip, visibleSymbols, spacing, i);
            reel.init();
            reel.container.x = startX + i * reelSpacing;
            reel.container.y = -600;
            this.reelArea.addChild(reel.container);
            this.reelObjects.push(reel);
            this.gameloop.add(reel);
        }
    }

    // RESIZE
    resize() {
        const screenW = this.app.screen.width;
        const screenH = this.app.screen.height;
        const scale = this.background.scaleValue;
        this.container.scale.set(scale);
        const footerHeight = this.footer.sprite.height * this.footer.container.scale.y;
        const bottomLimit = screenH - footerHeight;
        const reelHeight = this.reelBG.height * scale;
        const newY = bottomLimit - reelHeight / 2;
        this.container.position.set(screenW / 2, newY);
        if (screenH > this.background.sprite.height + 80) {
            this.container.position.set(screenW / 2, screenH / 2);
        }
    }

    destroy() {
        this.app.renderer.off("resize", this.resizeHandler);
    }
}
