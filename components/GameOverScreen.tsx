import React from 'react';
import { Player } from '../types';
import { StarIcon } from './icons/Icons';

interface GameOverScreenProps {
  winners: Player[];
  players: Player[];
  resetGame: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ winners, players, resetGame }) => {
  const sortedPlayers = [...players].sort((a, b) => b.assholeCount - a.assholeCount);
  const topScore = winners.length > 0 ? winners[0].assholeCount : 0;

  const getGameOverTitle = () => {
    if (topScore === 0) {
      return "Wow, a game with no assholes!";
    }
    if (winners.length > 1) {
      return "It's a tie for biggest asshole!";
    }
    return "And the biggest asshole is...";
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-700/50 flex flex-col items-center text-center animate-fade-in text-white w-full max-w-md">
      <h2 className="text-4xl font-bold mb-2">Game Over!</h2>
      <p className="text-xl text-pink-400 font-semibold mb-6">{getGameOverTitle()}</p>
      
      <div className="w-full space-y-3">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex justify-between items-center p-3 rounded-lg ${
              player.assholeCount === topScore && topScore > 0 ? 'bg-pink-500/20 border-2 border-pink-500' : 'bg-gray-700/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`font-bold text-lg ${player.assholeCount === topScore && topScore > 0 ? 'text-pink-400' : 'text-gray-400'}`}>#{index + 1}</span>
              {player.assholeCount === topScore && topScore > 0 && (
                <span className="text-yellow-400 w-5 h-5 blinking-star"><StarIcon /></span>
              )}
              <p className={`font-bold ${player.assholeCount === topScore && topScore > 0 ? 'text-3xl text-white' : 'text-xl text-gray-200'}`}>
                {player.name}
              </p>
            </div>
            <p className={`font-bold text-2xl ${player.assholeCount === topScore && topScore > 0 ? 'text-white' : 'text-gray-300'}`}>
              {player.assholeCount}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="mt-8 w-full max-w-xs py-4 text-xl font-bold text-white bg-pink-500 rounded-lg shadow-lg shadow-pink-500/40 hover:bg-pink-600 hover:scale-105 transform transition-all"
      >
        Start New Game
      </button>
    </div>
  );
};

export default GameOverScreen;