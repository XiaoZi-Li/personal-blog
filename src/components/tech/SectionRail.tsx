'use client';

import { useEffect, useState } from 'react';

export interface RailSection {
  id: string;
  label: string;
}

/**
 * SectionRail —— 右侧的章节导航轨。
 *
 * 长页面里读者需要一个「我在哪、还剩多少」的坐标，
 * 这条轨道把横线、刻度点和当前章节名放在一起：默认只是一列安静的小点，
 * 只有当前章节延展成一条短线 + 文字标签。
 */
export default function SectionRail({ sections }: { sections: RailSection[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          // 取当前与视口中线相交的那一段
          const visible = entries.filter((e) => e.isIntersecting);
          if (visible.length === 0) return;
          const topMost = visible.reduce((best, cur) =>
            cur.boundingClientRect.top < best.boundingClientRect.top ? cur : best,
          );
          setActiveId(topMost.target.id);
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
      );

      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    } catch {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.map((s) => s.id).join('|')]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="页面章节"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="pointer-events-auto flex flex-col items-end gap-3.5">
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => go(section.id)}
                aria-current={isActive ? 'true' : undefined}
                className="group flex items-center gap-2.5 rounded-full py-0.5 pl-3 pr-0.5 transition-opacity duration-300"
              >
                <span
                  className={`font-mono text-[10px] tracking-[0.14em] transition-all duration-300 ${
                    isActive
                      ? 'translate-x-0 text-[var(--neon-cyan)] opacity-100'
                      : 'translate-x-1 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                  }`}
                >
                  {section.label}
                </span>
                <span
                  className={`h-px transition-all duration-500 ${
                    isActive
                      ? 'w-6 bg-[var(--neon-cyan)]'
                      : 'w-3 bg-[color-mix(in_oklab,var(--muted-foreground)_55%,transparent)] group-hover:w-4.5'
                  }`}
                />
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500 ${
                    isActive
                      ? 'scale-125 bg-[var(--neon-cyan)] shadow-[0_0_10px_0_color-mix(in_oklab,var(--glow-cyan)_80%,transparent)]'
                      : 'bg-[color-mix(in_oklab,var(--muted-foreground)_45%,transparent)]'
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
