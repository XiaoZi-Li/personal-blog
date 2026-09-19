'use client';

import { useEffect, useState } from 'react';

/**
 * LocalClock —— 页脚的实时时钟（固定 Asia/Shanghai，与访客所在时区无关）。
 *
 * 首帧渲染占位符、挂载后再写入时间：`new Date()` 在服务端与客户端不可能一致，
 * 直接渲染必然触发 hydration 不匹配。
 */
const FORMAT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Shanghai',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export default function LocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(FORMAT.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-muted-foreground">
      <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--neon-lime)] opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--neon-lime)]" />
      </span>
      <span className="tabular-nums">{time ?? '--:--:--'}</span>
      <span className="opacity-60">UTC+8</span>
    </span>
  );
}
