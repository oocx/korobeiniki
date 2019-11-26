import { Subscription } from 'rxjs';
import { Component, ApplicationRef, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Buttons, GamepadState, GamepadService } from './../../input/gamepad.service';

import pkg from '../../../../package.json';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnDestroy {

  public version = '';

  private subscription: Subscription;

  @HostListener('window:keydown.a')
  public startSinglePlayerGame() {
    this.router.navigate(['game']);
  }

  @HostListener('window:keydown.b')
  public startMultiplayerGame() {
    this.router.navigate(['vs']);
  }

  @HostListener('window:keydown.x')
  public gotoHighscore() {
    this.router.navigate(['highscore']);
  }

  @HostListener('window:keydown.y')
  public gotoCredits() {
    this.router.navigate(['credits']);
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  constructor(
      private router: Router,
      gamepadService: GamepadService,
      appRef: ApplicationRef) {
    this.subscription = gamepadService.input$.subscribe(({ state }) => this.onInput(state));
    this.version = pkg.version;
    setTimeout(() => appRef.tick(), 0);
  }

  private onInput(gamepad: GamepadState) {

    if (gamepad.buttonsPressed[Buttons.A]) {
      this.startSinglePlayerGame();
    } else if (gamepad.buttonsPressed[Buttons.B]) {
      this.startMultiplayerGame();
    } else if (gamepad.buttonsPressed[Buttons.X]) {
      this.gotoHighscore();
    } else if (gamepad.buttonsPressed[Buttons.Y]) {
      this.gotoCredits();
    }
  }

}
