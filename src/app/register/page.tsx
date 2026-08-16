'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    captchaAnswer: '',
  });
  
  // 验证码相关
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // 获取验证码
  const fetchCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const response = await fetch('/api/captcha');
      const data = await response.json();
      setCaptchaQuestion(data.question);
    } catch {
      toast({
        title: t('auth.captchaFetchFailed') || 'Failed to fetch captcha',
        description: t('auth.refreshPage') || 'Please refresh the page and try again',
        variant: 'destructive',
      });
    } finally {
      setCaptchaLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaQuestion) {
      toast({
        title: t('auth.captchaRequired') || 'Please get the captcha first',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('auth.registerFailed'),
        description: t('auth.passwordMismatch'),
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: t('auth.registerFailed'),
        description: t('auth.passwordTooShort') || 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.captchaAnswer) {
      toast({
        title: t('auth.registerFailed'),
        description: t('auth.captchaRequired') || 'Please enter the captcha',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname || undefined,
          captchaAnswer: formData.captchaAnswer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: t('auth.registerFailed'),
          description: data.error || t('auth.tryAgain') || 'Please try again later',
          variant: 'destructive',
        });
        // 验证码错误时刷新验证码
        if (data.error?.includes('验证码') || data.error?.includes('captcha')) {
          fetchCaptcha();
          setFormData({ ...formData, captchaAnswer: '' });
        }
        return;
      }

      toast({
        title: t('auth.registerSuccess'),
        description: t('auth.registerSuccessDesc'),
      });

      router.push('/login');
    } catch (error) {
      toast({
        title: t('auth.registerFailed'),
        description: t('auth.networkError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('auth.registerTitle')}</CardTitle>
          <CardDescription>{t('auth.registerDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')} *</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">{t('auth.username')}</Label>
              <Input
                id="nickname"
                placeholder={t('auth.nicknamePlaceholder') || 'Nickname (optional)'}
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')} *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')} *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('auth.confirmPasswordPlaceholder') || 'Enter password again'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            {/* 验证码 */}
            <div className="space-y-2">
              <Label htmlFor="captcha">{t('auth.captcha')} *</Label>
              <div className="flex gap-2 items-center">
                <div className="flex-1 flex items-center gap-2">
                  <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-lg min-w-[120px] text-center">
                    {captchaQuestion || t('auth.loadingCaptcha') || 'Loading...'}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={fetchCaptcha}
                    disabled={captchaLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${captchaLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <Input
                  id="captcha"
                  type="text"
                  placeholder={t('auth.captchaPlaceholder')}
                  value={formData.captchaAnswer}
                  onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
                  className="w-24"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {t('auth.registering')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  {t('auth.registerBtn')}
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {t('auth.hasAccount')}{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              {t('auth.goToLogin')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
