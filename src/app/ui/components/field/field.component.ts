import { Subscription } from 'rxjs';
import { Component, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { merge } from 'rxjs';

import { Game } from 'src/app/gameplay/game';
import { GameLoopService } from 'src/app/ui/services/game-loop.service';

/**
 * Draws the playing field for a single game.
 */
@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldComponent implements OnDestroy {

  @Input()
  public set game(game: Game) {
    this.gameService = game;

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const events = merge(
      game.events.moved$,
      game.events.rotated$,
      game.events.tetrominoDropped$,
      game.events.tetrominoSpawned$,
      game.events.linesCleared$
    );

    this.subscription = events.subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  public get game() {
    return this.gameService;
  }

  public get fieldData() {
    return this.game.fieldData;
  }

  public get ghostY() {
    return this.game.ghostY;
  }

  @HostBinding('style.width.px')
  public get widthpx() {
    return this.game.fieldWidth * 40;
  }

  @HostBinding('style.height.px')
  public get heightpx() {
    return this.game.fieldHeight * 40;
  }

  public get tetromino() {
    return this.game.tetromino;
  }

  private gameService: Game;

  private subscription: Subscription;

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  constructor(private changeDetector: ChangeDetectorRef, loop: GameLoopService) {
    this.changeDetector.detach();
  }

}
