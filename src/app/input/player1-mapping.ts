import { KeyMap } from 'src/app/input/keymap';
import { Game } from '../gameplay/game';
import { GameLoopService } from '../ui/services/game-loop.service';


export class Player1Mapping extends KeyMap {

    constructor(private game: Game, loop: GameLoopService) {
      super(loop);
    }

    public arrowright(ellapsedTimeMs: number, isFirstEvent: boolean) {
      this.game.moveRight(ellapsedTimeMs, isFirstEvent);
      return false;
    }

    public arrowleft(ellapsedTimeMs: number, isFirstEvent: boolean) {
      this.game.moveLeft(ellapsedTimeMs, isFirstEvent);
      return false;
    }

    public arrowup() {
      this.game.rotateClockwise();
      return true;
    }

    public arrowdown(ellapsedTimeMs: number) {
      this.game.moveDownFast(ellapsedTimeMs);
      return false;
    }

    public space() {
      this.game.drop();
      return true;
    }
  }
