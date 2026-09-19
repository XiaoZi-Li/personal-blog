'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Cpu, CircuitBoard, Wifi, Zap, ArrowLeft, Eye, Heart,
  Clock, BookOpen, Pin, List, CalendarDays
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MarkdownRenderer, extractHeadings } from '@/components/MarkdownRenderer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';

interface Post {
  id: string;
  title: string;
  type: string;
  category: string | null;
  summary: string | null;
  content: string;
  cover: string | null;
  tags: string | null;
  difficulty: string | null;
  views: number;
  like_count: number;
  is_published: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

interface RelatedPost {
  id: string;
  title: string;
  category: string | null;
  summary: string | null;
  cover: string | null;
  difficulty: string | null;
  views: number;
  like_count: number;
  created_at: string;
}

const CATEGORY_CONFIG: Record<string, { key: string; icon: typeof Cpu; gradient: string; emoji: string }> = {
  '51mcu': { key: 'c51', icon: Cpu, gradient: 'from-[var(--glow-amber)] to-[var(--glow-amber)]', emoji: '🔧' },
  stm32: { key: 'stm32', icon: CircuitBoard, gradient: 'from-[var(--glow-cyan)] to-[var(--glow-cyan)]', emoji: '⚡' },
  esp32: { key: 'esp32', icon: Wifi, gradient: 'from-[var(--glow-lime)] to-[var(--glow-lime)]', emoji: '📡' },
  dcdc: { key: 'dcdc', icon: Zap, gradient: 'from-[var(--glow-violet)] to-[var(--glow-violet)]', emoji: '🔋' },
};

// 同 tutorials 列表页：亮色档底 + 同色小字对比度不足，底改用墨色档低透明度
const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-[color-mix(in_oklab,var(--neon-lime)_16%,transparent)] text-[var(--neon-lime)] dark:bg-[color-mix(in_oklab,var(--neon-lime)_40%,transparent)] dark:text-[var(--neon-lime)] border-[var(--neon-lime)] dark:border-[var(--neon-lime)]',
  intermediate: 'bg-[color-mix(in_oklab,var(--neon-amber)_16%,transparent)] text-[var(--neon-amber)] dark:bg-[color-mix(in_oklab,var(--neon-amber)_40%,transparent)] dark:text-[var(--neon-amber)] border-[var(--neon-amber)] dark:border-[var(--neon-amber)]',
  advanced: 'bg-[color-mix(in_oklab,var(--neon-magenta)_16%,transparent)] text-[var(--neon-magenta)] dark:bg-[color-mix(in_oklab,var(--neon-magenta)_40%,transparent)] dark:text-[var(--neon-magenta)] border-[var(--neon-magenta)] dark:border-[var(--neon-magenta)]',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export default function TutorialDetailPage() {
  const { id } = useParams() as { id: string };
  const { t } = useLanguage();
  const { user } = useUser();

  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState<string>('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setPost(data.post);
        setRelated(data.related || []);
        setLikeCount(data.post?.like_count || 0);
      } catch (e) {
        console.error('加载教程失败:', e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  // 点赞状态
  useEffect(() => {
    const fetchLike = async () => {
      try {
        const res = await fetch(`/api/posts/like?post_ids=${id}`);
        const data = await res.json();
        setLiked((data.liked_ids || []).includes(id));
      } catch { /* ignore */ }
    };
    if (id) fetchLike();
  }, [id, user]);

  const handleLike = async () => {
    try {
      const res = await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: id }),
      });
      const data = await res.json();
      if (data.success) {
        setLiked(data.is_liked);
        setLikeCount(data.like_count);
        if (data.is_liked) {
          setLikeAnimating(true);
          setTimeout(() => setLikeAnimating(false), 600);
        }
      }
    } catch (e) {
      console.error('点赞失败:', e);
    }
  };

  // 阅读进度 + 目录高亮
  const headings = useMemo(() => post ? extractHeadings(post.content) : [], [post]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min((window.scrollY / total) * 100, 100) : 0);

      // 高亮当前标题
      for (let i = headings.length - 1; i >= 0; i--) {
        const headingEl = document.getElementById(headings[i].id);
        if (headingEl && headingEl.getBoundingClientRect().top < 120) {
          setActiveHeading(headings[i].id);
          return;
        }
      }
      if (headings.length > 0) setActiveHeading(headings[0].id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  const scrollTo = useCallback((headingId: string) => {
    const el = document.getElementById(headingId);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }
  }, []);

  const config = post?.category ? CATEGORY_CONFIG[post.category] : null;
  const minRead = useMemo(() => post ? Math.max(1, Math.round(post.content.length / 500)) : 1, [post]);

  if (loading) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-12 w-full mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" style={{ width: `${90 - i * 5}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-bold mb-3">{t('tutorials.empty')}</h1>
          <Link href="/tutorials" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--glow-violet)] text-slate-900 text-sm font-medium hover:bg-[var(--glow-violet)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('tutorials.backToList')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 阅读进度条 */}
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[var(--glow-violet)] via-[var(--glow-violet)] to-[var(--glow-magenta)] transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 头部横幅：底色是亮色档（--glow-*），白字直接压上去只有 ~2:1，
          所以先盖一层压暗蒙版，再让白色文字落在它上面 */}
      <section className={`relative overflow-hidden py-10 sm:py-14 bg-gradient-to-br ${config?.gradient || 'from-[var(--glow-violet)] to-[var(--glow-violet)]'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.2),transparent_50%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-black/55" />
        <div className="absolute -right-6 -bottom-10 text-[120px] sm:text-[160px] opacity-20 select-none rotate-[-8deg]">
          {post.cover || config?.emoji || '📖'}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/tutorials" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('tutorials.backToList')}
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {config && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-xs font-medium">
                {(() => { const Icon = config.icon; return <Icon className="w-3.5 h-3.5" />; })()}
                {t(`tutorials.categories.${config.key}`)}
              </span>
            )}
            {post.difficulty && (
              <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm text-white text-xs">
                {t(`tutorials.difficulty.${post.difficulty}`)}
              </span>
            )}
            {post.is_pinned && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[color-mix(in_oklab,var(--neon-amber)_12%,transparent)] text-[var(--neon-amber)] text-xs font-medium">
                <Pin className="w-3 h-3 fill-[var(--neon-amber)]" />
                TOP
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-4 drop-shadow-sm">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/85 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              {formatDate(post.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {minRead} {t('tutorials.minRead')}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views} {t('tutorials.views')}
            </span>
            {post.tags && (
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {post.tags.split(',').slice(0, 4).map(tag => tag.trim()).join(' · ')}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 正文 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-10">
          <article className="max-w-3xl bg-card dark:bg-background rounded-2xl border border-border shadow-sm p-5 sm:p-10">
            <MarkdownRenderer content={post.content} />

            {/* 底部互动 */}
            <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
              <Link href="/tutorials" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[var(--neon-violet)] dark:hover:text-[var(--neon-violet)] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('tutorials.backToList')}
              </Link>
              <button
                onClick={handleLike}
                className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  liked
                    ? 'bg-[var(--glow-magenta)] text-slate-900 shadow-lg border border-transparent'
                    : 'bg-[color-mix(in_oklab,var(--neon-magenta)_12%,transparent)] text-[var(--neon-magenta)] border border-[color-mix(in_oklab,var(--neon-magenta)_35%,transparent)] hover:bg-[color-mix(in_oklab,var(--neon-magenta)_20%,transparent)]'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-slate-900' : ''} ${likeAnimating ? 'animate-bounce' : ''}`} />
                {liked ? t('tutorials.likeBtn') : t('tutorials.likeBtn')} {likeCount}
              </button>
            </div>
          </article>

          {/* 目录侧栏 */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              {headings.length > 0 && (
                <nav className="rounded-2xl border border-border bg-card dark:bg-background p-4 shadow-sm">
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground dark:text-muted-foreground">
                    <List className="w-4 h-4 text-[var(--neon-violet)]" />
                    {t('tutorials.toc')}
                  </h4>
                  <div className="relative">
                    <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
                    <ul className="space-y-1">
                      {headings.map((h, i) => (
                        <li key={`${h.id}-${i}`} className="relative">
                          <button
                            onClick={() => scrollTo(h.id)}
                            className={`relative w-full text-left text-xs leading-relaxed pl-5 py-1 rounded-md transition-all ${
                              activeHeading === h.id
                                ? 'text-[var(--neon-violet)] dark:text-[var(--neon-violet)] font-medium'
                                : 'text-muted-foreground hover:text-foreground'
                            } ${h.level === 3 ? 'pl-8' : ''}`}
                          >
                            <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full transition-all ${
                              activeHeading === h.id
                                ? 'bg-[var(--glow-violet)] scale-125 ring-4 ring-[color-mix(in_oklab,var(--neon-violet)_15%,transparent)]'
                                : 'bg-border'
                            } ${h.level === 3 ? 'left-2' : ''}`} />
                            {h.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </nav>
              )}
            </div>
          </aside>
        </div>

        {/* 相关推荐 */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-lg sm:text-xl font-bold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[var(--glow-violet)] to-[var(--glow-violet)]" />
              {t('tutorials.related')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(rp => {
                const rc = rp.category ? CATEGORY_CONFIG[rp.category] : null;
                return (
                  <Link key={rp.id} href={`/tutorials/${rp.id}`} className="group">
                    <div className="h-full rounded-2xl border border-border bg-card dark:bg-background p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${rc?.gradient || 'from-[var(--glow-violet)] to-[var(--glow-violet)]'} flex items-center justify-center text-white text-lg mb-3 group-hover:scale-110 transition-transform`}>
                        {rp.cover || rc?.emoji || '📖'}
                      </div>
                      <h3 className="font-semibold text-sm text-foreground dark:text-muted-foreground group-hover:text-[var(--neon-violet)] dark:group-hover:text-[var(--neon-violet)] transition-colors line-clamp-2 mb-1.5">
                        {rp.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{rp.summary}</p>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{rp.views}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{rp.like_count}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
