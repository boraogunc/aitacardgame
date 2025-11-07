
import React from 'react';
import { Player } from '../types';

interface JudgingScreenProps {
  judge: Player;
  playerInQuestion: Player;
  handleJudgment: (isAsshole: boolean) => void;
}

const JudgingScreen: React.FC<JudgingScreenProps> = ({ judge, playerInQuestion, handleJudgment }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-700/50 flex flex-col items-center text-center animate-fade-in text-white">
      <h2 className="text-3xl font-bold mb-4">
        Judge <span className="text-pink-400">{judge.name}</span>, the decision is yours!
      </h2>
      <p className="text-lg text-gray-400 mb-8">
        Was <span className="font-semibold text-white">{playerInQuestion.name}</span> an A*shole?
      </p>

      <div className="w-full flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleJudgment(true)}
          className="w-full py-6 text-xl font-bold text-white bg-pink-500 rounded-lg shadow-lg shadow-pink-900/40 hover:bg-pink-600 hover:scale-105 transform transition-all"
        >
          YOU'RE THE A*SHOLE
        </button>
        <button
          onClick={() => handleJudgment(false)}
          className="w-full py-6 text-xl font-bold text-white bg-pink-500 rounded-lg shadow-lg shadow-pink-900/40 hover:bg-pink-600 hover:scale-105 transform transition-all"
        >
          NOT THE A*SHOLE
        </button>
      </div>
    </div>
  );
};

export default JudgingScreen;
