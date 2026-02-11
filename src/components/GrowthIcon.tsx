/**
 * GrowthIcon — 西瓜生长阶段 SVG 图标
 * 5 个阶段：种子发芽 → 幼苗 → 开花 → 青瓜 → 成熟西瓜
 */
import type { GrowthStage } from '../types';

interface GrowthIconProps {
  stage: GrowthStage;
  size?: number;
  className?: string;
}

/** 种子发芽 — 黑色西瓜籽冒出小绿芽 */
function SeedIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 土壤 */}
      <ellipse cx="12" cy="20" rx="7" ry="2" fill="#8B6914" opacity="0.4" />
      {/* 西瓜籽 */}
      <ellipse cx="12" cy="17" rx="3" ry="4" fill="#1a1a1a" />
      <ellipse cx="12" cy="16.5" rx="2" ry="3" fill="#2d2d2d" />
      {/* 小绿芽 */}
      <path d="M12 13 C12 10 10 8 10 8 C10 8 12 9 12 7 C12 9 14 8 14 8 C14 8 12 10 12 13Z" fill="#4ade80" />
      <path d="M12 13 C12 10.5 10.5 8.5 10.5 8.5" stroke="#22c55e" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

/** 幼苗 — 小绿苗+叶子+卷须 */
function SproutIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 土壤 */}
      <ellipse cx="12" cy="21" rx="6" ry="1.5" fill="#8B6914" opacity="0.4" />
      {/* 茎 */}
      <path d="M12 20 C12 14 12 12 12 10" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      {/* 左叶 */}
      <path d="M12 15 C9 14 7 11 7 11 C7 11 10 12 12 15Z" fill="#4ade80" />
      <path d="M12 15 C9 14 7 11 7 11" stroke="#22c55e" strokeWidth="0.4" fill="none" />
      {/* 右叶 */}
      <path d="M12 12 C15 11 17 8 17 8 C17 8 14 9.5 12 12Z" fill="#4ade80" />
      <path d="M12 12 C15 11 17 8 17 8" stroke="#22c55e" strokeWidth="0.4" fill="none" />
      {/* 卷须 */}
      <path d="M12 10 C13 9 14.5 9.5 15 8 C15.5 6.5 14 6 13.5 7" stroke="#86efac" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** 开花 — 藤蔓+黄色小花 */
function BloomIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 茎 */}
      <path d="M10 21 C10 16 11 14 12 11" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      {/* 叶子 */}
      <path d="M11 16 C8 15 6 12.5 6 12.5 C6 12.5 9 13.5 11 16Z" fill="#4ade80" />
      <path d="M12 13 C15 12 17 9.5 17 9.5 C17 9.5 14 11 12 13Z" fill="#4ade80" />
      {/* 花瓣 — 5 片黄色 */}
      <circle cx="12" cy="7" r="1.2" fill="#fbbf24" />
      <circle cx="10" cy="8.2" r="1.2" fill="#fbbf24" />
      <circle cx="14" cy="8.2" r="1.2" fill="#fbbf24" />
      <circle cx="10.8" cy="9.8" r="1.2" fill="#fbbf24" />
      <circle cx="13.2" cy="9.8" r="1.2" fill="#fbbf24" />
      {/* 花心 */}
      <circle cx="12" cy="8.5" r="1.5" fill="#f59e0b" />
      {/* 卷须 */}
      <path d="M13 11 C14 10 16 10.5 16.5 9 C17 7.5 15.5 7 15 8" stroke="#86efac" strokeWidth="0.7" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** 青瓜 — 小的浅绿/黄绿色未成熟西瓜 */
function GreenIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 藤 */}
      <path d="M12 7 C12 5 13 4 14 3.5" stroke="#65a30d" strokeWidth="1" strokeLinecap="round" />
      {/* 小叶 */}
      <path d="M13.5 4.5 C15 3.5 16.5 4 16 5 C15.5 6 14 5.5 13.5 4.5Z" fill="#a3e635" />
      {/* 西瓜主体 — 浅绿/黄绿，比成熟的小 */}
      <ellipse cx="12" cy="14.5" rx="6" ry="6.5" fill="#a3e635" />
      {/* 浅色条纹 — 不太明显 */}
      <path d="M9 9.5 C8.3 12 8.3 17 9 20" stroke="#84cc16" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M12 8 C12 12 12 17 12 21" stroke="#84cc16" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M15 9.5 C15.7 12 15.7 17 15 20" stroke="#84cc16" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* 高光 */}
      <ellipse cx="10" cy="12" rx="1.8" ry="2.5" fill="white" opacity="0.2" transform="rotate(-15 10 12)" />
    </svg>
  );
}

