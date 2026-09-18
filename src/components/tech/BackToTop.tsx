'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/** BackToTop —— 滚动到一定距离后从右下角升起的回到顶部按钮。 */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="回到顶部"
      className={`glass-strong fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-500 hover:-translate-y-1 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      style={{
        boxShadow: show
          ? '0 0 30px -10px color-mix(in oklab, var(--neon-cyan) 75%, transparent)'
          : undefined,
      }}
    >
      <ArrowUp className="h-4 w-4 text-[var(--neon-cyan)]" />
    </button>
  );
}
