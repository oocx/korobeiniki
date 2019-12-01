import { Injectable } from '@angular/core';

import { Game } from '../gameplay/game';
import { AudioService } from './audio.service';
import { GameState } from '../gameplay/model';
import { GameFactoryService } from '../ui/services/game-factory.service';

/**
 * Plays sound effects when events occur in the game
 * - lines cleared
 * - level up
 * - tetromino dropped
 * - ...
 */
@Injectable({
  providedIn: 'root'
})
export class AudioEventsService {

  constructor(private audio: AudioService, gameFactoryService: GameFactoryService) {
    gameFactoryService.gamesCreated$.subscribe(games => this.games = games);
  }

  public set games(games: Game[]) {
    this.minBlockHeights = [];
    for (let i = 0; i < games.length; i++) {
      this.registerGame(games[i], i);
      this.minBlockHeights[i] = 20;
    }
  }

  private minBlockHeights: number[] = [];


  private registerGame(game: Game, player: number) {
    const events = game.events;
    events.gameStarted$.subscribe(() => this.audio.playMusic('tetris'));
    events.gameOver$.subscribe(() => this.audio.stopMusic());
    events.linesCleared$.subscribe(linesCleared => this.onLinesCleared(linesCleared, player));
    events.tetrominoDropped$.subscribe(() => this.audio.playSound('synth_misc_12', player));
    events.tetrominoHit$.subscribe(() => this.audio.playSound('hit', player));
    events.rotated$.subscribe(() => this.audio.playSound('retro_misc_04', player));
    events.levelUp$.subscribe(level => this.onLevelUp(level));
    events.tetrominoSpawned$.subscribe(minBlockHeight => this.onTetrominoSpawned(minBlockHeight, player));
  }

  private onLevelUp(level: number) {
    if (level === 5) { this.audio.playMusic('cementcity'); }
    if (level === 10) { this.audio.playMusic('twister'); }
  }

  private onLinesCleared(linesCleared: number, player: number) {
    switch (linesCleared) {
      case 1: {
        this.audio.playSound('pop3', player);
        break;
      }
      case 2: {
        this.audio.playSound('coin8', player);
        break;
      }
      case 3: {
         this.audio.playSound('coin1', player);
         break;
      }
      case 4: {
        this.audio.playSound('coin10', player);
        break;
      }
    }
  }

  private onTetrominoSpawned(minBlockHeight: number, player: number) {

    this.minBlockHeights[player] = minBlockHeight;

    const min = this.minBlockHeights.reduce((prev, current) => Math.min(prev, current));

    if (min < 15) {
      this.audio.setSpeed(1 + (0.015 * (15 - min)));
    } else {
      this.audio.setSpeed(1);
    }
  }
}
