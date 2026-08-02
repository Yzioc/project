import { NextRequest, NextResponse } from 'next/server';
import { getUserGameRecords } from '@/data/game-records';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: '缺少 userId 参数' },
        { status: 400 }
      );
    }

    const records = await getUserGameRecords(parseInt(userId, 10));

    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error('Error fetching game records:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
