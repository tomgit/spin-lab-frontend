//Footer.ts
import { Application, Sprite, Container, Assets, Graphics } from "pixi.js";
import { Background } from "../objects/Background";
import { getManifest } from "../state/manifestStore";
import { Footer } from "../objects/Footer";
import { GameManifest } from "../types/GameManifest";
import { Reel } from "../objects/Reel";

export class ReelGame {
    container = new Container();
    header!: Sprite;
    reelBG!: Sprite;
    reelFG!: Sprite;
    reels: Container[] = [];
    manifest!: GameManifest;
    private resizeHandler!: () => void;
    reelArea = new Container();    

    constructor(
        private app: Application,
        private background: Background,
        private footer: Footer
    ) {}

    async init() {
        this.app.stage.addChild(this.container);
        this.manifest = getManifest();
        this.createBG();
        this.container.addChild(this.reelArea);
        this.createFG();
        this.createReels();
        this.createMask();
        this.createHeader();
        this.resize();
        this.resizeHandler = () => this.resize(); 
        this.app.renderer.on("resize", this.resizeHandler);   
    }

    //header
    createHeader(){    
        this.header = Sprite.from(this.manifest.assets.images.header);
        this.header.scale.set(4);
        this.header.anchor.set(0.5);
        this.header.position.set(0, -this.reelBG.height / 2);
        this.container.addChild(this.header);
    }

    //reel background
    createBG(){
        this.reelBG = Sprite.from(this.manifest.assets.images.reelBG);
        this.reelBG.scale.set(3.5);
        this.reelBG.anchor.set(0.5, 0.5);
        this.container.addChild(this.reelBG);
    }

    //reel foreground
    createFG(){    
        this.reelFG = Sprite.from(this.manifest.assets.images.reelFG);
        this.reelFG.scale.set(3.5);
        this.reelFG.anchor.set(0.5, 0.5);
        this.container.addChild(this.reelFG);
        this.reelFG.visible = false;
    }

    createMask() {
        const mask = new Graphics();
        mask.beginFill(0xffffff);
        // A reelBG mérete alapján rajzolunk egy téglalapot
        mask.drawRect(
            this.reelBG.x - this.reelBG.width / 2,
            this.reelBG.y - this.reelBG.height / 2,
            this.reelBG.width,
            this.reelBG.height
        );
        mask.endFill();
        this.container.addChild(mask);
        this.reelArea.mask = mask;
    }

    //reel creation
    createReels() {
        const reelCount = 5;
        const symbolsPerReel = 4;
        const symbolNames = this.manifest.symbolNames; 
        const atlas = this.manifest.assets.atlases.symbols;
        const sheet = Assets.get(atlas);
        const reelSpacing = 324;
        const startX = -((reelCount - 1) * reelSpacing) / 2;
        for (let i = 0; i < reelCount; i++) {
            const reel = new Reel(sheet, symbolNames, symbolsPerReel, 300);
            reel.container.x = startX + i * reelSpacing;
            reel.container.y = 26 - reelSpacing;
            reel.createSymbols();
            this.reelArea.addChild(reel.container);
            this.reels.push(reel.container);
        }
    }

    //the resize handler
    resize() {
        const screenW = this.app.screen.width;
        const screenH = this.app.screen.height;
        const scale = this.background.scaleValue;
        this.container.scale.set(scale);
        // Real height of the footer
        const footerHeight = this.footer.sprite.height * this.footer.container.scale.y;
        // ReelGame do not go under the footer
        const bottomLimit = screenH - footerHeight;
        // ReelGame height (scaled)
        const reelHeight = this.reelBG.height * scale;
        // New Y position
        const newY = bottomLimit - reelHeight / 2;
        this.container.position.set(screenW / 2, newY);
        // In this case set Y position to the midde
        if (screenH > this.background.sprite.height + 80 ) {
            this.container.position.set(screenW / 2, screenH / 2);
        }        
    }

    destroy() { 
        this.app.renderer.off("resize", this.resizeHandler);
    }

}
