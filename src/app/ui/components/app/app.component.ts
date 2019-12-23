import { Component} from '@angular/core';

import { NavigationMusicService } from 'src/app/audio/navigation-music.service';
import { AudioEventsService } from 'src/app/audio/audio-events.service';
import { KeyboardInputService } from 'src/app/input/keyboard-input.service';
import { GamepadInputService } from 'src/app/input/gamepad-input.service';
import { UpdateUIService } from './../../services/update-ui.service';
import { HighscoreService } from './../../../highscore/highscore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  constructor(
    /*
      Those services are injected here so that they are created once when the app starts.
      They will listen and react to game events.
    */
    private gamepadInputService: GamepadInputService,
    private keyboardInputService: KeyboardInputService,
    private navigationMusicService: NavigationMusicService,
    private audioEventsService: AudioEventsService,
    private updateUIService: UpdateUIService,
    private highscoreService: HighscoreService
  ) {

  }

}
