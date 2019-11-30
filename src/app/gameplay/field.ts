import { BlockData } from './model';

export class Field {

  public width = 10;
  public height = 22;

  public data: BlockData[][];

  constructor() {
    this.init();
  }

  public getMinBlockHeight() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.data[y][x].type) { return y; }
      }
    }
    return this.height;
  }

  public init() {
    this.data = [];
    for (let y = 0; y < this.height; y++) {
      this.data[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.data[y][x] = {
          type: null,
          x,
          y,
          px: x * 40,
          py: y * 40
        };
      }
    }
  }

  public removeLine(line: number) {
    for (let y = line; y > 0; y--) {
      for (let x = 0; x < this.width; x++) {
        this.data[y][x].type = this.data[y - 1][x].type;
      }
    }

    for (let x = 0; x < this.width; x++) {
      this.data[0][x].type = null;
    }

  }
}
