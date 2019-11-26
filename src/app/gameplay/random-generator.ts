import { blockTypes, TetrominoType, tetrominoColors, BlockData } from './model';

export class RandomGenerator {

  // Make it possible to override random in unit tests - TODO: find more elegant way to inject this
  public static random = Math.random;

  private bag: ColoredTetrominoType[] = [];

  public preview: TetrominoPreview;


  public drawNext(): ColoredTetrominoType {

    if (this.bag.length <= 7) { this.fillBag(); }
    const result = this.bag.splice(0, 1)[0];
    this.updatePreview();
    return result;
  }

  constructor() {
    this.fillBag();
  }

  private fillBag() {
    const random = RandomGenerator.random;
    const tetrominos = blockTypes.map(t => ({ ...t }));
    while (tetrominos.length) {
      const index = Math.floor(random() * Math.floor(tetrominos.length));
      const tetromino = tetrominos.splice(index, 1)[0];
      const colorIndex = Math.floor(random() * Math.floor(tetrominoColors.length));
      this.bag.push( { ...tetromino, color: tetrominoColors[colorIndex] });
    }
    this.updatePreview();
  }

  private updatePreview() {
    const result = this.bag[0];
    result.blocks = result.blocks.map(b => {
      const px = b.x * 40 + 40 + (result.size === 3 ? 20 : 0);
      const py = b.y * 40 + 40 + (result.size < 4 ? 20 : 0);
      return { ...b, px, py, type: result.color } as BlockData;
    });
    this.preview = result as TetrominoPreview;
  }

}

export type ColoredTetrominoType = TetrominoType & { color: string };

export interface TetrominoPreview {
  blocks: BlockData[];
  size: 0 | 3 | 4;
  wallKickData: number[][][];
  color: string;
}
