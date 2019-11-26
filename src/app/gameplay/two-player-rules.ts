import { Game } from './game';
import { takeUntil } from 'rxjs/operators';


export function registerMultiplayerEvents(game: Game, otherGames: Game[]) {
  const events = game.events;
  events.linesCleared$.pipe(takeUntil(events.gameOver$))
    .subscribe(linesCleared => onLinesCleared(linesCleared, game, otherGames));
}


function onLinesCleared(linesCleared: number, scoreGame: Game, otherGames: Game[]) {

  switch (linesCleared) {
    case 1: {
      otherGames.forEach(otherGame => otherGame.increaseSpeed(3));
      break;
    }
    case 2: {
      otherGames.forEach(otherGame => otherGame.increaseSpeed(8));
      break;
    }
    case 3: {
      otherGames.forEach(otherGame => otherGame.increaseSpeed(15));
      break;
    }
    case 4: {
      otherGames.forEach(otherGame => otherGame.increaseSpeed(24));
      break;
    }
  }

}
