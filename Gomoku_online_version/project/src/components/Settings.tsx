import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, X } from 'lucide-react';
import { GameSettings, Theme } from '../types';
import clsx from 'clsx';

interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const BOARD_SIZES = [10, 15, 19];
const COLORS = [
  { name: 'Noir', value: '#000000' },
  { name: 'Bleu', value: '#3B82F6' },
  { name: 'Rouge', value: '#EF4444' },
  { name: 'Vert', value: '#10B981' },
];

export function Settings({ settings, onSettingsChange, isOpen, onToggle }: SettingsProps) {
  return (
    <>
      <button
        onClick={onToggle}
        className={clsx(
          'fixed top-4 right-4 p-2 rounded-full transition-colors duration-300',
          settings.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800',
          'hover:scale-110 transform transition-transform'
        )}
      >
        <SettingsIcon size={24} />
      </button>

      {isOpen && (
        <div className={clsx(
          'fixed inset-y-0 right-0 w-80 p-6 shadow-xl transition-colors duration-300',
          settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        )}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Paramètres</h2>
            <button
              onClick={onToggle}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Taille du plateau</label>
              <select
                value={settings.boardSize}
                onChange={(e) => onSettingsChange({ ...settings, boardSize: Number(e.target.value) })}
                className={clsx(
                  'w-full p-2 rounded',
                  settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                )}
              >
                {BOARD_SIZES.map(size => (
                  <option key={size} value={size}>{size}x{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Couleur du joueur</label>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map(color => (
                  <button
                    key={color.value}
                    className={clsx(
                      'w-full aspect-square rounded-full border-2',
                      settings.playerColor === color.value ? 'border-blue-500' : 'border-transparent'
                    )}
                    style={{ backgroundColor: color.value }}
                    onClick={() => onSettingsChange({ ...settings, playerColor: color.value })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Couleur de l'IA</label>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map(color => (
                  <button
                    key={color.value}
                    className={clsx(
                      'w-full aspect-square rounded-full border-2',
                      settings.aiColor === color.value ? 'border-blue-500' : 'border-transparent'
                    )}
                    style={{ backgroundColor: color.value }}
                    onClick={() => onSettingsChange({ ...settings, aiColor: color.value })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Thème</label>
              <button
                onClick={() => onSettingsChange({
                  ...settings,
                  theme: settings.theme === 'dark' ? 'light' : 'dark'
                })}
                className={clsx(
                  'w-full p-2 rounded flex items-center justify-center gap-2',
                  settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                )}
              >
                {settings.theme === 'dark' ? (
                  <>
                    <Sun size={20} /> Mode clair
                  </>
                ) : (
                  <>
                    <Moon size={20} /> Mode sombre
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}