'use client';

import { GameProvider, useGame } from '@/context/GameContext';
import { StartScreen } from '@/components/StartScreen';
import { GameScreen } from '@/components/GameScreen';
import { GameOverScreen } from '@/components/GameOverScreen';

function GameRouter() {
  const { gameState } = useGame();

  if (gameState.gameOver) return <GameOverScreen />;
  if (gameState.step > 0) return <GameScreen />;
  return <StartScreen />;
}

export default function Home() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
