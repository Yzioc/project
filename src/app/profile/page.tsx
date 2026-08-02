'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, HeartCrack, Gamepad2 } from 'lucide-react';

interface GameRecord {
  id: number;
  scenario: string;
  final_score: number;
  result: 'win' | 'lose';
  played_at: string;
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetch(`/api/game-records?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setRecords(data.records);
        })
        .catch((err) => console.error('Failed to fetch records:', err))
        .finally(() => setLoading(false));
    }
  }, [user, isLoading, router]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  const winCount = records.filter((r) => r.result === 'win').length;
  const loseCount = records.filter((r) => r.result === 'lose').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{user?.username}</h1>
              <p className="text-sm text-gray-500">游戏记录</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <Gamepad2 className="w-6 h-6 mx-auto mb-1 text-gray-400" />
              <div className="text-2xl font-bold text-gray-800">{records.length}</div>
              <div className="text-xs text-gray-500">总场次</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-1 text-green-500" />
              <div className="text-2xl font-bold text-green-600">{winCount}</div>
              <div className="text-xs text-gray-500">通关</div>
            </div>
            <div className="bg-red-50 rounded-2xl p-4 text-center">
              <HeartCrack className="w-6 h-6 mx-auto mb-1 text-red-400" />
              <div className="text-2xl font-bold text-red-500">{loseCount}</div>
              <div className="text-xs text-gray-500">失败</div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">历史记录</h2>

          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>还没有游戏记录</p>
              <p className="text-sm mt-1">快去哄哄 TA 吧～</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {record.result === 'win' ? (
                      <Trophy className="w-5 h-5 text-green-500" />
                    ) : (
                      <HeartCrack className="w-5 h-5 text-red-400" />
                    )}
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{record.scenario}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(record.played_at).toLocaleString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold ${
                        record.result === 'win' ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {record.result === 'win' ? '通关' : '失败'}
                    </div>
                    <div className="text-xs text-gray-400">好感度 {record.final_score}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
