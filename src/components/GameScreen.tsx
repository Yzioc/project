'use client';

import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { AffectionBar } from './AffectionBar';
import { LoadingAnimation } from './LoadingAnimation';
import { VOICE_CONFIG } from '@/types/game';
import type { Option } from '@/types/game';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

export function GameScreen() {
  const { gameState, isLoading, error, selectOption } = useGame();
  const { messages, currentOptions, step, affection, gender, voiceType } = gameState;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [audioUri, setAudioUri] = useState<string | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioMessageId, setCurrentAudioMessageId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const lastPartnerMessage = [...messages].reverse().find((m) => m.role === 'partner');
  const partnerMessageCount = messages.filter((m) => m.role === 'partner').length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!lastPartnerMessage || !voiceType || isLoading) return;

    const messageId = `${lastPartnerMessage.content}-${partnerMessageCount}`;
    if (currentAudioMessageId === messageId) return;

    setCurrentAudioMessageId(messageId);
    setAudioUri(undefined);

    const generateAudio = async () => {
      try {
        const speaker = VOICE_CONFIG[voiceType].speaker;
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: lastPartnerMessage.content,
            speaker,
            uid: `game-${partnerMessageCount}`,
          }),
        });
        const data = await res.json();
        if (data.audioUri) {
          setAudioUri(data.audioUri);
        }
      } catch (err) {
        console.error('TTS error:', err);
      }
    };

    generateAudio();
  }, [lastPartnerMessage?.content, partnerMessageCount, voiceType, isLoading]);

  const handlePlayAudio = () => {
    if (!audioUri) return;
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }
    const audio = new Audio(audioUri);
    audioRef.current = audio;
    audio.onended = () => setIsPlaying(false);
    audio.play();
    setIsPlaying(true);
  };

  const handleSelectOption = (option: Option) => {
    setAudioUri(undefined);
    setCurrentAudioMessageId(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    selectOption(option);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      <div className="max-w-2xl mx-auto w-full flex flex-col h-screen">
        <div className="p-4 bg-white/60 backdrop-blur-sm border-b border-white/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              第 {Math.min(step, 10)} 轮 / 共 10 轮
            </span>
            {audioUri && (
              <button
                onClick={handlePlayAudio}
                className="p-2 rounded-full hover:bg-pink-100 transition-colors"
              >
                {isPlaying ? (
                  <VolumeX className="w-5 h-5 text-pink-500" />
                ) : (
                  <Volume2 className="w-5 h-5 text-pink-500" />
                )}
              </button>
            )}
          </div>
          <AffectionBar affection={affection} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'partner' && (
                <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-xs text-pink-600 font-medium shrink-0">
                  TA
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'partner'
                    ? 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                    : 'bg-blue-500 text-white rounded-br-md shadow-sm'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-600 font-medium shrink-0">
                  我
                </div>
              )}
            </div>
          ))}

          {isLoading && gender && <LoadingAnimation gender={gender} />}

          {error && (
            <div className="text-center text-red-500 text-sm py-2">{error}</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {currentOptions.length > 0 && !isLoading && (
          <div className="p-4 bg-white/60 backdrop-blur-sm border-t border-white/40">
            <div className="grid grid-cols-1 gap-2">
              {currentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/80 hover:bg-white border border-gray-200 hover:border-pink-300 text-sm text-gray-700 transition-all hover:shadow-md active:scale-[0.98]"
                >
                  {option.content}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
