import { describe, it, expect } from 'vitest';
import { cleanTextForSpeech } from '@/app/api/tts/route';

describe('文本清理 - 语音合成前处理', () => {
  it('中文括号内容被去除', () => {
    expect(cleanTextForSpeech('你好（吸吸鼻子）世界')).toBe('你好世界');
  });

  it('英文括号内容被去除', () => {
    expect(cleanTextForSpeech('你好(小声说)世界')).toBe('你好世界');
  });

  it('中括号内容被去除', () => {
    expect(cleanTextForSpeech('你好[叹气]世界')).toBe('你好世界');
  });

  it('多个括号都能正确处理', () => {
    expect(
      cleanTextForSpeech('（翻白眼）我才没有想你（小声嘟囔）'),
    ).toBe('我才没有想你');
  });

  it('没有括号的内容保持不变', () => {
    expect(cleanTextForSpeech('我真的知道错了')).toBe('我真的知道错了');
  });

  it('空字符串返回空字符串', () => {
    expect(cleanTextForSpeech('')).toBe('');
  });

  it('只有括号内容时返回空字符串', () => {
    expect(cleanTextForSpeech('（吸吸鼻子）')).toBe('');
  });
});
