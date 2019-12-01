import { Field } from './field';
import { ClearLines } from './clear-lines';
import { GameState } from './model';
import { Movement } from './movement';
import { Tetromino } from './tetromino';
import { Events } from './events';
import { RandomGenerator } from './random-generator';
import { ScoreCalculator } from './score-calculator';


export class Game {

  public events: Events = new Events();

  public set playerName(name: string) {
    this.playerNameField = name;
    this.events.playerNameEntered$.next(name);
  }

  public get playerName() {
    return this.playerNameField;
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

  public get state() {
    return this.gameState;
  }

  public get tetromino() {
    return this.tetrominoValue;
  }

  private tetrominoValue: Tetromino;
  private field: Field;
  private randomGenerator: RandomGenerator;
  private movement: Movement;
  private lines: ClearLines;
  private score: ScoreCalculator;
  private playerNameField: string;
  private gameState = GameState.NotStarted;

  constructor() {
    this.init();
  }

  public start() {
    if (!(this.gameState === GameState.NotStarted)) { return; }
    if (!this.playerName) { return; }

    this.init();

    this.gameState = GameState.Running;
    this.tetromino.spawnNew();

    this.events.gameStarted$.next(this.playerName);
  }

  public pause() {
    if (this.gameState !== GameState.Running) { return; }
    this.gameState = GameState.Paused;
    this.events.paused$.next();
  }

  public continue() {
    if (this.gameState !== GameState.Paused) { return; }
    this.gameState = GameState.Running;
    this.events.continued$.next();
  }

  public stop() {
    this.gameState = GameState.Paused;
  }

  public gameOver() {
    this.gameState = GameState.GameOver;
  }

  public rotateClockwise() {
    if (this.gameState !== GameState.Running) { return; }

    this.movement.rotate();
  }

  public moveRight(ellapsedTimeMs: number, isFirstEvent: boolean = false) {
    if (this.gameState !== GameState.Running) { return; }
    this.movement.moveRight(ellapsedTimeMs, isFirstEvent);
  }

  public moveLeft(ellapsedTimeMs: number, isFirstEvent: boolean = false) {
    if (this.gameState !== GameState.Running) { return; }
    this.movement.moveLeft(ellapsedTimeMs, isFirstEvent);
  }

  public moveDownFast(ellapsedTimeMs: number) {
    if (this.gameState !== GameState.Running) { return; }

    this.movement.moveDownFast(ellapsedTimeMs);
  }

  public drop() {
    if (this.gameState !== GameState.Running) { return; }

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

    if (this.gameState !== GameState.Running) {
      return;
    }

    if (!this.movement.tryMoveDown(ellapsedTime)) {

      if (this.tetromino.y > 0) {

            this.tetromino.lock();
            this.lines.clearLines();
            this.tetromino.spawnNew();

            this.events.tetrominoHit$.next();

      } else {
        this.gameState = GameState.GameOver;
        this.events.gameOver$.next();
      }
    }

    this.score.tick(ellapsedTime);
  }
  private init() {
    this.field = new Field();
    this.randomGenerator = new RandomGenerator();
    this.tetrominoValue = new Tetromino(this.randomGenerator, this.field, this.events);
    this.movement = new Movement(this.tetromino, this.field, this.events);
    this.lines = new ClearLines(this.field, this.events);
    this.score = new ScoreCalculator(this.events);
  }
}
