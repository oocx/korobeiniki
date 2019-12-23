import { takeUntil, single } from 'rxjs/operators';

import { Events } from '../gameplay/events';
import { Score } from '../gameplay/model';

export class ScoreCalculator {

  public score: Score = null;

  private setLevel(level: number) {
    if (level === this.score.level) { return; }

    this.score.level = level;
    this.events.levelUp$.next(level);
  }

  constructor(private events: Events) {
    this.events.linesCleared$.pipe(takeUntil(this.events.gameOver$)).subscribe(linesCleared => this.onLinesCleared(linesCleared));
    this.events.gameStarted$.pipe(single()).subscribe(() => this.onGameStarted());
    this.onGameStarted();
  }

  public tick(ellapsedTimeMs: number) {
    this.score.gameTimeMs += ellapsedTimeMs;
  }

  private onGameStarted() {
    this.score = {
      score: 0,
      lines: 0,
      level: 1,
      gameTimeMs: 0,
      timestamp: new Date()
    };
    this.events.score$.next(this.score);
  }

  private onLinesCleared(linesCleared: number) {

    this.score.lines += linesCleared;

    switch (linesCleared) {
      case 1: {
        this.score.score += 40;
        break;
      }
      case 2: {
        this.score.score += 100;
        break;
      }
      case 3: {
         this.score.score += 300;
         break;
      }
      case 4: {
        this.score.score += 1200;
        break;
      }
    }

    this.setLevel(Math.max(Math.floor(this.score.lines / 5) + 1, 1));

    this.events.score$.next(this.score);
  }
}


