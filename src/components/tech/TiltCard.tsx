'use client';

import { useRef, type ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** 最大倾斜角度（度） */
  max?: number;
  /** 是否跟随鼠标显示内部光晕 */
  spotlight?: boolean;
}

/**
 * TiltCard —— 3D 倾斜卡片 + 鼠标光晕。
 * 指针位置同时驱动 rotateX/rotateY 与内部 radial-gradient 的高光坐标，
 * 让卡片像一块被手电扫过的金属面板。
 */
export default function TiltCard({
  children,
  className = '',
  max = 7,
  spotlight = true,
}: TiltCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const rect = wrap.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    wrap.classList.add('is-tilting');
    inner.style.transform = `rotateY(${(px - 0.5) * max * 2}deg) rotateX(${(0.5 - py) * max * 2}deg) translateZ(6px)`;

    if (spotlight) {
      inner.style.setProperty('--mx', `${px * 100}%`);
      inner.style.setProperty('--my', `${py * 100}%`);
    }
  };

  const handleLeave = () => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    wrap.classList.remove('is-tilting');
    inner.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`tilt-wrap h-full ${className}`}
    >
      <div
        ref={innerRef}
        className={`tilt-inner h-full ${spotlight ? 'spotlight-card' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}
