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
  private spaceDown = false;
  private spinMsg: any;
  private winAnimator: WinAnimator | undefined;

  constructor() {
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
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
    // ha már le van nyomva, ne csináljunk semmit
    if (this.spaceDown) return;
    this.spaceDown = true;
    const state = this.state.state;
    if (state === GameState.Spinning) {
      this.requestStop();
      return;
    }
    if (state === GameState.Idle || state === GameState.Win) {
      this.requestSpin();
    }
  }

  onKeyUp(e: KeyboardEvent) {
    if (e.code === "Space") {
      this.spaceDown = false;
    }
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
    if (this.state.state !== GameState.Spinning) return;
    this.state.setState(GameState.Blocked);
    this.reelGame.stopReels();
  }

  requestSpin() {
    if (this.state.state !== GameState.Idle && this.state.state !== GameState.Win) return;
    this.state.setState(GameState.Spinning);
    this.spinMsg = dummySpins[Math.floor(Math.random() * dummySpins.length)];
    this.sendMessage(this.spinMsg);
  }
}
