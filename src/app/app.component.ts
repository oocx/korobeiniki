
import { Component} from '@angular/core';

import { NavigationMusicService } from './audio/navigation-music.service';
import { KeyboardInputService } from './input/keyboard-input.service';
import { GamepadInputService } from 'src/app/input/gamepad-input.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  constructor(
    private gamepadInputService: GamepadInputService,
    private keyboardInputService: KeyboardInputService,
    private navigationMusicService: NavigationMusicService
  ) {

  }

}
