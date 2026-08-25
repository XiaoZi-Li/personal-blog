'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Eye, Heart, Clock, BookOpen, PenLine, CalendarDays, CloudSun
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { MarkdownRenderer, extractHeadings } from '@/components/MarkdownRenderer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';

interface Post {
  id: string;
  title: string;
  type: 'article' | 'diary';
  summary: string | null;
  content: string;
  cover: string | null;
  tags: string | null;
  mood: string | null;
  weather: string | null;
  views: number;
  like_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface RelatedPost {
  id: string;
  title: string;
  type: string;
  summary: string | null;
  cover: string | null;
  mood: string | null;
  views: number;
  like_count: number;
  created_at: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export default function BlogDetailPage() {
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
        console.error('加载文章失败:', e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

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

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min((window.scrollY / total) * 100, 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const minRead = useMemo(() => post ? Math.max(1, Math.round(post.content.length / 500)) : 1, [post]);
  const isDiary = post?.type === 'diary';

  if (loading) {
    return (
      <div className="min-h-screen pt-16 max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-4 w-48 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4" style={{ width: `${90 - i * 5}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-bold mb-3">{t('blog.empty')}</h1>
          <Link href="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* 阅读进度条 */}
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 头部 */}
      <section className={`relative overflow-hidden py-10 sm:py-14 ${
        isDiary
          ? 'bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-rose-950/20 dark:to-orange-950/10'
          : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-purple-950/10'
      }`}>
        <div className="absolute -right-4 -bottom-8 text-[100px] sm:text-[140px] opacity-10 select-none rotate-[-6deg]">
          {post.cover || (isDiary ? (post.mood || '📝') : '📄')}
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('blog.backToBlog')}
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-medium ${
              isDiary ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
            }`}>
              {isDiary ? <PenLine className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
              {isDiary ? t('blog.diary') : t('blog.article')}
            </span>
            {isDiary && post.mood && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 border border-border text-xs">
                <span>{post.mood}</span>
                <span className="text-muted-foreground">{t('blog.mood')}</span>
              </span>
            )}
            {isDiary && post.weather && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 border border-border text-xs text-muted-foreground">
                <CloudSun className="w-3.5 h-3.5" />
                {post.weather}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              {formatDate(post.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {minRead} {t('blog.minRead')}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views} {t('blog.views')}
            </span>
          </div>
        </div>
      </section>

      {/* 正文 */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <article className="bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-sm p-5 sm:p-10">
          <MarkdownRenderer content={post.content} />

          {post.tags && (
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-2">
              {post.tags.split(',').map((tag, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t('blog.backToBlog')}
            </Link>
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                liked
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''} ${likeAnimating ? 'animate-bounce' : ''}`} />
              {t('tutorials.likeBtn')} {likeCount}
            </button>
          </div>
        </article>

        {/* 相关推荐 */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold mb-4">{t('tutorials.related')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(rp => (
                <Link key={rp.id} href={`/blog/${rp.id}`} className="group">
                  <div className="flex gap-3 rounded-2xl border border-border bg-white dark:bg-slate-900 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center text-2xl">
                      {rp.cover || (rp.type === 'diary' ? (rp.mood || '📝') : '📄')}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {rp.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{rp.summary}</p>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{rp.views}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{rp.like_count}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
