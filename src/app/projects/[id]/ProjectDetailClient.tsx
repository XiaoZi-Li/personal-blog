'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, 
  Heart, 
  MessageSquare, 
  Send, 
  Reply,
  Star,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import EmojiPicker from '@/components/EmojiPicker';
import { TechCityBackground } from '@/components/TechCityBackground';
import { useUser } from '@/contexts/UserContext';

interface ProjectComment {
  id: number;
  user_id: number | null;
  nickname: string;
  content: string;
  like_count: number;
  created_at: string;
}

interface ProjectReply {
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

// 项目数据
const projectsData: Record<string, {
  name: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
}> = {
  'reid-system': {
    name: 'ReID行人重识别系统',
    description: '基于深度学习的行人重识别系统，用于跨摄像头场景下的行人追踪与识别。项目采用ResNet50作为骨干网络，结合PCB（Part-based Convolutional Baseline）策略进行局部特征提取，有效提升不同姿态、光照条件下的识别准确率。',
    tech: ['Python', 'PyTorch', 'OpenCV', 'ResNet50', 'PCB'],
    github: 'https://github.com/purplemist/reid-system',
  },
  'smart-mcp-assistant': {
    name: '小智MCP智能控制系统',
    description: '基于ESP32和MCP协议构建的智能家居控制系统，实现AI模型与硬件设备的高效交互。系统支持语音控制、传感器数据采集、设备状态监控等功能，通过MCP协议实现与AI助手的无缝对接。',
    tech: ['ESP32', 'MCP协议', 'Python', 'TypeScript', 'IoT'],
    github: 'https://github.com/purplemist/smart-mcp-assistant',
  },
  'personal-blog': {
    name: '个人博客网站',
    description: '基于Next.js + TypeScript + Supabase构建的个人博客网站，支持多语言切换、暗色模式、留言墙、用户认证等功能。采用shadcn/ui组件库，实现现代化的UI设计。',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'shadcn/ui'],
    github: 'https://github.com/purplemist/personal-blog',
    demo: 'https://blog.purplemist.dev',
  },
};

