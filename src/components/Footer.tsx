'use client';

import Link from 'next/link';
import { Code2, Github, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">{t('home.name')}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('home.subtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.home')}
              </Link>
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.projects')}
              </Link>
              <Link href="/messages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.messages')}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Contact</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="mailto:purplemist@qq.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                purplemist@qq.com
              </a>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                150-2202-2976
              </div>
              <a
                href="https://github.com/XiaoZi-Li"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {t('home.name')}. All rights reserved.</p>
          <p>Built with Next.js + TypeScript + Supabase</p>
        </div>
      </div>
    </footer>
  );
}
