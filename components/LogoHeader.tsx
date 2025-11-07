
import React, { useState } from 'react';
import { GameState, Player } from '../types';
import { ClockIcon, ShareIcon, RestartIcon } from './icons/Icons';

interface LogoHeaderProps {
  gameState: GameState;
  timeLeft: number;
  resetGame: () => void;
  cardText: string;
  player: Player;
}

const LogoHeader: React.FC<LogoHeaderProps> = ({ gameState, timeLeft, resetGame, cardText, player }) => {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    const url = window.location.origin;
    let shareText = `Hey, check out this hilarious party game I found!`;

    if (gameState === 'playerTurn' && cardText && player) {
      const processedCardText = cardText.replace(/%%/g, player.name);
      shareText = `Who's the a*shole in this situation? "${processedCardText}". Let's play and find out!`;
    }
    
    const fullMessage = `${shareText}\n\n${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AITA? Card Game',
          text: shareText,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(fullMessage);
        setCopyStatus('Link Copied!');
        setTimeout(() => setCopyStatus(null), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        setCopyStatus('Failed to Copy');
        setTimeout(() => setCopyStatus(null), 2000);
      }
    }
  };

  const handleRestartClick = () => {
    setIsRestartModalOpen(true);
  };

  const confirmRestart = () => {
    resetGame();
    setIsRestartModalOpen(false);
  };
  
  const showGameControls = gameState !== 'setup';

  return (
    <>
      <header 
        className="absolute top-0 left-0 right-0 px-4 sm:px-8 pb-3 flex items-center justify-between w-full z-10 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/60"
        style={{ paddingTop: `calc(0.75rem + env(safe-area-inset-top))` }}
      >
        
        <div className="flex items-baseline gap-3">
          <h1 className="font-logo text-white text-3xl sm:text-4xl tracking-wider">AITA?</h1>
          <p className="text-pink-400 text-xs sm:text-sm font-semibold tracking-widest uppercase pb-1">Card Game</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {showGameControls && (
            <>
              <button 
                onClick={handleRestartClick}
                className="p-2 text-gray-300 bg-gray-700/80 rounded-full hover:bg-gray-600/80 transition-colors"
                aria-label="Restart Game"
              >
                <RestartIcon />
              </button>
              <div className="flex items-center gap-2 bg-gray-800/50 text-white font-semibold px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base">
                <ClockIcon />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </>
          )}
          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 text-base sm:text-lg font-bold text-white bg-pink-500 rounded-full shadow-lg shadow-pink-500/40 hover:bg-pink-600 hover:scale-105 transform transition-all"
              aria-label="Share Game"
            >
              <ShareIcon />
              <span className="hidden sm:inline">Share Game</span>
            </button>
            {copyStatus && (
              <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                {copyStatus}
              </span>
            )}
          </div>
        </div>
      </header>
      
      {isRestartModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700/50 text-center max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">Confirm Restart</h2>
            <p className="text-gray-300 mb-8">Are you sure you want to restart the game? All progress will be lost.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsRestartModalOpen(false)}
                className="px-8 py-3 text-lg font-semibold text-gray-200 bg-gray-600/80 rounded-lg hover:bg-gray-500/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRestart}
                className="px-8 py-3 text-lg font-bold text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoHeader;
