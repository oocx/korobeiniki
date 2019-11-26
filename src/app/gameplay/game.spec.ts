import { TestBed } from '@angular/core/testing';
import { flatMap } from 'lodash-es';

import { Game } from './game';
import { GameState } from './model';
import { RandomGenerator } from './random-generator';

describe('GameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  describe('when a new game is created', () => {

    let game: Game;
    beforeAll(() => {
      game = new Game();
      game.playerName = 'unit test';
    });

    it('state should be NotStarted', () => {
      expect(game.state).toBe(GameState.NotStarted);
    });

    it('state should initialize a 10x22 field', () => {
      expect(game.fieldData.length).toBe(22);
      game.fieldData.forEach(row => expect(row.length).toBe(10));
    });
  });

  describe('when a game is started', () => {

    let game: Game;
    let gameStarted$count = 0;
    let tetrominoSpawned$count = 0;


    beforeAll(() => {
      game = new Game();
      game.playerName = 'unit test';
      game.events.gameStarted$.subscribe(() => gameStarted$count++);
      game.events.tetrominoSpawned$.subscribe(() => tetrominoSpawned$count++);
      game.start();
    });

    it('should raise a gameStarted event', () => {
      expect(gameStarted$count).toBe(1);
    });

    it('should set the state to Running', () => {
      expect(game.state).toBe(GameState.Running);
    });

    it('should start with initial step time of 1000', () => {
      expect(game.stepTime).toBe(1000);
    });

    it('should return a preview element', () => {
      expect(game.preview).not.toBeNull();
      expect(game.preview.blocks.length).toBe(4);
    });

    it('should spawn a tetromino at position 5,0', () => {
      expect(tetrominoSpawned$count).toBe(1);
      expect(game.tetromino.x).toBe(5);
      expect(game.tetromino.y).toBe(0);
    });
  });

  describe('when the game runs for 500ms', () => {

    let game: Game;
    let moved$count = 0;

    beforeAll(() => {
      game = new Game();
      game.playerName = 'unit test';
      game.events.moved$.subscribe(() => moved$count++);
      game.start();
      tick(game, 500);
    });

    it('should not move the tetromino yet', () => {
      expect(moved$count).toBe(0);
      expect(game.tetromino.y).toBe(0);
    });
  });

  describe('when the game runs for 2500ms', () => {

    let game: Game;
    let moved$count = 0;

    beforeAll(() => {
      game = new Game();
      game.playerName = 'unit test';
      game.events.moved$.subscribe(() => moved$count++);
      game.start();
      tick(game, 2500);
    });

    it('should move the tetromino two blocks down', () => {
      expect(moved$count).toBe(2);
      expect(game.tetromino.y).toBe(2);
    });
  });

  describe('when the game runs for 21000ms', () => {

    let game: Game;
    let moved$count = 0;
    let tetrominoHit$count = 0;
    let tetrominoSpawned$count = 0;

    beforeAll(() => {
      game = new Game();
      game.playerName = 'unit test';
      game.events.moved$.subscribe(() => moved$count++);
      game.events.tetrominoHit$.subscribe(() => tetrominoHit$count++);
      game.events.tetrominoSpawned$.subscribe(() => tetrominoSpawned$count++);
      game.start();
      tick(game, 21000);
    });

    it('should move the tetromino all the way down', () => {
      expect(moved$count).toBe(20);
      expect(game.tetromino.y).toBe(20);
    });

    it('should not yet have spawned a second tetromino', () => {
      expect(tetrominoSpawned$count).toBe(1);
    });

    it('should not yet raise a hit event', () => {
      expect(tetrominoHit$count).toBe(0);
    });

  });

  describe('when the game runs for 22000ms', () => {

    let game: Game;
    let moved$count = 0;
    let tetrominoHit$count = 0;
    let tetrominoSpawned$count = 0;

    beforeAll(() => {
      RandomGenerator.random = () => 0; // always return 0, so that we konw the order of new tetrominos
      game = new Game();
      game.playerName = 'unit test';
      game.events.moved$.subscribe(() => moved$count++);
      game.events.tetrominoHit$.subscribe(() => tetrominoHit$count++);
      game.events.tetrominoSpawned$.subscribe(() => tetrominoSpawned$count++);
      game.start();
      tick(game, 22000);
    });

    it('should move the tetromino all the way down', () => {
      expect(moved$count).toBe(20);
    });

    it('should have spawned a second tetromino at 5,0', () => {
      expect(tetrominoSpawned$count).toBe(2);
      expect(game.tetromino.x).toBe(5);
      expect(game.tetromino.y).toBe(0);
    });

    it('should raise a hit event', () => {
      expect(tetrominoHit$count).toBe(1);
    });

    it('should leave four blocks in the field', () => {
      const field = game.fieldData;
      const blocks = flatMap(field).filter(block => block.type !== null);

      expect(blocks.length).toBe(4);
      expect(field[21][5].type).toBe('cyan');
      expect(field[21][6].type).toBe('cyan');
      expect(field[21][7].type).toBe('cyan');
      expect(field[21][8].type).toBe('cyan');
    });

  });

  describe('when increasing the step time', () => {
    let game: Game;


    beforeAll(() => {
      RandomGenerator.random = () => 0; // always return 0, so that we konw the order of new tetrominos
      game = new Game();
      game.playerName = 'unit test';
      game.start();
    });

    it('should correctly increase step tiems', () => {
      // console.log(game.timePerStep + ' ' + game.stepTime + ' ' + game.gameSpeed + ' ' + (1000 / game.stepTime * 100));
      expect(game.gameSpeed).toBe(1);

      game.increaseSpeed(3);
      // console.log(game.timePerStep + ' ' + game.stepTime + ' ' + game.gameSpeed + ' ' + (1000 / game.stepTime * 100));
      expect(game.gameSpeed).toBe(0.97);


      game.increaseSpeed(3);
      // console.log(game.timePerStep + ' ' + game.stepTime + ' ' + game.gameSpeed + ' ' + (1000 / game.stepTime * 100));
      expect(game.gameSpeed).toBe(0.9409);
    });

  });

});

function tick(game: Game, ellapsedTimeMs: number) {
  while (ellapsedTimeMs > 0) {
    const tickTime = Math.min(ellapsedTimeMs, 16);
    ellapsedTimeMs -= tickTime;
    game.tick(tickTime);
  }
}
