import type { ReactNode } from 'react';
import Reveal from './Reveal';

interface SectionHeadingProps {
  /** 单行小标签，例如 SYSTEM / 01 */
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * SectionHeading —— 统一的分区标题：
 * 等宽字体的 kicker + 极光渐变标题 + 可选的描述，左侧带一段发光短线的「章节感」。
 */
export default function SectionHeading({
  kicker,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <Reveal className={`${centered ? 'text-center' : 'text-left'} ${className}`}>
      <div
        className={`flex items-center gap-3 ${centered ? 'justify-center' : 'justify-start'}`}
      >
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--glow-cyan)]" />
        <span className="mono-label">{kicker ?? 'SYSTEM'}</span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--glow-violet)]" />
      </div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="text-aurora">{title}</span>
      </h2>
      {description ? (
        <p
          className={`mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base ${
            centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          }`}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
