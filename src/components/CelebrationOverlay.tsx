/**
 * CelebrationOverlay — 番茄钟完成时的庆祝动画
 * 包含：弹跳生长 emoji、粒子/纸屑效果、文字提示
 * 2.5 秒后自动消失
 */
import { useEffect, useState, useMemo } from 'react';
import type { GrowthStage } from '../types';
import { GROWTH_EMOJI } from '../types';
import { useTheme } from '../hooks/useTheme';

interface CelebrationOverlayProps {
  stage: GrowthStage;
  isRipe: boolean; // ≥25min 的红番茄，庆祝感更强
  onComplete: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  rotation: number;
  shape: 'circle' | 'rect' | 'star';
}

const CELEBRATION_TEXTS = ['太棒了！🎉', '干得漂亮！✨', '完美专注！🔥', '继续保持！💪'];
const CELEBRATION_TEXTS_SHORT = ['不错！👍', '完成了！✨', '好的开始！🌱'];

function generateParticles(count: number, colors: string[]): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20, // cluster around center
    y: 50 + (Math.random() - 0.5) * 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 4 + Math.random() * 6,
    angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
    speed: 60 + Math.random() * 80,
    rotation: Math.random() * 360,
    shape: (['circle', 'rect', 'star'] as const)[Math.floor(Math.random() * 3)],
  }));
}

export function CelebrationOverlay({ stage, isRipe, onComplete }: CelebrationOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');
  const theme = useTheme();

  const emoji = GROWTH_EMOJI[stage];
  const text = useMemo(() => {
    const pool = isRipe ? CELEBRATION_TEXTS : CELEBRATION_TEXTS_SHORT;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [isRipe]);

  const particleColors = useMemo(() => {
    return isRipe
      ? [theme.accent, theme.accentEnd, '#fbbf24', '#f472b6', '#a78bfa', '#34d399']
      : [theme.accent, theme.accentEnd, '#fbbf24', '#86efac'];
  }, [isRipe, theme.accent, theme.accentEnd]);

  const particleCount = isRipe ? 36 : 18;
  const particles = useMemo(() => generateParticles(particleCount, particleColors), [particleCount, particleColors]);

  useEffect(() => {
    // enter → show
    const t1 = setTimeout(() => setPhase('show'), 50);
    // show → exit
    const t2 = setTimeout(() => setPhase('exit'), isRipe ? 2200 : 1800);
    // exit → done
    const t3 = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, isRipe ? 2700 : 2300);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isRipe, onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500 ${
        phase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => {
          const tx = Math.cos(p.angle) * p.speed;
          const ty = Math.sin(p.angle) * p.speed - 40; // bias upward
          return (
            <div
              key={p.id}
              className="absolute celebration-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.shape === 'rect' ? p.size * 0.6 : p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'rect' ? '1px' : '0',
                clipPath: p.shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : undefined,
                transform: `rotate(${p.rotation}deg)`,
                '--tx': `${tx}px`,
                '--ty': `${ty}px`,
                '--rot': `${p.rotation + 360 + Math.random() * 360}deg`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      {/* Bouncing emoji */}
      <div
        className={`celebration-emoji ${isRipe ? 'celebration-emoji-ripe' : ''}`}
        style={{ fontSize: isRipe ? '5rem' : '3.5rem' }}
      >
        {emoji}
      </div>

      {/* Text */}
      <div
        className="celebration-text mt-3"
        style={{ color: theme.text }}
      >
        {text}
      </div>
    </div>
  );
}
