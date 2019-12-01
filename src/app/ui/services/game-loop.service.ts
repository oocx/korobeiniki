import { Injectable } from '@angular/core';

import { GameLoop } from 'src/app/gameplay/game-loop';

@Injectable({
  providedIn: 'root'
})
export class GameLoopService {

  public get tick$() { return this.gameLoop.tick$; }
  public get fps$() { return this.gameLoop.fps$; }
  public get started() { return this.gameLoop.started; }

  public start() {
    this.gameLoop.start();
  }

  public stop() {
    this.gameLoop.stop();
  }

  constructor(private gameLoop: GameLoop) {}

}
