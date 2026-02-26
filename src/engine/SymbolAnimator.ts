import { Assets, AnimatedSprite, Container, Texture } from "pixi.js";
import { Reel } from "../objects/Reel";

export class SymbolAnimator {
    container = new Container();

    private animationFrames: Record<number, Texture[]> = {};
    private reels: Reel[];
    private runningAnimations: AnimatedSprite[] = [];

    constructor(reels: Reel[]) {
        this.reels = reels;
        this.loadAnimations();
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

    /** Egy szimbólum animációjának indítása (egyszeri vagy végtelenített) */
    playForSymbol(symbolId: number, reelIndex: number, rowIndex: number, loop: boolean = false) {
        const reel = this.reels[reelIndex];
        const symbol = reel.sprites[rowIndex];
        if (!symbol) return;

        const globalPos = symbol.getGlobalPosition();
        const localPos = this.container.parent!.toLocal(globalPos);

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
        anim.animationSpeed = 0.3;
        anim.loop = loop;

        anim.x = x - 303;
        anim.y = y + 13;

        this.container.addChild(anim);
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
        this.container.removeChild(anim);
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
            this.container.removeChild(anim);
            anim.destroy();
        }
        this.runningAnimations = [];
    }
}
