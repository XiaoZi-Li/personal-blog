'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Pin, PinOff,
  BookOpen, PenLine, FileText, ExternalLink, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

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
  mood: string | null;
  weather: string | null;
  views: number;
  like_count: number;
  is_published: boolean;
  is_pinned: boolean;
  created_at: string;
}

const TYPE_LABELS: Record<string, { label: string; icon: typeof FileText }> = {
  tutorial: { label: '教程', icon: BookOpen },
  article: { label: '文章', icon: FileText },
  diary: { label: '日记', icon: PenLine },
};

const CATEGORY_LABELS: Record<string, string> = {
  '51mcu': '51 单片机',
  stm32: 'STM32',
  esp32: 'ESP32',
  dcdc: 'DCDC 电源',
};

const EMPTY_FORM = {
  title: '',
  type: 'tutorial',
  category: '51mcu',
  summary: '',
  content: '',
  cover: '',
  tags: '',
  difficulty: 'beginner',
  mood: '',
  weather: '',
  is_published: true,
};

const MOOD_OPTIONS = ['😊', '😄', '😎', '🤔', '😴', '😤', '🥳', '😢', '🔥', '💪'];
const WEATHER_OPTIONS = ['☀️ 晴', '⛅ 多云', '☁️ 阴', '🌧️ 雨', '⛈️ 雷雨', '❄️ 雪', '🌫️ 雾'];

