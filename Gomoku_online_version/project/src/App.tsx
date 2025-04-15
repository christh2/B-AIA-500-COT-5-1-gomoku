import React, { useState, useCallback, useEffect } from 'react';
import { Brain, Trophy } from 'lucide-react';
import { Board } from './components/Board';
import { Settings } from './components/Settings';
import { GameSettings, Board as BoardType, Position, GameState, Player, GameStats, Difficulty } from './types';
import { findBestMove, checkWinner, checkDraw } from './utils/ai';
import clsx from 'clsx';

const DEFAULT_SETTINGS: GameSettings = {
  boardSize: 15,
  playerColor: '#000000',
  aiColor: '#3B82F6',
  gridColor: '#E5E7EB',
  theme: 'dark',
};

const DEFAULT_STATS: GameStats = {
  playerWins: 0,
  aiWins: 0,
  currentLevel: 1,
  winsNeededForNextLevel: 2,
};

const WINS_PER_LEVEL = 2;

function App() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [board, setBoard] = useState<BoardType>(() => 
    Array(settings.boardSize).fill(null).map(() => Array(settings.boardSize).fill(null))
  );
  const [gameState, setGameState] = useState<GameState>('playing');
  const [winner, setWinner] = useState<Player>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastMove, setLastMove] = useState<Position | null>(null);

  // Réinitialiser le plateau quand la taille change
  useEffect(() => {
    setBoard(Array(settings.boardSize).fill(null).map(() => Array(settings.boardSize).fill(null)));
    setGameState('playing');
    setWinner(null);
    setLastMove(null);
  }, [settings.boardSize]);

  // Mettre à jour les statistiques après une victoire
  const updateStats = useCallback((winner: Player) => {
    setStats(prevStats => {
      const newStats = { ...prevStats };
      
      if (winner === 'player') {
        newStats.playerWins++;
        
        // Vérifier si le joueur peut passer au niveau suivant
        if (newStats.playerWins % WINS_PER_LEVEL === 0 && newStats.currentLevel < 5) {
          newStats.currentLevel = (newStats.currentLevel + 1) as Difficulty;
          newStats.winsNeededForNextLevel = WINS_PER_LEVEL;
        } else {
          newStats.winsNeededForNextLevel = WINS_PER_LEVEL - (newStats.playerWins % WINS_PER_LEVEL);
        }
      } else if (winner === 'ai') {
        newStats.aiWins++;
      }
      
      return newStats;
    });
  }, []);

  // Tour de l'IA
  const aiMove = useCallback(async (currentBoard: BoardType) => {
    setIsThinking(true);
    // Simuler un temps de réflexion minimum
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const move = findBestMove(currentBoard, stats.currentLevel);
    const newBoard = currentBoard.map(row => [...row]);
    newBoard[move.row][move.col] = 'ai';
    setBoard(newBoard);
    setLastMove(move);
    
    const aiWinner = checkWinner(newBoard, move);
    if (aiWinner) {
      setGameState('won');
      setWinner(aiWinner);
      updateStats(aiWinner);
    } else if (checkDraw(newBoard)) {
      setGameState('draw');
    }
    
    setIsThinking(false);
  }, [stats.currentLevel, updateStats]);

  // Gérer le clic sur une cellule
  const handleCellClick = useCallback((position: Position) => {
    if (gameState !== 'playing' || board[position.row][position.col] !== null || isThinking) return;

    // Créer une nouvelle copie du plateau avec le coup du joueur
    const newBoard = board.map(row => [...row]);
    newBoard[position.row][position.col] = 'player';
    
    // Mettre à jour le plateau et la dernière position
    setBoard(newBoard);
    setLastMove(position);

    // Vérifier si le joueur a gagné
    const playerWinner = checkWinner(newBoard, position);
    if (playerWinner) {
      setGameState('won');
      setWinner(playerWinner);
      updateStats(playerWinner);
    } else if (checkDraw(newBoard)) {
      setGameState('draw');
    } else {
      // Si le jeu continue, l'IA joue son tour
      aiMove(newBoard);
    }
  }, [board, gameState, isThinking, aiMove, updateStats]);

  // Réinitialiser le jeu
  const resetGame = useCallback(() => {
    setBoard(Array(settings.boardSize).fill(null).map(() => Array(settings.boardSize).fill(null)));
    setGameState('playing');
    setWinner(null);
    setLastMove(null);
  }, [settings.boardSize]);

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-300 px-4',
      settings.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    )}>
      <div className="max-w-6xl mx-auto py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Brain size={32} className="text-blue-500" />
            <h1 className="text-3xl font-bold">Gomoku AI Challenge</h1>
          </div>

          <div className="mt-4 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-gray-500">Niveau actuel</p>
              <p className="text-2xl font-bold text-blue-500">{stats.currentLevel}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Victoires pour niveau {Math.min(stats.currentLevel + 1, 5)}</p>
              <p className="text-2xl font-bold">{stats.winsNeededForNextLevel}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-2xl">
                <span className="text-green-500">{stats.playerWins}</span>
                <span className="mx-2">-</span>
                <span className="text-blue-500">{stats.aiWins}</span>
              </p>
            </div>
          </div>

          {gameState !== 'playing' && (
            <div className="mt-4 space-y-4">
              <p className="text-xl">
                {gameState === 'won' 
                  ? `${winner === 'player' ? 'Vous avez' : "L'IA a"} gagné !` 
                  : 'Match nul !'}
              </p>
              <button
                onClick={resetGame}
                className={clsx(
                  'px-6 py-2 rounded-full font-medium transition-colors duration-300',
                  settings.theme === 'dark' 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                )}
              >
                Nouvelle partie
              </button>
            </div>
          )}
          {isThinking && (
            <p className="mt-4 text-blue-500 animate-pulse">L'IA réfléchit...</p>
          )}
        </header>

        <div className="max-w-2xl mx-auto">
          <Board
            board={board}
            settings={settings}
            onCellClick={handleCellClick}
            disabled={isThinking || gameState !== 'playing'}
          />
        </div>
      </div>

      <Settings
        settings={settings}
        onSettingsChange={setSettings}
        isOpen={isSettingsOpen}
        onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
      />
    </div>
  );
}

export default App;