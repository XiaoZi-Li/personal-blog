'use client';

import { useEffect, useRef } from 'react';

/**
 * CursorAura —— 跟随鼠标的柔和光晕 + 带阻尼延迟的描边圆环。
 * 「光晕」负责氛围，「圆环」像一个小小的伺服机构一样追着你跑。
 * 触摸设备与「减少动效」偏好下自动禁用。
 */
export default function CursorAura() {
  const auraRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const aura = auraRef.current;
    const ring = ringRef.current;
    if (!aura || !ring) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: target.x, y: target.y };
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        aura.style.opacity = '1';
        ring.style.opacity = '1';
        ringPos.x = e.clientX;
        ringPos.y = e.clientY;
      }
    };

    const onLeave = () => {
      visible = false;
      aura.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onDown = () => {
      ring.style.transform = `translate3d(${ringPos.x - 18}px, ${ringPos.y - 18}px, 0) scale(0.72)`;
    };

    const tick = () => {
      // 光晕几乎立刻跟随
      aura.style.transform = `translate3d(${target.x - 180}px, ${target.y - 180}px, 0)`;
      // 圆环用弹性阻尼跟随
      ringPos.x += (target.x - ringPos.x) * 0.14;
      ringPos.y += (target.y - ringPos.y) * 0.14;
      ring.style.transform = `translate3d(${ringPos.x - 18}px, ${ringPos.y - 18}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] hidden md:block">
      <div
        ref={auraRef}
        className="absolute h-[360px] w-[360px] rounded-full opacity-0 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--neon-cyan) 12%, transparent) 0%, transparent 62%)',
          filter: 'blur(12px)',
        }}
      />
      <div
        ref={ringRef}
        className="absolute h-9 w-9 rounded-full border opacity-0 transition-opacity duration-500"
        style={{
          borderColor: 'color-mix(in oklab, var(--neon-cyan) 45%, transparent)',
          boxShadow: '0 0 18px -4px color-mix(in oklab, var(--neon-cyan) 55%, transparent)',
        }}
      />
    </div>
  );
}
