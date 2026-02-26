// GameStateManager.ts
import { GameState } from "../state/GameState";

type Listener = (state: GameState) => void;

export class GameStateManager {
  private _state: GameState = GameState.Idle;
  private listeners: Listener[] = [];

  get state() {
    return this._state;
  }

  setState(newState: GameState) {
    if (this._state === newState) return;
    this._state = newState;
    this.listeners.forEach((fn) => fn(newState));
  }

  onChange(fn: Listener) {
    this.listeners.push(fn);
  }
}
