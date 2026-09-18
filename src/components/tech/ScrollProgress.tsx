'use client';

import { useEffect, useState } from 'react';

/** ScrollProgress —— 顶部极光进度条，像一条随着阅读推进而被点亮的信号线。 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, doc.scrollTop / total)) : 0);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-transparent"
    >
      <div
        className="h-full origin-left transition-transform duration-150 ease-out"
        style={{
          transform: `scaleX(${progress})`,
          background:
            'linear-gradient(90deg, var(--neon-cyan), var(--neon-violet) 55%, var(--neon-magenta))',
          boxShadow: '0 0 14px 0 color-mix(in oklab, var(--neon-cyan) 60%, transparent)',
        }}
      />
    </div>
  );
}
