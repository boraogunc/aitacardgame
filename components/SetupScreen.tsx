import React from 'react';
import { Player } from '../types';
import { MIN_PLAYERS, MAX_PLAYERS } from '../constants';

interface SetupScreenProps {
  players: Player[];
  addPlayer: () => void;
  removePlayer: (id: number) => void;
  updatePlayerName: (id: number, name: string) => void;
  startGame: () => void;
  gameDuration: number;
  setGameDuration: (duration: number) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({
  players,
  addPlayer,
  removePlayer,
  updatePlayerName,
  startGame,
  gameDuration,
  setGameDuration,
}) => {
  const canStart = players.length >= MIN_PLAYERS && players.every(p => p.name.trim() !== '');

  const durationOptions = [
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
    { label: '20 min', seconds: 1200 },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-700/50 flex flex-col items-center animate-fade-in w-full">
      
      <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">
        Ready to find the biggest asshole?
      </h2>
      <p className="text-gray-400 text-center mb-6">Enter player names and select game time.</p>
      
      <div className="space-y-4 mb-6 w-full">
        {players.map((player, index) => (
          <div key={player.id} className="flex items-center gap-3">
            <input
              type="text"
              placeholder={`Player ${index + 1}`}
              value={player.name}
              onChange={(e) => updatePlayerName(player.id, e.target.value)}
              className="flex-grow px-4 py-3 rounded-lg bg-gray-900/70 border-2 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
            />
            {players.length > MIN_PLAYERS && (
              <button 
                onClick={() => removePlayer(player.id)}
                className="w-11 h-11 flex-shrink-0 bg-pink-500 text-white rounded-full hover:bg-pink-600 font-bold text-2xl flex items-center justify-center transition-colors shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50"
              >
                -
              </button>
            )}
          </div>
        ))}
      </div>

      {players.length < MAX_PLAYERS && (
        <button
          onClick={addPlayer}
          className="w-full mb-6 py-3 text-lg font-semibold text-pink-300 bg-transparent border-2 border-pink-500/50 rounded-lg hover:bg-pink-500/20 hover:text-white transition-colors"
        >
          + Add Player
        </button>
      )}

      <div className="mb-8 w-full">
        <p className="text-gray-400 text-center mb-3">Game Duration</p>
        <div className="grid grid-cols-3 gap-3">
          {durationOptions.map(opt => (
            <button
              key={opt.seconds}
              onClick={() => setGameDuration(opt.seconds)}
              className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                gameDuration === opt.seconds
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={startGame}
        disabled={!canStart}
        className="w-full py-4 text-xl font-bold text-white bg-pink-500 rounded-lg shadow-lg shadow-pink-500/40 hover:bg-pink-600 hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-gray-600 disabled:shadow-none"
      >
        {`Start Game (${players.length} players)`}
      </button>

      <div className="mt-8 pt-6 border-t border-gray-700/50 w-full">
        <h3 className="text-xl font-bold text-white text-center mb-5">How to Play</h3>
        <div className="space-y-4 text-gray-300 text-left text-base">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-pink-500 text-white font-bold rounded-full mt-0.5">1</div>
            <p className="flex-1">Read the card aloud and tell your story!</p>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-pink-500 text-white font-bold rounded-full mt-0.5">2</div>
            <p className="flex-1">The Judge decides if you're the asshole.</p>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-pink-500 text-white font-bold rounded-full mt-0.5">3</div>
            <p className="flex-1">At the end, find out who's the biggest asshole!</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 text-center mt-8">
          All rights reserved. Bora Ogunc. This game is intended for entertainment purposes only.
        </p>
      </div>

    </div>
  );
};

export default SetupScreen;