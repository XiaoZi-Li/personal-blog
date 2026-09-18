'use client';

import Link from 'next/link';
import {
  MapPin,
  GraduationCap,
  Mail,
  Trophy,
  Code,
  Brain,
  Briefcase,
  Calendar,
  Users,
  Cpu,
  MessageSquare,
  FileText,
  Microchip,
  Wrench,
  Bot,
  BookOpen,
  Target,
  ArrowUpRight,
  Sparkles,
  Braces,
  Github,
  Languages,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/tech/SectionHeading';
import GlassCard from '@/components/tech/GlassCard';
import TiltCard from '@/components/tech/TiltCard';
import Typewriter from '@/components/tech/Typewriter';
import Marquee from '@/components/tech/Marquee';
import OrbitalCore from '@/components/tech/OrbitalCore';
import SectionRail, { type RailSection } from '@/components/tech/SectionRail';

type Level = 'core' | 'familiar' | 'learning';

const LEVEL_DOTS: Record<Level, number> = { core: 3, familiar: 2, learning: 1 };

/** 论文外链：Springer 正式出版页面，全文唯一一处科研出处入口 */
const PAPER_URL = 'https://link.springer.com/article/10.1007/s10044-026-01761-5';

/**
 * 熟练度指示器：三点式。
 * 形状单独承载信息是不够的，所以补上 aria-label / title 作为文字替代。
 */
function LevelDots({ level, label }: { level: Level; label: string }) {
  const filled = LEVEL_DOTS[level];
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="flex shrink-0 items-center gap-1"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-1 w-2.5 rounded-full ${
            i < filled
              ? 'bg-[var(--neon-cyan)]'
              : 'bg-[color-mix(in_oklab,var(--muted-foreground)_38%,transparent)]'
          }`}
        />
      ))}
    </span>
  );
}

/** 细线网格：用 1px gap 露出底色当作分隔线，比给每个格子写边框可靠得多 */
const HAIRLINE_GRID =
  'grid gap-px bg-border [&>*]:bg-card [&>*]:transition-colors [&>*]:duration-300';

/** 技术雷达：区分「已在项目里用过」和「正在学」，避免把计划当成熟练度展示 */
const TECH_RADAR: Array<{ name: string; learning?: boolean }> = [
  { name: 'C / C++' },
  { name: 'Python' },
  { name: 'Verilog' },
  { name: 'FPGA' },
  { name: 'ESP32' },
  { name: 'STM32' },
  { name: 'ROS 2' },
  { name: 'dora-rs' },
  { name: 'YOLO' },
  { name: 'OpenCV' },
  { name: 'PyTorch' },
  { name: 'PCB 设计' },
  { name: 'MCP' },
  { name: 'AI Agent' },
  { name: 'Next.js' },
  { name: 'TypeScript' },
  { name: 'Linux' },
  { name: 'Rust', learning: true },
  { name: 'MuJoCo', learning: true },
  { name: 'Isaac Lab', learning: true },
  { name: 'MPC', learning: true },
  { name: 'WBC', learning: true },
  { name: 'PPO / SAC', learning: true },
  { name: 'Sim2Real', learning: true },
  { name: 'OpenVLA', learning: true },
  { name: 'π0', learning: true },
  { name: 'Diffusion Policy', learning: true },
];

export default function Home() {
  const { t } = useLanguage();

  const roles = [
    t('home.hero.roles.r1'),
    t('home.hero.roles.r2'),
    t('home.hero.roles.r3'),
    t('home.hero.roles.r4'),
  ];

  const levelLabel: Record<Level, string> = {
    core: t('home.skillLevels.core'),
    familiar: t('home.skillLevels.familiar'),
    learning: t('home.skillLevels.learning'),
  };

  // 章节轨：顺序与下方 DOM 顺序一致，编号与 kicker 对应
  const railSections: RailSection[] = [
    { id: 'research', label: t('home.rail.research') },
    { id: 'about', label: t('home.rail.about') },
    { id: 'stack', label: t('home.rail.stack') },
    { id: 'honors', label: t('home.rail.honors') },
    { id: 'roadmap', label: t('home.rail.roadmap') },
    { id: 'traits', label: t('home.rail.traits') },
    { id: 'contact', label: t('home.rail.contact') },
  ];

  // 技术栈：像数据手册一样按列排，而不是四张一模一样的卡片
  const skillGroups: Array<{
    title: string;
    en: string;
    icon: typeof Code;
    glow: string;
    skills: Array<{ name: string; level: Level }>;
  }> = [
    {
      title: t('home.skillCategories.programming'),
      en: 'LANGUAGES',
      icon: Code,
      glow: 'var(--glow-violet)',
      skills: [
        { name: 'C / C++', level: 'core' },
        { name: 'Python', level: 'core' },
        { name: 'Verilog', level: 'familiar' },
        { name: 'Rust', level: 'learning' },
        { name: t('skills.cangjie'), level: 'learning' },
      ],
    },
    {
      title: t('home.skillCategories.hardware'),
      en: 'HARDWARE',
      icon: Microchip,
      glow: 'var(--glow-cyan)',
      skills: [
        { name: t('skills.fpga'), level: 'familiar' },
        { name: t('skills.esp32'), level: 'familiar' },
        { name: t('skills.stm32'), level: 'familiar' },
        { name: t('skills.harmony'), level: 'familiar' },
      ],
    },
    {
      title: t('home.skillCategories.ai'),
      en: 'AI TOOLCHAIN',
      icon: Brain,
      glow: 'var(--glow-magenta)',
      skills: [
        { name: t('skills.mcp'), level: 'familiar' },
        { name: t('skills.aiSkills'), level: 'learning' },
        { name: 'PyTorch · OpenCV', level: 'familiar' },
      ],
    },
    {
      title: t('common.more'),
      en: 'PRACTICE',
      icon: Wrench,
      glow: 'var(--glow-lime)',
      skills: [
        { name: 'PCB 绘制', level: 'familiar' },
        { name: '传感器融合', level: 'familiar' },
        { name: '嵌入式全流程', level: 'familiar' },
        { name: 'Next.js / TS 全栈', level: 'learning' },
      ],
    },
  ];

  const roadmap = [
    {
      index: '01',
      status: 'doing' as const,
      accent: 'var(--neon-cyan)',
      name: t('home.roadmap.stage1.name'),
      en: t('home.roadmap.stage1.en'),
      desc: t('home.roadmap.stage1.desc'),
      items: [
        t('home.roadmap.stage1.items.i1'),
        t('home.roadmap.stage1.items.i2'),
        t('home.roadmap.stage1.items.i3'),
        t('home.roadmap.stage1.items.i4'),
      ],
    },
    {
      index: '02',
      status: 'next' as const,
      accent: 'var(--neon-violet)',
      name: t('home.roadmap.stage2.name'),
      en: t('home.roadmap.stage2.en'),
      desc: t('home.roadmap.stage2.desc'),
      items: [
        t('home.roadmap.stage2.items.i1'),
        t('home.roadmap.stage2.items.i2'),
        t('home.roadmap.stage2.items.i3'),
        t('home.roadmap.stage2.items.i4'),
      ],
    },
    {
      index: '03',
      status: 'next' as const,
      accent: 'var(--neon-magenta)',
      name: t('home.roadmap.stage3.name'),
      en: t('home.roadmap.stage3.en'),
      desc: t('home.roadmap.stage3.desc'),
      items: [
        t('home.roadmap.stage3.items.i1'),
        t('home.roadmap.stage3.items.i2'),
        t('home.roadmap.stage3.items.i3'),
        t('home.roadmap.stage3.items.i4'),
      ],
    },
  ];

  // 竞赛：沿用线上完整列表（comp0 队长一等奖 → comp3 服务外包），不删减获奖记录
  const competitions = [
    {
      title: t('competitions.comp0.title'),
      award: t('competitions.comp0.award'),
      date: t('competitions.comp0.date'),
      role: t('competitions.captain'),
      track: t('competitions.comp0.track'),
      details: [t('competitions.comp0.detail1'), t('competitions.comp0.detail2')],
      accent: 'var(--neon-cyan)',
    },
    {
      title: t('competitions.comp1.title'),
      award: t('competitions.comp1.award'),
      date: t('competitions.comp1.date'),
      role: t('competitions.member'),
      track: t('competitions.comp1.track'),
      details: [t('competitions.comp1.detail1'), t('competitions.comp1.detail2')],
      accent: 'var(--neon-violet)',
    },
    {
      title: t('competitions.comp2.title'),
      award: t('competitions.comp2.award'),
      date: t('competitions.comp2.date'),
      role: t('competitions.member'),
      track: t('competitions.comp2.track'),
      details: [t('competitions.comp2.detail1'), t('competitions.comp2.detail2')],
      accent: 'var(--neon-magenta)',
    },
    {
      title: t('competitions.comp3.title'),
      award: t('competitions.comp3.award'),
      date: t('competitions.comp3.date'),
      role: t('competitions.member'),
      track: t('competitions.comp3.track'),
      details: [t('competitions.comp3.detail1'), t('competitions.comp3.detail2')],
      accent: 'var(--neon-lime)',
    },
  ];

  const traits = [
    { title: t('home.evaluations.embodiedLove'), desc: t('home.evaluations.embodiedLoveDesc'), icon: Bot },
    { title: t('home.evaluations.embeddedPassion'), desc: t('home.evaluations.embeddedPassionDesc'), icon: Cpu },
    { title: t('home.evaluations.rustEnthusiast'), desc: t('home.evaluations.rustEnthusiastDesc'), icon: Braces },
    { title: t('home.evaluations.humbleLearner'), desc: t('home.evaluations.humbleLearnerDesc'), icon: BookOpen },
    { title: t('home.evaluations.teamWork'), desc: t('home.evaluations.teamWorkDesc'), icon: Users },
    { title: t('home.evaluations.aiAssisted'), desc: t('home.evaluations.aiAssistedDesc'), icon: Target },
  ];

  const specialties = t('home.specialties');
  const specialtyList: string[] = Array.isArray(specialties) ? specialties : [];

  return (
    <div className="relative">
      <SectionRail sections={railSections} />

      {/* ============================================================
          HERO
         ============================================================ */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="tech-grid pointer-events-none absolute inset-0 opacity-70" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 15% 0%, color-mix(in oklab, var(--glow-cyan) 16%, transparent), transparent 70%), radial-gradient(ellipse 50% 45% at 88% 22%, color-mix(in oklab, var(--glow-magenta) 14%, transparent), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-16 lg:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[color-mix(in_oklab,var(--neon-cyan)_30%,transparent)] px-3 py-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--neon-lime)] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--neon-lime)]" />
                  </span>
                  <span className="mono-label">{t('home.hero.kicker')}</span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-base font-normal text-muted-foreground sm:text-lg">
                    {t('home.greeting')}
                  </span>
                  <span className="text-aurora mt-1 block text-balance">{t('home.name')}</span>
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-5 flex items-center gap-2 font-mono text-sm text-[var(--neon-cyan)] sm:text-base">
                  <span className="text-[var(--neon-magenta)]">▸</span>
                  <Typewriter phrases={roles} />
                </div>
              </Reveal>

              <Reveal delay={240}>
                <p className="mt-6 max-w-xl border-l-2 border-[color-mix(in_oklab,var(--glow-violet)_60%,transparent)] pl-4 text-sm leading-relaxed text-foreground sm:text-base">
                  {t('home.hero.quote')}
                </p>
              </Reveal>

              {/* 两个主行动：一个去看完整经历，一个去看向的方向 */}
              <Reveal delay={320}>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/resume"
                    className="btn-neon inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    {t('home.hero.ctaPrimary')}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/robotics"
                    className="btn-ghost-tech inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium"
                  >
                    <Bot className="h-4 w-4 text-[var(--neon-cyan)]" />
                    {t('home.hero.ctaSecondary')}
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground sm:text-sm">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-[var(--neon-cyan)]" />
                    {t('home.university')} · {t('home.major')} · {t('home.grade')}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[var(--neon-violet)]" />
                    2023.09 — 2027.07
                  </span>
                  <a
                    href="https://github.com/XiaoZi-Li"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 transition-colors hover:text-[var(--neon-cyan)]"
                  >
                    <Github className="h-4 w-4 text-[var(--neon-magenta)]" />
                    XiaoZi-Li
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal dir="scale" delay={220} className="lg:pl-6">
              <OrbitalCore />
            </Reveal>
          </div>

          {/* 联系带：只放可公开的渠道 —— 邮箱、学校、GitHub、站内留言，以及简历页入口。
              手机号与简历文件下载已按隐私要求移除，联系方式一律走站内。 */}
          <Reveal delay={480}>
            <div className="panel mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl px-5 py-4 sm:flex-row">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground sm:text-sm">
                <a
                  href="mailto:purplemist@qq.com"
                  className="flex items-center gap-2 transition-colors hover:text-[var(--neon-cyan)]"
                >
                  <Mail className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
                  purplemist@qq.com
                </a>
                <span className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
                  {t('home.university')}
                </span>
                <a
                  href="https://github.com/XiaoZi-Li"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-[var(--neon-cyan)]"
                >
                  <Github className="h-3.5 w-3.5 text-[var(--neon-violet)]" />
                  XiaoZi-Li
                </a>
                <Link
                  href="/messages"
                  className="flex items-center gap-2 transition-colors hover:text-[var(--neon-cyan)]"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[var(--neon-magenta)]" />
                  {t('messages.leaveMessage')}
                </Link>
              </div>
              <Link
                href="/resume"
                className="btn-ghost-tech inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium sm:text-sm"
              >
                <FileText className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
                {t('home.career.goToResume')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          技术雷达
         ============================================================ */}
      <section className="relative border-y border-border/50 py-5">
        <div className="mx-auto mb-3 flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Sparkles className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
          <span className="mono-label">{t('home.marquee.label')}</span>
          <span className="hairline-x flex-1" />
          {/* 诚实标注：哪些是做过项目的，哪些还在学 */}
          <span className="flex shrink-0 items-center gap-3 font-mono text-[9.5px] tracking-[0.12em] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-2.5 rounded-full bg-[var(--neon-cyan)]" />
              {t('home.marquee.practiced')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-2.5 rounded-full bg-[color-mix(in_oklab,var(--muted-foreground)_35%,transparent)]" />
              {t('home.marquee.learning')}
            </span>
          </span>
        </div>
        <Marquee>
          {TECH_RADAR.map((tag) => (
            <span key={tag.name} className="mx-3 flex items-center gap-3 whitespace-nowrap">
              <span
                className={`font-mono text-[12px] tracking-wide transition-colors duration-300 ${
                  tag.learning
                    ? 'text-muted-foreground'
                    : 'text-foreground hover:text-[var(--neon-cyan)]'
                }`}
              >
                {tag.name}
              </span>
              <span
                className={`h-1 w-1 rounded-full ${
                  tag.learning
                    ? 'bg-transparent ring-1 ring-inset ring-[color-mix(in_oklab,var(--muted-foreground)_60%,transparent)]'
                    : 'bg-[var(--neon-violet)]'
                }`}
              />
            </span>
          ))}
        </Marquee>
      </section>

      {/* ============================================================
          科研经历：全站最硬的一条资历，放在履历之前先给证据
         ============================================================ */}
      <section id="research" className="relative scroll-mt-24 pb-14 pt-20 sm:pt-24">
        <div aria-hidden="true" className="tech-grid-fade pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="RESEARCH / 01" title={t('home.research.title')} align="left" />

          <Reveal delay={80}>
            <GlassCard className="mt-10 p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background:
                          'linear-gradient(135deg, color-mix(in oklab, var(--glow-violet) 90%, white), color-mix(in oklab, var(--glow-violet) 55%, black))',
                      }}
                    >
                      <FileText className="h-4 w-4 text-slate-900" />
                    </span>
                    <span className="mono-label">{t('home.research.badge')}</span>
                  </div>

                  {/* 论文标题即外链：Springer 正式出版页 */}
                  <h3 className="mt-5 text-balance text-lg font-bold leading-snug sm:text-xl">
                    <a
                      href={PAPER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-2 text-[var(--neon-violet)] underline-offset-4 transition-colors hover:text-[var(--neon-cyan)] hover:underline"
                    >
                      {t('home.research.paper')}
                      <ExternalLink className="mt-1 h-4 w-4 shrink-0" />
                    </a>
                  </h3>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:text-sm">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
                      {t('home.research.period')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[var(--neon-violet)]" />
                      {t('home.research.role')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-[var(--neon-magenta)]" />
                      <span className="italic">{t('home.research.journal')}</span>
                    </span>
                  </div>

                  <p className="mt-5 max-w-3xl text-pretty text-[13px] leading-[1.85] text-muted-foreground sm:text-sm">
                    {t('home.research.desc')}
                  </p>
                </div>

                {/* 状态徽标：不是装饰，是这条资历的可信度标记 */}
                <span
                  className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-[var(--neon-lime)]"
                  style={{
                    background: 'color-mix(in oklab, var(--glow-lime) 16%, transparent)',
                    boxShadow:
                      'inset 0 0 0 1px color-mix(in oklab, var(--neon-lime) 38%, transparent)',
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  {t('home.research.status')}
                </span>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          关于我
         ============================================================ */}
      <section id="about" className="relative scroll-mt-24 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="PROFILE / 02" title={t('home.about')} align="left" />

          <div className="mt-10 grid gap-4 lg:grid-cols-6">
            {/* 自我介绍：长篇只出现一次 */}
            <Reveal className="lg:col-span-4" delay={60}>
              <GlassCard className="h-full p-6 sm:p-8">
                <p className="text-pretty text-base leading-[1.85] text-foreground/90 sm:text-[17px]">
                  {t('home.aboutContent')}
                </p>
              </GlassCard>
            </Reveal>

            {/* 教育 */}
            <Reveal className="lg:col-span-2" delay={120}>
              <GlassCard className="flex h-full flex-col justify-between p-6">
                <span className="index-chip">EDUCATION</span>
                <div className="mt-6">
                  <p className="text-lg font-semibold">{t('home.university')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t('home.major')} · {t('home.grade')}
                  </p>
                  <p className="mt-3 font-mono text-xs text-[var(--neon-cyan)]">
                    2023.09 — 2027.07
                  </p>
                </div>
              </GlassCard>
            </Reveal>

            {/* 语言与证书 */}
            <Reveal className="lg:col-span-2" delay={160}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-[var(--neon-cyan)]" />
                  <span className="index-chip">LANGUAGES</span>
                </div>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">英语</dt>
                    <dd className="font-medium">CET-4</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">普通话</dt>
                    <dd className="font-medium">二级乙等</dd>
                  </div>
                </dl>
              </GlassCard>
            </Reveal>

            {/* 专业领域 */}
            <Reveal className="lg:col-span-4" delay={200}>
              <GlassCard className="h-full p-6">
                <span className="index-chip">DOMAINS</span>
                <div className="mt-5 flex flex-wrap gap-2">
                  {specialtyList.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] tracking-wide text-muted-foreground transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--neon-cyan)_45%,transparent)] hover:text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          技术栈：一张数据手册，而不是四张同款卡片
         ============================================================ */}
      <section id="stack" className="relative scroll-mt-24 py-14 sm:py-20">
        <div aria-hidden="true" className="tech-grid-fade pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="STACK / 03"
            title={t('home.skills')}
            description="从寄存器到策略网络，我尽量让每一层都亲手碰过。右侧三点表示投入程度，不是自评分。"
            align="left"
          />

          <Reveal delay={80}>
            <GlassCard className="mt-8 p-0" hud={false} spotlight={false} lift={false}>
              <div className={`${HAIRLINE_GRID} sm:grid-cols-2 lg:grid-cols-4`}>
                {skillGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.title} className="p-6">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-lg"
                          style={{
                            background: `linear-gradient(135deg, color-mix(in oklab, ${group.glow} 90%, white), color-mix(in oklab, ${group.glow} 55%, black))`,
                          }}
                        >
                          <Icon className="h-4 w-4 text-slate-900" />
                        </span>
                        <span>
                          <span className="block text-[13px] font-semibold leading-tight">
                            {group.title}
                          </span>
                          <span className="block font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
                            {group.en}
                          </span>
                        </span>
                      </div>

                      <ul className="mt-5 space-y-3">
                        {group.skills.map((skill) => (
                          <li key={skill.name} className="flex items-center justify-between gap-3">
                            <span className="truncate text-[13px] text-foreground/90">
                              {skill.name}
                            </span>
                            <LevelDots level={skill.level} label={levelLabel[skill.level]} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}

                {/* 图例：说明三点代表什么，并声明这不是自评分 */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 p-6 sm:col-span-2 lg:col-span-4">
                  {(['core', 'familiar', 'learning'] as Level[]).map((level) => (
                    <span
                      key={level}
                      className="flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-muted-foreground"
                    >
                      <LevelDots level={level} label={levelLabel[level]} />
                      {levelLabel[level]}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          竞赛与荣誉（先给证据）
         ============================================================ */}
      <section id="honors" className="relative scroll-mt-24 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="HONORS / 04" title={t('competitions.title')} align="left" />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {competitions.map((comp, i) => (
              <Reveal key={comp.title} delay={i * 90}>
                <TiltCard max={4}>
                  <GlassCard className="flex h-full flex-col p-6">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-full w-[3px]"
                      style={{
                        background: `linear-gradient(180deg, ${comp.accent}, transparent)`,
                      }}
                    />
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold"
                        style={{
                          background: `color-mix(in oklab, ${comp.accent} 16%, transparent)`,
                          color: `color-mix(in oklab, ${comp.accent} 92%, var(--foreground))`,
                          boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${comp.accent} 38%, transparent)`,
                        }}
                      >
                        <Trophy className="h-3 w-3" />
                        {comp.award}
                      </span>
                      <span className="index-chip">{comp.date}</span>
                    </div>

                    <h3 className="mt-5 text-balance text-[15px] font-bold leading-snug">
                      {comp.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3 w-3" />
                        {comp.role}
                      </span>
                      <span className="font-mono">·</span>
                      <span className="font-mono">{comp.track}</span>
                    </div>

                    <ul className="mt-5 space-y-2.5 border-t border-border/60 pt-5">
                      {comp.details.map((detail) => (
                        <li
                          key={detail}
                          className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--neon-cyan)]" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          具身智能路线图：一条链，不是三张等权卡片
         ============================================================ */}
      <section id="roadmap" className="relative scroll-mt-24 overflow-hidden py-14 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in oklab, var(--glow-violet) 16%, transparent), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker={`${t('home.roadmap.kicker')} / 05`}
            title={t('home.roadmap.title')}
            description={t('home.roadmap.subtitle')}
            align="left"
          />

          <Reveal delay={80}>
            <GlassCard className="mt-8 p-0" hud={false} spotlight={false} lift={false}>
              <div className={`${HAIRLINE_GRID} lg:grid-cols-3`}>
                {roadmap.map((stage) => (
                  <div key={stage.index} className="p-6 lg:p-7">
                    {/* 站点：圆点 + 延伸到下一站的信号线 */}
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                        <span
                          className="absolute inset-0 rounded-full opacity-35"
                          style={{ background: stage.accent }}
                        />
                        {stage.status === 'doing' && (
                          <span
                            className="animate-ping-ring absolute inset-0 rounded-full"
                            style={{ background: stage.accent }}
                          />
                        )}
                        <span
                          className="relative h-2 w-2 rounded-full"
                          style={{ background: stage.accent }}
                        />
                      </span>
                      <span className="index-chip">{stage.index}</span>
                      <span
                        aria-hidden="true"
                        className="hidden h-px flex-1 lg:block"
                        style={{
                          background: `linear-gradient(90deg, color-mix(in oklab, ${stage.accent} 55%, transparent), transparent)`,
                        }}
                      />
                      <span
                        className="ml-auto rounded-full px-2.5 py-1 font-mono text-[9.5px] tracking-[0.14em] lg:ml-0"
                        style={{
                          background: `color-mix(in oklab, ${stage.accent} 14%, transparent)`,
                          color: `color-mix(in oklab, ${stage.accent} 96%, var(--foreground))`,
                          boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${stage.accent} 32%, transparent)`,
                        }}
                      >
                        {stage.status === 'doing'
                          ? t('home.roadmap.status.doing')
                          : t('home.roadmap.status.next')}
                      </span>
                    </div>

                    <p className="mt-5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                      {stage.en}
                    </p>
                    <h3 className="mt-1.5 text-lg font-bold">{stage.name}</h3>
                    <p className="mt-3 text-pretty text-[13px] leading-relaxed text-muted-foreground">
                      {stage.desc}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {stage.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px]">
                          <span
                            className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: stage.accent }}
                          />
                          <span className="text-foreground/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/robotics"
                className="btn-ghost-tech inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium"
              >
                <Bot className="h-4 w-4 text-[var(--neon-cyan)]" />
                {t('home.hero.ctaSecondary')}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <p className="max-w-md text-pretty text-xs leading-relaxed text-muted-foreground">
                {t('home.roadmap.note')}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          个人特质：密集行，代替六张同款卡片
         ============================================================ */}
      <section id="traits" className="relative scroll-mt-24 py-14 sm:py-20">
        <div aria-hidden="true" className="tech-grid-fade pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="TRAITS / 06" title="个人特质" align="left" />

          <Reveal delay={80}>
            <GlassCard className="mt-8 p-0" hud={false} spotlight={false} lift={false}>
              <div className={`${HAIRLINE_GRID} sm:grid-cols-2 lg:grid-cols-3`}>
                {traits.map((trait) => {
                  const Icon = trait.icon;
                  return (
                    <div
                      key={trait.title}
                      className="group flex gap-3.5 p-6 hover:bg-[color-mix(in_oklab,var(--glow-cyan)_6%,transparent)]"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon-cyan)] transition-transform duration-300 group-hover:scale-110" />
                      <div className="min-w-0">
                        <h4 className="text-[13.5px] font-semibold">{trait.title}</h4>
                        <p className="mt-1.5 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                          {trait.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          求职与交流
         ============================================================ */}
      <section id="contact" className="relative scroll-mt-24 overflow-hidden pb-24 pt-14 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 60% at 50% 100%, color-mix(in oklab, var(--glow-cyan) 16%, transparent), transparent 72%)',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker={t('home.career.title')}
            title={t('home.career.heading')}
            align="left"
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Reveal delay={60}>
              <GlassCard className="h-full p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--glow-cyan)] to-[var(--glow-violet)]">
                    <Briefcase className="h-5 w-5 text-slate-900" />
                  </span>
                  <h3 className="font-bold">{t('home.career.internship')}</h3>
                </div>
                <p className="mt-4 text-pretty text-[13px] leading-relaxed text-muted-foreground">
                  {t('home.career.internshipDesc')}
                </p>
                <Link
                  href="/resume"
                  className="btn-neon mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px]"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {t('home.career.goToResume')}
                </Link>
              </GlassCard>
            </Reveal>

            <Reveal delay={130}>
              <GlassCard className="h-full p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--glow-magenta)] to-[var(--glow-violet)]">
                    <MessageSquare className="h-5 w-5 text-slate-900" />
                  </span>
                  <h3 className="font-bold">{t('home.career.community')}</h3>
                </div>
                <p className="mt-4 text-pretty text-[13px] leading-relaxed text-muted-foreground">
                  {t('home.career.communityDesc')}
                </p>
                <Link
                  href="/messages"
                  className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-[var(--neon-cyan)] transition-colors hover:text-[var(--neon-magenta)]"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {t('home.career.goToForum')}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
