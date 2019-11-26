import { PlayerName } from './player-name';
import { GamepadService, GamepadState, Buttons } from 'src/app/input/gamepad.service';
import { Subscription } from 'rxjs';

export class GamepadMapping {

    private subscription: Subscription;

    constructor(gamePad: GamepadService, private playerName: PlayerName, private playerNumber: number) {
        this.subscription = gamePad.input$.subscribe(({ state, gamepadId }) => this.onGamepadInput(state, gamepadId));
    }

    public onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }


    private onGamepadInput(gamepad: GamepadState, gamepadId: number) {
        if (gamepadId !== this.playerNumber) { return; }

        if (!gamepad.buttonsPressed) { return; }

        if (gamepad.buttonsPressed[Buttons.Left]) {
          this.playerName.moveCursorLeft();
        }
        if (gamepad.buttonsPressed[Buttons.Right]) {
          this.playerName.moveCursorRight();
        }
        if (gamepad.buttonsPressed[Buttons.Up]) {
          this.playerName.nextChar();
        }
        if (gamepad.buttonsPressed[Buttons.Down]) {
          this.playerName.previousChar();
        }
        if (gamepad.buttonsPressed[Buttons.X]) {
          this.playerName.delete();
        }
        if (gamepad.buttonsPressed[Buttons.RB]) {
          this.playerName.backspace();
        }
        if (gamepad.buttonsPressed[Buttons.LT]) {
          this.playerName.setNameToJana();
        }
        if (gamepad.buttonsPressed[Buttons.RT]) {
          this.playerName.setNameToMathias();
        }
        if (gamepad.buttonsPressed[Buttons.A]) {
          this.playerName.submitPlayerName();
        }
    }
}
