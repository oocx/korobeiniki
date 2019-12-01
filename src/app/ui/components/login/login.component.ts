import { Component, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AudioService } from 'src/app/audio/audio.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {

  public promptEvent: BeforeInstallPromptEvent = null;

  public isLoading = true;

  public async install() {
    this.promptEvent.prompt();
    const choice = await this.promptEvent.userChoice;
  }

  constructor(
    private router: Router, appRef: ApplicationRef, public audio: AudioService) {
    window.addEventListener('beforeinstallprompt', (e: BeforeInstallPromptEvent) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.promptEvent = e;
    });

    setTimeout(() => appRef.tick(), 0);

    audio.finishedLoadingSounds$.pipe(take(1)).subscribe(() => this.router.navigate(['menu']));

   }

}


export interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<'accepted' | 'dismissed'>;
  prompt();
}
