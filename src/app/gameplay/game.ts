import { BehaviorSubject } from 'rxjs';

import { Field } from './field';
import { ClearLines } from './clear-lines';
import { GameState } from './model';
import { Movement } from './movement';
import { Tetromino } from './tetromino';
import { Events } from './events';
import { RandomGenerator } from './random-generator';
import { ScoreCalculator } from '../scoring/score';


export class Game {

  public state$ = new BehaviorSubject<GameState>(GameState.NotStarted);

  public events: Events = new Events();

  public set playerName(name: string) {
    this.playerNameField = name;
    this.events.playerNameEntered$.next(name);
  }

  public get playerName() {
    return this.playerNameField;
  }

  public get state() {
    return this.state$.value;
  }

  public get preview() {
    return this.randomGenerator.preview;
  }

  public get fieldData() {
    return this.field.data;
  }

  public get fieldWidth() {
    return this.field.width;
  }

  public get fieldHeight() {
    return this.field.height;
  }

  public get ghostY() {
    return this.movement.ghostY;
  }

  public get stepTime() {
    return this.movement.stepTime;
  }

  public get timePerStep() {
    return this.movement.timePerStep;
  }

  public get gameSpeed() {
    return this.movement.gameSpeed;
  }

  public set gameSpeed(speed: number) {
    this.movement.gameSpeed = speed;
  }

  public tetromino: Tetromino;



  private field: Field;
  private randomGenerator: RandomGenerator;
  private movement: Movement;
  private lines: ClearLines;
  private score: ScoreCalculator;
  private playerNameField;


  constructor() {
    this.init();
  }

  public start() {
    if (!(this.state === GameState.NotStarted)) { return; }
    if (!this.playerName) { return; }

    this.init();

    this.setState(GameState.Running);
    this.tetromino.spawnNew();

    this.events.gameStarted$.next(this.playerName);
  }

  public pause() {
    if (this.state !== GameState.Running) { return; }
    this.setState(GameState.Paused);
    this.events.paused$.next();
  }

  public continue() {
    if (this.state !== GameState.Paused) { return; }
    this.setState(GameState.Running);
    this.events.continued$.next();
  }

  public stop() {
    this.setState(GameState.Paused);
  }

  public gameOver() {
    this.setState(GameState.GameOver);
  }

  public rotateClockwise() {
    if (this.state !== GameState.Running) { return; }

    this.movement.rotate();
  }

  public moveRight(ellapsedTimeMs: number, isFirstEvent: boolean = false) {
    if (this.state !== GameState.Running) { return; }
    this.movement.moveRight(ellapsedTimeMs, isFirstEvent);
  }

  public moveLeft(ellapsedTimeMs: number, isFirstEvent: boolean = false) {
    if (this.state !== GameState.Running) { return; }
    this.movement.moveLeft(ellapsedTimeMs, isFirstEvent);
  }

  public moveDownFast(ellapsedTimeMs: number) {
    if (this.state !== GameState.Running) { return; }

    this.movement.moveDownFast(ellapsedTimeMs);
  }

  public drop() {
    if (this.state !== GameState.Running) { return; }

    this.movement.drop();
    this.tetromino.lock();
    this.lines.clearLines();
    this.tetromino.spawnNew();

    this.events.tetrominoDropped$.next();

  }

  public increaseSpeed(percent: number) {
    this.gameSpeed = this.gameSpeed - this.gameSpeed * (percent / 100);
  }

  public tick(ellapsedTime: number) {

    if (this.state !== GameState.Running) {
      return;
    }

    if (!this.movement.tryMoveDown(ellapsedTime)) {

      if (this.tetromino.y > 0) {

            this.tetromino.lock();
            this.lines.clearLines();
            this.tetromino.spawnNew();

            this.events.tetrominoHit$.next();

      } else {
        this.setState(GameState.GameOver);
        this.events.gameOver$.next();
      }
    }

    this.score.tick(ellapsedTime);
  }

  private setState(newState: GameState) {
    this.state$.next(newState);
  }

  private init() {
    this.field = new Field();
    this.randomGenerator = new RandomGenerator();
    this.tetromino = new Tetromino(this.randomGenerator, this.field, this.events);
    this.movement = new Movement(this.tetromino, this.field, this.events);
    this.lines = new ClearLines(this.field, this.events);
    this.score = new ScoreCalculator(this.events);
  }
}
