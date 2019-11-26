import { Subscription } from 'rxjs';
import { GameLoopService } from 'src/app/infrastructure/game-loop.service';
import { Game } from '../gameplay/game';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Player1Mapping } from './player1-mapping';
import { Player2Mapping } from './player2-mapping';
import { GlobalMapping } from './global-mapping';
import { KeyMap } from '../infrastructure/keymap';

@Injectable({
  providedIn: 'root'
})
export class KeyboardInputService {

  private listeners = new Set<KeyMap>();

  private globalMapping: GlobalMapping;

  public set games(games: Game[]) {

    if (this.listeners) {
      for (const listener of this.listeners) {
        listener.removeListeners();
      }
      this.listeners.clear();
    }

    if (games.length < 1) { return; }

    if (games.length === 1) {
      const player1Map = new Player1Mapping(games[0], this.loop);
      player1Map.addListeners();
      this.listeners.add(player1Map);
    } else if (games.length === 2) {
      const player1Map = new Player1Mapping(games[0], this.loop);
      const player2Map = new Player2Mapping(games[1], this.loop);
      player1Map.addListeners();
      player2Map.addListeners();
      this.listeners.add(player1Map);
      this.listeners.add(player2Map);
    }

    this.globalMapping.games = games;
  }

  constructor(private loop: GameLoopService, private router: Router) {
    this.globalMapping = new GlobalMapping(router);
    this.globalMapping.addListeners();
  }



}

