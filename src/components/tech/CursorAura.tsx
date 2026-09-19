'use client';

import { useEffect, useRef } from 'react';

/**
 * CursorAura —— 跟随鼠标的粒子拖尾。
 *
 * 刻意**不做光标替身**：没有圆环、没有描边、没有任何能被一眼认出的形状，
 * 只有一层会自己消散的微粒。鼠标停下，画面就安静下来。
 *
 * 指针落在可交互元素上时，粒子会换成暖色调并略微加密 —— 交互反馈交给
 * 「光的变化」来表达，而不是给光标套一个壳。卡片自身的悬停反馈
 * （spotlight / tilt / 描边流光）仍然由卡片负责。
 *
 * 触摸设备与「减少动效」偏好下完全禁用。
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 剩余寿命（0..1），用于算透明度和尺寸衰减 */
  life: number;
  decay: number;
  size: number;
  /** 调色板索引 */
  tone: number;
};

/** 上限，防止快速甩动时堆积 */
const MAX_PARTICLES = 140;
/** 每移动 1px 生成的粒子数 */
const SPAWN_PER_PX = 0.11;
/** 精灵图分辨率（实际绘制尺寸远小于它，靠双线性缩放保持柔边） */
const SPRITE = 64;

export default function CursorAura() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* ------------------------------------------------------------------
       取色：把 CSS 变量解析成 canvas 能用的颜色。
       直接赋值 fillStyle 是最稳的探针 —— 值非法时它会保持不变，
       所以「赋值前后不一致」就说明解析成功。oklch / color-mix 都能吃。
       ------------------------------------------------------------------ */
    const probe = document.createElement('canvas').getContext('2d');
    const resolve = (varName: string, fallback: string) => {
      if (!probe) return fallback;
      const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      if (!raw) return fallback;
      probe.fillStyle = '#000000';
      probe.fillStyle = raw;
      const resolved = String(probe.fillStyle);
      // 解析失败时 fillStyle 会停在上一次的 #000000
      return resolved === '#000000' ? fallback : resolved;
    };

    /**
     * 亮色主题用墨色档（深、够对比），暗色主题用亮色档（发光）。
     * 这与全站 --neon-* / --glow-* 的分工保持一致。
     */
    const buildPalette = () => {
      const dark = document.documentElement.classList.contains('dark');
      const [a, b, c] = dark
        ? [
            resolve('--glow-cyan', '#7dd3fc'),
            resolve('--glow-violet', '#a78bfa'),
            resolve('--glow-magenta', '#f0abfc'),
          ]
        : [
            resolve('--neon-cyan', '#0e7490'),
            resolve('--neon-violet', '#5b21b6'),
            resolve('--neon-magenta', '#a21caf'),
          ];
      return { cool: [a, b, c], warm: dark ? [c, resolve('--glow-amber', '#fcd34d'), b] : [c, resolve('--neon-amber', '#b45309'), b] };
    };

    let palette = buildPalette();
    let sprites: HTMLCanvasElement[] = [];

    /** 预渲染柔边光点：每帧为每个粒子新建渐变太贵 */
    const buildSprites = () => {
      const tones = [...palette.cool, ...palette.warm];
      sprites = tones.map((color) => {
        const c = document.createElement('canvas');
        c.width = SPRITE;
        c.height = SPRITE;
        const g = c.getContext('2d');
        if (g) {
          const grad = g.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
          grad.addColorStop(0, color);
          grad.addColorStop(0.35, color);
          grad.addColorStop(1, 'transparent');
          g.fillStyle = grad;
          g.beginPath();
          g.arc(SPRITE / 2, SPRITE / 2, SPRITE / 2, 0, Math.PI * 2);
          g.fill();
        }
        return c;
      });
    };

    buildSprites();

    // 主题切换时重建调色板与精灵
    const themeObserver = new MutationObserver(() => {
      palette = buildPalette();
      buildSprites();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    /* ------------------------------- 画布尺寸 ------------------------------- */
    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /* ------------------------------- 粒子状态 ------------------------------- */
    const particles: Particle[] = [];
    const pointer = { x: width / 2, y: height / 2, px: width / 2, py: height / 2, moved: false, warm: false };
    let raf = 0;
    let running = false;

    const spawn = (x: number, y: number, count: number, warm: boolean) => {
      for (let i = 0; i < count; i += 1) {
        if (particles.length >= MAX_PARTICLES) return;
        const toneBase = warm ? 3 : 0;
        // 大多数是冷色主调，偶尔混一点暖色/品红，避免单调
        const tone = toneBase + (Math.random() < 0.72 ? 0 : Math.random() < 0.5 ? 1 : 2);
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35 - 0.12,
          life: 1,
          decay: 0.018 + Math.random() * 0.022,
          size: 1 + Math.random() * 1.9,
          tone: Math.min(tone, 5),
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.moved = true;
      const el = e.target as Element | null;
      pointer.warm = !!el?.closest?.('a, button, [role="button"], input, textarea, select, [data-particle-warm]');
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onDown = (e: PointerEvent) => {
      // 点击来一小圈爆发，很短很轻
      spawn(e.clientX, e.clientY, 14, pointer.warm);
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      // 上一帧指针位置 → 沿线段插值补粒子，快速移动才不会断续
      if (pointer.moved) {
        const dx = pointer.x - pointer.px;
        const dy = pointer.y - pointer.py;
        const dist = Math.hypot(dx, dy);
        pointer.moved = false;
        if (dist > 0.5) {
          const steps = Math.min(12, Math.max(1, Math.floor(dist * SPAWN_PER_PX * 3)));
          for (let i = 0; i < steps; i += 1) {
            const t = i / steps;
            spawn(pointer.px + dx * t, pointer.py + dy * t, 1, pointer.warm);
          }
        }
        pointer.px = pointer.x;
        pointer.py = pointer.y;
      }

      ctx.clearRect(0, 0, width, height);
      const dark = document.documentElement.classList.contains('dark');
      // 暗色下用叠加让粒子互相提亮；亮色下叠加会发白，改用正常合成
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.004; // 轻微下沉，像灰尘
        p.vx *= 0.985;
        p.vy *= 0.985;

        const eased = p.life * p.life;
        const r = p.size * (0.35 + eased * 0.9);
        const sprite = sprites[p.tone];
        if (!sprite) continue;

        ctx.globalAlpha = (dark ? 0.5 : 0.32) * eased;
        ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      // 没有粒子且指针静止 → 停下 rAF，别空转
      if (particles.length === 0 && !pointer.moved) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('resize', resize);
    const onLeave = () => {
      pointer.moved = false;
    };
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', resize);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] hidden md:block"
    />
  );
}
