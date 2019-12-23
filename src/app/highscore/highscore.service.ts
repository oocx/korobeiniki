import { Injectable, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil, first } from 'rxjs/operators';

import { FirebaseService } from './firebase.service';
import { Score } from 'src/app/gameplay/model';
import { Events } from 'src/app/gameplay/events';
import { Game } from 'src/app/gameplay/game';
import { GameFactoryService } from '../ui/services/game-factory.service';


@Injectable({
  providedIn: 'root'
})
export class HighscoreService {

  public set games(games: Game[]) {
    for (const game of games) {
      this.registerGame(game);
    }
  }

  private highscore: Score = null;

  public lastScore: Score = null;

  constructor(
    private appRef: ApplicationRef, private firebase: FirebaseService, private router: Router, gameFactoryService: GameFactoryService) {
    gameFactoryService.gamesCreated$.subscribe(games => this.games = games);
  }

  public async getAllEntries(): Promise<Score[]> {
    const results = await this.firebase.firestore.collection(process.env.FIREBASE_COLLECTION).orderBy('score', 'desc').limit(10).get();
    const scores = results.docs.map(d => d.data() as Score);
    return scores;
  }

  private async registerGame(game: Game) {
    const events = game.events;
    events.gameStarted$.pipe(takeUntil(events.gameOver$)).subscribe(() => this.lastScore = null);
    events.score$.pipe(takeUntil(events.gameOver$)).subscribe(score => this.onScore(score, game.events));
    events.gameOver$.pipe(first()).subscribe(() => this.onGameOver(game.playerName));
    events.highscore$.next(this.highscore);

    const lastHighScore = await this.firebase.firestore.collection(process.env.FIREBASE_COLLECTION).orderBy('score', 'desc').limit(1).get();

    if (lastHighScore.docs.length === 1) {
      this.highscore = lastHighScore.docs[0].data() as unknown as Score;
      game.events.highscore$.next(this.highscore);
      this.appRef.tick();
    }
  }

  private async onGameOver(playerName: string) {
    if (this.lastScore === null) { return; }

    // round time, as we would not get the exact same result back from the service otherwise
    this.lastScore = { ...this.lastScore, playerName, gameTimeMs: Math.floor(this.lastScore.gameTimeMs) };

    await this.firebase.firestore.collection(process.env.FIREBASE_COLLECTION).add(this.lastScore);
    this.router.navigate(['highscore']);
  }

  private onScore(score: Score, events: Events) {
    this.lastScore = score;
    if (this.highscore === null || score.score > this.highscore.score) {
      this.highscore = score;
      events.highscore$.next(this.highscore);
    }
  }
}
