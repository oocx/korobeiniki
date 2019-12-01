import { Component, ApplicationRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { GameState } from 'src/app/gameplay/model';
import { Game as Game } from 'src/app/gameplay/game';
import { GameLoopService } from 'src/app/ui/services/game-loop.service';
import { GameFactoryService } from 'src/app/ui/services/game-factory.service';


/**
 * Draws the screen for a single player game.
 */
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnDestroy {

  public game: Game;

  public get events() {
    return this.game.events;
  }

  public get gameIsPaused() {
    return this.game.state === GameState.Paused;
  }

  constructor(app: ApplicationRef, factory: GameFactoryService, public loop: GameLoopService) {

      this.game = factory.createSinglePlayerGame();

      setTimeout(() => { app.tick(); }, 0);
  }

  public ngOnDestroy() {
    if (this.game) { this.game.gameOver(); }
  }

}
