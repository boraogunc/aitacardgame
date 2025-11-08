export interface Player {
  id: number;
  name: string;
  assholeCount: number;
}

export type GameState = 'setup' | 'playerTurn' | 'judging' | 'gameOver';