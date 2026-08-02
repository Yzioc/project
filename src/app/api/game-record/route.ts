import { NextRequest, NextResponse } from 'next/server';
import { saveGameRecord } from '@/data/game-records';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, scenario, finalScore, result } = body;

    if (!userId || !scenario || finalScore === undefined || !result) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    if (result !== 'win' && result !== 'lose') {
      return NextResponse.json(
        { error: 'result 必须是 win 或 lose' },
        { status: 400 }
      );
    }

    const record = await saveGameRecord(userId, scenario, finalScore, result);

    if (!record) {
      return NextResponse.json(
        { error: '保存游戏记录失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Error saving game record:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
