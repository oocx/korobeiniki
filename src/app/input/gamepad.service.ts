import { Injectable, EventEmitter } from '@angular/core';

import { GameLoopService } from '../ui/services/game-loop.service';


@Injectable({
  providedIn: 'root'
})
export class GamepadService {

  public input$ = new EventEmitter<{ state: GamepadState, gamepadId: number}>();

  private previousButtonState: boolean[][] = [];

  private gamepads: Gamepad[] = [];


  constructor(private loop: GameLoopService) {
    this.loop.tick$.subscribe((ellapsedTime) => this.tick(ellapsedTime));
    setInterval(() => {
      // regular tick loop is only executed when the game is running
      // if it is not started yet, we still need to detect any button press to start the game
      if (!this.loop.started) {
        if (this.gamepads.length === 0) { this.detectGamepads(); }
        this.tick(0);
      }
    }, 100);
  }

  private detectGamepads() {
    try {
      const pads = [... navigator.getGamepads() ].filter(pad => pad);
      if (pads.length > 0) {
        this.gamepads = pads;
      }
      this.tick(0);
    } catch (ex) {
      console.error('error in detectGamepads(): ' + ex);
    }
  }

  private tick(ellapsedTime: number) {
    try {
      this.gamepads = navigator.getGamepads();

      if (!this.gamepads) { return; }


      for (let idx = 0; idx < this.gamepads.length; idx++) {
        const gamepad = this.gamepads[idx];
        if (!gamepad) { continue; }

        this.handleGamepad(gamepad, ellapsedTime, idx);
      }
    } catch (ex) {
      console.error('error in gamepad tick: ' + ex);
    }
  }

  private handleGamepad(gamepad: Gamepad, ellapsedTime: number, gamepadId: number) {

    if (!this.previousButtonState[gamepadId]) {
      this.previousButtonState[gamepadId] = gamepad.buttons.map(b => false);
    }

    const state: GamepadState = {
      id: gamepad.id,
      buttons: gamepad.buttons,
      buttonsPressed: this.getButtonState(gamepad, gamepadId),
      axes: gamepad.axes,
      ellapsedTime
    };

    this.input$.next({ state, gamepadId });
  }


  private getButtonState(gamepad: Gamepad, gamepadId: number) {
    const buttonPressed = gamepad.buttons.map((b, idx) => b.pressed && !this.previousButtonState[gamepadId][idx]);
    this.previousButtonState[gamepadId] = gamepad.buttons.map(b => b.pressed);
    return buttonPressed;
  }
}

export enum Buttons {
  A = 0,
  B = 1,
  X = 2,
  Y = 3,
  LB = 4,
  RB = 5,
  LT = 6,
  RT = 7,
  View = 8,
  Menu = 9,
  LeftStick = 10,
  RightStick = 11,
  Up = 12,
  Down = 13,
  Left = 14,
  Right = 15
}

export interface GamepadState {
  id: string;
  buttonsPressed: readonly boolean[];
  buttons: readonly GamepadButton[];
  axes: readonly number[];
  ellapsedTime: number;
}
