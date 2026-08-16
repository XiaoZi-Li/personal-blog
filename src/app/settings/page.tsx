'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Save, ArrowLeft, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  nickname: string;
  avatar: string | null;
  role: string;
  created_at: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: contextUser, fetchUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setProfile(data.user);
      setNickname(data.user.nickname || data.user.username);
      setAvatar(data.user.avatar);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    if (!nickname.trim()) {
      toast({
        title: '保存失败',
        description: '昵称不能为空',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast({
          title: '保存失败',
          description: data.error,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: '保存成功',
        description: '昵称已更新',
      });

      // 更新本地状态和全局状态
      if (profile) {
        setProfile({ ...profile, nickname: nickname.trim() });
      }
      await fetchUser();
    } catch {
      toast({
        title: '保存失败',
        description: '网络错误',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: '上传失败',
        description: '只支持 JPG、PNG、GIF、WebP 格式的图片',
        variant: 'destructive',
      });
      return;
    }

    // 验证文件大小
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: '上传失败',
        description: '图片大小不能超过 2MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        toast({
          title: '上传失败',
          description: data.error,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: '上传成功',
        description: '头像已更新',
      });

      setAvatar(data.avatar);
      if (profile) {
        setProfile({ ...profile, avatar: data.avatar });
      }
      await fetchUser();
    } catch {
      toast({
        title: '上传失败',
        description: '网络错误',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pt-20 flex items-center justify-center">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              个人设置
            </CardTitle>
            <CardDescription>管理您的账号信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 头像 */}
            <div className="space-y-4">
              <Label>头像</Label>
              <div className="flex items-center gap-4">
                <div 
                  onClick={handleAvatarClick}
                  className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center cursor-pointer group overflow-hidden"
                >
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt={profile?.nickname || 'avatar'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-medium">
                      {profile?.nickname?.charAt(0) || profile?.username?.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  <p>点击头像更换</p>
                  <p>支持 JPG、PNG、GIF、WebP 格式</p>
                  <p>最大 2MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* 基本信息 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>邮箱</Label>
                <Input value={profile?.email || ''} disabled className="bg-slate-50" />
                <p className="text-xs text-slate-400">邮箱为账号唯一凭证，不可修改</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">昵称</Label>
                <div className="flex gap-2">
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="请输入昵称"
                    maxLength={20}
                  />
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? '保存中...' : '保存'}
                  </Button>
                </div>
                <p className="text-xs text-slate-400">昵称将在留言、评论时显示</p>
              </div>

              <div className="space-y-2">
                <Label>角色</Label>
                <div className="text-sm text-slate-600">
                  {profile?.role === 'admin' ? '管理员' : '普通用户'}
                </div>
              </div>

              <div className="space-y-2">
                <Label>注册时间</Label>
                <div className="text-sm text-slate-600">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleString('zh-CN') : '-'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
