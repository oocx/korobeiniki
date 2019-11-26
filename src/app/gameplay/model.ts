
export interface Block {
  x: number;
  y: number;
}

export interface OtherBlock extends Block {
  color: string;
}

export interface TetrominoType {
  blocks: Block[];
  size: 0 | 3 | 4;
  wallKickData: number[][][];
}

export const jlstzWallKickData = [
  /* 0 -> R */ [ [ 0, 0 ], [ -1, 0 ], [ -1, 1 ], [ 0, -2 ], [ -1, -2 ] ],
  /* R -> 2 */ [ [ 0, 0 ], [ 1, 0 ], [ 1, -1 ], [ 0, 2 ], [ 1, 2 ] ],
  /* 2 -> L */ [ [ 0, 0 ], [ 1, 0 ], [ 1, 1 ], [ 0, -2 ], [ 1, -2 ] ],
  /* 0 -> R */ [ [ 0, 0 ], [ -1, 0 ], [ -1, -1 ], [ 0, 2 ], [ -1, 2 ] ],
];

export const iWallKickData = [
  /* 0 -> R */ [ [ 0, 0 ], [ -2, 0 ], [ 1, 0 ], [ -2, -1 ], [ 1, 2 ] ],
  /* R -> 2 */ [ [ 0, 0 ], [ -1, 0 ], [ 2, 0 ], [ -1, 2 ], [ 2, -1 ] ],
  /* 2 -> L */ [ [ 0, 0 ], [ 2, 0 ], [ -1, 0 ], [ 2, 1 ], [ -1, -2 ] ],
  /* 0 -> R */ [ [ 0, 0 ], [ 1, 0 ], [ -2, -0 ], [ 1, -2 ], [ -2, 1 ] ],
];

export const blockTypes: TetrominoType[] = [
  {
    blocks: [
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
    ],
    size: 4,
    wallKickData: iWallKickData
  },
  {
    blocks: [
      { x: 0, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
    ],
    size: 3,
    wallKickData: jlstzWallKickData
  },
  {
    blocks: [
                                      { x: 2, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
    ],
    size: 3,
    wallKickData: jlstzWallKickData
  },
  {
    blocks: [
      { x: 1, y: 0 }, { x: 2, y: 0 },
      { x: 1, y: 1 }, { x: 2, y: 1 },
    ],
    size: 0,
    wallKickData: null
  },
  {
    blocks: [
                      { x: 1, y: 0 }, { x: 2, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 },
    ],
    size: 3,
    wallKickData: jlstzWallKickData
  },
  {
    blocks: [
                      { x: 1, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
    ],
    size: 3,
    wallKickData: jlstzWallKickData
  },
  {
    blocks: [
      { x: 0, y: 0 }, { x: 1, y: 0 },
                      { x: 1, y: 1 }, { x: 2, y: 1 }
    ],
    size: 3,
    wallKickData: jlstzWallKickData
  },
];

export const tetrominoColors = [
  'cyan', 'blue', 'orange', 'yellow', 'green', 'magenta', 'red', 'lime'
];

export enum GameState  {
  NotStarted, Running, Paused, GameOver
}

export type FieldData = string[][];

export interface Score {
  score: number;
  lines: number;
  level: number;
  gameTimeMs: number;
  timestamp: Date;
  playerName?: string;
}

export interface BlockData {
  x: number;
  y: number;
  px: number;
  py: number;
  type: string;
  changed?: () => void;
}
