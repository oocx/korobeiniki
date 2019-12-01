import { KeyMap } from 'src/app/input/keymap';
import { Game } from '../gameplay/game';
import { GameState } from '../gameplay/model';
import { Router } from '@angular/router';


export class GlobalMapping extends KeyMap {

    public games: Game[] = [];

    constructor(private router: Router) {
      super(null);
    }

    public enter(ellapsedTimeMs: number) {
      if (this.games.every(g => g.state === GameState.NotStarted && g.playerName)) {
        this.games.forEach(g => g.start());
      }
      return true;
    }

    public p(ellapsedTimeMs: number) {
      if (this.games.every(g => g.state === GameState.Running)) {
        this.games.forEach(g => g.pause());
      } else if (this.games.every(g => g.state === GameState.Paused)) {
        this.games.forEach(g => g.continue());
      }
      return true;
    }

    public esc() {
      this.games.forEach(g =>
        g.gameOver()
      );
      this.router.navigate(['menu']);
    }

  }
