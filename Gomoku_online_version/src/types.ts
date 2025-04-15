export type Player = 'player' | 'ai' | null;
export type Board = Player[][];
export type Position = { row: number; col: number };
export type GameState = 'playing' | 'won' | 'draw';
export type Theme = 'dark' | 'light';
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface GameSettings {
  boardSize: number;
  playerColor: string;
  aiColor: string;
  gridColor: string;
  theme: Theme;
}

export interface GameStats {
  playerWins: number;
  aiWins: number;
  currentLevel: Difficulty;
  winsNeededForNextLevel: number;
}