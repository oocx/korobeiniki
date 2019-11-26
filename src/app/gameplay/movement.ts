import { Field } from './field';
import { Tetromino } from './tetromino';
import { Events } from './events';


export class Movement {

  public timePerStep = 1000;
  public gameSpeed = 1;
  private deltaY = 0;
  private deltaX = 0;
  private lockDelay = 0;
  private canMoveDownFast = true;

  public get stepTime() {
    return this.timePerStep * this.gameSpeed;
  }

  public get horizontalStepTime() {
    return Math.max(this.timePerStep * this.gameSpeed, 320);
  }

  public get ghostY() {
    let y = 0;
    while (this.canMove(0, ++y)) {}
    return y - 1;
  }

  constructor(
    private tetromino: Tetromino,
    private field: Field,
    private events: Events) {
    }

  public moveRight(ellapsedTimeMs: number, isFirstEvent: boolean) {
    if (!this.canMove(1, 0)) { return; }

    if (isFirstEvent) {
      this.deltaX = 0;
    } else {
      this.deltaX += ellapsedTimeMs * 6;
    }

    let hasMoved = false;
    while ((isFirstEvent || this.deltaX > this.horizontalStepTime) && this.canMove(1, 0)) {
      this.tetromino.x++;
      this.tetromino.ghostY = this.ghostY;
      this.deltaX = Math.max(0, this.deltaX - this.horizontalStepTime);
      this.canMoveDownFast = true;
      hasMoved = true;
      isFirstEvent = false;
    }
    if (hasMoved) {
      this.events.moved$.next();
    }
  }

  public moveLeft(ellapsedTimeMs: number, isFirstEvent: boolean) {
    if (!this.canMove(-1, 0)) { return; }

    if (isFirstEvent) {
      this.deltaX = 0;
    } else {
      this.deltaX += ellapsedTimeMs * 6;
    }

    let hasMoved = false;
    while ((isFirstEvent || this.deltaX > this.horizontalStepTime) && this.canMove(-1, 0)) {
      this.tetromino.x--;
      this.tetromino.ghostY = this.ghostY;
      this.deltaX -= this.horizontalStepTime;
      this.canMoveDownFast = true;
      hasMoved = true;
      isFirstEvent = false;
    }
    if (hasMoved ) { this.events.moved$.next(); }
  }

  public moveDownFast(ellapsedTimeMs: number) {
    this.lockDelay -= ellapsedTimeMs * 8;

    if (!this.canMoveDownFast) {
      this.deltaY = 0;
      return;
     }
    if (!this.canMove(0, 1)) {
      this.deltaY = 0;
      return;
    }

    this.deltaY += ellapsedTimeMs * 20;
  }

  public drop() {
    let hasMoved = false;
    while (this.canMove(0, 1)) {
      this.tetromino.y++;
      hasMoved = true;
    }
    this.deltaY = 0;
    if (hasMoved) { this.events.moved$.next(); }
  }

  public tryMoveDown(ellapsedTime: number) {
    if (this.canMove(0, 1)) {
      this.lockDelay = 0;
      this.deltaY += ellapsedTime;

      let hasMoved = false;

      while (this.deltaY > this.stepTime && this.canMove(0, 1)) {
        this.tetromino.y++;
        this.tetromino.ghostY = this.ghostY;
        this.deltaY -= this.stepTime;
        this.canMoveDownFast = true;
        hasMoved = true;
      }
      this.lockDelay = this.stepTime * 1.5;

      if (hasMoved) { this.events.moved$.next(); }
      return true;
    } else if (this.lockDelay > 0) {
      this.lockDelay = Math.max(-1, this.lockDelay - ellapsedTime);
      return true;
    }

    this.canMoveDownFast = false;
    this.deltaY = 0;
    return false;
  }

  public canMove(dx: number, dy: number) {
    if (!this.tetromino || !this.tetromino.blocks) { return; }

    const width = this.field.data[0].length;
    const height = this.field.data.length;

    for (const block of this.tetromino.blocks) {
      const x = this.tetromino.x + block.x + dx;
      const y = this.tetromino.y + block.y + dy;

      if (y >= height || x < 0 || x >= width) { return false; }

      if (this.field.data[y][x].type) { return false; }

    }
    return true;
  }

  public rotate() {
    // https://tetris.wiki/SRS

    if (this.tetromino.size === 0) { return; }

    const originalBlocks = this.tetromino.blocks.map(b => ({ ...b }));

    this.tetromino.blocks = this.tetromino.blocks.map(b => {
        const x = this.tetromino.size - 1 - b.y;
        return { x, y: b.x, px: x * 40, py: b.x * 40, type: b.type };
      });

    for (const wallKick of this.tetromino.wallKickData[this.tetromino.rotation]) {

      if (this.canMove(wallKick[0], wallKick[1])) {

        this.tetromino.x += wallKick[0];
        this.tetromino.y += wallKick[1];
        if (this.tetromino.rotation === 3) {
          this.tetromino.rotation = 0;
        } else {
            this.tetromino.rotation++;
        }

        this.tetromino.ghostY = this.ghostY;
        this.events.rotated$.next();
        return;
      }
    }
    this.tetromino.blocks = originalBlocks;
    this.tetromino.ghostY = this.ghostY;
  }


}
