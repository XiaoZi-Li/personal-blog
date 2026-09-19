'use client';

import { useRef, type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** HUD 四角装饰 */
  hud?: boolean;
  /** 悬停时环形流光描边 */
  neon?: boolean;
  /** 鼠标光晕高光 */
  spotlight?: boolean;
  /** 悬停上浮 */
  lift?: boolean;
  /**
   * 表面材质。
   * - `panel`（默认）：近乎不透明的面板 + 发丝边。无 backdrop-filter，
   *   文字对比度可预测、GPU 开销低；极光仍会从 alpha 里透出一点。
   * - `glass`：真玻璃。只留给导航、Hero 主面板这类确实需要浮在场景上的少数位置。
   */
  surface?: 'panel' | 'glass';
}

/**
 * GlassCard —— 全站统一的卡片容器。
 *
 * 名称保留历史叫法，默认材质已改为 `panel`：玻璃拟态用满全站会同时牺牲
 * 对比度与帧率，只在少数位置保留才成立。
 */
export default function GlassCard({
  children,
  className = '',
  hud = true,
  neon = true,
  spotlight = true,
  lift = true,
  surface = 'panel',
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    if (spotlight) {
      el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    }

    // 描边流光从指针进来的方向起转，而不是每次都从 0° 开始。
    // 动画只定义了 to 关键帧，所以起转点就是这里的当前值。
    const cx = e.clientX - (rect.left + rect.width / 2);
    const cy = e.clientY - (rect.top + rect.height / 2);
    if (cx !== 0 || cy !== 0) {
      el.style.setProperty('--border-angle', `${(Math.atan2(cy, cx) * 180) / Math.PI + 90}deg`);
    }
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMove}
      onMouseMove={handleMove}
      className={[
        surface === 'glass' ? 'glass' : 'panel',
        'relative overflow-hidden rounded-2xl',
        'shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_24px_60px_-30px_rgba(0,0,0,0.7)]',
        hud ? 'hud-frame' : '',
        neon ? 'neon-border' : '',
        spotlight ? 'spotlight-card' : '',
        lift ? 'transition-all duration-500 hover:-translate-y-1' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
