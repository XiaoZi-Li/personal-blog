'use client';

import { useEffect, useState } from 'react';

interface TypewriterProps {
  /** 依次循环打出的短语 */
  phrases: string[];
  /** 每个字符打出间隔（毫秒） */
  typeSpeed?: number;
  /** 删除间隔（毫秒） */
  deleteSpeed?: number;
  /** 打完一句后的停顿（毫秒） */
  holdTime?: number;
  className?: string;
}

/**
 * Typewriter —— 终端式打字机。
 * 用在 Hero 的职位副标题上：一行行打出「运动控制 → 强化学习 → VLA」的成长路径。
 */
export default function Typewriter({
  phrases,
  typeSpeed = 62,
  deleteSpeed = 28,
  holdTime = 1900,
  className = '',
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing');

  useEffect(() => {
    if (!phrases.length) return;

    const current = phrases[index % phrases.length];

    if (phase === 'typing') {
      if (text === current) {
        const id = setTimeout(() => setPhase('holding'), holdTime);
        return () => clearTimeout(id);
      }
      const id = setTimeout(
        () => setText(current.slice(0, text.length + 1)),
        typeSpeed + Math.random() * 40,
      );
      return () => clearTimeout(id);
    }

    if (phase === 'holding') {
      const id = setTimeout(() => setPhase('deleting'), 220);
      return () => clearTimeout(id);
    }

    if (text === '') {
      const id = setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length);
        setPhase('typing');
      }, 260);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
    return () => clearTimeout(id);
  }, [text, phase, index, phrases, typeSpeed, deleteSpeed, holdTime]);

  return (
    <span className={className}>
      <span>{text}</span>
      <span
        aria-hidden="true"
        className="animate-caret ml-0.5 inline-block w-[2px] translate-y-[2px] self-stretch bg-current align-middle"
        style={{ height: '1em' }}
      />
    </span>
  );
}
