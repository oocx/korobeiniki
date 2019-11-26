import { GameFactoryService } from './../../gameplay/game-factory.service';
import { Component, ApplicationRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { GameState, Score } from 'src/app/gameplay/model';
import { Game } from 'src/app/gameplay/game';
import { LogService } from 'src/app/infrastructure/log.service';
import { GameLoopService } from 'src/app/infrastructure/game-loop.service';


/**
 * Draws the screen for a two player game.
 */
@Component({
  selector: 'app-two-player-game',
  templateUrl: './two-player-game.component.html',
  styleUrls: ['./two-player-game.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwoPlayerGameComponent implements OnDestroy {

  public game1: Game;

  public game2: Game;

  public get events1() {
    return this.game1.events;
  }

  public get events2() {
    return this.game2.events;
  }

  public get gameIsPaused() {
    return this.game1.state === GameState.Paused;
  }

  constructor(app: ApplicationRef, factory: GameFactoryService, public log: LogService, public loop: GameLoopService) {


      [ this.game1, this.game2 ] = factory.createMultiplayerGames(2);

      setTimeout(() => { app.tick(); }, 0);
  }

  public ngOnDestroy() {
    if (this.game1) { this.game1.gameOver(); }
    if (this.game2) { this.game2.gameOver(); }
  }

}
