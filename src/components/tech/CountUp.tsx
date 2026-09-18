'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** 目标数值 */
  to: number;
  /** 起始数值 */
  from?: number;
  /** 动画时长（毫秒） */
  duration?: number;
  className?: string;
  /** 数字后的后缀，如 "+" */
  suffix?: string;
}

/** CountUp —— 进入视口后数字滚动到目标值。 */
export default function CountUp({
  to,
  from = 0,
  duration = 1400,
  className = '',
  suffix = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(from);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = window.setTimeout(() => setValue(to), 0);
      return () => window.clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || started.current) return;
          started.current = true;
          const start = performance.now();

          const step = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            // easeOutExpo
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            setValue(Math.round(from + (to - from) * eased));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, from, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
