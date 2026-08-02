'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameProvider, useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { StartScreen } from '@/components/StartScreen';
import { GameScreen } from '@/components/GameScreen';
import { GameOverScreen } from '@/components/GameOverScreen';

function GameRouter() {
  const { gameState } = useGame();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-lg text-purple-600">加载中...</div>
      </div>
    );
  }

  if (!user) return null;

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
