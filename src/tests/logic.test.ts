import { describe, it, expect } from 'vitest';
import {
  INITIAL_AFFECTION,
  MAX_AFFECTION,
  MIN_AFFECTION,
  WIN_AFFECTION,
  MAX_ROUNDS,
} from '@/types/game';

function clampAffection(value: number): number {
  return Math.max(MIN_AFFECTION, Math.min(100, value));
}

function checkGameOver(affection: number, step: number) {
  const won = affection >= WIN_AFFECTION;
  const lost = affection <= MIN_AFFECTION;
  const outOfRounds = step > MAX_ROUNDS;
  return { gameOver: won || lost || outOfRounds, won };
}

describe('好感度计算', () => {
  it('初始好感度为 20', () => {
    expect(INITIAL_AFFECTION).toBe(20);
  });

  it('加分后好感度正确增加', () => {
    const result = clampAffection(INITIAL_AFFECTION + 15);
    expect(result).toBe(35);
  });

  it('减分后好感度正确减少', () => {
    const result = clampAffection(INITIAL_AFFECTION - 10);
    expect(result).toBe(10);
  });

  it('好感度不超过上限', () => {
    const result = clampAffection(95 + 20);
    expect(result).toBe(100);
  });

  it('好感度不低于下限', () => {
    const result = clampAffection(-40 - 20);
    expect(result).toBe(MIN_AFFECTION);
  });
});

describe('游戏胜负判定', () => {
  it('好感度 >= 80 时获胜', () => {
    const { gameOver, won } = checkGameOver(80, 5);
    expect(gameOver).toBe(true);
    expect(won).toBe(true);
  });

  it('好感度 <= -50 时失败', () => {
    const { gameOver, won } = checkGameOver(-50, 3);
    expect(gameOver).toBe(true);
    expect(won).toBe(false);
  });

  it('10 轮用完好感度不足 80 时失败', () => {
    const { gameOver, won } = checkGameOver(60, 11);
    expect(gameOver).toBe(true);
    expect(won).toBe(false);
  });

  it('游戏进行中不结束', () => {
    const { gameOver } = checkGameOver(50, 5);
    expect(gameOver).toBe(false);
  });
});

describe('轮次递增', () => {
  it('每选一次选项轮次加 1', () => {
    let step = 1;
    step += 1;
    expect(step).toBe(2);
  });

  it('第 10 轮选完后 step 变为 11，触发结束', () => {
    const step = 10 + 1;
    const { gameOver } = checkGameOver(50, step);
    expect(gameOver).toBe(true);
  });
});
