import { KeyMap } from 'src/app/input/keymap';
import { Game } from '../gameplay/game';
import { GameLoopService } from '../ui/services/game-loop.service';

export class Player2Mapping extends KeyMap {

    constructor(private game: Game, loop: GameLoopService) {
      super(loop);
    }

    public d(ellapsedTimeMs: number, isFirstEvent: boolean) {
      this.game.moveRight(ellapsedTimeMs, isFirstEvent);
      return false;
    }

    public a(ellapsedTimeMs: number, isFirstEvent: boolean) {
      this.game.moveLeft(ellapsedTimeMs, isFirstEvent);
      return false;
    }

    public w() {
      this.game.rotateClockwise();
      return true;
    }

    public s(ellapsedTimeMs: number) {
      this.game.moveDownFast(ellapsedTimeMs);
      return false;
    }

    public e() {
      this.game.drop();
      return true;
    }
  }
