'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Trash2, Eye, EyeOff, Link2, Upload, Loader2,
  Camera, Film, FileVideo, ImageIcon, ExternalLink, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  type: 'image' | 'video';
  url: string;
  thumbnail: string | null;
  category: string;
  is_published: boolean;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  works: '💡 作品',
  competition: '🏆 竞赛',
  life: '🌱 生活',
};

function toEmbedUrl(url: string): string | null {
  const bv = /bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/.exec(url);
  if (bv) return `https://player.bilibili.com/player.html?bvid=${bv[1]}&autoplay=0&danmaku=0`;
  const yt = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/.exec(url);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return null;
}

export function MediaManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<'upload' | 'link'>('upload');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);

  // 上传状态
  const [fileList, setFileList] = useState<File[]>([]);
  const [uploadCategory, setUploadCategory] = useState('works');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 外链状态
  const [linkForm, setLinkForm] = useState({ title: '', url: '', type: 'video', category: 'competition', description: '' });
  const [savingLink, setSavingLink] = useState(false);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setItems(data.media || []);
    } catch {
      toast({ title: '加载失败', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const uploadOne = async (file: File): Promise<boolean> => {
    // 1. 获取签名上传 URL
    const res1 = await fetch('/api/media/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });
    const signData = await res1.json();
    if (!res1.ok) {
      toast({ title: '无法上传', description: signData.error, variant: 'destructive' });
      return false;
    }

    // 2. 直传文件到 Supabase 存储
    const res2 = await fetch(signData.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
    if (!res2.ok) {
      toast({ title: '文件上传失败', description: `${file.name}（HTTP ${res2.status}）`, variant: 'destructive' });
      return false;
    }

    // 3. 创建记录（标题默认取文件名去扩展名）
    const title = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ') || '未命名';
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    const res3 = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, type, url: signData.publicUrl, category: uploadCategory }),
    });
    if (!res3.ok) {
      toast({ title: '保存记录失败', description: file.name, variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      toast({ title: '请先选择文件', variant: 'destructive' });
      return;
    }
    setUploading(true);
    setUploadProgress({ done: 0, total: fileList.length });
    let okCount = 0;
    for (let i = 0; i < fileList.length; i++) {
      const ok = await uploadOne(fileList[i]);
      if (ok) okCount++;
      setUploadProgress({ done: i + 1, total: fileList.length });
    }
    setUploading(false);
    if (okCount > 0) {
      toast({ title: `上传完成`, description: `成功 ${okCount} / ${fileList.length} 个文件` });
      setDialogOpen(false);
      setFileList([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchMedia();
    }
  };

  const handleAddLink = async () => {
    if (!linkForm.title.trim() || !linkForm.url.trim()) {
      toast({ title: '请填写标题和链接', variant: 'destructive' });
      return;
    }
    setSavingLink(true);
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkForm),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: '添加失败', description: data.error, variant: 'destructive' });
        return;
      }
      toast({ title: '添加成功' });
      setDialogOpen(false);
      setLinkForm({ title: '', url: '', type: 'video', category: 'competition', description: '' });
      fetchMedia();
    } catch {
      toast({ title: '添加失败', variant: 'destructive' });
    } finally {
      setSavingLink(false);
    }
  };

  const handleToggle = async (item: MediaItem) => {
    try {
      const res = await fetch(`/api/media/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !item.is_published }),
      });
      if (res.ok) {
        setItems(prev => prev.map(m => m.id === item.id ? { ...m, is_published: !m.is_published } : m));
      }
    } catch {
      toast({ title: '操作失败', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/media/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: '删除成功' });
        setItems(prev => prev.filter(m => m.id !== deleteTarget.id));
      } else {
        const data = await res.json();
        toast({ title: '删除失败', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: '删除失败', variant: 'destructive' });
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = categoryFilter === 'all' ? items : items.filter(m => m.category === categoryFilter);

  return (
    <div>
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {[['all', '全部'], ['works', '作品'], ['competition', '竞赛'], ['life', '生活']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                categoryFilter === key
                  ? 'bg-rose-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-900/40'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={fetchMedia}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            title="刷新"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <Button onClick={() => { setMode('upload'); setDialogOpen(true); }} className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          添加作品
        </Button>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">加载中...</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Camera className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">还没有作品，点击「添加作品」上传第一张照片或视频吧</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(item => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-[4/3] bg-muted">
                {item.type === 'video' ? (
                  item.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : toEmbedUrl(item.url) ? (
                    <iframe src={toEmbedUrl(item.url)!} className="w-full h-full pointer-events-none" scrolling="no" frameBorder="0" title={item.title} />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" preload="metadata" muted />
                  )
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                )}
                {!item.is_published && (
                  <Badge variant="secondary" className="absolute top-2 left-2 text-[10px]">未发布</Badge>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                    title="打开原文件"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleToggle(item)}
                    className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                    title={item.is_published ? '下架' : '发布'}
                  >
                    {item.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2.5 rounded-full bg-red-500/60 hover:bg-red-500 text-white transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Badge variant="outline" className="text-[10px] px-1.5">
                    {item.type === 'video' ? <FileVideo className="w-3 h-3 mr-0.5" /> : <ImageIcon className="w-3 h-3 mr-0.5" />}
                    {item.type === 'video' ? '视频' : '图片'}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5">{CATEGORY_LABELS[item.category]}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 添加弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={open => { if (!uploading) setDialogOpen(open); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>添加作品</DialogTitle>
          </DialogHeader>

          {/* 模式切换 */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setMode('upload')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                mode === 'upload'
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                  : 'border-border text-muted-foreground hover:border-rose-300'
              }`}
            >
              <Upload className="w-4 h-4" />
              上传文件
            </button>
            <button
              onClick={() => setMode('link')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                mode === 'link'
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                  : 'border-border text-muted-foreground hover:border-rose-300'
              }`}
            >
              <Link2 className="w-4 h-4" />
              外部链接
            </button>
          </div>

          {mode === 'upload' ? (
            <div className="space-y-4">
              {/* 分类 */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">分类</label>
                <div className="flex gap-2">
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setUploadCategory(key)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        uploadCategory === key ? 'bg-rose-500 text-white' : 'bg-muted text-muted-foreground hover:bg-rose-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 文件选择 */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">选择文件（支持多选，图片 / 视频均可）</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={e => setFileList(Array.from(e.target.files || []))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-rose-100 file:text-rose-700 dark:file:bg-rose-950/50 dark:file:text-rose-300 file:text-sm file:font-medium"
                />
                {fileList.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {fileList.map((f, i) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        {f.type.startsWith('video/') ? <Film className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                        {f.name}
                        <span className="ml-auto">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {uploading && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    正在上传 {uploadProgress.done} / {uploadProgress.total} ...
                  </p>
                  <div className="h-1.5 rounded-full bg-border mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all"
                      style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={uploading}>取消</Button>
                <Button onClick={handleUpload} disabled={uploading || fileList.length === 0} className="bg-gradient-to-r from-rose-500 to-orange-500">
                  {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  上传 {fileList.length > 0 ? `(${fileList.length})` : ''}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">标题 *</label>
                <input
                  value={linkForm.title}
                  onChange={e => setLinkForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="如：机器狗比赛现场"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">链接 *</label>
                <input
                  value={linkForm.url}
                  onChange={e => setLinkForm(f => ({ ...f, url: e.target.value }))}
                  placeholder="B 站视频页链接、YouTube 链接或图片/视频直链"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
                <p className="text-[11px] text-muted-foreground mt-1">B 站和 YouTube 链接会自动转为站内播放器</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">类型</label>
                  <div className="flex gap-2">
                    {([['video', '视频'], ['image', '图片']] as const).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setLinkForm(f => ({ ...f, type: key }))}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          linkForm.type === key ? 'bg-rose-500 text-white' : 'bg-muted text-muted-foreground hover:bg-rose-100'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">分类</label>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setLinkForm(f => ({ ...f, category: key }))}
                        className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          linkForm.category === key ? 'bg-rose-500 text-white' : 'bg-muted text-muted-foreground hover:bg-rose-100'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">描述（可选）</label>
                <input
                  value={linkForm.description}
                  onChange={e => setLinkForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="一句话介绍"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                <Button onClick={handleAddLink} disabled={savingLink} className="bg-gradient-to-r from-rose-500 to-orange-500">
                  {savingLink && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  添加
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <Dialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            确定要删除「{deleteTarget?.title}」吗？文件和记录都会被删除，此操作不可恢复。
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete}>删除</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
