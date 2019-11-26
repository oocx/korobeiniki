
import { Component, Input, ApplicationRef, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';

import { GameLoopService } from 'src/app/infrastructure/game-loop.service';
import { Game } from 'src/app/gameplay/game';
import { GamepadService } from 'src/app/input/gamepad.service';
import { GamepadMapping } from './gamepad-mapping';
import { KeyMap } from 'src/app/infrastructure/keymap';
import { Player1Mapping } from './player1-mapping';
import { Player2Mapping } from './player2-mapping';
import { PlayerName } from './player-name';

/**
 * This component allows the player to enter his/her name
 * at the beginning of the game.
 *
 * A player can enter the name by using the up/down/left/right
 * keys on his keyboard or the gamepad.
 */
@Component({
  selector: 'app-enter-player-name',
  templateUrl: './enter-player-name.component.html',
  styleUrls: ['./enter-player-name.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterPlayerNameComponent implements OnInit, OnDestroy {

  private gamepadMapping: GamepadMapping;

  private keyboardMapping: KeyMap;

  private playerName;

  public get chars() {
    return this.playerName.chars;
  }

  public get cursorPos() {
    return this.playerName.cursorPos;
  }

  @Input()
  public set game(game: Game) {
    this.gameInstance = game;
    if (game && game.playerName) {
      this.playerName.setChars(game.playerName);
    }
  }

  public get game() {
    return this.gameInstance;
  }

  private gameInstance: Game;

  @Input()
  public set playerNumber(value: string) {
    this.playerNumberValue = Number.parseInt(value, 10);
  }

  private playerNumberValue = 0;


  public ngOnDestroy() {
    this.gamepadMapping.onDestroy();
    this.keyboardMapping.removeListeners();
  }

  public ngOnInit() {
    this.gamepadMapping = new GamepadMapping(this.gamepad, this.playerName, this.playerNumberValue);
    if (this.playerNumberValue < 1) {
      this.keyboardMapping = new Player1Mapping(this.playerName);
    } else {
      this.keyboardMapping = new Player2Mapping(this.playerName);
    }
    this.keyboardMapping.addListeners();
  }

  constructor(
    app: ApplicationRef,
    changeDetector: ChangeDetectorRef,
    private gamepad: GamepadService,
    private loop: GameLoopService) {

      this.playerName = new PlayerName(
        () => changeDetector.detectChanges(),
        () => app.tick(),
        (name) => {
          if (this.game) {
            this.game.playerName = name;
            app.tick();
          }
        }
      );
      setTimeout(() => { app.tick(); }, 0);
  }
}

