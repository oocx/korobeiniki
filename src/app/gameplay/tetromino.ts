import { Field } from './field';
import { RandomGenerator, ColoredTetrominoType } from './random-generator';
import { TetrominoType, BlockData } from './model';
import { Events } from './events';

export class Tetromino implements TetrominoType {

  public set ghostY(y: number) {
    this.ghostYy = y;
    this.updateGhost();
  }

  public get ghostY() {
    return this.ghostYy;
  }

  public set x(x: number) {
    this.xx = x;
    if (!this.blocks) { return; }
    for (const block of this.blocks) {
      block.px = (block.x + x) * 40;
      if (block.changed) { block.changed(); }
    }
  }

  public get x() {
    return this.xx;
  }

  public set y(y: number) {
    this.yy = y;
    if (!this.blocks) { return; }
    for (const block of this.blocks) {
      block.py = (block.y + y) * 40;
      if (block.changed) { block.changed(); }
    }
  }

  public get y() {
    return this.yy;
  }

  public rotation: number;
  public blocks: BlockData[];
  public ghostBlocks: BlockData[];
  public get size() { return this.type.size; }
  public get wallKickData() { return this.type.wallKickData; }
  public get color() { return this.type.color; }

  private type: ColoredTetrominoType;
  private xx: number;
  private yy: number;
  private ghostYy: number;

  constructor(
    private randomGenerator: RandomGenerator,
    private field: Field,
    private events: Events
    ) { }

  public spawnNew() {

    this.type = { ... this.randomGenerator.drawNext() };
    this.rotation = 0;
    this.x = 5;
    this.y = 0;

    this.blocks = this.type.blocks.map(b => (
        {
          x: b.x,
          y: b.y,
          px: (this.x + b.x) * 40,
          py: (this.y + b.y) * 40,
          type: this.color }
    ));

    const minBlockHeight = this.field.getMinBlockHeight();
    this.events.tetrominoSpawned$.next(minBlockHeight);
  }

  public lock() {
    if (this.blocks) {
      for (const block of this.blocks) {
        const y = block.y + this.y;
        const x = block.x + this.x;

        this.field.data[y][x] = {
          x,
          y,
          px: x * 40,
          py: y * 40,
          type: this.color
        };
      }
    }
  }

  private updateGhost() {
    this.ghostBlocks = this.blocks.map(b => (
      { ...b, y: this.y + b.y + this.ghostY, py: (this.y + b.y + this.ghostY) * 40, type: b.type + ' ghost' }
    ));
  }
}
