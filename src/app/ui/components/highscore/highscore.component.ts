import { Component, HostListener, ApplicationRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Score } from 'src/app/gameplay/model';
import { HighscoreService } from 'src/app/highscore/highscore.service';
import { GamepadService, GamepadState } from 'src/app/input/gamepad.service';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.less']
})
export class HighscoreComponent implements OnDestroy {

  public entries: Score[] = [];

  private lastScore: Score = null;

  private subscription: Subscription;
  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  constructor(
    gamepadService: GamepadService,
    appRef: ApplicationRef,
    highscoreSerivce: HighscoreService,
    private router: Router
    ) {
    this.lastScore = highscoreSerivce.lastScore;
    this.subscription = gamepadService.input$.subscribe(({state}) => this.onInput(state));
    highscoreSerivce.getAllEntries().then(entries => {
      this.entries = entries;
      appRef.tick();
    });
   }

   public isLastScore(score: Score) {
     return score.score === this.lastScore.score &&
      score.gameTimeMs === this.lastScore.gameTimeMs &&
      score.playerName === this.lastScore.playerName;
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
