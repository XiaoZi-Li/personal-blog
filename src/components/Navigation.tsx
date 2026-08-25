'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Code2, FolderGit2, MessageSquare, LogOut, Settings, LogIn, UserPlus, UserCog, Menu, X, FileText, BookOpen, Newspaper } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import NotificationBell from '@/components/NotificationBell';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useUser } from '@/contexts/UserContext';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, fetchUser } = useUser();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: '/', label: t('nav.home'), icon: Code2 },
    { href: '/tutorials', label: t('nav.tutorials'), icon: BookOpen },
    { href: '/blog', label: t('nav.blog'), icon: Newspaper },
    { href: '/resume', label: t('nav.resume') || '简历', icon: FileText },
    { href: '/projects', label: t('nav.projects'), icon: FolderGit2 },
    { href: '/messages', label: t('nav.messages'), icon: MessageSquare },
  ];

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 路由切换关闭移动菜单
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    await fetchUser();
    setShowUserMenu(false);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all group-hover:scale-105">
              <Code2 className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {t('home.name')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            {/* GitHub链接 */}
            <Link
              href="https://github.com/XiaoZi-Li"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="hidden lg:inline">{t('nav.github')}</span>
            </Link>

            {/* 分隔线 */}
            <div className="w-px h-6 bg-border mx-1 hidden lg:block" />

            {/* 主题切换 */}
            <ThemeToggle />

            {/* 语言切换 */}
            <LanguageToggle />

            {/* 用户菜单 */}
            {user ? (
              <div className="flex items-center gap-1">
                <NotificationBell onNotificationCountChange={setNotificationCount} />
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-accent transition-all duration-200"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.nickname || user.username} className="w-7 h-7 rounded-full object-cover ring-2 ring-violet-200 dark:ring-violet-800" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {user.nickname?.charAt(0) || user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden lg:block text-sm">{user.nickname || user.username}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-background/95 backdrop-blur-xl rounded-xl shadow-xl border border-border py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-medium text-sm">{user.nickname || user.username}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{user.role === 'admin' ? t('nav.adminRole') : t('nav.userRole')}</p>
                      </div>
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                      >
                        <UserCog className="w-4 h-4 text-muted-foreground" />
                        {t('nav.settings')}
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          {t('nav.admin')}
                        </Link>
                      )}
                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-accent transition-colors text-red-500 w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('nav.logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('nav.login')}</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-md shadow-violet-500/25"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t('nav.register')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-3 border-t border-border/50 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <Link
                href="https://github.com/XiaoZi-Li"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </Link>

              {/* 移动端工具栏 */}
              <div className="flex items-center gap-2 px-4 py-2">
                <ThemeToggle />
                <LanguageToggle />
              </div>

              {/* 移动端用户菜单 */}
              <div className="border-t border-border/50 mt-1 pt-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {user.nickname?.charAt(0) || user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {user.nickname || user.username}
                    </div>
                    <Link
                      href="/notifications"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent transition-all duration-200"
                    >
                      <span className="relative">🔔</span>
                      <span>{t('nav.notifications')}</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent transition-all duration-200"
                    >
                      <UserCog className="w-5 h-5" />
                      <span>{t('nav.settings')}</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent transition-all duration-200"
                      >
                        <Settings className="w-5 h-5" />
                        <span>{t('nav.admin')}</span>
                      </Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent transition-all duration-200 text-red-500 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent transition-all duration-200"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>{t('nav.login')}</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white justify-center shadow-md"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>{t('nav.register')}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
