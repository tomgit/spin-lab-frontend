import { GameStateManager } from "../engine/GameStateManager";
import { GameState } from "../state/GameState";

//GameController.ts
export class GameController {
  state = new GameStateManager();
  private listeners: ((msg: any) => void)[] = [];
  private reelGame: any;
  private inputLocked = false;

  constructor() {
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.code !== "Space") return;
    if (this.inputLocked) return;

    this.lockInput();

    const state = this.state.state;
    if (state === GameState.Idle) {
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

  reelsStopped() { 
    this.state.setState(GameState.Idle); 
  }

  requestStop() {
    this.reelGame.stopReels();
  }

  requestSpin() {
    if (this.state.state !== GameState.Idle) return;
    this.state.setState(GameState.Spinning);
    const dummy = {
      type: "spinStart",
      reels: [
        ["6", "0", "0"],
        ["6", "2", "2"],
        ["6", "3", "7"],
        ["4", "4", "4"],
        ["5", "5", "7"],
      ],
      win: 120,
      credits: 880,
    };
    this.sendMessage(dummy);
  }
}