export function PostManager() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: '1', limit: '50' });
      if (typeFilter !== 'all') params.set('type', typeFilter);
      const res = await fetch(`/api/posts?${params.toString()}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setTotal(data.total || 0);
    } catch {
      toast({ title: '加载失败', description: '无法加载内容列表', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [typeFilter, toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const openCreate = () => {
    setEditingPost(null);
    setForm({ ...EMPTY_FORM });
    setPreviewMode(false);
    setDialogOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      type: post.type,
      category: post.category || '51mcu',
      summary: post.summary || '',
      content: post.content,
      cover: post.cover || '',
      tags: post.tags || '',
      difficulty: post.difficulty || 'beginner',
      mood: post.mood || '',
      weather: post.weather || '',
      is_published: post.is_published,
    });
    setPreviewMode(false);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: '请填写标题', variant: 'destructive' });
      return;
    }
    if (!form.content.trim()) {
      toast({ title: '请填写内容', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        category: form.type === 'tutorial' ? form.category : null,
      };
      const res = await fetch(editingPost ? `/api/posts/${editingPost.id}` : '/api/posts', {
        method: editingPost ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: '保存失败', description: data.error, variant: 'destructive' });
        return;
      }
      toast({ title: editingPost ? '更新成功' : '发布成功' });
      setDialogOpen(false);
      fetchPosts();
    } catch {
      toast({ title: '保存失败', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (post: Post, field: 'is_published' | 'is_pinned') => {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !post[field], type: post.type }),
      });
      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, [field]: !p[field] } : p));
      }
    } catch {
      toast({ title: '操作失败', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/posts/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: '删除成功' });
        setPosts(prev => prev.filter(p => p.id !== deleteTarget.id));
        setTotal(prev => prev - 1);
      }
    } catch {
      toast({ title: '删除失败', variant: 'destructive' });
    } finally {
      setDeleteTarget(null);
    }
  };

  const detailHref = (post: Post) => post.type === 'tutorial' ? `/tutorials/${post.id}` : `/blog/${post.id}`;

  return (
    <div>
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          {['all', 'tutorial', 'article', 'diary'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                typeFilter === type
                  ? 'bg-violet-600 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-violet-900/40'
              }`}
            >
              {type === 'all' ? `全部 (${total})` : TYPE_LABELS[type].label}
            </button>
          ))}
        </div>
        <Button onClick={openCreate} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          新建内容
        </Button>
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">加载中...</div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">还没有内容，点击「新建内容」发布第一篇教程或文章吧</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map(post => {
            const TypeIcon = TYPE_LABELS[post.type]?.icon || FileText;
            return (
              <Card key={post.id} className="group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white ${
                    post.type === 'tutorial' ? 'bg-gradient-to-br from-violet-500 to-purple-600'
                    : post.type === 'diary' ? 'bg-gradient-to-br from-rose-500 to-orange-500'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                  }`}>
                    {post.cover || <TypeIcon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm truncate max-w-xs">{post.title}</h3>
                      {post.is_pinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                      {!post.is_published && <Badge variant="secondary" className="text-[10px]">未发布</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-[10px] px-1.5">{TYPE_LABELS[post.type]?.label}</Badge>
                      {post.category && <Badge variant="outline" className="text-[10px] px-1.5">{CATEGORY_LABELS[post.category]}</Badge>}
                      <span>{post.views} 浏览 · {post.like_count} 赞</span>
                      <span className="hidden sm:inline">{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={detailHref(post)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-muted text-slate-500 transition-colors"
                      title="查看"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleToggle(post, 'is_pinned')}
                      className="p-2 rounded-lg hover:bg-muted text-slate-500 transition-colors"
                      title={post.is_pinned ? '取消置顶' : '置顶'}
                    >
                      {post.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleToggle(post, 'is_published')}
                      className="p-2 rounded-lg hover:bg-muted text-slate-500 transition-colors"
                      title={post.is_published ? '下架' : '发布'}
                    >
                      {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEdit(post)}
                      className="p-2 rounded-lg hover:bg-muted text-violet-600 transition-colors"
                      title="编辑"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(post)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 新建/编辑弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? '编辑内容' : '新建内容'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 类型 */}
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(TYPE_LABELS).map(([type, { label, icon: Icon }]) => (
                <button
                  key={type}
                  onClick={() => setForm(f => ({ ...f, type }))}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    form.type === type
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300'
                      : 'border-border text-muted-foreground hover:border-violet-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 教程分区 */}
              {form.type === 'tutorial' && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">教程分区</label>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* 难度 */}
              {form.type === 'tutorial' && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">难度</label>
                  <Select value={form.difficulty} onValueChange={v => setForm(f => ({ ...f, difficulty: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">入门</SelectItem>
                      <SelectItem value="intermediate">进阶</SelectItem>
                      <SelectItem value="advanced">实战</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* 日记心情 */}
              {form.type === 'diary' && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">心情</label>
                  <div className="flex flex-wrap gap-1.5">
                    {MOOD_OPTIONS.map(m => (
                      <button
                        key={m}
                        onClick={() => setForm(f => ({ ...f, mood: f.mood === m ? '' : m }))}
                        className={`w-9 h-9 rounded-lg text-lg transition-all ${
                          form.mood === m ? 'bg-rose-100 dark:bg-rose-900/50 ring-2 ring-rose-400 scale-110' : 'hover:bg-muted'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* 日记天气 */}
              {form.type === 'diary' && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">天气</label>
                  <div className="flex flex-wrap gap-1.5">
                    {WEATHER_OPTIONS.map(w => (
                      <button
                        key={w}
                        onClick={() => setForm(f => ({ ...f, weather: f.weather === w ? '' : w }))}
                        className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                          form.weather === w ? 'bg-sky-100 dark:bg-sky-900/50 ring-2 ring-sky-400' : 'hover:bg-muted'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* 封面 emoji */}
              <div className={form.type === 'tutorial' ? '' : 'sm:col-span-1'}>
                <label className="text-sm font-medium mb-1.5 block">封面 emoji（可选）</label>
                <input
                  value={form.cover}
                  onChange={e => setForm(f => ({ ...f, cover: e.target.value }))}
                  placeholder={form.type === 'tutorial' ? '如 🔧' : '如 📄'}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
            </div>

            {/* 标题 */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">标题 *</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="输入标题..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
              />
            </div>

            {/* 摘要 */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">摘要</label>
              <textarea
                value={form.summary}
                onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                placeholder="一句话简介（列表页展示）..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none"
              />
            </div>

            {/* 标签 */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">标签（逗号分隔）</label>
              <input
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="如: GPIO,中断,定时器"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
              />
            </div>

            {/* 正文 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">正文（Markdown）*</label>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    previewMode ? 'bg-violet-600 text-white' : 'bg-muted text-muted-foreground hover:bg-violet-100'
                  }`}
                >
                  {previewMode ? '编辑' : '预览'}
                </button>
              </div>
              {previewMode ? (
                <div className="min-h-[240px] max-h-[420px] overflow-y-auto rounded-lg border border-border bg-white dark:bg-slate-900 p-4">
                  {form.content.trim() ? (
                    <MarkdownRenderer content={form.content} />
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-10">暂无内容，切换回编辑模式输入</p>
                  )}
                </div>
              ) : (
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder={'支持 Markdown 语法...\n\n## 二级标题\n\n正文段落，**加粗**、`代码`、[链接](https://example.com)\n\n```c\nint main(void) {\n  return 0;\n}\n```'}
                  rows={12}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono leading-relaxed resize-y"
                />
              )}
            </div>

            {/* 发布开关 */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                className="w-4 h-4 accent-violet-600"
              />
              <span className="text-sm">立即发布（取消勾选则保存为草稿）</span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingPost ? '保存修改' : '发布'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <Dialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            确定要删除「{deleteTarget?.title}」吗？此操作不可恢复。
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
