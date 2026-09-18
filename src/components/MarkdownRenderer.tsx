'use client';

import { useState, memo, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';

function CodeBlock({ children, className }: { children: ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const lang = /language-(\w+)/.exec(className || '')?.[1] || 'code';

  const handleCopy = async () => {
    const text = extractText(children);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用时忽略
    }
  };

  return (
    <div className="group relative my-5 rounded-xl overflow-hidden border border-border bg-background dark:bg-black/60">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background">
        <span className="text-xs font-mono text-muted-foreground tracking-wide lowercase">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-muted-foreground hover:bg-card transition-colors"
          aria-label="复制代码"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[var(--neon-lime)]" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-muted-foreground">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as { props: { children?: ReactNode } }).props?.children);
  }
  return '';
}

export const MarkdownRenderer = memo(function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-body text-sm sm:text-[15px] leading-relaxed text-muted-foreground dark:text-muted-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 id={slugify(children)} className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-border text-foreground dark:text-muted-foreground scroll-mt-24">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 id={slugify(children)} className="group text-xl sm:text-2xl font-bold mt-10 mb-4 flex items-center gap-2.5 text-foreground dark:text-muted-foreground scroll-mt-24">
              <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[var(--glow-violet)] to-[var(--glow-violet)] shrink-0" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={slugify(children)} className="text-lg font-semibold mt-7 mb-3 text-foreground dark:text-muted-foreground scroll-mt-24">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold mt-5 mb-2 text-foreground dark:text-muted-foreground">{children}</h4>
          ),
          p: ({ children }) => <p className="my-4 leading-7">{children}</p>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--neon-violet)] dark:text-[var(--neon-violet)] hover:underline underline-offset-4 font-medium">
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="my-4 space-y-1.5 pl-6 list-disc marker:text-[var(--neon-violet)]">{children}</ul>,
          ol: ({ children }) => <ol className="my-4 space-y-1.5 pl-6 list-decimal marker:text-[var(--neon-violet)] marker:font-semibold">{children}</ol>,
          li: ({ children }) => <li className="leading-7">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-5 pl-4 py-1 border-l-4 border-[var(--neon-violet)] bg-[color-mix(in_oklab,var(--neon-violet)_10%,transparent)] rounded-r-lg text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isBlock = /language-/.test(className || '');
            if (isBlock) return <CodeBlock className={className}>{children}</CodeBlock>;
            return (
              <code className="px-1.5 py-0.5 rounded-md bg-[color-mix(in_oklab,var(--neon-violet)_12%,transparent)] text-[var(--neon-violet)] text-[13px] font-mono">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/60">{children}</thead>,
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left font-semibold border-b border-border whitespace-nowrap">{children}</th>
          ),
          td: ({ children }) => <td className="px-4 py-2.5 border-b border-border/50 last:border-b-0">{children}</td>,
          img: ({ children, ...props }) => (
            <span className="block my-5 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img {...props} className="max-w-full rounded-xl border border-border shadow-md mx-auto" alt={(props as { alt?: string }).alt || ''} />
              {children}
            </span>
          ),
          hr: () => <hr className="my-8 border-border" />,
          strong: ({ children }) => <strong className="font-semibold text-foreground dark:text-muted-foreground">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

export function slugify(children: ReactNode): string {
  return extractText(children)
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

// 从 markdown 提取标题目录
export function extractHeadings(markdown: string): { level: number; text: string; id: string }[] {
  const headings: { level: number; text: string; id: string }[] = [];
  const lines = markdown.split('\n');
  let inCode = false;
  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (match) {
      const text = match[2].replace(/[*`~\[\]]/g, '').trim();
      headings.push({ level: match[1].length, text, id: slugify(text) });
    }
  }
  return headings;
}
