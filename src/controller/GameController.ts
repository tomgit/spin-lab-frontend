//GameController.ts
import { GameStateManager } from "../engine/GameStateManager";
import { GameState } from "../state/GameState";
import { WinAnimator } from "../engine/WinAnimator";
import { dummySpins } from "../data/dummySpins";
import { SoundManager } from "../engine/SoundManager";

export class GameController {
  state = new GameStateManager();
  autoplayEnabled = false;
  private listeners: ((msg: any) => void)[] = [];
  private reelGame: any;
  private inputLocked = false;
  private spinMsg: any;
  private winAnimator: WinAnimator | undefined;

  constructor() {
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
  }

  get lastSpin() {
    return this.spinMsg;
  }


  toggleAutoplay() { 
    this.autoplayEnabled = !this.autoplayEnabled; 
  }

  setWinAnimator(winAnimator: WinAnimator) {
    this.winAnimator = winAnimator;
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.code !== "Space") return;
    if (this.inputLocked) return;
    this.lockInput();
    const state = this.state.state;
    if (state === GameState.Idle || state === GameState.Win) {
      this.requestSpin();
    }
    if (state === GameState.Spinning) {
      this.requestStop();
    }
  }  

  private lockInput() {
    this.inputLocked = true;
    setTimeout(() => {
      this.inputLocked = false;
    }, 200); 
  }  

  setReelGame(game: any) { 
    this.reelGame = game; 
  }

  onMessage(cb: (msg: any) => void) {
    this.listeners.push(cb);
  }

  sendMessage(msg: any) {
    for (const cb of this.listeners) {
      cb(msg);
    }
  }

  // When all reels stopped
  reelsStopped() { 
    if (this.spinMsg.winlines.length > 0) {
      this.state.setState(GameState.Win); 
      SoundManager.getInstance().play("winsound");
      SoundManager.getInstance().play("writeup");
      this.winAnimator!.start(this.spinMsg);
    } else {
        this.state.setState(GameState.Idle); 
      }
  }

  animationStopped() {
    this.state.setState(GameState.Idle); 
    console.log('controller animationStopped()');
  }  

  requestStop() {
    this.reelGame.stopReels();
  }

  requestSpin() {
    if (this.state.state !== GameState.Idle && this.state.state !== GameState.Win) return;
    this.state.setState(GameState.Spinning);
    this.spinMsg = dummySpins[Math.floor(Math.random() * dummySpins.length)];
    this.sendMessage(this.spinMsg);
  }
}
