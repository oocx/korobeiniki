import { Injectable, ApplicationRef } from '@angular/core';

import { FirebaseService } from './firebase.service';
import { Score } from 'src/app/gameplay/model';
import { Events } from 'src/app/gameplay/events';
import { Game } from 'src/app/gameplay/game';

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

  private lastScore: Score = null;

  constructor(private appRef: ApplicationRef, private firebase: FirebaseService) {
  }

  public async getAllEntries(): Promise<Score[]> {
    const results = await this.firebase.firestore.collection(process.env.FIREBASE_COLLECTION).orderBy('score', 'desc').limit(10).get();
    const scores = results.docs.map(d => d.data() as Score);
    return scores;
  }

  private async registerGame(game: Game) {
    game.events.score$.subscribe(score => this.onScore(score, game.events));
    game.events.gameOver$.subscribe(() => this.onGameOver(game.playerName));
    game.events.highscore$.next(this.highscore);

    const lastHighScore = await this.firebase.firestore.collection(process.env.FIREBASE_COLLECTION).orderBy('score', 'desc').limit(1).get();

    if (lastHighScore.docs.length === 1) {
      this.highscore = lastHighScore.docs[0].data() as unknown as Score;
      game.events.highscore$.next(this.highscore);
      this.appRef.tick();
    }
  }

  private async onGameOver(playerName: string) {
    if (this.lastScore === null) { return; }

    await this.firebase.firestore.collection(process.env.FIREBASE_COLLECTION).add({ ...this.lastScore, playerName });
    this.lastScore = null;
  }

  private onScore(score: Score, events: Events) {
    this.lastScore = score;
    if (this.highscore === null || score.score > this.highscore.score) {
      this.highscore = score;
      events.highscore$.next(this.highscore);
    }
  }
}
