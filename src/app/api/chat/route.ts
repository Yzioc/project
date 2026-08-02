import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import type { Gender, Message } from '@/types/game';

function getMoodDescription(affection: number): string {
  if (affection <= 0) return '非常生气，冷暴力或激烈质问，语气很冲';
  if (affection <= 30) return '还在生气，但愿意听对方说话，语气带刺';
  if (affection <= 60) return '开始软化，嘴上还在抱怨但语气已经缓和很多';
  if (affection <= 80) return '快被哄好了，可能会撒娇或小声说"哼"，语气变温柔';
  return '基本原谅了，但还要对方保证不再犯，带点小傲娇';
}

function buildPrompt(
  gender: Gender,
  scenario: string,
  messages: Message[],
  affection: number,
  step: number,
  isGameOver: boolean,
  won: boolean,
): string {
  const partnerLabel = gender === 'female' ? '女朋友' : '男朋友';
  const mood = getMoodDescription(affection);

  if (isGameOver) {
    if (won) {
      return `你是一个${partnerLabel}角色。场景：${scenario}。
当前好感度${affection}，你基本被哄好了。
请生成一段甜蜜但带点小傲娇的原谅话语（50字以内），表示你原谅了对方但还要他/她保证不再犯。
只输出你说的话，不要输出其他内容。`;
    }
    return `你是一个${partnerLabel}角色。场景：${scenario}。
当前好感度${affection}，你非常失望。
请生成一段绝情的分手或冷战话语（50字以内），表达你的失望和伤心。
只输出你说的话，不要输出其他内容。`;
  }

  const prevMessages = messages
    .map((m) => `${m.role === 'partner' ? partnerLabel : '对方'}: ${m.content}`)
    .join('\n');

  return `你是一个恋爱哄人模拟器游戏。你扮演生气的${partnerLabel}。

场景：${scenario}
当前是第${step}轮对话。
当前好感度：${affection}/100
你的情绪状态：${mood}

${prevMessages ? `之前的对话记录：\n${prevMessages}` : '这是第一轮对话，请根据场景生成开场白。'}

请根据当前好感度和情绪状态，生成${partnerLabel}的下一句话（50字以内）。
要求：
1. 与前面的对话连贯，不要重复之前说过的话
2. 情绪要符合当前好感度对应的状态
3. 可以适当加入括号内的动作/情绪描述，如（翻白眼）（小声嘟囔）
4. 只输出${partnerLabel}说的话

然后，生成6个供用户选择的回复选项，格式严格为JSON数组：
[{"id":"1","content":"选项内容","score":10},{"id":"2","content":"选项内容","score":-5},...]

选项要求：
- 必须有2个加分选项（score在+5到+20之间）：真诚道歉、具体弥补方案、提起共同回忆等
- 必须有4个减分选项（score在-5到-30之间）：
  - 1-2个普通减分：敷衍、转移话题、找借口
  - 2-3个奇葩搞笑选项：离谱到好笑的回复
- 选项顺序随机打乱
- 每个选项内容不超过30字
- 不要提示用户哪个选项好哪个选项差

请严格按以下JSON格式输出，不要输出任何其他内容：
{"partnerMessage":"你说的话","options":[{"id":"1","content":"选项","score":10},...]}`;
}

const DEFAULT_RESPONSE = {
  partnerMessage: '（生气地转过头去）哼！',
  options: [
    { id: '1', content: '宝贝我错了，原谅我好不好？', score: 15 },
    { id: '2', content: '我给你买好吃的赔罪！', score: 10 },
    { id: '3', content: '行行行，都是我的错', score: -10 },
    { id: '4', content: '你也太敏感了吧', score: -20 },
    { id: '5', content: '我要召唤奥特曼来哄你', score: -5 },
    { id: '6', content: '要不我给你表演个节目？', score: -15 },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      gender,
      scenario,
      messages,
      affection,
      step,
      isGameOver,
      won,
    } = body as {
      gender: Gender;
      scenario: string;
      messages: Message[];
      affection: number;
      step: number;
      isGameOver: boolean;
      won: boolean;
    };

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    const prompt = buildPrompt(
      gender,
      scenario,
      messages,
      affection,
      step,
      isGameOver,
      won,
    );

    const llmMessages = [
      { role: 'user' as const, content: prompt },
    ];

    const response = await client.invoke(llmMessages, {
      model: 'doubao-seed-2-0-mini-260215',
      temperature: 0.9,
    });

    const text = response.content.trim();

    const jsonMatch = text.match(/\{[\s\S]*"partnerMessage"[\s\S]*"options"[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('LLM response missing JSON:', text);
      return NextResponse.json(DEFAULT_RESPONSE);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.partnerMessage || !Array.isArray(parsed.options) || parsed.options.length !== 6) {
      console.error('Invalid LLM response structure:', parsed);
      return NextResponse.json(DEFAULT_RESPONSE);
    }

    return NextResponse.json({
      partnerMessage: parsed.partnerMessage,
      options: parsed.options,
    });
  } catch (err) {
    console.error('/api/chat error:', err);
    return NextResponse.json(DEFAULT_RESPONSE);
  }
}
