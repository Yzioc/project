'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { SCENARIOS, VOICE_CONFIG } from '@/types/game';
import type { Gender, VoiceType, Scenario } from '@/types/game';
import { Heart, BookOpen, LogOut } from 'lucide-react';

export function StartScreen() {
  const { setGender, setScenario, setVoiceType, startGame, gameState } = useGame();
  const { user, logout } = useAuth();
  const [selectedGender, setSelectedGender] = useState<Gender>('female');
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceType>('gentle-female');

  const availableVoices = Object.entries(VOICE_CONFIG)
    .filter(([, v]) => v.gender === selectedGender)
    .map(([key, v]) => ({ key: key as VoiceType, ...v }));

  const handleGenderChange = (gender: Gender) => {
    setSelectedGender(gender);
    const firstVoice = Object.entries(VOICE_CONFIG).find(
      ([, v]) => v.gender === gender,
    );
    if (firstVoice) setSelectedVoice(firstVoice[0] as VoiceType);
  };

  const handleStart = () => {
    setGender(selectedGender);
    setScenario(selectedScenario);
    setVoiceType(selectedVoice);
    setTimeout(() => startGame(), 50);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            欢迎，<span className="font-medium text-purple-600">{user?.username}</span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            退出
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            哄哄模拟器
          </h1>
          <p className="text-gray-500 mt-2 text-sm">TA 生气了，你能在 10 轮内哄好吗？</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择对方性别
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['female', 'male'] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => handleGenderChange(g)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedGender === g
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {g === 'female' ? '👩 女朋友' : '👨 男朋友'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择场景
            </label>
            <div className="space-y-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(s)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedScenario.id === s.id
                      ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-300 shadow-sm'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-800">{s.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择语音
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableVoices.map((v) => (
                <button
                  key={v.key}
                  onClick={() => setSelectedVoice(v.key)}
                  className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                    selectedVoice === v.key
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            开始哄人 💕
          </button>

          <Link
            href="/blog"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white/60 border border-pink-200 text-pink-600 font-medium text-sm hover:bg-white hover:shadow-md transition-all"
          >
            <BookOpen className="w-4 h-4" />
            恋爱攻略
          </Link>
        </div>
      </div>
    </div>
  );
}
