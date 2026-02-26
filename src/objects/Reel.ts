//Reel.ts
import { Container, Sprite, Spritesheet } from "pixi.js";
import { gsap } from "gsap";
import { ReelGame } from "../engine/ReelGame";
import { SoundManager } from "../engine/SoundManager";

export class Reel {
    container = new Container();
    public sprites: Sprite[] = [];
    private virtualPos = 0;
    private speed = 0;
    private spinning = false;
    private stopping = false;
    private stopReel = false;
    private spinCount = 0;
    private stopAt = 0;
    private prepareAt = 0;
    private finalSymbols = [];

    constructor(
        private reelgame: ReelGame,
        private sheet: Spritesheet,
        private strip: string[],
        private visibleCount = 3,
        private spacing = 300,
        public index = 0
    ) {}

    setStopReel() {
        this.spinCount = this.prepareAt - 1;
    }

    init() {
        for (let i = 0; i < this.visibleCount + 1; i++) {
            const s = new Sprite(this.sheet.textures[this.strip[Math.floor(Math.random() * 8)]]);
            //const s = new Sprite(this.sheet.textures[this.strip[6]]);
            s.anchor.set(0.5);
            s.scale.set(0.82);
            s.y = i * this.spacing;
            this.container.addChild(s);
            this.sprites.push(s);
        }
        this.stopAt = 16 + this.index * 4;
        this.prepareAt = this.stopAt - 3;
    }

    startSpin(initialSpeed = 2000, msg: any) {
        const reversed = [...msg].reverse();
        //console.log(reversed);
        this.finalSymbols = msg;
        this.spinCount = 0;
        this.speed = initialSpeed;
        this.spinning = true;
        this.stopping = false;
        this.stopReel = false;
    }

    // STOP 
    stopSpin(finalSymbols: string[]) {
        //this.finalSymbols = finalSymbols;
        this.stopping = true;
    }

    //The Update methods
    update(delta: number) {
        if (!this.spinning) return;
        this.updateScroll(delta);
        this.updateSpritePositions();
        if (this.virtualPos >= this.spacing) {
            this.handleRecycle();
        }
    }

    private updateScroll(delta: number) {
        this.virtualPos += this.speed * delta;
    }

    private updateSpritePositions() {
        for (let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].y = i * this.spacing + this.virtualPos;
        }
    }

    private handleRecycle() {
        this.virtualPos -= this.spacing;
        this.spinCount++;
        this.updateStopLogic();
        const bottom = this.sprites.pop()!;
        this.sprites.unshift(bottom);
        if (this.stopping) {
            this.finishStop();
            return;
        }
        this.assignTexture(bottom);
    }

    private updateStopLogic() {
        if (this.spinCount === this.prepareAt) {
            this.stopReel = true;
        } else if (this.spinCount === this.stopAt) {
            this.stopping = true;
        }
    }

    private assignTexture(bottom: Sprite) {
        let symbolName: string;
        if (this.stopReel) {
            const indexInFinal = this.spinCount - this.prepareAt;
            symbolName = this.strip[this.finalSymbols[indexInFinal]];
        } else {
            const nextIndex = Math.floor(Math.random() * this.strip.length);
            symbolName = this.strip[nextIndex];
        }
        const blurName = symbolName.replace("_base", "_blur");
        bottom.texture = this.stopReel
            ? this.sheet.textures[symbolName]
            : (this.sheet.textures[blurName] ?? this.sheet.textures[symbolName]);
    }

    //FinishStop
    private finishStop() {
        this.spinning = false;
        this.stopping = false;
        // spacing snap — csak MOST, egyszer
        this.virtualPos = 0;
        // sprite-ok pontos helyre
        for (let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].y = i * this.spacing;
        }
        this.finishTween();
    }

    //End tween
    private finishTween() {
        const n = Math.floor(Math.random() * 5) + 1;
        SoundManager.getInstance().play(`reelstop${n}`);
        const baseY = this.container.y;
        gsap.fromTo(
            this.container,
            { y: baseY + 10 },
            {
                y: baseY,
                duration: 0.35,
                ease: "sine.out",
                onComplete: () => { 
                    if (this. index === 4)
                        this.reelgame.onSpinStop();
                }
            }
        );
    }

}
