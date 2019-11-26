import { LogService } from './log.service';
import { Injectable, EventEmitter, ApplicationRef } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GameLoopService {

  private frameid: number = null;
  private previousTimestamp = 0;

  public tick$ = new EventEmitter<number>();
  public fps$ = new EventEmitter<number>();

  public started = false;

  public requestTick = true;

  constructor(private log: LogService, private app: ApplicationRef) { }

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

    if (this.requestTick) {
      this.app.tick();
      this.requestTick = false;
    }
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
