import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Player, GameState } from './types';
import { cards } from './data/cards';

import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import JudgingScreen from './components/JudgingScreen';
import GameOverScreen from './components/GameOverScreen';
import LogoHeader from './components/LogoHeader';

function App() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: '', assholeCount: 0 },
    { id: 2, name: '', assholeCount: 0 },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentJudgeIndex, setCurrentJudgeIndex] = useState(1);
  const [currentCard, setCurrentCard] = useState('');
  const [shuffledCards, setShuffledCards] = useState<string[]>([]);
  const [cardIndex, setCardIndex] = useState(0);

  const [gameDuration, setGameDuration] = useState(300); // Default 5 mins in seconds
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  
  // --- Player Management ---
  const addPlayer = () => {
    setPlayers(prev => [
      ...prev,
      { id: Date.now(), name: '', assholeCount: 0 },
    ]);
  };

  const removePlayer = (id: number) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const updatePlayerName = (id: number, name: string) => {
    setPlayers(prev =>
      prev.map(p => (p.id === id ? { ...p, name } : p))
    );
  };

  // --- Game Flow ---
  const shuffleCards = useCallback(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentCard(shuffled[0] || cards[0]);
  }, []);

  const startGame = () => {
    shuffleCards();
    setCardIndex(0);
    setCurrentPlayerIndex(0);
    setCurrentJudgeIndex(1);
    setTimeLeft(gameDuration);
    setPlayers(prev => prev.map(p => ({ ...p, assholeCount: 0 })));
    setGameState('playerTurn');
  };

  const finishTurn = () => {
    setGameState('judging');
  };

  const handleJudgment = (isAsshole: boolean) => {
    if (isAsshole) {
      setPlayers(prev =>
        prev.map((p, index) =>
          index === currentPlayerIndex
            ? { ...p, assholeCount: p.assholeCount + 1 }
            : p
        )
      );
    }
    nextTurn();
  };
  
  const nextTurn = () => {
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const nextJudgeIndex = (nextPlayerIndex + 1) % players.length;
    
    setCurrentPlayerIndex(nextPlayerIndex);
    setCurrentJudgeIndex(nextJudgeIndex);
    
    const nextCardIndex = cardIndex + 1;

    if (nextCardIndex >= shuffledCards.length) {
      // Reshuffle if we're at the end
      const reshuffled = [...cards].sort(() => Math.random() - 0.5);
      setShuffledCards(reshuffled);
      setCurrentCard(reshuffled[0] || cards[0]);
      setCardIndex(0);
    } else {
      setCurrentCard(shuffledCards[nextCardIndex]);
      setCardIndex(nextCardIndex);
    }

    setGameState('playerTurn');
  };
  
  const resetGame = () => {
    setPlayers([
      { id: 1, name: '', assholeCount: 0 },
      { id: 2, name: '', assholeCount: 0 },
    ]);
    setGameState('setup');
  };

  // --- Effects ---
  useEffect(() => {
    // initial shuffle on mount
    shuffleCards();
  }, [shuffleCards]);


  useEffect(() => {
    if (gameState !== 'playerTurn' && gameState !== 'judging') return;

    if (timeLeft <= 0) {
      setGameState('gameOver');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // --- Memoized values ---
  const currentPlayer = players[currentPlayerIndex];
  const currentJudge = players[currentJudgeIndex];

  const winners = useMemo(() => {
    if (gameState !== 'gameOver') return [];
    const maxScore = Math.max(...players.map(p => p.assholeCount), 0);
    if (maxScore === 0) return [];
    return players.filter(p => p.assholeCount === maxScore);
  }, [gameState, players]);
  
  const renderScreen = () => {
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
        if (!currentPlayer) return null; // Handle case where players array is empty
        return (
          <GameScreen
            player={currentPlayer}
            cardText={currentCard}
            finishTurn={finishTurn}
          />
        );
      case 'judging':
        if (!currentJudge || !currentPlayer) return null;
        return (
          <JudgingScreen
            judge={currentJudge}
            playerInQuestion={currentPlayer}
            handleJudgment={handleJudgment}
          />
        );
      case 'gameOver':
        return <GameOverScreen winners={winners} players={players} resetGame={resetGame} />;
      default:
        return <div>Invalid game state</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4 font-sans overflow-hidden">
      <LogoHeader 
        gameState={gameState}
        timeLeft={timeLeft}
        resetGame={resetGame}
        cardText={currentCard}
        player={currentPlayer}
      />
      <main className="w-full max-w-2xl pt-24">{renderScreen()}</main>
    </div>
  );
}

export default App;