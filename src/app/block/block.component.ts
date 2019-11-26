import { Component, ChangeDetectionStrategy, Input, HostBinding, ChangeDetectorRef } from '@angular/core';

import { BlockData } from '../gameplay/model';

/**
 * This component represents a block on the playing field.
 */
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockComponent {


  @Input()
  public set data(data: BlockData) {
    if (this.blockData) {
      this.blockData.changed = null;
    }
    this.blockData = data;
    data.changed = () => {
      this.changeDetector.markForCheck();
    };
  }

  public get data() {
    return this.blockData;
  }

  @HostBinding('class')
  public get class() {
    return this.data && this.data.type ? this.data.type : 'empty';
  }

  @HostBinding('style.left.px')
  public get x() {
    return this.data ? this.data.px : null;
  }

  @HostBinding('style.top.px')
  public get y() {
    return this.data ? this.data.py : null;
  }

  private blockData: BlockData;

  constructor(private changeDetector: ChangeDetectorRef) {
    // this.changeDetector.detach();
  }

}
