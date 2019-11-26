import { GamepadService, GamepadState, Buttons } from './gamepad.service';
import { LogService } from '../infrastructure/log.service';
import { GameState } from '../gameplay/model';
import { Injectable } from '@angular/core';
import { Game } from '../gameplay/game';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GamepadInputService {

  public games: Game[] = [];

  constructor(private router: Router, private log: LogService, gamepadService: GamepadService) {
    gamepadService.input$.subscribe(gamepad => this.tick(gamepad.state, gamepad.gamepadId));
  }

  private tick(gamepad: GamepadState, gamepadId: number) {
    try {
      this.handleGamepad(gamepad, gamepadId);
    } catch (ex) {
      this.log.writeLine('error in gamepad tick: ' + ex);
    }
  }

  private handleGamepad(gamepad: GamepadState, gamepadId: number) {
    this.handleGotoMainMenu(gamepad);

    if (gamepadId > (this.games.length - 1)) { return; }

    const game = this.games[gamepadId];

    this.handleButtons(gamepad, game);
    this.handleAxes(gamepad, game);
  }

  private handleGotoMainMenu(gamepad: GamepadState) {
    if (gamepad.axes.length < 4 || !gamepad.buttons || gamepad.buttons.length < Buttons.RT) { return; }
    if (gamepad.buttons[Buttons.RT].pressed
      && (gamepad.axes[0] < -0.5 )
      && (gamepad.axes[2] > 0.5)) {
        this.router.navigate(['menu']);
      }
  }

  private handleButtons(gamepad: GamepadState, game: Game) {


    const buttonPressed = gamepad.buttonsPressed;

    if (game.state ===  GameState.NotStarted) {

      if (buttonPressed[Buttons.A] && this.games.every(g => g.playerName !== null)) {
        this.games.forEach(g => g.start());
      }
    } else if (game.state === GameState.GameOver) {
      // TODO
    } else if (game.state === GameState.Running) {

      if (buttonPressed[Buttons.A] || buttonPressed[Buttons.Up]) {
        game.rotateClockwise();
      }

      if (buttonPressed[Buttons.X] || buttonPressed[Buttons.RT]) {
        game.drop();
      }

      if ((buttonPressed[Buttons.LB] || buttonPressed[Buttons.RB])) {
        this.games.forEach(g => g.pause());
      }


      if (gamepad.buttons[Buttons.Left].pressed) {
        game.moveLeft(gamepad.ellapsedTime);
      }

      if (gamepad.buttons[Buttons.Right].pressed) {
        game.moveRight(gamepad.ellapsedTime);
      }

      if (gamepad.buttons[Buttons.Down].pressed) {
        game.moveDownFast(gamepad.ellapsedTime);
      }


    } else if (game.state === GameState.Paused) {

      if (buttonPressed[Buttons.LB] || buttonPressed[Buttons.RB]) {
        this.games.forEach(g => g.continue());
      }

    }
  }

  private handleAxes(gamepad: GamepadState, game: Game) {

    if (gamepad.axes.length > 0) {

      if (gamepad.axes[0] < -0.2) {
        game.moveLeft(this.easeValue(gamepad.axes[0], gamepad.ellapsedTime));
      } else if (gamepad.axes[0] > 0.2) {
        game.moveRight(this.easeValue(gamepad.axes[0], gamepad.ellapsedTime));
      }

      if (gamepad.axes.length > 1) {
        if (gamepad.axes[1] > 0.2) {
          game.moveDownFast(this.easeValue(gamepad.axes[1], gamepad.ellapsedTime));
        }
      }
    }
  }

  private easeValue(movement: number, ellapsedTime: number) {
    const result = movement * movement * movement * ellapsedTime;
    return Math.abs(result);
  }
}
