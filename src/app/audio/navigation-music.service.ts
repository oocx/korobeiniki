import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AudioService } from './audio.service';

/**
 * Plays background music for various game screens.
 * This service listens to router events and plays back
 * music depending on which page the player navigated to.
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationMusicService {

  constructor(private audio: AudioService, router: Router) {
    this.registerNavigationMusic(router);
   }

  private registerNavigationMusic(router: Router) {
    router.events.subscribe(event => {

        if (event instanceof NavigationEnd) {
          switch (event.url) {
            case '/menu':
              this.audio.playMusic('tetrisc64kraku');
              break;
            case '/highscore':
              this.audio.playMusic('KorobeinikiFPM');
              break;
            case '/credits':
              this.audio.playMusic('djtc');
              break;
          }
        }
      });
  }
}
