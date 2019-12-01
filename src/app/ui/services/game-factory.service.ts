import { Injectable } from '@angular/core';

import { GameFactory } from 'src/app/gameplay/game-factory';

@Injectable({
  providedIn: 'root'
})
export class GameFactoryService {

  private gameFactory = new GameFactory();

  public get gamesCreated$() {
    return this.gameFactory.gamesCreated$;
  }

  public createSinglePlayerGame() {
    return this.gameFactory.createSinglePlayerGame();
  }

  public createMultiplayerGames(numberOfPlayers: number) {
    return this.gameFactory.createMultiplayerGames(numberOfPlayers);
  }

  constructor() {}
}
