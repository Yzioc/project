import { describe, it, expect } from 'vitest';
import { VOICE_CONFIG } from '@/types/game';

describe('语音配置', () => {
  it('每个语音类型都有对应的 speaker', () => {
    for (const [key, config] of Object.entries(VOICE_CONFIG)) {
      expect(config.speaker).toBeTruthy();
      expect(typeof config.speaker).toBe('string');
    }
  });

  it('女声语音有 3 种', () => {
    const femaleVoices = Object.values(VOICE_CONFIG).filter(
      (v) => v.gender === 'female',
    );
    expect(femaleVoices.length).toBe(3);
  });

  it('男声语音有 2 种', () => {
    const maleVoices = Object.values(VOICE_CONFIG).filter(
      (v) => v.gender === 'male',
    );
    expect(maleVoices.length).toBe(2);
  });

  it('每条语音消息应生成唯一 ID', () => {
    const id1 = `partner-msg1-1`;
    const id2 = `partner-msg2-2`;
    expect(id1).not.toBe(id2);
  });

  it('相同消息内容但不同轮次应有不同 ID', () => {
    const content = '哼！';
    const id1 = `partner-${content}-1`;
    const id2 = `partner-${content}-2`;
    expect(id1).not.toBe(id2);
  });
});
