'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Pin, Reply, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import EmojiPicker from '@/components/EmojiPicker';
import { useUser } from '@/contexts/UserContext';

interface Message {
  id: number;
  user_id: number | null;
  nickname: string;
  content: string;
  is_pinned: boolean;
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
  created_at: string;
}

export default function MessagesPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: number; nickname: string; userId: number | null } | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
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
        title: '加载失败',
        description: '无法加载留言',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

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
        toast({ title: '发送失败', description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: '发送成功', description: '留言已发布' });
      setNewMessage('');
      fetchMessages();
    } catch {
      toast({ title: '发送失败', description: '网络错误', variant: 'destructive' });
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
        toast({ title: '回复失败', description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: '回复成功', description: '回复已发布' });
      setReplyContent('');
      setReplyingTo(null);
      fetchMessages();
    } catch {
      toast({ title: '回复失败', description: '网络错误', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleReplyEmojiSelect = (emoji: string) => {
    setReplyContent(prev => prev + emoji);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPages = Math.ceil(total / limit);

  // 渲染单个回复项
  const ReplyItem = ({ reply, rootMessageId }: { reply: Reply; rootMessageId: number }) => (
    <div className="py-2 group">
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
          {reply.nickname.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{reply.nickname}</span>
            {reply.is_admin_reply && (
              <Badge variant="default" className="text-xs bg-indigo-600">博主</Badge>
            )}
            {reply.reply_to_nickname && (
              <span className="text-sm text-slate-400">
                回复 <span className="text-indigo-500">@{reply.reply_to_nickname}</span>
              </span>
            )}
            <span className="text-xs text-slate-400">{formatDate(reply.created_at)}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 break-words">{reply.content}</p>
          
          {/* 回复按钮 */}
          <button
            onClick={() => setReplyingTo({ 
              id: reply.id, 
              nickname: reply.nickname,
              userId: reply.user_id 
            })}
            className="mt-1 text-xs text-slate-400 hover:text-indigo-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Reply className="w-3 h-3" />
            回复
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pt-20 flex items-center justify-center">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">留言墙</h1>
          <p className="text-slate-500">有什么想说的？给我留言吧！</p>
        </div>

        {/* 发送留言 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              发表留言
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="写下你的留言..."
                  className="w-full min-h-[100px] p-3 pr-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  maxLength={500}
                />
                {/* 表情按钮 */}
                <div className="absolute bottom-2 right-2">
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">{newMessage.length}/500</span>
                <Button type="submit" disabled={submitting || !newMessage.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  发送
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 留言列表 */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-slate-500">
                暂无留言，来发表第一条吧！
              </CardContent>
            </Card>
          ) : (
            messages.map((msg) => (
              <Card key={msg.id} className={msg.is_pinned ? 'ring-2 ring-indigo-500' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                      {msg.nickname.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium">{msg.nickname}</span>
                        {msg.is_pinned && (
                          <Badge variant="secondary" className="text-xs">
                            <Pin className="w-3 h-3 mr-1" />
                            置顶
                          </Badge>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(msg.created_at)}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words">{msg.content}</p>

                      {/* 回复按钮 */}
                      <button
                        onClick={() => setReplyingTo({ id: msg.id, nickname: msg.nickname, userId: msg.user_id })}
                        className="mt-2 text-sm text-slate-400 hover:text-indigo-500 flex items-center gap-1"
                      >
                        <Reply className="w-4 h-4" />
                        回复
                      </button>

                      {/* 回复输入框 */}
                      {replyingTo?.id === msg.id && (
                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <div className="text-sm text-slate-500 mb-2">
                            回复 <span className="text-indigo-500">@{replyingTo.nickname}</span>
                          </div>
                          <div className="flex gap-2 items-start">
                            <div className="flex-1 relative">
                              <Input
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="写下你的回复..."
                                className="pr-10"
                                maxLength={500}
                              />
                              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                                <EmojiPicker onEmojiSelect={handleReplyEmojiSelect} />
                              </div>
                            </div>
                            <div className="flex gap-2">
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
                              >
                                回复
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 显示回复 */}
                      {replies.filter(r => r.parent_id === msg.id).length > 0 && (
                        <div className="mt-3 ml-2 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                          {replies
                            .filter(r => r.parent_id === msg.id)
                            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                            .map((reply) => (
                              <div key={reply.id}>
                                <ReplyItem reply={reply} rootMessageId={msg.id} />
                                
                                {/* 回复的回复输入框 */}
                                {replyingTo?.id === reply.id && (
                                  <div className="ml-9 mb-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="text-sm text-slate-500 mb-2">
                                      回复 <span className="text-indigo-500">@{replyingTo.nickname}</span>
                                    </div>
                                    <div className="flex gap-2 items-start">
                                      <div className="flex-1 relative">
                                        <Input
                                          value={replyContent}
                                          onChange={(e) => setReplyContent(e.target.value)}
                                          placeholder="写下你的回复..."
                                          className="pr-10"
                                          maxLength={500}
                                        />
                                        <div className="absolute right-1 top-1/2 -translate-y-1/2">
                                          <EmojiPicker onEmojiSelect={handleReplyEmojiSelect} />
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => { setReplyingTo(null); setReplyContent(''); }}
                                        >
                                          取消
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => handleReply(reply.id)}
                                          disabled={submitting || !replyContent.trim()}
                                        >
                                          回复
                                        </Button>
                                      </div>
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
            >
              <ChevronLeft className="w-4 h-4" />
              上一页
            </Button>
            <span className="text-sm text-slate-500">
              第 {page} / {totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              下一页
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
