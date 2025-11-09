import React, { useState, useEffect, useCallback } from 'react';
import { Player, GameState } from './types';
import { cardsNsfw } from './data/cards';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import JudgingScreen from './components/JudgingScreen';
import GameOverScreen from './components/GameOverScreen';
import LogoHeader from './components/LogoHeader';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<Player[]>([
    { id: Date.now(), name: '', assholeCount: 0 },
    { id: Date.now() + 1, name: '', assholeCount: 0 },
  ]);
  const [gameDuration, setGameDuration] = useState(300); // default 5 minutes
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentJudgeIndex, setCurrentJudgeIndex] = useState(1);
  const [currentCard, setCurrentCard] = useState('');
  const [usedCards, setUsedCards] = useState<string[]>([]);
  const [winners, setWinners] = useState<Player[]>([]);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const endGame = useCallback(() => {
    setGameState('gameOver');
    const maxScore = Math.max(...players.map(p => p.assholeCount), 0);
    
    if (maxScore === 0) {
      setWinners([]);
    } else {
      setWinners(players.filter(p => p.assholeCount === maxScore));
    }
  }, [players]);


  useEffect(() => {
    if (gameState === 'playerTurn' || gameState === 'judging') {
      if (timeLeft <= 0) {
        endGame();
        return;
      }
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, endGame]);

  const addPlayer = () => {
    setPlayers(prev => [...prev, { id: Date.now(), name: '', assholeCount: 0 }]);
  };

  const removePlayer = (id: number) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const updatePlayerName = (id: number, name: string) => {
    setPlayers(prev => prev.map(p => (p.id === id ? { ...p, name } : p)));
  };

  const getNextCard = useCallback(() => {
    const currentDeck = cardsNsfw;
    const availableCards = currentDeck.filter(card => !usedCards.includes(card));
    if (availableCards.length === 0) {
      // All cards used, reset and get a new one
      const newCard = currentDeck[Math.floor(Math.random() * currentDeck.length)];
      setUsedCards([newCard]);
      return newCard;
    }
    const newCard = availableCards[Math.floor(Math.random() * availableCards.length)];
    setUsedCards(prev => [...prev, newCard]);
    return newCard;
  }, [usedCards]);

  const startGame = () => {
    setTimeLeft(gameDuration);
    setPlayers(p => p.map(player => ({ ...player, assholeCount: 0 })));
    setCurrentPlayerIndex(0);
    setCurrentJudgeIndex(1 % players.length);
    setCurrentCard(getNextCard());
    setGameState('playerTurn');
  };

  const finishTurn = () => {
    setGameState('judging');
  };

  const handleJudgment = (isAsshole: boolean) => {
    if (isAsshole) {
      setPlayers(prev =>
        prev.map((p, index) =>
          index === currentPlayerIndex ? { ...p, assholeCount: p.assholeCount + 1 } : p
        )
      );
    }

    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);
    setCurrentJudgeIndex((nextPlayerIndex + 1) % players.length);
    setCurrentCard(getNextCard());
    setGameState('playerTurn');
  };

  const resetGame = () => {
    setGameState('setup');
    setPlayers([
      { id: Date.now(), name: '', assholeCount: 0 },
      { id: Date.now() + 1, name: '', assholeCount: 0 },
    ]);
    setGameDuration(300);
    setUsedCards([]);
    setCurrentCard('');
    setWinners([]);
  };
  
  useEffect(() => {
    if (gameState === 'setup') {
      setTimeLeft(gameDuration);
    }
  }, [gameDuration, gameState]);


  const renderContent = () => {
    switch (gameState) {
      case 'setup':
        return (
          <SetupScreen
            players={players}
            addPlayer={addPlayer}
            removePlayer={removePlayer}
            updatePlayerName={updatePlayerName}
            startGame={startGame}
            gameDuration={gameDuration}
            setGameDuration={setGameDuration}
          />
        );
      case 'playerTurn':
        if (!players[currentPlayerIndex]) return null;
        return (
          <GameScreen
            player={players[currentPlayerIndex]}
            cardText={currentCard}
            finishTurn={finishTurn}
          />
        );
      case 'judging':
        if (!players[currentJudgeIndex] || !players[currentPlayerIndex]) return null;
        return (
          <JudgingScreen
            judge={players[currentJudgeIndex]}
            playerInQuestion={players[currentPlayerIndex]}
            handleJudgment={handleJudgment}
          />
        );
      case 'gameOver':
        return (
          <GameOverScreen
            winners={winners}
            players={players}
            resetGame={resetGame}
          />
        );
      default:
        return <div>Loading...</div>;
    }
  };
  
  const SplashScreen = () => (
    <div className="flex flex-col items-center justify-center animate-fade-in">
        <h1 className="font-logo text-white text-8xl sm:text-9xl tracking-wider animate-pulse">AITA?</h1>
        <p className="text-pink-400 text-lg sm:text-xl font-semibold tracking-widest uppercase">Card Game</p>
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-pink-900/40 to-transparent pointer-events-none"></div>

      {!isLoading && (
         <LogoHeader
          gameState={gameState}
          timeLeft={timeLeft}
          resetGame={resetGame}
          cardText={currentCard}
          player={players[currentPlayerIndex] || players[0]}
        />
      )}

      <main className="w-full max-w-lg mx-auto flex items-center justify-center flex-grow pt-24 pb-8 z-10">
        {isLoading ? <SplashScreen /> : renderContent()}
      </main>
    </div>
  );
}

export default App;
