'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Cpu, CircuitBoard, Wifi, Zap, Search, Eye, Heart,
  Clock, BookOpen, GraduationCap, Pin, Layers
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Reveal } from '@/components/Reveal';
import { useLanguage } from '@/contexts/LanguageContext';

interface Post {
  id: string;
  title: string;
  type: string;
  category: string | null;
  summary: string | null;
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

const CATEGORY_CONFIG: Record<string, {
  key: string; icon: typeof Cpu; gradient: string; lightBg: string; emoji: string;
}> = {
  '51mcu': { key: 'c51', icon: Cpu, gradient: 'from-amber-500 to-orange-600', lightBg: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20', emoji: '🔧' },
  stm32: { key: 'stm32', icon: CircuitBoard, gradient: 'from-sky-500 to-blue-600', lightBg: 'from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/20', emoji: '⚡' },
  esp32: { key: 'esp32', icon: Wifi, gradient: 'from-emerald-500 to-teal-600', lightBg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20', emoji: '📡' },
  dcdc: { key: 'dcdc', icon: Zap, gradient: 'from-violet-500 to-purple-600', lightBg: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20', emoji: '🔋' },
};

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

function readingTime(content?: string | null): number {
  if (!content) return 1;
  return Math.max(1, Math.round(content.length / 500));
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function TutorialsPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [search, setSearch] = useState('');

  const fetchPosts = useCallback(async (pageNum: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const params = new URLSearchParams({ type: 'tutorial', page: String(pageNum), limit: '12' });
      if (category) params.set('category', category);
      if (difficulty) params.set('difficulty', difficulty);
      if (search.trim()) params.set('search', search.trim());
      const res = await fetch(`/api/posts?${params.toString()}`);
      const data = await res.json();
      setPosts(prev => append ? [...prev, ...(data.posts || [])] : (data.posts || []));
      setTotal(data.total || 0);
      setPage(pageNum);
    } catch (e) {
      console.error('加载教程失败:', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, difficulty, search]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPosts(1, false), search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [fetchPosts, search]);

  const hasMore = posts.length < total;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/30" />
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-violet-300/30 dark:bg-violet-900/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs sm:text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            {t('tutorials.badge')}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            {t('tutorials.title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {t('tutorials.subtitle')}
          </p>
        </div>
      </section>

      {/* 分类入口卡片 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 sm:mt-0 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(CATEGORY_CONFIG).map(([catId, config], idx) => {
            const Icon = config.icon;
            const isActive = category === catId;
            return (
              <Reveal key={catId} delay={idx * 80}>
                <button
                  onClick={() => setCategory(isActive ? '' : catId)}
                  className={`group relative w-full text-left rounded-2xl border p-4 sm:p-5 transition-all duration-300 overflow-hidden ${
                    isActive
                      ? 'border-violet-400 dark:border-violet-600 shadow-lg shadow-violet-500/10 scale-[1.02]'
                      : 'border-border bg-white/70 dark:bg-slate-900/70 hover:border-violet-300 dark:hover:border-violet-700 hover:-translate-y-1 hover:shadow-xl'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.lightBg} opacity-0 ${isActive ? 'opacity-100' : 'group-hover:opacity-100'} transition-opacity`} />
                  <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="relative font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 mb-1">
                    {t(`tutorials.categories.${config.key}`)}
                  </h3>
                  <p className="relative text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {t(`tutorials.categoriesDesc.${config.key}`)}
                  </p>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* 筛选栏 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* 分类标签 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            <button
              onClick={() => setCategory('')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                !category
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25'
                  : 'bg-muted text-muted-foreground hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-violet-900/40 dark:hover:text-violet-300'
              }`}
            >
              {t('tutorials.all')}
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([catId, config]) => (
              <button
                key={catId}
                onClick={() => setCategory(catId)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  category === catId
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25'
                    : 'bg-muted text-muted-foreground hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-violet-900/40 dark:hover:text-violet-300'
                }`}
              >
                {t(`tutorials.categories.${config.key}`)}
              </button>
            ))}
            <div className="w-px h-5 bg-border shrink-0 mx-1 hidden sm:block" />
            {(['beginner', 'intermediate', 'advanced'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(difficulty === diff ? '' : diff)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs border transition-all ${
                  difficulty === diff
                    ? DIFFICULTY_STYLES[diff]
                    : 'border-border text-muted-foreground hover:border-current/50'
                }`}
              >
                {t(`tutorials.difficulty.${diff}`)}
              </button>
            ))}
          </div>

          {/* 搜索框 */}
          <div className="relative shrink-0 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('tutorials.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-white/70 dark:bg-slate-900/70 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {total} {t('tutorials.tutorialsUnit')}
        </p>
      </section>

      {/* 教程网格 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-md">
                <Skeleton className="h-32 rounded-t-xl" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">{t('tutorials.empty')}</h3>
            <p className="text-sm text-muted-foreground">{t('tutorials.emptyDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((post, idx) => {
              const config = CATEGORY_CONFIG[post.category || ''] || CATEGORY_CONFIG.stm32;
              const Icon = config.icon;
              return (
                <Reveal key={post.id} delay={Math.min(idx, 8) * 60}>
                  <Link href={`/tutorials/${post.id}`} className="group block h-full">
                    <Card className="h-full border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
                      {/* 封面 */}
                      <div className={`relative h-32 sm:h-36 bg-gradient-to-br ${config.gradient} overflow-hidden`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.25),transparent_60%)]" />
                        <div className="absolute -right-4 -bottom-6 w-28 h-28 rounded-full bg-white/10 blur-sm group-hover:scale-125 transition-transform duration-500" />
                        <div className="absolute right-3 bottom-2 text-5xl opacity-30 group-hover:opacity-50 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                          {post.cover || config.emoji}
                        </div>
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                          <Icon className="w-3.5 h-3.5" />
                          {t(`tutorials.categories.${config.key}`)}
                        </div>
                        {post.is_pinned && (
                          <div className="absolute top-3 right-3">
                            <Pin className="w-4 h-4 text-white fill-white drop-shadow" />
                          </div>
                        )}
                        {!post.is_published && (
                          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/40 text-white text-[10px] backdrop-blur-sm">
                            {t('tutorials.unpublished')}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-2">
                          {post.difficulty && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium border ${DIFFICULTY_STYLES[post.difficulty] || ''}`}>
                              {t(`tutorials.difficulty.${post.difficulty}`)}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2 mb-1.5">
                          {post.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                          {post.summary}
                        </p>
                        {post.tags && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {post.tags.split(',').slice(0, 3).map((tag, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground">
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-[11px] sm:text-xs text-muted-foreground pt-2 border-t border-border/60">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            {post.like_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {readingTime(post.summary)} {t('tutorials.minRead')}
                          </span>
                          <span className="ml-auto">{formatDate(post.created_at)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* 加载更多 */}
        {hasMore && !loading && (
          <div className="text-center mt-8">
            <button
              onClick={() => fetchPosts(page + 1, true)}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all disabled:opacity-60"
            >
              <Layers className="w-4 h-4" />
              {loadingMore ? '...' : t('tutorials.loadMore')}
            </button>
          </div>
        )}
        {!hasMore && posts.length > 0 && !loading && (
          <p className="text-center text-xs text-muted-foreground mt-8">{t('tutorials.noMore')}</p>
        )}
      </section>

      {/* 底部装饰 */}
      <div className="text-center pb-12 text-muted-foreground/50">
        <GraduationCap className="w-8 h-8 mx-auto mb-2" />
      </div>
    </div>
  );
}
