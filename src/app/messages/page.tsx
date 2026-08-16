'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Pin, Reply, Clock, ChevronLeft, ChevronRight, Heart, Star, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import EmojiPicker from '@/components/EmojiPicker';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { TechCityBackground } from '@/components/TechCityBackground';

interface Message {
  id: number;
  user_id: number | null;
  nickname: string;
  content: string;
  is_pinned: boolean;
  is_essence?: boolean;
  like_count: number;
  created_at: string;
}

interface Reply {
  id: number;
  parent_id: number;
  user_id: number | null;
  nickname: string;
  content: string;
  reply_to_user_id: number | null;
  reply_to_nickname: string | null;
  is_admin_reply: boolean;
  like_count?: number;
  created_at: string;
}

export default function MessagesPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: number; nickname: string; userId: number | null } | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [likedMessages, setLikedMessages] = useState<Set<number>>(new Set());
  const limit = 10;

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/messages?page=${page}&limit=${limit}`);
      const data = await response.json();
      setMessages(data.messages || []);
      setReplies(data.replies || []);
      setTotal(data.total || 0);
    } catch (error) {
      toast({
        title: t('messages.loadFailed'),
        description: t('messages.loadFailedDesc'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, toast, t]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast({ title: t('messages.sendFailed'), description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: t('messages.sendSuccess'), description: t('messages.sendSuccessDesc') });
      setNewMessage('');
      fetchMessages();
    } catch {
      toast({ title: t('messages.sendFailed'), description: t('messages.networkError'), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: number) => {
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: replyContent, 
          parent_id: parentId,
          reply_to_user_id: replyingTo?.userId,
          reply_to_nickname: replyingTo?.nickname,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast({ title: t('messages.sendFailed'), description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: t('messages.replySuccess'), description: t('messages.replySuccessDesc') });
      setReplyContent('');
      setReplyingTo(null);
      fetchMessages();
    } catch {
      toast({ title: t('messages.sendFailed'), description: t('messages.networkError'), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (messageId: number) => {
    try {
      const response = await fetch('/api/messages/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, action: 'toggle' }),
      });
      
      const data = await response.json();
      if (data.success) {
        // 更新点赞状态
        setLikedMessages(prev => {
          const newSet = new Set(prev);
          if (data.is_liked) {
            newSet.add(messageId);
          } else {
            newSet.delete(messageId);
          }
          return newSet;
        });
        setMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, like_count: data.like_count } : m
        ));
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleReplyEmojiSelect = (emoji: string) => {
    setReplyContent(prev => prev + emoji);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    const locale = t('language') === 'zh-CN' ? 'zh-CN' : t('language') === 'ja-JP' ? 'ja-JP' : 'en-US';
    return date.toLocaleDateString(locale, { month: '2-digit', day: '2-digit' });
  };

  const totalPages = Math.ceil(total / limit);

  // 渲染单个回复项
  const ReplyItem = ({ reply, rootMessageId }: { reply: Reply; rootMessageId: number }) => (
    <div className="py-2 group">
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
          {reply.nickname.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{reply.nickname}</span>
            {reply.is_admin_reply && (
              <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-indigo-500 to-purple-500">博主</Badge>
            )}
            {reply.reply_to_nickname && (
              <span className="text-xs text-slate-400">
                回复 <span className="text-indigo-500">@{reply.reply_to_nickname}</span>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 break-words">{reply.content}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
            <span>{formatDate(reply.created_at)}</span>
            <button
              onClick={() => setReplyingTo({ id: reply.id, nickname: reply.nickname, userId: reply.user_id })}
              className="hover:text-indigo-500 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Reply className="w-3 h-3" />
              回复
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dark min-h-screen relative overflow-hidden">
        <TechCityBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-indigo-900/80 backdrop-blur-sm" />
        <div className="relative z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-300">加载中...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen relative overflow-hidden">
      <TechCityBackground />

      {/* 内容 */}
      <div className="relative z-10 pt-2 sm:pt-6 pb-8 sm:pb-12">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* 标题区 - 哔站风格 */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <MessageSquare className="w-5 h-5 sm:w-7 sm:h-7 text-indigo-400" />
                技术交流区
              </h1>
              <p className="text-slate-400 mt-1 text-sm">分享技术见解，交流开发经验</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-400">{total}</div>
              <div className="text-xs text-slate-500">条讨论</div>
            </div>
          </div>
        </div>

        {/* 发送框 - 简洁风格 */}
        <Card className="mb-8 border-0 shadow-lg bg-white/10 backdrop-blur-xl border border-white/20">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="分享你的技术见解或问题..."
                  className="w-full min-h-[80px] p-3 pr-12 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  maxLength={500}
                />
                <div className="absolute bottom-2 right-2">
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{newMessage.length}/500</span>
                <Button 
                  type="submit" 
                  disabled={submitting || !newMessage.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl px-6"
                >
                  <Send className="w-4 h-4 mr-2" />
                  发布
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 评论列表 - 哔站风格 */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-xl border border-white/20">
              <CardContent className="py-16 text-center">
                <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-400">暂无讨论，来发表第一条吧！</p>
              </CardContent>
            </Card>
          ) : (
            messages.map((msg) => (
              <Card 
                key={msg.id} 
                className={`border-0 shadow-lg backdrop-blur-xl transition-all hover:shadow-xl ${
                  msg.is_pinned ? 'bg-indigo-500/20 border border-indigo-400/50' :
                  msg.is_essence ? 'bg-amber-500/20 border border-amber-400/50' :
                  'bg-white/10 border border-white/20'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    {/* 头像 */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        msg.is_pinned ? 'bg-gradient-to-br from-indigo-500 to-purple-500' :
                        msg.is_essence ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                        'bg-gradient-to-br from-slate-400 to-slate-500'
                      }`}>
                        {msg.nickname.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    {/* 内容区 */}
                    <div className="flex-1 min-w-0">
                      {/* 用户信息行 */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-white">{msg.nickname}</span>
                        {msg.is_pinned && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                            <Pin className="w-2.5 h-2.5 mr-0.5" />
                            置顶
                          </Badge>
                        )}
                        {msg.is_essence && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                            <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                            精华
                          </Badge>
                        )}
                        <span className="text-xs text-slate-400">{formatDate(msg.created_at)}</span>
                      </div>
                      
                      {/* 评论内容 */}
                      <p className="text-slate-300 whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                      
                      {/* 操作栏 */}
                      <div className="flex items-center gap-4 mt-3">
                        {/* 点赞 */}
                        <button 
                          onClick={() => handleLike(msg.id)}
                          className={`flex items-center gap-1 text-sm transition-all ${
                            likedMessages.has(msg.id) 
                              ? 'text-pink-400' 
                              : 'text-slate-400 hover:text-pink-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedMessages.has(msg.id) ? 'fill-current' : ''}`} />
                          <span>{msg.like_count || 0}</span>
                        </button>
                        
                        {/* 回复 */}
                        <button
                          onClick={() => setReplyingTo({ id: msg.id, nickname: msg.nickname, userId: msg.user_id })}
                          className="flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                        >
                          <Reply className="w-4 h-4" />
                          <span>{replies.filter(r => r.parent_id === msg.id).length || '回复'}</span>
                        </button>
                      </div>

                      {/* 回复输入框 */}
                      {replyingTo?.id === msg.id && (
                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="text-xs text-slate-500 mb-2">
                            回复 <span className="text-indigo-500">@{replyingTo.nickname}</span>
                          </div>
                          <div className="flex gap-2 items-start">
                            <div className="flex-1 relative">
                              <Input
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="写下你的回复..."
                                className="pr-10 text-sm"
                                maxLength={500}
                              />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <EmojiPicker onEmojiSelect={handleReplyEmojiSelect} />
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { setReplyingTo(null); setReplyContent(''); }}
                            >
                              取消
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReply(msg.id)}
                              disabled={submitting || !replyContent.trim()}
                              className="bg-indigo-500 hover:bg-indigo-600"
                            >
                              回复
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* 回复列表 */}
                      {replies.filter(r => r.parent_id === msg.id).length > 0 && (
                        <div className="mt-3 ml-2 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800 space-y-1">
                          {replies
                            .filter(r => r.parent_id === msg.id)
                            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                            .map((reply) => (
                              <div key={reply.id}>
                                <ReplyItem reply={reply} rootMessageId={msg.id} />
                                
                                {replyingTo?.id === reply.id && (
                                  <div className="ml-8 mb-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="text-xs text-slate-500 mb-2">
                                      回复 <span className="text-indigo-500">@{replyingTo.nickname}</span>
                                    </div>
                                    <div className="flex gap-2 items-start">
                                      <Input
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="写下你的回复..."
                                        className="flex-1 text-sm"
                                        maxLength={500}
                                      />
                                      <Button size="sm" variant="outline" onClick={() => { setReplyingTo(null); setReplyContent(''); }}>
                                        取消
                                      </Button>
                                      <Button size="sm" onClick={() => handleReply(reply.id)} disabled={submitting || !replyContent.trim()}>
                                        回复
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
              上一页
            </Button>
            <span className="text-sm text-slate-500 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-xl"
            >
              下一页
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