export default function ProjectDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = useParams() as { id: string };
  const { toast } = useToast();
  const { user } = useUser();
  
  const project = projectsData[id];
  
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [replies, setReplies] = useState<ProjectReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: number; nickname: string; userId: number | null } | null>(null);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/projects/${id}/comments`);
      const data = await response.json();
      setComments(data.comments || []);
      setReplies(data.replies || []);
      
      if (data.comments?.length > 0) {
        const commentIds = data.comments.map((c: ProjectComment) => c.id).join(',');
        const likeRes = await fetch(`/api/projects/${id}/comments/like?comment_ids=${commentIds}`);
        const likeData = await likeRes.json();
        setLikedComments(new Set(likeData.liked_ids || []));
      }
    } catch (error) {
      console.error('加载评论失败:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast({ title: '发送失败', description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: '评论成功', description: '你的评论已发布' });
      setNewComment('');
      fetchComments();
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
      const response = await fetch(`/api/projects/${id}/comments`, {
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
        toast({ title: '发送失败', description: data.error, variant: 'destructive' });
        return;
      }

      toast({ title: '回复成功', description: '你的回复已发布' });
      setReplyContent('');
      setReplyingTo(null);
      fetchComments();
    } catch {
      toast({ title: '发送失败', description: '网络错误', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: number) => {
    try {
      const response = await fetch(`/api/projects/${id}/comments/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: commentId, action: 'toggle' }),
      });
      
      const data = await response.json();
      if (data.success) {
        setLikedComments(prev => {
          const newSet = new Set(prev);
          if (data.is_liked) {
            newSet.add(commentId);
          } else {
            newSet.delete(commentId);
          }
          return newSet;
        });
        setComments(prev => prev.map(c => 
          c.id === commentId ? { ...c, like_count: data.like_count } : c
        ));
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('确定要删除这条评论吗？')) return;
    
    try {
      const response = await fetch(`/api/projects/${id}/comments/${commentId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        toast({ title: '删除成功' });
        fetchComments();
      } else {
        toast({ title: '删除失败', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      console.error('删除失败:', error);
      toast({ title: '删除失败', variant: 'destructive' });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">项目不存在</h1>
          <Link href="/projects">
            <Button>返回项目列表</Button>
          </Link>
        </div>
      </div>
    );
  }

  const commentCount = comments.length + replies.length;

  return (
    <div className="dark min-h-screen relative overflow-hidden">
      {/* 科技风粒子背景 */}
      <TechCityBackground />
      
      {/* 毛玻璃遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-indigo-900/80 backdrop-blur-sm" />
      
      {/* 内容 */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* 返回按钮 */}
        <Link href="/projects" className="inline-flex items-center gap-1.5 sm:gap-2 text-slate-300 hover:text-white mb-4 sm:mb-6 transition-colors text-sm">
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          返回项目列表
        </Link>

        {/* 项目信息卡片 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-8 mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">{project.name}</h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4 sm:mb-6">{project.description}</p>
          
          {/* 技术标签 */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {project.tech.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                {tech}
              </Badge>
            ))}
          </div>
          
          {/* 链接 */}
          <div className="flex gap-2 sm:gap-4">
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs sm:text-sm"
              >
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                查看源码
              </a>
            )}
            {project.demo && (
              <a 
                href={project.demo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-indigo-500/80 hover:bg-indigo-500 text-white transition-colors text-xs sm:text-sm"
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                在线演示
              </a>
            )}
          </div>
        </div>

        {/* 评论区 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            <h2 className="text-base sm:text-xl font-semibold text-white">评论区</h2>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
              {commentCount} 条讨论
            </Badge>
          </div>

          {/* 评论输入 */}
          <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="分享你的想法或问题..."
                  className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-sm"
                  maxLength={500}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <EmojiPicker onEmojiSelect={(emoji) => setNewComment(prev => prev + emoji)} />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={submitting || !newComment.trim()}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* 评论列表 */}
          {loading ? (
            <div className="py-6 sm:py-8 text-center text-slate-400 text-sm">加载中...</div>
          ) : comments.length === 0 ? (
            <div className="py-8 sm:py-12 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">暂无讨论，来发表第一条吧！</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {comments.map((comment) => {
                const commentReplies = replies.filter(r => r.parent_id === comment.id);
                const isLiked = likedComments.has(comment.id);
                
                return (
                  <div key={comment.id} className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
                    {/* 主评论 */}
                    <div className="flex gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0 text-xs sm:text-sm">
                        {comment.nickname.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">{comment.nickname}</span>
                          <span className="text-[10px] sm:text-xs text-slate-400">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{comment.content}</p>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <button
                            onClick={() => handleLike(comment.id)}
                            className={`flex items-center gap-1 text-xs sm:text-sm transition-colors ${
                              isLiked ? 'text-pink-400' : 'text-slate-400 hover:text-pink-400'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-current' : ''}`} />
                            {comment.like_count || 0}
                          </button>
                          <button
                            onClick={() => setReplyingTo({ id: comment.id, nickname: comment.nickname, userId: comment.user_id })}
                            className="flex items-center gap-1 text-xs sm:text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                          >
                            <Reply className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            回复
                          </button>
                          {user?.isAdmin && (
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="flex items-center gap-1 text-xs sm:text-sm text-slate-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              删除
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 回复输入 */}
                    {replyingTo?.id === comment.id && (
                      <div className="mt-3 ml-8 sm:ml-13 flex gap-2">
                        <Input
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={`回复 @${comment.nickname}...`}
                          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-sm"
                          maxLength={300}
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleReply(comment.id)}
                          disabled={submitting || !replyContent.trim()}
                          className="bg-indigo-500 hover:bg-indigo-600"
                        >
                          发送
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => { setReplyingTo(null); setReplyContent(''); }}
                          className="text-slate-400 hover:text-white"
                        >
                          取消
                        </Button>
                      </div>
                    )}

                    {/* 回复列表 */}
                    {commentReplies.length > 0 && (
                      <div className="ml-8 sm:ml-13 mt-3 space-y-2">
                        {commentReplies.map((reply) => (
                          <div key={reply.id} className="flex gap-2 text-xs sm:text-sm bg-white/5 rounded-lg p-2.5 sm:p-3">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-[10px] sm:text-xs font-medium flex-shrink-0">
                              {reply.nickname.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <span className="font-medium text-slate-200">{reply.nickname}</span>
                              {reply.reply_to_nickname && (
                                <span className="text-slate-400 mx-1">回复 @{reply.reply_to_nickname}</span>
                              )}
                              <span className="text-slate-300">: {reply.content}</span>
                              <span className="text-slate-500 ml-2 text-[10px] sm:text-xs">{formatDate(reply.created_at)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
