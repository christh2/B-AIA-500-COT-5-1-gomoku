import { Board, Position, Player, Difficulty } from '../types';

// Constantes pour l'évaluation
const SCORES = {
  FIVE: 1000000,    // Victoire
  OPEN_FOUR: 50000, // Quatre alignés avec espace libre
  FOUR: 10000,      // Quatre alignés bloqués
  OPEN_THREE: 5000, // Trois alignés avec espaces libres
  THREE: 1000,      // Trois alignés bloqués
  OPEN_TWO: 500,    // Deux alignés avec espaces libres
  TWO: 100,         // Deux alignés bloqués
  ONE: 10           // Une pièce
};

const DIRECTIONS = [
  [1, 0],  // horizontal
  [0, 1],  // vertical
  [1, 1],  // diagonal
  [1, -1]  // anti-diagonal
];

// Facteurs de difficulté qui influencent la précision de l'IA
const DIFFICULTY_FACTORS = {
  1: { threshold: 0.5, defenseWeight: 0.5 }, // Facile
  2: { threshold: 0.7, defenseWeight: 0.6 }, // Moyen
  3: { threshold: 0.8, defenseWeight: 0.7 }, // Difficile
  4: { threshold: 0.9, defenseWeight: 0.8 }, // Très difficile
  5: { threshold: 1.0, defenseWeight: 0.9 }  // Expert
};

// Évaluer une ligne dans une direction donnée
function evaluateLine(board: Board, row: number, col: number, player: 'player' | 'ai', dx: number, dy: number): number {
  let count = 1;
  let openEnds = 2;
  let score = 0;

  // Vérifier dans les deux directions
  for (const multiplier of [-1, 1]) {
    let x = row + dx * multiplier;
    let y = col + dy * multiplier;
    let tempCount = 0;

    while (
      x >= 0 && x < board.length &&
      y >= 0 && y < board.length
    ) {
      if (board[x][y] === player) {
        tempCount++;
      } else if (board[x][y] === null) {
        break;
      } else {
        openEnds--;
        break;
      }
      x += dx * multiplier;
      y += dy * multiplier;
    }

    if (x < 0 || x >= board.length || y < 0 || y >= board.length) {
      openEnds--;
    }

    count += tempCount;
  }

  // Attribuer un score basé sur le nombre de pièces alignées et les extrémités ouvertes
  if (count >= 5) score = SCORES.FIVE;
  else if (count === 4) score = openEnds === 2 ? SCORES.OPEN_FOUR : SCORES.FOUR;
  else if (count === 3) score = openEnds === 2 ? SCORES.OPEN_THREE : SCORES.THREE;
  else if (count === 2) score = openEnds === 2 ? SCORES.OPEN_TWO : SCORES.TWO;
  else if (count === 1) score = SCORES.ONE;

  return score;
}

// Évaluer une position pour un joueur
function evaluatePosition(board: Board, row: number, col: number, player: 'player' | 'ai'): number {
  let totalScore = 0;

  for (const [dx, dy] of DIRECTIONS) {
    totalScore += evaluateLine(board, row, col, player, dx, dy);
  }

  return totalScore;
}

// Trouver le meilleur coup en fonction du niveau de difficulté
export function findBestMove(board: Board, difficulty: Difficulty = 1): Position {
  const { threshold, defenseWeight } = DIFFICULTY_FACTORS[difficulty];
  let bestScore = -Infinity;
  let bestMove: Position = { row: 0, col: 0 };
  let moves: { pos: Position; score: number }[] = [];

  // Générer et évaluer tous les coups possibles
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === null) {
        // Simuler le coup
        board[i][j] = 'ai';
        
        // Évaluer le coup pour l'IA et le joueur
        const aiScore = evaluatePosition(board, i, j, 'ai');
        const playerScore = evaluatePosition(board, i, j, 'player');
        
        // Retirer le coup simulé
        board[i][j] = null;
        
        // Calculer le score total (attaque + défense) en fonction du niveau
        const totalScore = aiScore + playerScore * defenseWeight;
        
        moves.push({
          pos: { row: i, col: j },
          score: totalScore
        });

        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestMove = { row: i, col: j };
        }
      }
    }
  }

  // Filtrer les coups en fonction du niveau de difficulté
  const thresholdScore = bestScore * threshold;
  const validMoves = moves.filter(move => move.score >= thresholdScore);
  
  // Plus le niveau est bas, plus l'IA peut faire des erreurs
  return validMoves[Math.floor(Math.random() * validMoves.length)].pos;
}

// Vérifier s'il y a un gagnant
export function checkWinner(board: Board, lastMove: Position): Player {
  if (!lastMove) return null;
  
  const { row, col } = lastMove;
  const player = board[row][col];
  
  for (const [dx, dy] of DIRECTIONS) {
    let count = 1;
    
    // Vérifier dans les deux sens
    for (const multiplier of [-1, 1]) {
      let x = row + dx * multiplier;
      let y = col + dy * multiplier;
      
      while (
        x >= 0 && x < board.length &&
        y >= 0 && y < board.length &&
        board[x][y] === player
      ) {
        count++;
        x += dx * multiplier;
        y += dy * multiplier;
      }
    }
    
    if (count >= 5) return player;
  }
  
  return null;
}

// Vérifier s'il y a match nul
export function checkDraw(board: Board): boolean {
  return board.every(row => row.every(cell => cell !== null));
}