/**
 * 切瓜逻辑引擎
 *
 * 计算切瓜产出（种子数量、道具掉落）。
 */
import type { ItemId, SlicingResult } from '../types/slicing';
import { COMMON_ITEMS, RARE_ITEMS } from '../types/slicing';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 计算切瓜结果
 * @param melonType 西瓜类型（ripe=大西瓜, legendary=金西瓜）
 * @param isPerfect 是否完美切割（正中间±10%）
 */
export function rollSlicingResult(
  melonType: 'ripe' | 'legendary',
  isPerfect: boolean,
): SlicingResult {
  let seeds: number;
  if (melonType === 'legendary') {
    seeds = randomInt(3, 5);
  } else {
    seeds = randomInt(1, 3);
  }
  if (isPerfect) seeds += 1;

  const items: ItemId[] = [];
  if (melonType === 'legendary') {
    items.push(pickRandom(RARE_ITEMS));
  } else {
    if (Math.random() < 0.2) {
      items.push(pickRandom(COMMON_ITEMS));
    }
  }

  return { seeds, items, isPerfect, melonType };
}
