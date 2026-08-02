import { NextRequest, NextResponse } from 'next/server';
import { TTSClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/（[^）]*）/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/[「」『』]/g, '')
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const { text, speaker, uid } = (await request.json()) as {
      text: string;
      speaker: string;
      uid: string;
    };

    if (!text || !speaker) {
      return NextResponse.json({ error: 'Missing text or speaker' }, { status: 400 });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new TTSClient(config, customHeaders);

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) {
      return NextResponse.json({ audioUri: '', audioSize: 0 });
    }

    const response = await client.synthesize({
      uid: uid || 'game-user',
      text: cleanText,
      speaker,
    });

    return NextResponse.json({
      audioUri: response.audioUri,
      audioSize: response.audioSize,
    });
  } catch (err) {
    console.error('/api/tts error:', err);
    return NextResponse.json({ audioUri: '', audioSize: 0 });
  }
}
