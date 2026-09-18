'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  BookOpen,
  Camera,
  Code2,
  FileText,
  FolderGit2,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Settings,
  Sparkles,
  UserCog,
  UserPlus,
  X,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import NotificationBell from '@/components/NotificationBell';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useUser } from '@/contexts/UserContext';

const GITHUB_URL = 'https://github.com/XiaoZi-Li';

/** 渐变底上的墨色（与 .btn-neon 的 ink 一致，两套主题下都够对比度） */
const INK = 'text-[#04121a]';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, fetchUser } = useUser();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [, setNotificationCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const menuRef = useRef<HTMLDivElement>(null);
  const linksWrapRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  // 线上既有的 7 个导航链接：集合、顺序与图标保持不变（不新增 /robotics，
  // 8 个链接在 lg 断点会挤爆），也不新增任何翻译 key。
  const links = [
    { href: '/', label: t('nav.home'), icon: Code2 },
    { href: '/tutorials', label: t('nav.tutorials'), icon: BookOpen },
    { href: '/blog', label: t('nav.blog'), icon: Newspaper },
    { href: '/gallery', label: t('nav.gallery'), icon: Camera },
    { href: '/resume', label: t('nav.resume') || '简历', icon: FileText },
    { href: '/projects', label: t('nav.projects'), icon: FolderGit2 },
    { href: '/messages', label: t('nav.messages'), icon: MessageSquare },
  ];

  // 保留线上语义：首页严格相等，其余用前缀匹配（这样 /blog/xxx 详情页仍有高亮）
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // 滚动状态：胶囊轻微收缩
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 滑动指示器：把高亮胶囊平滑移动到当前激活项
  // （用 useEffect + 「未就绪时 transition: none」，避免 useLayoutEffect 在 SSR 下报警告）
  useEffect(() => {
    const update = () => {
      const activeIndex = links.findIndex((link) => isActive(link.href));
      const el = activeIndex >= 0 ? linkRefs.current[activeIndex] : null;
      const wrap = linksWrapRef.current;
      if (!el || !wrap) {
        setPill((prev) => ({ ...prev, ready: false }));
        return;
      }
      const wrapRect = wrap.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setPill({ left: rect.left - wrapRect.left, width: rect.width, ready: true });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, t]);

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

  // 抽屉与桌面导航的分界是 lg：升到 lg 时收起抽屉，避免滚动锁残留
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setIsOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // 锁定移动端抽屉时的页面滚动
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    await fetchUser();
    setShowUserMenu(false);
    router.push('/');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="relative z-50 mx-auto max-w-7xl px-3 sm:px-5">
        <div
          className={`glass-strong flex items-center justify-between gap-3 rounded-2xl px-3 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.75)] transition-all duration-500 sm:px-4 ${
            scrolled ? 'mt-2 h-14' : 'mt-3 h-16'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center">
              <span className="animate-spin-slow absolute inset-0 rounded-xl border border-dashed border-[color-mix(in_oklab,var(--neon-cyan)_45%,transparent)]" />
              <span className="absolute inset-[3px] rounded-lg bg-gradient-to-br from-[var(--glow-cyan)] via-[var(--glow-violet)] to-[var(--glow-magenta)] opacity-90 transition-transform duration-500 group-hover:scale-105" />
              <Code2 className={`relative h-4 w-4 ${INK}`} />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-[15px] font-bold tracking-tight">
                {t('home.name')}
              </span>
              <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground">
                EMBODIED / ROBOTICS
              </span>
            </span>
          </Link>

          {/* Desktop nav（lg 以上） */}
          <div ref={linksWrapRef} className="relative hidden items-center gap-0.5 lg:flex">
            {/* 滑动高亮胶囊 */}
            <span
              aria-hidden="true"
              className="absolute top-1/2 z-0 h-9 -translate-y-1/2 rounded-xl"
              style={{
                left: pill.left,
                width: pill.width,
                opacity: pill.ready ? 1 : 0,
                transition: pill.ready
                  ? 'left 520ms cubic-bezier(0.22, 1, 0.36, 1), width 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease'
                  : 'none',
                background:
                  'linear-gradient(120deg, color-mix(in oklab, var(--neon-cyan) 22%, transparent), color-mix(in oklab, var(--neon-violet) 22%, transparent))',
                boxShadow:
                  'inset 0 0 0 1px color-mix(in oklab, var(--neon-cyan) 32%, transparent), 0 0 22px -8px color-mix(in oklab, var(--neon-cyan) 70%, transparent)',
              }}
            />
            {links.map((link, i) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  className={`relative z-10 flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[12.5px] transition-colors duration-300 xl:px-3 xl:text-[13px] ${
                    active
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right cluster */}
          <div className="flex shrink-0 items-center gap-1.5">
            {/* 状态芯片：只在宽屏显示，给站点一点「在线信号」的仪式感 */}
            <span className="hidden items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--neon-lime)_35%,transparent)] px-2.5 py-1 xl:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--neon-lime)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--neon-lime)]" />
              </span>
              <span className="font-mono text-[9px] tracking-[0.16em] text-[color-mix(in_oklab,var(--neon-lime)_80%,var(--foreground))]">
                OPEN TO INTERN
              </span>
            </span>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('nav.github')}
              className="hidden h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-foreground sm:flex"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            <ThemeToggle />
            <LanguageToggle />

            {user ? (
              <div className="flex items-center gap-1">
                <NotificationBell onNotificationCountChange={setNotificationCount} />
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    aria-haspopup="menu"
                    aria-expanded={showUserMenu}
                    className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition-all duration-200 hover:bg-accent"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.nickname || user.username}
                        className="h-7 w-7 rounded-full object-cover ring-2 ring-[color-mix(in_oklab,var(--neon-cyan)_45%,transparent)]"
                      />
                    ) : (
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--glow-cyan)] to-[var(--glow-violet)] text-xs font-bold ${INK}`}
                      >
                        {user.nickname?.charAt(0) || user.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="hidden text-sm xl:block">
                      {user.nickname || user.username}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="glass-strong absolute right-0 mt-2 w-52 animate-in fade-in slide-in-from-top-2 rounded-xl py-1 shadow-2xl duration-150">
                      <div className="border-b border-border px-4 py-3">
                        <p className="text-sm font-medium">
                          {user.nickname || user.username}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {user.role === 'admin' ? t('nav.adminRole') : t('nav.userRole')}
                        </p>
                      </div>
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-accent"
                      >
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                        {t('nav.settings')}
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-accent"
                        >
                          <Settings className="h-4 w-4 text-muted-foreground" />
                          {t('nav.admin')}
                        </Link>
                      )}
                      <div className="mt-1 border-t border-border pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-accent"
                        >
                          <LogOut className="h-4 w-4" />
                          {t('nav.logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/login"
                  aria-label={t('nav.login')}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-foreground"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline">{t('nav.login')}</span>
                </Link>
                <Link
                  href="/register"
                  className="btn-neon flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px]"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>{t('nav.register')}</span>
                </Link>
              </div>
            )}

            {/* Mobile toggle：抽屉一直负责到 lg */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-accent lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        inert={!isOpen}
        className={`fixed inset-0 top-0 z-40 lg:hidden ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`glass-strong absolute inset-x-3 top-20 max-h-[78vh] overflow-y-auto rounded-3xl p-4 shadow-2xl transition-all duration-300 ${
            isOpen
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-4 opacity-0'
          }`}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="mono-label">NAVIGATION</span>
            <Sparkles className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
          </div>

          <div className="flex flex-col gap-1">
            {links.map((link, i) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  style={{ transitionDelay: isOpen ? `${i * 45}ms` : '0ms' }}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 ${
                    isOpen ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
                  } ${
                    active
                      ? 'border-[color-mix(in_oklab,var(--neon-cyan)_40%,transparent)] bg-[color-mix(in_oklab,var(--neon-cyan)_12%,transparent)] font-medium'
                      : 'border-transparent text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="my-3 hairline-x" />

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[var(--glow-cyan)] to-[var(--glow-violet)] text-xs font-bold ${INK}`}
                    >
                      {user.nickname?.charAt(0) || user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                  {user.nickname || user.username}
                </div>
                <Link
                  href="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-muted-foreground transition-colors hover:bg-accent"
                >
                  <Bell className="h-5 w-5" />
                  <span>{t('nav.notifications')}</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-muted-foreground transition-colors hover:bg-accent"
                >
                  <UserCog className="h-5 w-5" />
                  <span>{t('nav.settings')}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-muted-foreground transition-colors hover:bg-accent"
                  >
                    <Settings className="h-5 w-5" />
                    <span>{t('nav.admin')}</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-400 transition-colors hover:bg-accent"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-ghost-tech flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm"
                >
                  <LogIn className="h-4 w-4" />
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn-neon flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
