import React from 'react';
import { Player } from '../types';

interface GameScreenProps {
  player: Player;
  cardText: string;
  finishTurn: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ player, cardText, finishTurn }) => {

  const processedCardText = cardText.replace(/%%/g, player.name);

  return (
    <div className="flex flex-col items-center text-center animate-fade-in w-full px-2 sm:px-0">
      
      <div className="mb-8 px-4">
        <h2 className="text-2xl font-bold text-white">
          Your Turn, <span className="text-pink-400">{player.name}!</span>
        </h2>
        <p className="text-gray-400">Read the card and tell your story!</p>
      </div>
      
      <div className="w-full max-w-md" style={{ perspective: '1000px' }}>
        <div className="relative bg-gray-50 text-gray-900 p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-between min-h-[22rem] transition-transform transform-gpu"
             style={{ transform: 'rotateX(2deg) rotateY(-2deg)' }}>
          
          <div className="flex-grow flex items-center justify-center">
            <p className="text-xl font-semibold leading-relaxed">{processedCardText}</p>
          </div>

          <button
            onClick={finishTurn}
            className="w-full max-w-xs py-3 mt-6 text-xl font-bold text-white bg-pink-500 rounded-lg shadow-lg shadow-pink-500/40 hover:bg-pink-600 hover:scale-105 transform transition-all"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;