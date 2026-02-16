/**
 * SlicingScene — 全屏切瓜场景
 *
 * 用户滑动切开西瓜，获得种子和道具。
 * 包含：刀光引导、滑动检测、切割动画、种子弹出、道具掉落、结果展示。
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import { rollSlicingResult } from '../slicing/engine';
import { playSliceSound, playSplashSound, playRareDropSound } from '../slicing/audio';
import { ITEM_DEFS } from '../types/slicing';
import type { SlicingResult, ItemId } from '../types/slicing';

interface SlicingSceneProps {
  melonType: 'ripe' | 'legendary';
  onComplete: (result: SlicingResult) => void;
  onCancel: () => void;
}

type Phase = 'ready' | 'slicing' | 'split' | 'drops' | 'result';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

interface SeedDrop {
  id: number;
  x: number;
  y: number;
  targetY: number;
  delay: number;
}

interface ItemDrop {
  id: number;
  itemId: ItemId;
  x: number;
  delay: number;
  isRare: boolean;
}

// 汁水粒子颜色
const JUICE_COLORS = ['#ff3b3b', '#ff6b6b', '#ff1a1a', '#cc0000', '#ff4d4d'];
const GOLD_JUICE_COLORS = ['#fbbf24', '#f59e0b', '#fde68a', '#d97706', '#fef3c7'];

export function SlicingScene({ melonType, onComplete, onCancel }: SlicingSceneProps) {
  const theme = useTheme();
  const t = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>('ready');
  const [sliceAngle, setSliceAngle] = useState(0); // 切割角度（弧度）
  const [particles, setParticles] = useState<Particle[]>([]);
  const [seeds, setSeeds] = useState<SeedDrop[]>([]);
  const [itemDrops, setItemDrops] = useState<ItemDrop[]>([]);
  const [result, setResult] = useState<SlicingResult | null>(null);
  const [showPerfect, setShowPerfect] = useState(false);
  const [showRareGlow, setShowRareGlow] = useState(false);

  // 拖拽状态
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const hasSwiped = useRef(false);

  const melonEmoji = melonType === 'legendary' ? '👑' : '🍉';
  const juiceColors = melonType === 'legendary' ? GOLD_JUICE_COLORS : JUICE_COLORS;

  // 生成汁水粒子
  const spawnParticles = useCallback((cx: number, cy: number, angle: number) => {
    const count = melonType === 'legendary' ? 40 : 25;
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * Math.PI;
      const dir = angle + Math.PI / 2 + spread;
      const speed = 2 + Math.random() * 6;
      newParticles.push({
        id: i,
        x: cx + (Math.random() - 0.5) * 20,
        y: cy + (Math.random() - 0.5) * 20,
        vx: Math.cos(dir) * speed,
        vy: Math.sin(dir) * speed,
        size: 3 + Math.random() * 6,
        color: juiceColors[Math.floor(Math.random() * juiceColors.length)],
        opacity: 1,
      });
    }
    setParticles(newParticles);
  }, [melonType, juiceColors]);

  // 粒子动画
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev => {
        const next = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.3, // 重力
            opacity: p.opacity - 0.02,
          }))
          .filter(p => p.opacity > 0);
        if (next.length === 0) clearInterval(interval);
        return next;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [particles.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // 处理切割
  const handleSlice = useCallback((startX: number, startY: number, endX: number, endY: number) => {
    if (phase !== 'ready' || hasSwiped.current) return;
    hasSwiped.current = true;

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // 计算切割角度和偏移
    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 30) { hasSwiped.current = false; return; } // 太短不算

    const angle = Math.atan2(dy, dx);
    setSliceAngle(angle);

    // 计算切割位置偏移（相对于西瓜中心）
    const midX = (startX + endX) / 2;
    const offset = (midX - cx) / (rect.width * 0.15); // 归一化到 -1~1

    const isPerfect = Math.abs(offset) < 0.1;

    // Phase: slicing
    setPhase('slicing');
    playSliceSound();

    // 生成粒子
    setTimeout(() => {
      spawnParticles(cx, cy, angle);
      playSplashSound();
      setPhase('split');

      // 计算结果
      const sliceResult = rollSlicingResult(melonType, isPerfect);
      setResult(sliceResult);

      if (isPerfect) {
        setShowPerfect(true);
        setTimeout(() => setShowPerfect(false), 1500);
      }

      // 种子弹出
      setTimeout(() => {
        setPhase('drops');
        const seedDrops: SeedDrop[] = [];
        for (let i = 0; i < sliceResult.seeds; i++) {
          seedDrops.push({
            id: i,
            x: cx + (Math.random() - 0.5) * 100,
            y: cy,
            targetY: cy + 60 + Math.random() * 40,
            delay: i * 150,
          });
        }
        setSeeds(seedDrops);

        // 道具掉落
        if (sliceResult.items.length > 0) {
          const hasRare = sliceResult.items.some(id => ITEM_DEFS[id].rarity === 'rare');
          if (hasRare) {
            setShowRareGlow(true);
            playRareDropSound();
          }
          const drops: ItemDrop[] = sliceResult.items.map((itemId, i) => ({
            id: i,
            itemId,
            x: cx + (i - (sliceResult.items.length - 1) / 2) * 60,
            delay: sliceResult.seeds * 150 + 300 + i * 200,
            isRare: ITEM_DEFS[itemId].rarity === 'rare',
          }));
          setItemDrops(drops);
        }

        // 显示结果
        const totalDelay = sliceResult.seeds * 150 + 300 + sliceResult.items.length * 200 + 800;
        setTimeout(() => {
          setShowRareGlow(false);
          setPhase('result');
        }, totalDelay);
      }, 600);
    }, 200);
  }, [phase, melonType, spawnParticles]);

  // 触摸事件
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!dragStart.current) return;
    const touch = e.changedTouches[0];
    handleSlice(dragStart.current.x, dragStart.current.y, touch.clientX, touch.clientY);
    dragStart.current = null;
  }, [handleSlice]);

  // 鼠标事件
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragStart.current) return;
    handleSlice(dragStart.current.x, dragStart.current.y, e.clientX, e.clientY);
    dragStart.current = null;
  }, [handleSlice]);

  // 收下结果
  const handleCollect = useCallback(() => {
    if (result) onComplete(result);
  }, [result, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center select-none"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', cursor: phase === 'ready' ? 'crosshair' : 'default' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* 关闭按钮（仅 ready 阶段） */}
      {phase === 'ready' && (
        <button
          onClick={(e) => { e.stopPropagation(); onCancel(); }}
          className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center z-10"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
        >✕</button>
      )}

      {/* 稀有掉落金光 */}
      {showRareGlow && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(251,191,36,0.3) 0%, transparent 70%)',
            animation: 'pulse 0.5s ease-in-out infinite alternate',
          }}
        />
      )}

      {/* 西瓜 */}
      <div
        className="relative transition-all"
        style={{
          fontSize: phase === 'ready' ? 120 : 100,
          transform: phase === 'slicing' ? 'scale(1.1)' : phase === 'split' || phase === 'drops' ? 'scale(0)' : 'scale(1)',
          opacity: phase === 'result' ? 0 : 1,
          transition: phase === 'slicing' ? 'transform 0.15s ease-out' : 'transform 0.4s ease-in, opacity 0.3s',
        }}
      >
        {/* 整瓜 */}
        {(phase === 'ready' || phase === 'slicing') && (
          <span className="block">{melonEmoji}</span>
        )}

        {/* 裂开的两半 */}
        {(phase === 'split' || phase === 'drops') && (
          <div className="relative" style={{ fontSize: 100 }}>
            <span
              className="absolute"
              style={{
                transform: `rotate(${sliceAngle}rad) translateX(-40px) rotate(-15deg)`,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                filter: `drop-shadow(0 0 10px ${melonType === 'legendary' ? '#fbbf24' : '#ff3b3b'})`,
              }}
            >{melonEmoji}</span>
            <span
              className="absolute"
              style={{
                transform: `rotate(${sliceAngle}rad) translateX(40px) rotate(15deg)`,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                filter: `drop-shadow(0 0 10px ${melonType === 'legendary' ? '#fbbf24' : '#ff3b3b'})`,
              }}
            >{melonEmoji}</span>
          </div>
        )}
      </div>

      {/* 刀光引导（ready 阶段） */}
      {phase === 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-0.5 h-40 rounded-full"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.6), transparent)',
              animation: 'sliceGuide 2s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {/* 提示文字 */}
      {phase === 'ready' && (
        <p
          className="absolute bottom-24 text-sm font-medium"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {t.sliceHint}
        </p>
      )}

      {/* 完美切割特效 */}
      {showPerfect && (
        <div
          className="absolute text-2xl font-bold"
          style={{
            color: '#fbbf24',
            textShadow: '0 0 20px rgba(251,191,36,0.8)',
            animation: 'perfectPop 1.5s ease-out forwards',
          }}
        >
          {t.slicePerfect}
        </div>
      )}

      {/* 汁水粒子 */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* 种子弹出 */}
      {seeds.map(s => (
        <div
          key={s.id}
          className="absolute pointer-events-none text-2xl"
          style={{
            left: s.x,
            top: s.y,
            transform: 'translate(-50%, -50%)',
            animation: `seedBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${s.delay}ms both`,
          }}
        >
          🌰
        </div>
      ))}

      {/* 道具掉落 */}
      {itemDrops.map(d => (
        <div
          key={d.id}
          className="absolute pointer-events-none text-3xl"
          style={{
            left: d.x,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `itemDrop 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${d.delay}ms both`,
            filter: d.isRare ? 'drop-shadow(0 0 15px rgba(251,191,36,0.8))' : 'none',
          }}
        >
          {ITEM_DEFS[d.itemId].emoji}
        </div>
      ))}

      {/* 结果卡片 */}
      {phase === 'result' && result && (
        <div
          className="absolute inset-x-4 max-w-sm mx-auto rounded-2xl border p-6 animate-fade-up"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <h3 className="text-lg font-semibold text-center mb-4" style={{ color: theme.text }}>
            {melonType === 'legendary' ? t.sliceGoldResult : t.sliceResult}
          </h3>

          {/* 种子 */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🌰</span>
            <span className="text-base font-medium" style={{ color: theme.text }}>
              {t.sliceSeedsObtained(result.seeds)}
            </span>
            {result.isPerfect && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fbbf2420', color: '#fbbf24' }}>
                {t.slicePerfectBonus}
              </span>
            )}
          </div>

          {/* 道具 */}
          {result.items.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {result.items.map((itemId, i) => {
                const def = ITEM_DEFS[itemId];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{
                      backgroundColor: def.rarity === 'rare' ? '#fbbf2415' : `${theme.accent}08`,
                      border: def.rarity === 'rare' ? '1px solid #fbbf2430' : `1px solid ${theme.border}`,
                    }}
                  >
                    <span className="text-xl">{def.emoji}</span>
                    <span className="text-sm font-medium" style={{ color: theme.text }}>
                      {t.itemName(itemId)}
                    </span>
                    {def.rarity === 'rare' && (
                      <span className="text-xs px-1.5 py-0.5 rounded ml-auto" style={{ backgroundColor: '#fbbf2420', color: '#fbbf24' }}>
                        {t.sliceRare}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 收下按钮 */}
          <button
            onClick={handleCollect}
            className="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all"
            style={{ backgroundColor: theme.accent, color: '#fff' }}
          >
            {t.sliceCollect}
          </button>
        </div>
      )}

      {/* CSS 动画 */}
      <style>{`
        @keyframes sliceGuide {
          0%, 100% { opacity: 0.3; transform: translateY(-10px) rotate(-5deg); }
          50% { opacity: 0.8; transform: translateY(10px) rotate(5deg); }
        }
        @keyframes perfectPop {
          0% { transform: scale(0.5); opacity: 0; }
          30% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1) translateY(-40px); opacity: 0; }
        }
        @keyframes seedBounce {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-50%, -150%) scale(1.2); opacity: 1; }
          70% { transform: translate(-50%, -80%) scale(1); }
          85% { transform: translate(-50%, -110%) scale(1.05); }
          100% { transform: translate(-50%, -90%) scale(1); opacity: 1; }
        }
        @keyframes itemDrop {
          0% { transform: translate(-50%, -200%) scale(0); opacity: 0; }
          40% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
          60% { transform: translate(-50%, -70%) scale(1); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
