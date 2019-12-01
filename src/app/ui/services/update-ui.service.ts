import { Injectable, ApplicationRef } from '@angular/core';
import { merge } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { GameFactoryService } from 'src/app/ui/services/game-factory.service';
import { Game } from 'src/app/gameplay/game';
import { GameLoopService } from 'src/app/ui/services/game-loop.service';

/**
 * This service manually triggers change detection for
 * certain events that occur in the game.
 *
 * We don't use automatic change detection (zone.js) for
 * for higher performance.
 */
@Injectable({
  providedIn: 'root'
})
export class UpdateUIService {
  constructor(
    private loop: GameLoopService,
    private app: ApplicationRef,
    gameFactoryService: GameFactoryService) {
    gameFactoryService.gamesCreated$.subscribe(games => this.onGamesCreated(games));
  }

  private onGamesCreated(games: Game[]) {
    games.forEach(game => this.registerEvents(game));
    this.loop.start();
  }

  private registerEvents(game: Game) {
    const events = game.events;

    events.gameStarted$.pipe(take(1)).subscribe(() => {

      let requestTick = false;

      this.loop.tick$.pipe(takeUntil(events.gameOver$))
        .subscribe(
          ellapsedTime => {
            game.tick(ellapsedTime);
            if (requestTick) {
              this.app.tick();
              console.log('app.tick');
              requestTick = false;
            }
          },
          err => {},
          () => this.loop.stop());

      merge(
        events.moved$,
        events.linesCleared$,
        events.tetrominoSpawned$,
        events.rotated$
      ).pipe(takeUntil(events.gameOver$))
       .subscribe(() => requestTick = true);

      events.paused$.pipe(takeUntil(events.gameOver$))
        .subscribe(() => this.loop.stop());

      events.continued$.pipe(takeUntil(events.gameOver$))
        .subscribe(() => this.loop.start());

    });
  }
}
