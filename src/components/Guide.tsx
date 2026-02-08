/**
 * 使用说明弹窗 — 首次访问自动弹出，之后可通过 ❓ 图标手动打开
 */
import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { GrowthIcon } from './GrowthIcon';

interface GuideProps {
  onClose: () => void;
}

function Guide({ onClose }: GuideProps) {
  const t = useTheme();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative max-w-sm w-full rounded-2xl p-6 shadow-2xl animate-scale-in max-h-[80vh] overflow-y-auto"
        style={{ backgroundColor: t.surface, color: t.text }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">🍉 西瓜时钟使用指南</h2>

        <div className="space-y-4 text-sm" style={{ color: t.textMuted }}>
          <section>
            <h3 className="font-medium mb-1" style={{ color: t.text }}>番茄工作法</h3>
            <p>西瓜时钟采用番茄工作法（Pomodoro Technique）计时，帮助你高效专注。专注工作 25 分钟 → 短休息 5 分钟 → 重复 4 轮 → 长休息 15 分钟。</p>
          </section>

          <section>
            <h3 className="font-medium mb-1" style={{ color: t.text }}>基本操作</h3>
            <ul className="space-y-1 list-disc list-inside">
              <li>点击播放按钮开始专注</li>
              <li>计时中可暂停或放弃</li>
              <li>完成后自动进入休息，每 4 轮触发长休息</li>
              <li>idle 时点击时间数字可快速调整时长</li>
            </ul>
          </section>

          <section>
            <h3 className="font-medium mb-1" style={{ color: t.text }}>🌱 西瓜生长</h3>
            <p>专注时长越长，西瓜长得越好：</p>
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex items-center gap-2"><GrowthIcon stage="seed" size={18} /><span>&lt;10分钟 · 种子发芽</span></div>
              <div className="flex items-center gap-2"><GrowthIcon stage="sprout" size={18} /><span>10-14分钟 · 幼苗生长</span></div>
              <div className="flex items-center gap-2"><GrowthIcon stage="bloom" size={18} /><span>15-19分钟 · 开花期</span></div>
              <div className="flex items-center gap-2"><GrowthIcon stage="green" size={18} /><span>20-24分钟 · 小西瓜</span></div>
              <div className="flex items-center gap-2"><GrowthIcon stage="ripe" size={18} /><span>≥25分钟 · 成熟西瓜</span></div>
            </div>
          </section>

          <section>
            <h3 className="font-medium mb-1" style={{ color: t.text }}>⚙️ 设置</h3>
            <p>右上角齿轮可自定义：专注/休息时长、自动开始、提醒音效、背景音、音量、主题配色、数据导出。</p>
          </section>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
          style={{ backgroundColor: t.accent, color: 'white' }}
        >
          开始使用
        </button>
      </div>
    </div>
  );
}

/** 使用说明入口 — 管理首次弹出 + 手动打开 */
export function GuideButton() {
  const [showGuide, setShowGuide] = useState(false);
  const t = useTheme();

  // 首次访问自动弹出
  useEffect(() => {
    const seen = localStorage.getItem('pomodoro-guide-seen');
    if (!seen) {
      setShowGuide(true);
    }
  }, []);

  const handleClose = () => {
    setShowGuide(false);
    localStorage.setItem('pomodoro-guide-seen', '1');
  };

  return (
    <>
      <button
        onClick={() => setShowGuide(true)}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer text-sm"
        style={{ color: t.textMuted }}
        aria-label="使用说明"
      >
        ?
      </button>
      {showGuide && <Guide onClose={handleClose} />}
    </>
  );
}
