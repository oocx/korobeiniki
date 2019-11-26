import { Injectable } from '@angular/core';
import {  merge } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { Game } from './game';
import { GamepadInputService } from '../input/gamepad-input.service';
import { KeyboardInputService } from '../input/keyboard-input.service';
import { LogService } from '../infrastructure/log.service';
import { GameLoopService } from '../infrastructure/game-loop.service';
import { HighscoreService } from '../scoring/highscore.service';
import { AudioEventsService } from '../audio/audio-events.service';
import { registerSingleplayerEvents } from './single-player-rules';
import { registerMultiplayerEvents } from './two-player-rules';

@Injectable({
  providedIn: 'root'
})
export class GameFactoryService {

  constructor(
    public gamepad: GamepadInputService,
    public keyboard: KeyboardInputService,
    public log: LogService,
    public loop: GameLoopService,
    private highscore: HighscoreService,
    private audioEvents: AudioEventsService
  ) { }

  public createSinglePlayerGame() {
    const game = new Game();
    this.registerGames([ game ]);
    this.registerEvents(game);
    registerSingleplayerEvents(game);
    return game;
  }

  public createMultiplayerGames(numberOfPlayers: number) {
    const games = [...Array(numberOfPlayers)].map(() => new Game());
    this.registerGames(games);
    games.forEach(game => {
      this.registerEvents(game);
      registerMultiplayerEvents(game, games.filter(g => g !== game));
    });
    return games;
  }

  private registerGames(games: Game[]) {
    this.audioEvents.games = this.highscore.games = this.keyboard.games = this.gamepad.games =games;
  }

  private registerEvents(game: Game) {
    const events = game.events;
    events.gameStarted$.pipe(take(1)).subscribe(() => {

      this.loop.tick$.pipe(takeUntil(events.gameOver$))
        .subscribe(
          ellapsedTime => game.tick(ellapsedTime),
          err => {},
          () => this.loop.stop());

      merge(
        events.moved$,
        events.linesCleared$,
        events.tetrominoSpawned$,
        events.rotated$
      ).pipe(takeUntil(events.gameOver$))
       .subscribe(() => this.loop.requestTick = true);

      events.paused$.pipe(takeUntil(events.gameOver$))
        .subscribe(() => this.loop.stop());

      events.continued$.pipe(takeUntil(events.gameOver$))
        .subscribe(() => this.loop.start());

      this.loop.start();

    });
  }

}
