import { Field } from './field';
import { Events } from './events';

export class ClearLines {

  constructor(private field: Field, private events: Events) { }


  public clearLines() {
    const numberOfLinesCleared = this.tryClearLines();

    if (numberOfLinesCleared < 1) { return; }
    this.events.linesCleared$.next(numberOfLinesCleared);
  }

  private tryClearLines() {

    let linesCleared = 0;
    const linesToClear = [];

    for (let y = 0; y < this.field.height; y++) {
      if (this.field.data[y].every(block => block.type)) {
        this.clearLine(y);
        linesCleared++;
        linesToClear.push(y);
      }
    }

    if (linesToClear.length > 0) {
      setTimeout(() => {
        // TODO: implement more advanced algorithm,
        // https://gamedevelopment.tutsplus.com/tutorials/implementing-tetris-clearing-lines--gamedev-1197

        for (const line of linesToClear) {
          this.field.removeLine(line);
        }
      }, 500);
    }
    return linesCleared;
  }

  private clearLine(y: number) {
    for (let x = 0; x < this.field.width; x++) {
      this.field.data[y][x].type += ' explode';
    }
  }



}
