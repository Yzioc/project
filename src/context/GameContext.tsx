'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import type {
  Gender,
  VoiceType,
  Scenario,
  Message,
  Option,
  GameState,
} from '@/types/game';
import { INITIAL_AFFECTION, MAX_ROUNDS, WIN_AFFECTION, MIN_AFFECTION } from '@/types/game';

interface GameContextType {
  gameState: GameState;
  isLoading: boolean;
  error: string | null;
  setGender: (gender: Gender) => void;
  setScenario: (scenario: Scenario) => void;
  setVoiceType: (voiceType: VoiceType) => void;
  startGame: () => void;
  selectOption: (option: Option) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

const initialState: GameState = {
  step: 0,
  affection: INITIAL_AFFECTION,
  gender: null,
  scenario: null,
  voiceType: null,
  messages: [],
  currentOptions: [],
  gameOver: false,
  won: false,
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isGeneratingRef = useRef(false);

  const setGender = useCallback((gender: Gender) => {
    setGameState((prev) => ({ ...prev, gender }));
  }, []);

  const setScenario = useCallback((scenario: Scenario) => {
    setGameState((prev) => ({ ...prev, scenario }));
  }, []);

  const setVoiceType = useCallback((voiceType: VoiceType) => {
    setGameState((prev) => ({ ...prev, voiceType }));
  }, []);

  const generateRound = useCallback(
    async (state: GameState) => {
      if (isGeneratingRef.current) return;
      isGeneratingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const isGameOver =
          state.step > MAX_ROUNDS ||
          state.affection >= WIN_AFFECTION ||
          state.affection <= MIN_AFFECTION;
        const won = state.affection >= WIN_AFFECTION;

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gender: state.gender,
            scenario: state.scenario?.title,
            messages: state.messages,
            affection: state.affection,
            step: state.step,
            isGameOver,
            won,
          }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();

        if (isGameOver) {
          setGameState((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              { role: 'partner' as const, content: data.partnerMessage },
            ],
            currentOptions: [],
            gameOver: true,
            won,
          }));
        } else {
          setGameState((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              { role: 'partner' as const, content: data.partnerMessage },
            ],
            currentOptions: data.options,
          }));
        }
      } catch (err) {
        console.error('generateRound error:', err);
        setError('生成对话失败，请重试');
      } finally {
        setIsLoading(false);
        isGeneratingRef.current = false;
      }
    },
    [],
  );

  const startGame = useCallback(() => {
    setGameState((prev) => {
      if (!prev.gender || !prev.scenario || !prev.voiceType) {
        console.error('Missing game config');
        return prev;
      }
      const newState: GameState = {
        ...prev,
        step: 1,
        affection: INITIAL_AFFECTION,
        messages: [],
        currentOptions: [],
        gameOver: false,
        won: false,
      };
      setTimeout(() => generateRound(newState), 0);
      return newState;
    });
  }, [generateRound]);

  const selectOption = useCallback(
    (option: Option) => {
      setGameState((prev) => {
        const newAffection = Math.max(
          MIN_AFFECTION,
          Math.min(100, prev.affection + option.score),
        );
        const newStep = prev.step + 1;
        const isLastRound = newStep > MAX_ROUNDS;
        const won = newAffection >= WIN_AFFECTION;
        const gameOver = isLastRound || won || newAffection <= MIN_AFFECTION;

        const newState: GameState = {
          ...prev,
          step: newStep,
          affection: newAffection,
          messages: [
            ...prev.messages,
            { role: 'user' as const, content: option.content },
          ],
          currentOptions: [],
          gameOver,
          won: gameOver ? won : prev.won,
        };

        if (!gameOver) {
          setTimeout(() => generateRound(newState), 0);
        } else {
          setTimeout(() => generateRound(newState), 0);
        }

        return newState;
      });
    },
    [generateRound],
  );

  const resetGame = useCallback(() => {
    isGeneratingRef.current = false;
    setIsLoading(false);
    setError(null);
    setGameState(initialState);
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        isLoading,
        error,
        setGender,
        setScenario,
        setVoiceType,
        startGame,
        selectOption,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
