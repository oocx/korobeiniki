import { Game } from './game';
import { takeUntil } from 'rxjs/operators';

export function registerSingleplayerEvents(game: Game) {
  const events = game.events;
  events.levelUp$.pipe(takeUntil(events.gameOver$))
    .subscribe(level => onLevelUp(game, level));
}


function onLevelUp(game: Game, level: number) {
  game.gameSpeed = Math.pow(0.98, (level  - 1) * 3);
}
