import { NextResponse } from 'next/server';
import { LLMClient, Config } from 'coze-coding-dev-sdk';
import { insertPost } from '@/data/blog';

export async function POST() {
  try {
    const config = new Config();
    const client = new LLMClient(config);

    const response = await client.invoke(
      [
        {
          role: 'system',
          content:
            '你是一位恋爱沟通技巧博主，文风轻松幽默、接地气，擅长用网络流行语和emoji，文章面向年轻情侣。每篇文章300-500字。',
        },
        {
          role: 'user',
          content: `请生成一篇全新的恋爱沟通技巧文章，要求：
1. 主题从以下方向随机选一个：有效倾听、情绪管理、制造惊喜、日常表达爱意、处理分歧、保持新鲜感、道歉技巧、吵架后修复、异地恋沟通、安全感建立
2. 不要和已有文章重复（已有主题：吵架后黄金30分钟、"你说得对"的危害、道歉的正确方式）
3. 输出严格JSON格式：{"title":"文章标题","summary":"一句话摘要（30字内）","content":"文章正文（300-500字，用换行分段）"}
4. 只输出JSON，不要其他内容`,
        },
      ],
      {
        model: 'doubao-seed-2-0-mini-260215',
        temperature: 0.9,
      },
    );

    const raw = response.content.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'LLM 返回格式异常' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      title: string;
      summary: string;
      content: string;
    };

    const post = await insertPost({
      title: parsed.title,
      summary: parsed.summary,
      content: parsed.content,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('生成文章失败:', error);
    return NextResponse.json(
      { error: '生成文章失败' },
      { status: 500 }
    );
  }
}
