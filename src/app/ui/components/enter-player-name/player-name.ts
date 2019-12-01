const CHAR_A = 'A'.charCodeAt(0);
const CHAR_SPACE = ' '.charCodeAt(0);
const CHAR_Z = 'Z'.charCodeAt(0);

export class PlayerName {

  public chars: string[] = '       '.split('');

  public cursorPos = 0;

  public moveCursorRight() {
    this.cursorPos++;
    if (this.cursorPos > 6) {
      this.cursorPos = 0;
    }
    this.detectChanges();
  }

  public moveCursorLeft() {
    this.cursorPos--;
    if (this.cursorPos < 0) {
      this.cursorPos = 6;
    }
    this.detectChanges();
  }

  public nextChar() {
    let char = this.chars[this.cursorPos].charCodeAt(0);

    if (char === CHAR_SPACE) {
      char = CHAR_A;
    } else if (char >= CHAR_Z) {
      char = CHAR_SPACE;
    } else {
      char++;
    }

    this.chars[this.cursorPos] = String.fromCharCode(char);
    this.detectChanges();
  }

  public previousChar() {
    let char = this.chars[this.cursorPos].charCodeAt(0);

    if (char === CHAR_SPACE) {
      char = CHAR_Z;
    } else if (char <= CHAR_A) {
      char = CHAR_SPACE;
    } else {
      char--;
    }

    this.chars[this.cursorPos] = String.fromCharCode(char);
    this.detectChanges();
  }

  public backspace() {
    this.chars[this.cursorPos] = ' ';
    this.moveCursorLeft();
  }

  public delete() {
    this.chars[this.cursorPos] = ' ';
    this.tick();
  }

  public submitPlayerName() {
    this.submit(this.chars.join('').trim());
    this.tick();
  }
  public setNameToMathias() {
    this.setChars('MATHIAS');
  }

  public setNameToJana() {
    this.setChars('JANA');
  }


  public setChars(name: string) {
    if (!name) { name = ''; }

    this.chars = [' ', ' ', ' ', ' ', ' ', ' ', ' '];
    for (let i = 0; i < name.length && i < 7; i++) {
      this.chars[i] = name[i].toUpperCase();
    }

    this.detectChanges();
  }

  constructor(private detectChanges: () => void, private tick: () => void, private submit: (name: string) => void) {
  }

}
