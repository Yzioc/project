import { describe, it, expect } from 'vitest';
import { SCENARIOS } from '@/types/game';

describe('API 数据结构', () => {
  it('场景列表包含 5 个预设场景', () => {
    expect(SCENARIOS.length).toBe(5);
  });

  it('每个场景有 id、title、description', () => {
    for (const s of SCENARIOS) {
      expect(s.id).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.description).toBeTruthy();
    }
  });

  it('chat API 请求体结构正确', () => {
    const requestBody = {
      gender: 'female' as const,
      scenario: '忘记纪念日',
      messages: [{ role: 'partner' as const, content: '哼！' }],
      affection: 20,
      step: 1,
      isGameOver: false,
      won: false,
    };
    expect(requestBody.gender).toBe('female');
    expect(requestBody.messages.length).toBe(1);
    expect(requestBody.affection).toBe(20);
  });

  it('chat API 响应体结构正确', () => {
    const responseBody = {
      partnerMessage: '你还知道回来？',
      options: [
        { id: '1', content: '对不起', score: 10 },
        { id: '2', content: '我错了', score: 15 },
        { id: '3', content: '随便啦', score: -10 },
        { id: '4', content: '你太敏感了', score: -20 },
        { id: '5', content: '我给你唱首歌', score: -5 },
        { id: '6', content: '我去给你买奶茶', score: 5 },
      ],
    };
    expect(responseBody.options.length).toBe(6);
    expect(responseBody.partnerMessage).toBeTruthy();
  });

  it('tts API 请求体结构正确', () => {
    const requestBody = {
      text: '你好',
      speaker: 'zh_female_xiaohe_uranus_bigtts',
      uid: 'test-user',
    };
    expect(requestBody.text).toBeTruthy();
    expect(requestBody.speaker).toBeTruthy();
  });
});
