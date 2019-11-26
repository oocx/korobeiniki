import { PlayerName } from './player-name';
import { KeyMap } from 'src/app/infrastructure/keymap';

export class Player1Mapping extends KeyMap {

    constructor(private playerName: PlayerName) {
      super(null);
    }

    public arrowright() {
      this.playerName.moveCursorRight();
      return true;
    }

    public arrowleft() {
      this.playerName.moveCursorLeft();
      return true;
    }

    public arrowup() {
      this.playerName.nextChar();
      return true;
    }

    public arrowdown() {
      this.playerName.previousChar();
      return true;
    }


    public backspace() {
      this.playerName.backspace();
      return true;
    }

    public delete() {
      this.playerName.delete();
      return true;
    }

    public enter() {
      this.playerName.submitPlayerName();
      return true;
    }

    public m() {
      this.playerName.setNameToMathias();
      return true;
    }

    public j() {
      this.playerName.setNameToJana();
      return true;
    }
  }
