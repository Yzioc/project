export type Gender = 'female' | 'male';

export type VoiceType =
  | 'gentle-female'
  | 'cool-female'
  | 'cute-female'
  | 'deep-male'
  | 'gentle-male';

export interface Scenario {
  id: string;
  title: string;
  description: string;
}

export interface Message {
  role: 'user' | 'partner';
  content: string;
}

export interface Option {
  id: string;
  content: string;
  score: number;
}

export interface GameState {
  step: number;
  affection: number;
  gender: Gender | null;
  scenario: Scenario | null;
  voiceType: VoiceType | null;
  messages: Message[];
  currentOptions: Option[];
  gameOver: boolean;
  won: boolean;
}

export const INITIAL_AFFECTION = 20;
export const MAX_AFFECTION = 100;
export const MIN_AFFECTION = -50;
export const WIN_AFFECTION = 80;
export const MAX_ROUNDS = 10;

export const SCENARIOS: Scenario[] = [
  {
    id: 'anniversary',
    title: '忘记纪念日',
    description: '今天是你们在一起三周年，你完全忘了...',
  },
  {
    id: 'late-night',
    title: '深夜不回消息',
    description: '你昨晚打游戏到凌晨三点，对方发了十几条消息你都没回...',
  },
  {
    id: 'flirty-chat',
    title: '被发现和异性聊天',
    description: '对方看到你和异性朋友的暧昧聊天记录...',
  },
  {
    id: 'lost-cat',
    title: '把对方的猫弄丢了',
    description: '你帮对方照顾猫的时候，猫跑丢了...',
  },
  {
    id: 'public-joke',
    title: '当众让对方没面子',
    description: '你在朋友聚会上开了一个过分的玩笑...',
  },
];

export const VOICE_CONFIG: Record<
  VoiceType,
  { speaker: string; label: string; gender: Gender }
> = {
  'gentle-female': {
    speaker: 'zh_female_xiaohe_uranus_bigtts',
    label: '温柔女声',
    gender: 'female',
  },
  'cool-female': {
    speaker: 'zh_female_vv_uranus_bigtts',
    label: '霸道御姐',
    gender: 'female',
  },
  'cute-female': {
    speaker: 'saturn_zh_female_keainvsheng_tob',
    label: '可爱软妹',
    gender: 'female',
  },
  'deep-male': {
    speaker: 'zh_male_m191_uranus_bigtts',
    label: '低沉男声',
    gender: 'male',
  },
  'gentle-male': {
    speaker: 'zh_male_taocheng_uranus_bigtts',
    label: '温柔男声',
    gender: 'male',
  },
};
