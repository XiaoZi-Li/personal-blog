import type { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  /** 反向滚动 */
  reverse?: boolean;
  /** 更快的一档速度 */
  fast?: boolean;
  className?: string;
}

/**
 * Marquee —— 无限横向跑马灯。内容会被复制一份以实现无缝循环。
 * 悬停整条轨道会暂停，方便阅读。
 */
export default function Marquee({
  children,
  reverse = false,
  fast = false,
  className = '',
}: MarqueeProps) {
  const anim = fast ? 'animate-marquee-fast' : 'animate-marquee';

  return (
    <div className={`group-marquee marquee-mask relative w-full overflow-hidden ${className}`}>
      <div className="flex w-max">
        <div
          className={`flex shrink-0 items-center ${anim}`}
          style={reverse ? { animationDirection: 'reverse' } : undefined}
        >
          {children}
        </div>
        <div
          aria-hidden="true"
          className={`flex shrink-0 items-center ${anim}`}
          style={reverse ? { animationDirection: 'reverse' } : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
