import { Component, HostListener, ApplicationRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Score } from '../../gameplay/model';
import { HighscoreService } from '../../scoring/highscore.service';
import { GamepadService, GamepadState } from '../../input/gamepad.service';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.less']
})
export class HighscoreComponent implements OnDestroy {

  public entries: Score[] = [];

  private subscription: Subscription;
  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  constructor(
    gamepadService: GamepadService,
    highscoreSerivce: HighscoreService,
    appRef: ApplicationRef,
    private router: Router
    ) {
    this.subscription = gamepadService.input$.subscribe(({state}) => this.onInput(state));
    highscoreSerivce.getAllEntries().then(entries => {
      this.entries = entries;
      appRef.tick();
    });
   }

  @HostListener('window:keydown')
  public returnToMenu() {
    this.router.navigate(['menu']);
  }

  private onInput(gamepad: GamepadState) {
    if (gamepad.buttonsPressed.find(b => b)) {
      this.returnToMenu();
    }
  }

}
