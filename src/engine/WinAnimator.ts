//WinAnimator.ts
import { Application } from "pixi.js";
import { GameController } from "../controller/GameController";
import { SymbolAnimator } from "./SymbolAnimator";
import { GameState } from "../state/GameState";

export class WinAnimator {
    lineIndex = 0;
    private currentMsg: any;

    paylineDefinitions = [ 
        [1,1,1,1,1], 
        [0,0,0,0,0], 
        [2,2,2,2,2],    
        [0,1,2,1,0], 
        [2,1,0,1,2],  
        [1,2,2,2,1],  
        [1,0,0,0,1],  
        [2,2,1,0,0],  
        [0,0,1,2,2],  
        [2,1,1,1,0],  
    ];    

    frameNames = [
        "frame_00.png",
        "frame_01.png",
        "frame_02.png",
        "frame_03.png",
        "frame_04.png",
        "frame_05.png",
        "frame_06.png",
        "frame_07.png",
        "frame_08.png",
        "frame_09.png",
    ];

    constructor(
        private app: Application,
        private controller: GameController, 
        private symbolAnimator: SymbolAnimator
    ) {}

    start(msg: any) {
        // winSymbols normalizálása
        if (Array.isArray(msg.winSymbols) && !Array.isArray(msg.winSymbols[0])) {
            msg.winSymbols = [msg.winSymbols];
        }
        this.currentMsg = msg;
        this.lineIndex = 0;
        this.playCurrentLine();
    }

    private playCurrentLine() {
        const lines = this.currentMsg.winlines;      // [2,3,9]
        const symbols = this.currentMsg.winSymbols;  // [[...],[...],[...]]
        const paylineIndex = lines[this.lineIndex];  // pl. 9
        const lineSymbols = symbols[this.lineIndex]; // pl. [5,5,5]
        if (!lineSymbols) {
            console.warn("Missing winSymbols for lineIndex", this.lineIndex);
            this.onLineAnimationCompleted();
            return;
        }
        const frameName = this.frameNames[this.lineIndex % this.frameNames.length];
        let remaining = lineSymbols.length;
        for (let i = 0; i < lineSymbols.length; i++) {
            const symbolId = lineSymbols[i] + 1;
            const reelIndex = i;
            const rowIndex = this.paylineDefinitions[paylineIndex - 1][i];
            this.symbolAnimator.playForSymbol(
                symbolId,
                reelIndex,
                rowIndex,
                frameName,
                () => {
                    remaining--;
                    if (remaining === 0) {
                        this.onLineAnimationCompleted();
                    }
                }
            );
        }
    }

    private onLineAnimationCompleted() {
        const autoplay = this.controller.autoplayEnabled;
        const lines = this.currentMsg.winlines;
        this.lineIndex++;
        if (autoplay) {
            // autoplay: minden winline egyszer → Idle
            if (this.lineIndex >= lines.length) {
                this.controller.state.setState(GameState.Idle);
                return;
            }
            this.playCurrentLine();
            return;
        }
        // manuális mód: végtelen loop
        if (this.lineIndex >= lines.length) {
            this.lineIndex = 0;
        }
        this.playCurrentLine();
    }
}

