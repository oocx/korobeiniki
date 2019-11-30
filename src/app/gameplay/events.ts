import { Subject } from 'rxjs';

import { Score } from './model';

export class Events {

  public linesCleared$ = new Subject<number>();

  public tetrominoDropped$ = new Subject();

  public tetrominoHit$ = new Subject();

  public tetrominoSpawned$ = new Subject<number>();

  public levelUp$ = new Subject<number>();

  public rotated$ = new Subject();

  public moved$ = new Subject();

  public score$ = new Subject<Score>();

  public highscore$ = new Subject<Score>();

  public gameStarted$ = new Subject<string>();

  public gameOver$ = new Subject();

  public paused$ = new Subject();

  public continued$ = new Subject();

  public playerNameEntered$ = new Subject();

}
