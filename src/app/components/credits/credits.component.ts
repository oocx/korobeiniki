import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { GamepadService, GamepadState } from './../../input/gamepad.service';


@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditsComponent implements OnDestroy {

  private subscription: Subscription;

  public credits: string[] = [];

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  constructor(gamepadService: GamepadService, private router: Router, private http: HttpClient,private changeDetector: ChangeDetectorRef) {
    this.subscription = gamepadService.input$.subscribe(({state}) => this.onInput(state));
    this.loadCredits();
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

  private loadCredits() {
    this.http.get('/assets/credits.txt', { responseType: 'text' }).subscribe(response => {
      this.credits = response.split('\n');
      this.changeDetector.detectChanges();
    });
  }
}
