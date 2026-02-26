import { Assets, AnimatedSprite, Container, Texture, Sprite } from "pixi.js";
import { Reel } from "../objects/Reel";
import { gsap } from "gsap";


export class SymbolAnimator {
    container = new Container();
    private animContainer = new Container(); 
    private frameContainer = new Container();
    private animationFrames: Record<number, Texture[]> = {};
    private reels: Reel[];
    private runningAnimations: AnimatedSprite[] = [];
    private winFrameTextures: Record<string, Texture> = {};
    private winFrames: Record<string, Texture> = {};
    private activeWinFrames: Sprite[] = [];


    constructor(reels: Reel[]) {
        this.reels = reels;
        this.container.addChild(this.animContainer); 
        this.container.addChild(this.frameContainer);        
        this.loadAnimations();
        this.loadWinFrames();
    }

    private loadAnimations() {
        for (let i = 1; i <= 8; i++) {
            const sheet = Assets.get(`symbolanim_${i}`);
            if (!sheet) continue;
            const frameNames = Object.keys(sheet.textures).sort();
            const frames = frameNames.map(name => sheet.textures[name]);
            this.animationFrames[i] = frames;
        }
    }

    createWinFrameForSymbol(reelIndex: number, rowIndex: number, frameName: string = "frame_00.png") {
        const reel = this.reels[reelIndex];
        const symbol = reel.sprites[rowIndex];
        if (!symbol) return;
        const globalPos = symbol.getGlobalPosition();
        const localPos = this.container.parent!.toLocal(globalPos);
        const texture = this.winFrames[frameName];
        if (!texture) return;
        const frame = new Sprite(texture);
        frame.anchor.set(0);
        frame.scale.set(.85);
        frame.x = localPos.x + symbol.width / 2 - 308;
        frame.y = localPos.y + symbol.height / 2 + 7;
        this.frameContainer.addChild(frame);
        this.activeWinFrames.push(frame);
        return frame;
    }

    removeAllWinFrames() {
        for (const frame of this.activeWinFrames) {
            gsap.to(frame, {
                alpha: 0,
                duration: 0.05,
                onComplete: () => {
                    this.frameContainer.removeChild(frame);
                    frame.destroy();
                }
            });
        }
        this.activeWinFrames = [];
    }

    removeWinFrame(frame: Sprite) {
        gsap.to(frame, {
            alpha: 0,
            duration: 0.25,
            onComplete: () => {
                this.frameContainer.removeChild(frame);
                frame.destroy();

                const i = this.activeWinFrames.indexOf(frame);
                if (i !== -1) this.activeWinFrames.splice(i, 1);
            }
        });
    }

    private loadWinFrames() {
        const sheet = Assets.get("frames");
        if (!sheet) return;
        for (const key in sheet.textures) {
            this.winFrames[key] = sheet.textures[key];
        }
    }

    /** Egy szimbólum animációjának indítása (egyszeri vagy végtelenített) */
    playForSymbol(symbolId: number, reelIndex: number, rowIndex: number, loop: boolean = false) {
        const reel = this.reels[reelIndex];
        const symbol = reel.sprites[rowIndex];
        if (!symbol) return;

        const globalPos = symbol.getGlobalPosition();
        const localPos = this.container.parent!.toLocal(globalPos);

        this.createWinFrameForSymbol(0, 0, "frame_03.png");
        this.createWinFrameForSymbol(1, 0, "frame_03.png");
        this.createWinFrameForSymbol(2, 0, "frame_03.png");
        this.createWinFrameForSymbol(2, 2, "frame_03.png");

        return this.play(
            symbolId,
            localPos.x + symbol.width / 2,
            localPos.y + symbol.height / 2,
            loop
        );
    }

    /** Új AnimatedSprite példány létrehozása és elindítása */
    play(symbolId: number, x: number, y: number, loop: boolean = false) {
        const frames = this.animationFrames[symbolId];
        if (!frames) return;

        const anim = new AnimatedSprite(frames);
        anim.anchor.set(0);
        anim.scale.set(0.82);
        anim.animationSpeed = 0.6;
        anim.loop = loop;

        anim.x = x - 303;
        anim.y = y + 13;

        this.animContainer.addChild(anim);
        this.runningAnimations.push(anim);

        anim.gotoAndPlay(0);

        if (!loop) {
            anim.onComplete = () => {
                this.stopAnimation(anim);
            };
        }

        return anim;
    }

    /** Egy animáció leállítása és törlése */
    private stopAnimation(anim: AnimatedSprite) {
        anim.stop();
        this.animContainer.removeChild(anim);
        anim.destroy();

        const index = this.runningAnimations.indexOf(anim);
        if (index !== -1) {
            this.runningAnimations.splice(index, 1);
        }
    }

    /** Minden futó animáció leállítása */
    stopAll() {
        for (const anim of this.runningAnimations) {
            anim.stop();
            this.animContainer.removeChild(anim);
            anim.destroy();
        }
        this.runningAnimations = [];
    }
}
