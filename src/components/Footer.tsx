'use client';

import Link from 'next/link';
import { Github, Heart, Mail, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const GITHUB_URL = 'https://github.com/XiaoZi-Li';
const EMAIL = 'purplemist@qq.com';

const FOCUS = [
  { label: 'Robot Motion Control', sub: 'MPC · WBC · MuJoCo' },
  { label: 'Vision-Language-Action', sub: 'OpenVLA · π0 · GR00T' },
  { label: 'Reinforcement Learning', sub: 'PPO · SAC · Sim2Real' },
  { label: 'Embedded Systems', sub: 'Rust · ESP32 · FPGA' },
];

export default function Footer() {
  const { t } = useLanguage();

  // 线上既有的 7 个导航链接（沿用线上的 key，不新增条目）
  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/tutorials', label: t('nav.tutorials') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/resume', label: t('nav.resume') || '简历' },
    { href: '/projects', label: t('nav.projects') },
    { href: '/messages', label: t('nav.messages') },
  ];

  return (
    <footer className="relative z-10 mt-20 overflow-hidden">
      <div className="hairline-x" />

      {/* 底部极光辉光 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-60%] h-[420px] opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, color-mix(in oklab, var(--glow-violet) 26%, transparent), transparent 68%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="animate-spin-slower absolute inset-0 rounded-lg border border-dashed border-[color-mix(in_oklab,var(--neon-cyan)_45%,transparent)]" />
                <span className="absolute inset-[3px] rounded-md bg-gradient-to-br from-[var(--glow-cyan)] to-[var(--glow-violet)]" />
              </span>
              <span className="text-lg font-bold tracking-tight">{t('home.name')}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t('footer.tagline')}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={`mailto:${EMAIL}`}
                className="btn-ghost-tech flex h-9 w-9 items-center justify-center rounded-xl"
                aria-label={EMAIL}
              >
                <Mail className="h-4 w-4" />
              </a>
              <Link
                href="/messages"
                className="btn-ghost-tech flex h-9 w-9 items-center justify-center rounded-xl"
                aria-label={t('messages.leaveMessage')}
              >
                <MessageSquare className="h-4 w-4" />
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-tech flex h-9 w-9 items-center justify-center rounded-xl"
                aria-label={t('nav.github')}
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h3 className="mono-label">{t('footer.navigate')}</h3>
            <div className="mt-4 flex flex-col gap-2.5">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="h-px w-0 bg-[var(--neon-cyan)] transition-all duration-300 group-hover:w-3" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Focus */}
          <div className="md:col-span-4">
            <h3 className="mono-label">{t('footer.focus')}</h3>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {FOCUS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border/60 bg-[color-mix(in_oklab,var(--card)_55%,transparent)] px-3 py-2.5 transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--neon-cyan)_40%,transparent)]"
                >
                  <p className="text-[12.5px] font-medium leading-tight">{item.label}</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h3 className="mono-label">{t('footer.contact')}</h3>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-[var(--neon-cyan)]" />
                {EMAIL}
              </a>
              <Link
                href="/messages"
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0 text-[var(--neon-cyan)]" />
                {t('messages.leaveMessage')}
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5 shrink-0 text-[var(--neon-cyan)]" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row">
          <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
            © {new Date().getFullYear()} {t('home.name')} · Next.js + TypeScript + Supabase
          </p>
          <p className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-muted-foreground">
            Built with
            <Heart className="h-3 w-3 animate-heartbeat text-[var(--neon-magenta)]" />
            {t('footer.built')}
          </p>
        </div>
      </div>
    </footer>
  );
}
