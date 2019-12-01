import { PlayerName } from './player-name';
import { KeyMap } from 'src/app/input/keymap';

export class Player2Mapping extends KeyMap {

    constructor(private playerName: PlayerName) {
      super(null);
    }

    public d() {
      this.playerName.moveCursorRight();
      return true;
    }

    public a() {
      this.playerName.moveCursorLeft();
      return true;
    }

    public w() {
      this.playerName.nextChar();
      return true;
    }

    public s() {
      this.playerName.previousChar();
      return true;
    }


    public q() {
      this.playerName.backspace();
      return true;
    }

    public y() {
      this.playerName.delete();
      return true;
    }
    public e() {
      this.playerName.submitPlayerName();
      return true;
    }

    public r() {
      this.playerName.setNameToMathias();
      return true;
    }

    public t() {
      this.playerName.setNameToJana();
      return true;
    }
  }
