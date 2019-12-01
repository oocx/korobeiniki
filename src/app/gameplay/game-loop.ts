import { Subject } from 'rxjs';

export class GameLoop {

  private frameid: number = null;
  private previousTimestamp = 0;

  public tick$ = new Subject<number>();
  public fps$ = new Subject<number>();

  public started = false;

  public start() {
    this.started = true;
    this.sheduleNextTick();
  }

  public stop() {
    cancelAnimationFrame(this.frameid);
    this.started = false;
    this.previousTimestamp = 0;
  }

  private raiseNextTick(timestamp: number) {
    const ellapsedTime = this.previousTimestamp ? timestamp - this.previousTimestamp : 1000;
    this.previousTimestamp = timestamp;
    this.tick$.next(ellapsedTime);

    if (ellapsedTime > 0) {
      this.fps$.next(Math.round(1000 / ellapsedTime));
    }
    this.sheduleNextTick();
  }

  private sheduleNextTick() {
    if (!this.started) { return; }
    this.frameid = requestAnimationFrame((timestamp) => this.raiseNextTick(timestamp));
  }
}
