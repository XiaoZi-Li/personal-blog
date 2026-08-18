'use client';

import {
  MapPin, GraduationCap, Mail, Phone,
  Trophy, Briefcase,
  Calendar, Users,
  Star, MessageSquare, FileText
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResumeDownloadButton } from '@/components/ResumeDownloadButton';
import { Reveal } from '@/components/Reveal';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  // 竞赛经历
  const competitions = [
    {
      title: t('competitions.comp1.title'),
      award: t('competitions.comp1.award'),
      date: t('competitions.comp1.date'),
      role: t('competitions.member'),
      track: t('competitions.comp1.track'),
      details: [t('competitions.comp1.detail1'), t('competitions.comp1.detail2')],
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/20',
    },
    {
      title: t('competitions.comp2.title'),
      award: t('competitions.comp2.award'),
      date: t('competitions.comp2.date'),
      role: t('competitions.member'),
      track: t('competitions.comp2.track'),
      details: [t('competitions.comp2.detail1'), t('competitions.comp2.detail2')],
      gradient: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/20',
    },
    {
      title: t('competitions.comp0.title'),
      award: t('competitions.comp0.award'),
      date: t('competitions.comp0.date'),
      role: t('competitions.captain'),
      track: t('competitions.comp0.track'),
      details: [t('competitions.comp0.detail1'), t('competitions.comp0.detail2')],
      gradient: 'from-violet-500 to-purple-600',
      glow: 'shadow-violet-500/20',
    },
    {
      title: t('competitions.comp3.title'),
      award: t('competitions.comp3.award'),
      date: t('competitions.comp3.date'),
      role: t('competitions.member'),
      track: t('competitions.comp3.track'),
      details: [t('competitions.comp3.detail1'), t('competitions.comp3.detail2')],
      gradient: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-500/20',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950" />

        {/* 浮动装饰 - 移动端缩小 */}
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-violet-300/20 dark:bg-violet-900/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-56 sm:w-80 h-56 sm:h-80 bg-indigo-300/20 dark:bg-indigo-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-40 sm:w-60 h-40 sm:h-60 bg-fuchsia-200/20 dark:bg-fuchsia-900/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* 左侧：基本信息卡片 */}
            <div className="lg:col-span-1">
              <Card className="lg:sticky lg:top-24 border-0 shadow-2xl shadow-violet-500/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
                
                <CardContent className="pt-6 sm:pt-8 text-center">
                  {/* 头像 - 移动端稍小 */}
                  <div className="relative inline-block mb-4 sm:mb-6">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-[3px] shadow-xl shadow-violet-500/30">
                      <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                        <span className="text-3xl sm:text-5xl">👨‍💻</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full border-3 sm:border-4 border-white dark:border-slate-800 flex items-center justify-center">
                      <span className="text-white text-[10px] sm:text-xs">✓</span>
                    </div>
                  </div>
                  
                  {/* 姓名 */}
                  <h1 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2 bg-gradient-to-r from-violet-700 to-indigo-600 dark:from-violet-300 dark:to-indigo-300 bg-clip-text text-transparent">
                    {t('home.name')}
                  </h1>
                  
                  {/* 求职意向 */}
                  <p className="text-xs sm:text-sm text-violet-600 dark:text-violet-400 font-medium mb-3 sm:mb-4">
                    {t('home.subtitle')}
                  </p>
                  
                  {/* 联系方式 */}
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-500" />
                      <span>150-2202-2976</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-500" />
                      <span>purplemist@qq.com</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-500" />
                      <span>{t('home.university')}</span>
                    </div>
                  </div>
                  
                  {/* 简历下载按钮 */}
                  <ResumeDownloadButton />
                  
                  {/* 教育背景简述 */}
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl bg-violet-50/80 dark:bg-violet-950/30 text-left border border-violet-100 dark:border-violet-900/50">
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-600 dark:text-violet-400" />
                      <span className="font-medium text-xs sm:text-sm">{t('home.about')}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">{t('home.university')}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{t('home.major')} · {t('home.grade')}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">2023.09 - 2027.07</p>
                  </div>
                  
                  {/* 语言能力 */}
                  <div className="mt-3 sm:mt-4 flex justify-center gap-2 sm:gap-3">
                    <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 border-0 text-xs">
                      CET-4
                    </Badge>
                    <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-0 text-xs">
                      普通话二乙
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* 右侧：详细信息 */}
            <div className="lg:col-span-2 space-y-5 sm:space-y-8">
              {/* 自我介绍 */}
              <Card className="border-0 shadow-lg shadow-violet-500/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardContent className="pt-5 sm:pt-6 px-4 sm:px-6">
                  <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t('home.aboutContent')}
                  </p>
                </CardContent>
              </Card>
              
              {/* 核心优势 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                {[
                  { label: t('competitions.award.national') + ' ' + t('competitions.award.third'), value: '3', gradient: 'from-amber-500 to-orange-500', icon: '🏆' },
                  { label: t('competitions.award.provincialTop') + ' ' + t('competitions.award.first'), value: '1', gradient: 'from-violet-500 to-purple-600', icon: '🥇' },
                  { label: t('home.stats.totalAwards'), value: '4', gradient: 'from-fuchsia-500 to-pink-600', icon: '⭐' },
                  { label: t('home.stats.certification'), value: '1', gradient: 'from-emerald-500 to-teal-500', icon: '📜' },
                ].map((item, i) => (
                  <Reveal key={i} delay={i * 120} y={16}>
                    <Card className="group card-shimmer border-0 shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.03] transition-all duration-300">
                      <CardContent className="pt-4 sm:pt-6 pb-3 sm:pb-6 text-center px-2 sm:px-4">
                        <div className="text-xl sm:text-3xl mb-1 sm:mb-2 group-hover:animate-wiggle inline-block transition-transform">{item.icon}</div>
                        <p className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                          {item.value}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-tight">{item.label}</p>
                      </CardContent>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 科研经历 */}
      <section className="py-10 sm:py-16 bg-white dark:bg-slate-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-50 via-transparent to-transparent dark:from-violet-950/20 dark:via-transparent dark:to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t('home.research.badge')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">{t('home.research.title')}</h2>
          </div>

          <Reveal>
            <Card className="group card-shimmer animate-glow-pulse border-0 hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 hover:-translate-y-1">
              <CardContent className="pt-5 sm:pt-6 px-4 sm:px-8 pb-5 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{t('home.research.paper')}</h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {t('home.research.period')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {t('home.research.role')}
                    </span>
                    <span className="italic">{t('home.research.journal')}</span>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white border-0 shadow-md self-start whitespace-nowrap group-hover:scale-105 transition-transform">
                  {t('home.research.status')}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('home.research.desc')}
              </p>
            </CardContent>
          </Card>
        </Reveal>
        </div>
      </section>

      {/* 竞赛与荣誉 */}
      <section className="py-10 sm:py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-50 via-transparent to-transparent dark:from-violet-950/20 dark:via-transparent dark:to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t('home.honors')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">竞赛经历</h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {competitions.map((comp, i) => (
              <Reveal key={i} delay={i * 100}>
              <Card
                className={`group card-shimmer relative border-0 shadow-lg ${comp.glow} hover:shadow-2xl transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl overflow-hidden hover:-translate-y-1 hover:scale-[1.01]`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-gradient-to-b ${comp.gradient} group-hover:w-1.5 sm:group-hover:w-2 transition-all`} />
                <CardContent className="pt-4 sm:pt-6 pl-4 sm:pl-6 px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{comp.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {comp.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {comp.role}
                        </span>
                        <Badge variant="outline" className="text-[10px] sm:text-xs border-violet-200 dark:border-violet-800 h-5 group-hover:border-violet-400 transition-colors">{comp.track}</Badge>
                      </div>
                    </div>
                    <Badge className={`bg-gradient-to-r ${comp.gradient} text-white border-0 shadow-md text-xs sm:text-sm self-start group-hover:scale-105 transition-transform`}>
                      <Trophy className="w-3 h-3 mr-1 group-hover:animate-wiggle" />
                      {comp.award}
                    </Badge>
                  </div>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {comp.details.map((detail, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${comp.gradient} mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform`} style={{ transitionDelay: `${j * 60}ms` }} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 自我评价 */}
      <section className="py-10 sm:py-16 bg-white dark:bg-slate-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-50 via-transparent to-transparent dark:from-fuchsia-950/10 dark:via-transparent dark:to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-700 dark:text-fuchsia-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t('home.about')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">个人特质</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { title: t('home.evaluations.embodiedLove'), desc: t('home.evaluations.embodiedLoveDesc'), icon: '🤖' },
              { title: t('home.evaluations.embeddedPassion'), desc: t('home.evaluations.embeddedPassionDesc'), icon: '⚡' },
              { title: t('home.evaluations.rustEnthusiast'), desc: t('home.evaluations.rustEnthusiastDesc'), icon: '🦀' },
              { title: t('home.evaluations.humbleLearner'), desc: t('home.evaluations.humbleLearnerDesc'), icon: '📚' },
              { title: t('home.evaluations.teamWork'), desc: t('home.evaluations.teamWorkDesc'), icon: '🤝' },
              { title: t('home.evaluations.aiAssisted'), desc: t('home.evaluations.aiAssistedDesc'), icon: '🎯' },
            ].map((item, i) => (
              <Reveal key={i} delay={(i % 3) * 100} y={20}>
                <Card className="group card-shimmer border-0 shadow-md bg-white dark:bg-slate-900 hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="pt-4 sm:pt-5 px-3 sm:px-6 pb-3 sm:pb-5">
                    <div className="text-xl sm:text-2xl mb-2 sm:mb-3 group-hover:animate-float-soft inline-block">{item.icon}</div>
                    <h4 className="font-semibold text-violet-700 dark:text-violet-400 mb-1 sm:mb-2 text-sm sm:text-base">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 求职与交流 */}
      <section className="py-10 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/30 dark:via-purple-950/20 dark:to-fuchsia-950/30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t('home.career.title')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">{t('home.career.heading')}</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <Reveal delay={0}>
            <Card className="group card-shimmer border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardContent className="pt-5 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg sm:text-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    💼
                  </div>
                  <h3 className="font-bold text-base sm:text-lg">{t('home.career.internship')}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('home.career.internshipDesc')}
                </p>
                <a href="/resume" className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs sm:text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {t('home.career.goToResume')}
                </a>
              </CardContent>
            </Card>
            </Reveal>

            <Reveal delay={120}>
            <Card className="group card-shimmer border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardContent className="pt-5 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center text-white text-lg sm:text-xl shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                    🌐
                  </div>
                  <h3 className="font-bold text-base sm:text-lg">{t('home.career.community')}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('home.career.communityDesc')}
                </p>
                <Link href="/messages" className="inline-flex items-center gap-1.5 mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors">
                  <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {t('home.career.goToForum')}
                </Link>
              </CardContent>
            </Card>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
