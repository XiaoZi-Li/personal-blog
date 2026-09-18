'use client';

import { useEffect, useRef } from 'react';

/**
 * AuroraField —— 全站底层氛围背景，分成两层：
 *
 * 1. **极光层（CSS）**：三团缓慢漂移的径向渐变色块，用 CSS `transform` 动画。
 *    之所以从 canvas 搬到 CSS：原来每一帧都要在满屏 canvas 上重建并填充 4 个
 *    渐变（约 400 万像素的重绘），是纯粹的填充率浪费。CSS 的 `transform`
 *    动画由合成器处理，几乎不占主线程。
 * 2. **神经节点层（canvas）**：透明画布，只画节点、连线与偶发流星。
 *    每帧的实际填充面积很小，开销从「满屏」降到「几万个像素」。
 *
 * 配色全部走主题令牌：亮/暗切换由 CSS 自动完成，画布的节点色用 MutationObserver 同步。
 */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

/** 深色主题下的节点颜色（rgba 分量 + 透明度） */
const DARK_NET = { node: '190, 240, 255', link: '140, 200, 255', nodeAlpha: 0.85, linkAlpha: 0.16 };
/** 亮色主题：节点要更暗才看得见 */
const LIGHT_NET = { node: '58, 82, 150', link: '96, 118, 190', nodeAlpha: 0.42, linkAlpha: 0.14 };

export default function AuroraField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef<'dark' | 'light'>('dark');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let nodes: Node[] = [];
    let shooting: ShootingStar[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let isMobile = false;
    let paused = false;

    const pointer = { x: -9999, y: -9999, active: false };

    const readTheme = () => {
      themeRef.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    };
    readTheme();

    const themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const palette = () => (themeRef.current === 'dark' ? DARK_NET : LIGHT_NET);

    const seed = () => {
      const divisor = isMobile ? 26000 : 12000;
      const count = Math.min(isMobile ? 30 : 82, Math.max(16, Math.round((w * h) / divisor)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.6 + 0.7,
        pulse: Math.random() * Math.PI * 2,
      }));
      shooting = [];
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      isMobile = w < 768;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const drawNetwork = () => {
      const p = palette();
      const linkDist = isMobile ? 112 : 150;
      const linkDist2 = linkDist * linkDist;

      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > linkDist2) continue;
          const alpha = p.linkAlpha * (1 - Math.sqrt(d2) / linkDist);
          ctx.strokeStyle = `rgba(${p.link}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      nodes.forEach((n) => {
        n.pulse += 0.02;
        const flicker = 0.65 + Math.sin(n.pulse) * 0.35;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.9 + Math.sin(n.pulse) * 0.15), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.node}, ${p.nodeAlpha * flicker})`;
        ctx.fill();
      });
    };

    const stepNodes = () => {
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        if (pointer.active) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          const radius = 170;
          if (d2 < radius * radius && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = (1 - d / radius) * 0.55;
            n.x += (dx / d) * force;
            n.y += (dy / d) * force;
          }
        }

        if (n.x < -12) n.x = w + 12;
        if (n.x > w + 12) n.x = -12;
        if (n.y < -12) n.y = h + 12;
        if (n.y > h + 12) n.y = -12;
      });
    };

    const drawShootingStars = () => {
      // 流星只在深色主题下出现，亮色主题里它是脏点
      if (themeRef.current !== 'dark' || isMobile) return;
      if (shooting.length < 2 && Math.random() < 0.0035) {
        shooting.push({
          x: Math.random() * w * 0.8,
          y: Math.random() * h * 0.4,
          vx: 4.4 + Math.random() * 2.4,
          vy: 1.5 + Math.random() * 1.1,
          life: 0,
          maxLife: 90 + Math.random() * 50,
        });
      }

      shooting = shooting.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life += 1;
        const k = 1 - s.life / s.maxLife;
        if (k <= 0 || s.x > w + 80 || s.y > h + 80) return false;

        const tailX = s.x - s.vx * 22;
        const tailY = s.y - s.vy * 22;
        const g = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        g.addColorStop(0, `rgba(220, 240, 255, ${0.7 * k})`);
        g.addColorStop(1, 'rgba(220, 240, 255, 0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        return true;
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      if (!reduceMotion) stepNodes();
      drawNetwork();
      drawShootingStars();
    };

    const loop = () => {
      if (!paused) render();
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    // 切到后台就停手，回来再继续
    const onVisibility = () => {
      paused = document.hidden;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    if (reduceMotion) {
      render();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* 底色：极淡的斜向渐变，给深空一点方向感 */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,var(--background)_0%,color-mix(in_oklab,var(--glow-violet)_6%,var(--background))_48%,var(--background)_100%)]" />

      {/* 极光层：三团各自漂移，全部走 transform，不触发重绘 */}
      <div
        className="animate-drift absolute -left-[15%] -top-[20%] h-[75vmax] w-[75vmax] rounded-full opacity-70 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--glow-cyan) 22%, transparent) 0%, transparent 62%)',
        }}
      />
      <div
        className="animate-float-slow absolute -right-[18%] top-[6%] h-[70vmax] w-[70vmax] rounded-full opacity-70 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--glow-violet) 24%, transparent) 0%, transparent 60%)',
        }}
      />
      <div
        className="animate-drift absolute bottom-[-26%] left-[18%] h-[62vmax] w-[62vmax] rounded-full opacity-60 will-change-transform [animation-delay:4s]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--glow-magenta) 18%, transparent) 0%, transparent 60%)',
        }}
      />

      {/* 神经节点层 */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
