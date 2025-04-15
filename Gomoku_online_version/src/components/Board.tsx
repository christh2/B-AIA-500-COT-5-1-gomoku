import React from 'react';
import { Board as BoardType, GameSettings, Position } from '../types';
import clsx from 'clsx';

interface BoardProps {
  board: BoardType;
  settings: GameSettings;
  onCellClick: (position: Position) => void;
  disabled: boolean;
}

export function Board({ board, settings, onCellClick, disabled }: BoardProps) {
  return (
    <div 
      className={clsx(
        'grid p-4 rounded-lg shadow-xl transition-colors duration-300',
        settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
      )}
      style={{
        gridTemplateColumns: `repeat(${settings.boardSize}, minmax(0, 1fr))`,
        gap: '1px',
        background: settings.gridColor,
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            className={clsx(
              'aspect-square relative transition-all duration-200',
              settings.theme === 'dark' ? 'bg-gray-800' : 'bg-white',
              'disabled:cursor-not-allowed',
              cell === null && !disabled && 'hover:scale-95',
              // Ajouter des bordures pour créer la grille
              'border-[0.5px]',
              settings.theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
            )}
            disabled={cell !== null || disabled}
            onClick={() => onCellClick({ row: rowIndex, col: colIndex })}
          >
            {cell && (
              <div
                className="absolute inset-2 rounded-full shadow-lg transform transition-transform duration-300 animate-pop"
                style={{
                  backgroundColor: cell === 'player' ? settings.playerColor : settings.aiColor,
                }}
              />
            )}
          </button>
        ))
      )}
    </div>
  );
}