import { Subject } from 'rxjs';

import { Score } from './model';

export class Events {

  public linesCleared$ = new Subject<number>();

  public tetrominoDropped$ = new Subject<void>();

  public tetrominoHit$ = new Subject<void>();

  public tetrominoSpawned$ = new Subject<number>();

  public levelUp$ = new Subject<number>();

  public rotated$ = new Subject<void>();

  public moved$ = new Subject<void>();

  public score$ = new Subject<Score>();

  public highscore$ = new Subject<Score>();

  public gameStarted$ = new Subject<string>();

  public gameOver$ = new Subject<void>();

  public paused$ = new Subject<void>();

  public continued$ = new Subject<void>();

  public playerNameEntered$ = new Subject<string>();

}
