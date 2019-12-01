import { Subject } from 'rxjs';

import { Game } from './game';
import { registerSingleplayerEvents } from './single-player-rules';
import { registerMultiplayerEvents } from './two-player-rules';

export class GameFactory {

  public gamesCreated$ = new Subject<Game[]>();

  public createSinglePlayerGame() {
    const game = new Game();
    this.gamesCreated$.next([game]);

    registerSingleplayerEvents(game);
    return game;
  }

  public createMultiplayerGames(numberOfPlayers: number) {
    const games = [...Array(numberOfPlayers)].map(() => new Game());
    this.gamesCreated$.next(games);

    games.forEach(game => {
      registerMultiplayerEvents(game, games.filter(g => g !== game));
    });
    return games;
  }

}
