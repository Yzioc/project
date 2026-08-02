'use client';

import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { VOICE_CONFIG } from '@/types/game';
import { Heart, HeartCrack, RotateCcw } from 'lucide-react';

export function GameOverScreen() {
  const { gameState, resetGame } = useGame();
  const { won, messages, voiceType } = gameState;
  const [audioUri, setAudioUri] = useState<string | undefined>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const lastPartnerMessage = [...messages].reverse().find((m) => m.role === 'partner');

  useEffect(() => {
    if (!lastPartnerMessage || !voiceType) return;

    const generateAudio = async () => {
      try {
        const speaker = VOICE_CONFIG[voiceType].speaker;
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: lastPartnerMessage.content,
            speaker,
            uid: 'game-over',
          }),
        });
        const data = await res.json();
        if (data.audioUri) setAudioUri(data.audioUri);
      } catch (err) {
        console.error('TTS error:', err);
      }
    };

    generateAudio();
  }, [lastPartnerMessage?.content, voiceType]);

  const handlePlayAudio = () => {
    if (!audioUri) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(audioUri);
    audioRef.current = audio;
    audio.play();
  };

  useEffect(() => {
    if (audioUri) {
      handlePlayAudio();
    }
  }, [audioUri]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center">
        {won ? (
          <>
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-red-400 mb-4 mx-auto">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">通关成功！</h2>
            <p className="text-gray-500 text-sm mb-6">你成功把 TA 哄好了～</p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">💔</div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 mb-4 mx-auto">
              <HeartCrack className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">哄人失败</h2>
            <p className="text-gray-500 text-sm mb-6">TA 似乎更生气了...</p>
          </>
        )}

        {lastPartnerMessage && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-700 italic">&ldquo;{lastPartnerMessage.content}&rdquo;</p>
            {audioUri && (
              <button
                onClick={handlePlayAudio}
                className="mt-3 text-xs text-pink-500 hover:text-pink-600"
              >
                🔊 再听一次
              </button>
            )}
          </div>
        )}

        <p className="text-sm text-gray-400 mb-6">
          {won ? '通关！分享给朋友试试？' : '再试一次？'}
        </p>

        <button
          onClick={resetGame}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          再来一次
        </button>
      </div>
    </div>
  );
}
