'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Direction = 'up' | 'left' | 'right' | 'scale';

type RevealProps = {
  children: ReactNode;
  /** 延迟（毫秒），用于做错落入场 */
  delay?: number;
  className?: string;
  /** 静止时的位移距离（兼容旧调用） */
  y?: number;
  /** 入场方向 */
  dir?: Direction;
};

/**
 * Reveal —— 滚动渐显容器。
 *
 * 失败要「开」：默认可见，只有 JS 真正跑起来（html 上有 .js）才隐藏并等待入场。
 * JS 被禁用、脚本报错或 observer 构造失败时，内容依然读得到，不会永久停在 opacity: 0。
 */
export function Reveal({ children, delay = 0, className = '', y = 24, dir }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    try {
      if (typeof IntersectionObserver === 'undefined') {
        const id = window.setTimeout(() => setVisible(true), 0);
        return () => window.clearTimeout(id);
      }

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      );
      obs.observe(el);
      return () => obs.disconnect();
    } catch {
      // 与上面的降级分支一致：用异步方式显示，避免在 effect 体内同步 setState
      const id = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(id);
    }
  }, []);

  return (
    <div
      ref={ref}
      data-dir={dir}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        // 旧调用通过 y 指定位移；新调用用 data-dir
        ...(dir ? {} : { ['--reveal-y' as string]: `${y}px` }),
      }}
    >
      {children}
    </div>
  );
}

export default Reveal;
