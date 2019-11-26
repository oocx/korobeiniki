import { EventEmitter } from '@angular/core';
import { Score } from './model';

export class Events {

  public linesCleared$ = new EventEmitter<number>();

  public tetrominoDropped$ = new EventEmitter();

  public tetrominoHit$ = new EventEmitter();

  public tetrominoSpawned$ = new EventEmitter<number>();

  public levelUp$ = new EventEmitter<number>();

  public rotated$ = new EventEmitter();

  public moved$ = new EventEmitter();

  public score$ = new EventEmitter<Score>();

  public highscore$ = new EventEmitter<Score>();

  public gameStarted$ = new EventEmitter<string>();

  public gameOver$ = new EventEmitter();

  public paused$ = new EventEmitter();

  public continued$ = new EventEmitter();

  public playerNameEntered$ = new EventEmitter();

}
