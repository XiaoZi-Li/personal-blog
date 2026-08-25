'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, Eye, Heart, Clock, PenLine, BookOpen,
  Sparkles, Newspaper
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Reveal } from '@/components/Reveal';
import { useLanguage } from '@/contexts/LanguageContext';

interface Post {
  id: string;
  title: string;
  type: 'article' | 'diary';
  summary: string | null;
  content?: string;
  cover: string | null;
  tags: string | null;
  mood: string | null;
  weather: string | null;
  views: number;
  like_count: number;
  is_published: boolean;
  is_pinned: boolean;
  created_at: string;
}

function readingTime(content?: string | null): number {
  if (!content) return 1;
  return Math.max(1, Math.round(content.length / 500));
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const TABS = [
  { key: '', icon: Sparkles },
  { key: 'article', icon: BookOpen },
  { key: 'diary', icon: PenLine },
] as const;

export default function BlogPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<string>('');
  const [search, setSearch] = useState('');

  const fetchPosts = useCallback(async (pageNum: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pageNum), limit: '10' });
      if (tab) params.set('type', tab);
      if (search.trim()) params.set('search', search.trim());
      const res = await fetch(`/api/posts?${params.toString()}`);
      const data = await res.json();
      setPosts(prev => append ? [...prev, ...(data.posts || [])] : (data.posts || []));
      setTotal(data.total || 0);
      setPage(pageNum);
    } catch (e) {
      console.error('加载文章失败:', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [tab, search]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPosts(1, false), search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [fetchPosts, search]);

  const featured = !loading && !search && !tab && posts.length > 0 ? posts[0] : null;
  const restPosts = featured ? posts.slice(1) : posts;
  const hasMore = posts.length < total;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-indigo-300/30 dark:bg-indigo-900/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-rose-300/30 dark:bg-rose-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-medium mb-4">
            <Newspaper className="w-4 h-4" />
            {t('blog.badge')}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">
            {t('blog.title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>
      </section>

      {/* 筛选栏 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {TABS.map(({ key, icon: Icon }) => {
              const label = key === '' ? t('blog.all') : key === 'article' ? t('blog.article') : t('blog.diary');
              const active = tab === key;
              return (
                <button
                  key={key || 'all'}
                  onClick={() => setTab(key)}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                      : 'bg-muted text-muted-foreground hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
          <div className="relative shrink-0 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('blog.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-white/70 dark:bg-slate-900/70 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {total} {t('blog.articleUnit')}
        </p>
      </section>

      {/* 内容 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✍️</div>
            <h3 className="text-lg font-semibold mb-2">{t('blog.empty')}</h3>
            <p className="text-sm text-muted-foreground">{t('blog.emptyDesc')}</p>
          </div>
        ) : (
          <>
            {/* 最新置顶大卡 */}
            {featured && (
              <Reveal>
                <Link href={`/blog/${featured.id}`} className="group block mb-6">
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10" />
                    <div className="relative md:flex">
                      <div className="md:w-1/3 bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-400 p-8 flex items-center justify-center min-h-[140px]">
                        <span className="text-6xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 select-none">
                          {featured.cover || (featured.type === 'diary' ? (featured.mood || '📝') : '📄')}
                        </span>
                      </div>
                      <div className="md:w-2/3 p-5 sm:p-7">
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            featured.type === 'diary'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                          }`}>
                            {featured.type === 'diary' ? t('blog.diary') : t('blog.article')}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[11px] font-medium">
                            {t('blog.latest')}
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 line-clamp-1">
                          {featured.title}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                          {featured.summary}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{featured.views}</span>
                          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{featured.like_count}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{readingTime(featured.summary)} {t('blog.minRead')}</span>
                          <span className="ml-auto">{formatDate(featured.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            )}

            {/* 文章列表 */}
            <div className="space-y-4">
              {restPosts.map((post, idx) => (
                <Reveal key={post.id} delay={Math.min(idx, 6) * 50}>
                  <Link href={`/blog/${post.id}`} className="group block">
                    <div className="flex gap-4 sm:gap-5 rounded-2xl border border-border bg-white dark:bg-slate-900 p-4 sm:p-5 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:-translate-y-0.5">
                      <div className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform ${
                        post.type === 'diary'
                          ? 'bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/20'
                          : 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20'
                      }`}>
                        {post.cover || (post.type === 'diary' ? (post.mood || '📝') : '📄')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            post.type === 'diary'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                          }`}>
                            {post.type === 'diary' ? t('blog.diary') : t('blog.article')}
                          </span>
                          {post.type === 'diary' && post.weather && (
                            <span className="text-[11px] text-muted-foreground">{post.weather}</span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1">
                          {post.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-2.5">
                          {post.summary}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views}</span>
                          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.like_count}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readingTime(post.summary)} {t('blog.minRead')}</span>
                          <span className="ml-auto">{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </>
        )}

        {hasMore && !loading && (
          <div className="text-center mt-8">
            <button
              onClick={() => fetchPosts(page + 1, true)}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all disabled:opacity-60"
            >
              {loadingMore ? '...' : t('blog.loadMore')}
            </button>
          </div>
        )}
        {!hasMore && posts.length > 0 && !loading && (
          <p className="text-center text-xs text-muted-foreground mt-8">{t('blog.noMore')}</p>
        )}
      </section>
    </div>
  );
}