/** 成熟西瓜 — 切开露出红瓤 */
function RipeIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 整瓜（右半，背景） */}
      <path d="M14 3 C19 4 22 9 22 14 C22 19 18 22 14 22 C14 22 14 3 14 3Z" fill="#22c55e" />
      <path d="M16 4.5 C16.5 8 16.5 16 16 20" stroke="#15803d" strokeWidth="0.8" fill="none" />
      <path d="M19 6.5 C19.5 10 19.5 15 19 19" stroke="#15803d" strokeWidth="0.8" fill="none" />
      {/* 切面（左半） */}
      <path d="M14 3 C9 4 4 8 3 14 C4 20 9 22 14 22 C14 22 14 3 14 3Z" fill="#ef4444" />
      {/* 红瓤渐变 */}
      <path d="M14 4.5 C10 5.5 5.5 9 5 14 C5.5 19 10 21 14 21.5" fill="#dc2626" opacity="0.3" />
      {/* 西瓜皮边缘 */}
      <path d="M14 3 C9 4 4 8 3 14 C4 20 9 22 14 22" stroke="#16a34a" strokeWidth="1.8" fill="none" />
      {/* 白色瓤皮 */}
      <path d="M14 4 C9.5 5 5 8.5 4 14 C5 19.5 9.5 21.5 14 22" stroke="#bbf7d0" strokeWidth="0.8" fill="none" />
      {/* 西瓜籽 */}
      <ellipse cx="9" cy="10" rx="0.8" ry="1.2" fill="#1a1a1a" transform="rotate(-20 9 10)" />
      <ellipse cx="7.5" cy="14" rx="0.8" ry="1.2" fill="#1a1a1a" transform="rotate(10 7.5 14)" />
      <ellipse cx="10" cy="17" rx="0.8" ry="1.2" fill="#1a1a1a" transform="rotate(-5 10 17)" />
      <ellipse cx="11.5" cy="13" rx="0.8" ry="1.2" fill="#1a1a1a" transform="rotate(15 11.5 13)" />
      <ellipse cx="9" cy="18.5" rx="0.7" ry="1" fill="#1a1a1a" transform="rotate(-10 9 18.5)" />
    </svg>
  );
}

/** 金西瓜 — 金色西瓜 + 皇冠 + 金光 */
function LegendaryIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 金色光芒 */}
      <circle cx="12" cy="13" r="10" fill="url(#legendary-glow)" opacity="0.3" />
      <defs>
        <radialGradient id="legendary-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* 整瓜（右半，背景）— 金色 */}
      <path d="M14 5 C19 6 22 10 22 15 C22 20 18 23 14 23 C14 23 14 5 14 5Z" fill="#f59e0b" />
      <path d="M16 6.5 C16.5 10 16.5 17 16 21" stroke="#d97706" strokeWidth="0.8" fill="none" />
      <path d="M19 8.5 C19.5 11 19.5 16 19 20" stroke="#d97706" strokeWidth="0.8" fill="none" />
      {/* 切面（左半）— 深金色 */}
      <path d="M14 5 C9 6 4 9.5 3 15 C4 21 9 23 14 23 C14 23 14 5 14 5Z" fill="#fbbf24" />
      <path d="M14 6.5 C10 7.5 5.5 10.5 5 15 C5.5 20 10 22 14 22.5" fill="#f59e0b" opacity="0.3" />
      {/* 金色瓜皮边缘 */}
      <path d="M14 5 C9 6 4 9.5 3 15 C4 21 9 23 14 23" stroke="#b45309" strokeWidth="1.8" fill="none" />
      {/* 白色瓤皮 */}
      <path d="M14 6 C9.5 7 5 10 4 15 C5 20.5 9.5 22.5 14 23" stroke="#fef3c7" strokeWidth="0.8" fill="none" />
      {/* 金色西瓜籽 */}
      <ellipse cx="9" cy="11.5" rx="0.8" ry="1.2" fill="#92400e" transform="rotate(-20 9 11.5)" />
      <ellipse cx="7.5" cy="15" rx="0.8" ry="1.2" fill="#92400e" transform="rotate(10 7.5 15)" />
      <ellipse cx="10" cy="18" rx="0.8" ry="1.2" fill="#92400e" transform="rotate(-5 10 18)" />
      <ellipse cx="11.5" cy="14" rx="0.8" ry="1.2" fill="#92400e" transform="rotate(15 11.5 14)" />
      {/* 皇冠 */}
      <path d="M7 5 L8.5 2 L10.5 4 L12 1 L13.5 4 L15.5 2 L17 5 Z" fill="#fbbf24" />
      <path d="M7 5 L8.5 2 L10.5 4 L12 1 L13.5 4 L15.5 2 L17 5" stroke="#d97706" strokeWidth="0.5" fill="none" />
      {/* 皇冠宝石 */}
      <circle cx="10.5" cy="3.8" r="0.5" fill="#ef4444" />
      <circle cx="12" cy="2.5" r="0.6" fill="#ef4444" />
      <circle cx="13.5" cy="3.8" r="0.5" fill="#ef4444" />
    </svg>
  );
}

const ICON_MAP: Record<GrowthStage, React.FC<{ size: number }>> = {
  seed: SeedIcon,
  sprout: SproutIcon,
  bloom: BloomIcon,
  green: GreenIcon,
  ripe: RipeIcon,
  legendary: LegendaryIcon,
};

export function GrowthIcon({ stage, size = 22, className }: GrowthIconProps) {
  const Icon = ICON_MAP[stage];
  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${className ?? ''}`}>
      <Icon size={size} />
    </span>
  );
}
