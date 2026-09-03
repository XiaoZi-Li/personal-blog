'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Camera, Play, X, ChevronLeft, ChevronRight, Image as ImageIcon, Film, Sparkles
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Reveal } from '@/components/Reveal';
import { useLanguage } from '@/contexts/LanguageContext';

interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  type: 'image' | 'video';
  url: string;
  thumbnail: string | null;
  category: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

// 把视频页面的 URL 转成可嵌入的播放地址
function toEmbedUrl(url: string): string | null {
  try {
    // Bilibili: https://www.bilibili.com/video/BVxxxx
    const bv = /bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/.exec(url);
    if (bv) return `https://player.bilibili.com/player.html?bvid=${bv[1]}&autoplay=0&danmaku=0`;
    // YouTube: https://www.youtube.com/watch?v=xxx 或 youtu.be/xxx
    const yt = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/.exec(url);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    return null;
  } catch {
    return null;
  }
}

const CATEGORY_ICONS: Record<string, string> = {
  works: '💡',
  competition: '🏆',
  life: '🌱',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function GalleryPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      const res = await fetch(`/api/media?${params.toString()}`);
      const data = await res.json();
      setItems(data.media || []);
    } catch (e) {
      console.error('加载作品失败:', e);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const current = lightboxIndex >= 0 && lightboxIndex < items.length ? items[lightboxIndex] : null;

  const closeLightbox = useCallback(() => setLightboxIndex(-1), []);
  const prev = useCallback(() => setLightboxIndex(i => (i > 0 ? i - 1 : items.length - 1)), [items.length]);
  const next = useCallback(() => setLightboxIndex(i => (i < items.length - 1 ? i + 1 : 0)), [items.length]);

  // 键盘导航
  useEffect(() => {
    if (lightboxIndex < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, closeLightbox, prev, next]);

  const imageCount = items.filter(m => m.type === 'image').length;
  const videoCount = items.filter(m => m.type === 'video').length;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950/20" />
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-rose-300/30 dark:bg-rose-900/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber-300/30 dark:bg-amber-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-medium mb-4">
            <Camera className="w-4 h-4" />
            {t('gallery.badge')}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            {t('gallery.title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>
      </section>

      {/* 筛选栏 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {[
              { key: '', label: t('gallery.all') },
              { key: 'works', label: t('gallery.categories.works') },
              { key: 'competition', label: t('gallery.categories.competition') },
              { key: 'life', label: t('gallery.categories.life') },
            ].map(({ key, label }) => (
              <button
                key={key || 'all'}
                onClick={() => setCategory(key)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  category === key
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/25'
                    : 'bg-muted text-muted-foreground hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-900/40 dark:hover:text-rose-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {!loading && items.length > 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-3">
              <span className="flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5" />{imageCount}</span>
              <span className="flex items-center gap-1"><Film className="w-3.5 h-3.5" />{videoCount}</span>
            </p>
          )}
        </div>
      </section>

      {/* 网格 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📷</div>
            <h3 className="text-lg font-semibold mb-2">{t('gallery.empty')}</h3>
            <p className="text-sm text-muted-foreground">{t('gallery.emptyDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {items.map((item, idx) => {
              const isVideo = item.type === 'video';
              const embed = isVideo ? toEmbedUrl(item.url) : null;
              return (
                <Reveal key={item.id} delay={Math.min(idx, 8) * 60}>
                  <button
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-muted shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
                  >
                    {/* 缩略图 */}
                    {isVideo ? (
                      item.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : embed ? (
                        <iframe
                          src={`${embed}&high_quality=1`}
                          className="w-full h-full pointer-events-none"
                          scrolling="no"
                          frameBorder="0"
                          title={item.title}
                        />
                      ) : (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      )
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}

                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* 视频播放按钮 */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-500/80 transition-all duration-300">
                          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* 分类角标 */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-[11px] font-medium">
                      {CATEGORY_ICONS[item.category] || '💡'} {t(`gallery.categories.${item.category}`)}
                    </span>

                    {/* 标题 */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5 text-left translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white text-sm font-semibold line-clamp-1">{item.title}</p>
                      {item.description && (
                        <p className="text-white/70 text-xs line-clamp-1 mt-0.5">{item.description}</p>
                      )}
                      <p className="text-white/50 text-[10px] mt-1">{formatDate(item.created_at)}</p>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* 灯箱 */}
      {current && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-2 sm:left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-2 sm:right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-[92vw] max-h-[85vh] flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
            <div className="flex-1 flex items-center justify-center min-h-0">
              {current.type === 'video' ? (
                toEmbedUrl(current.url) ? (
                  <iframe
                    src={toEmbedUrl(current.url)!}
                    className="w-[86vw] sm:w-[720px] aspect-video rounded-xl bg-black shadow-2xl"
                    allowFullScreen
                    scrolling="no"
                    frameBorder="0"
                    title={current.title}
                  />
                ) : (
                  <video
                    src={current.url}
                    controls
                    autoPlay
                    className="max-w-[90vw] max-h-[75vh] rounded-xl shadow-2xl"
                  />
                )
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.url}
                  alt={current.title}
                  className="max-w-[90vw] max-h-[75vh] object-contain rounded-xl shadow-2xl"
                />
              )}
            </div>
            <div className="text-center">
              <p className="text-white text-sm sm:text-base font-medium">{current.title}</p>
              {current.description && (
                <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">{current.description}</p>
              )}
              <p className="text-gray-500 text-[11px] mt-1.5">
                {lightboxIndex + 1} / {items.length} · {t(`gallery.categories.${current.category}`)} · {formatDate(current.created_at)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
