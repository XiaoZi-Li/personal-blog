'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  Mic,
  Zap,
  Cpu,
  Braces,
  Github,
  Eye,
  Workflow,
  BrainCircuit,
  Check,
  Loader,
  Circle,
  Radar,
  Gauge,
  Layers,
  GitBranch,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/tech/SectionHeading';
import GlassCard from '@/components/tech/GlassCard';
import CountUp from '@/components/tech/CountUp';
import Marquee from '@/components/tech/Marquee';

/** 细线网格：用 1px 的 gap 露出底色当分隔线，比给每格写边框更可靠（写法同首页） */
const HAIRLINE_GRID =
  'grid gap-px bg-border [&>*]:bg-card [&>*]:transition-colors [&>*]:duration-300';

function FlowLink() {
  return (
    <div className="relative flex shrink-0 items-center justify-center py-2 lg:py-0">
      {/* 竖线（移动端） */}
      <span className="h-6 w-px bg-gradient-to-b from-[color-mix(in_oklab,var(--neon-cyan)_60%,transparent)] to-[color-mix(in_oklab,var(--neon-violet)_60%,transparent)] lg:hidden" />
      {/* 横线（桌面端） */}
      <span className="relative hidden h-px w-10 overflow-hidden bg-[color-mix(in_oklab,var(--neon-cyan)_35%,transparent)] lg:block xl:w-16">
        <span
          className="animate-scan absolute inset-y-0 w-4"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--neon-cyan), transparent)',
            animation: 'marquee-x 2.4s linear infinite',
          }}
        />
      </span>
    </div>
  );
}

export default function RoboticsPage() {
  const { t } = useLanguage();

  // 信号链：颜色只用于图标描边和低透明度底纹，属于墨色档 ink
  const pipeline = [
    { label: 'Sensors', sub: '双目相机 · 本体状态', icon: Camera, ink: 'var(--neon-cyan)' },
    { label: 'Perception', sub: '深度估计 · 手势', icon: Eye, ink: 'var(--neon-lime)' },
    { label: 'Decision', sub: '状态机 · 优先级仲裁', icon: Workflow, ink: 'var(--neon-violet)' },
    { label: 'Policy', sub: 'VLA / RL（规划中）', icon: BrainCircuit, ink: 'var(--neon-magenta)' },
    { label: 'Actuators', sub: '运动指令', icon: Zap, ink: 'var(--neon-amber)' },
  ];

  // 核心能力：图标块是「渐变填充 + text-slate-900 近黑字形」，填充必须用亮色档 glow；
  // 块上的发丝描边属于边框用途，取墨色档 ink。两档混用会让亮色主题的图标块失去对比。
  const features = [
    { icon: Camera, title: t('embodied.f1.title'), desc: t('embodied.f1.desc'), ink: 'var(--neon-cyan)', glow: 'var(--glow-cyan)' },
    { icon: Mic, title: t('embodied.f2.title'), desc: t('embodied.f2.desc'), ink: 'var(--neon-violet)', glow: 'var(--glow-violet)' },
    { icon: Zap, title: t('embodied.f3.title'), desc: t('embodied.f3.desc'), ink: 'var(--neon-magenta)', glow: 'var(--glow-magenta)' },
    { icon: Radar, title: t('embodied.f4.title'), desc: t('embodied.f4.desc'), ink: 'var(--neon-lime)', glow: 'var(--glow-lime)' },
  ];

  const hardware = [
    { icon: Cpu, name: t('embodied.hw1.name'), desc: t('embodied.hw1.desc') },
    { icon: Camera, name: t('embodied.hw2.name'), desc: t('embodied.hw2.desc') },
    { icon: Mic, name: t('embodied.hw3.name'), desc: t('embodied.hw3.desc') },
  ];

  const software = [
    { icon: Braces, name: t('embodied.sw1.name'), desc: t('embodied.sw1.desc') },
    { icon: Workflow, name: t('embodied.sw2.name'), desc: t('embodied.sw2.desc') },
  ];

  const algorithms = ['StereoNet', 'MediaPipe', 'OpenCV', 'PyTorch', 'NumPy', 'ROS 2'];

  const progress = [
    { name: t('embodied.p1'), status: 'completed' },
    { name: t('embodied.p2'), status: 'completed' },
    { name: t('embodied.p3'), status: 'completed' },
    { name: t('embodied.p4'), status: 'completed' },
    { name: t('embodied.p5'), status: 'inProgress' },
    { name: t('embodied.p6'), status: 'planned' },
    { name: t('embodied.p7'), status: 'planned' },
  ];

  const statusMeta = {
    completed: { icon: Check, color: 'var(--neon-lime)', label: t('embodied.status.completed') },
    inProgress: { icon: Loader, color: 'var(--neon-amber)', label: t('embodied.status.inProgress') },
    planned: { icon: Circle, color: 'var(--muted-foreground)', label: t('embodied.status.planned') },
  } as const;

  // 指标：数字与图标都是「文字/描边」用途，走墨色档。
  // 只放硬件平台的客观规格，不放没有实测支撑的性能数字。
  const metrics = [
    { label: 'BPU', value: 10, suffix: ' TOPS', icon: Gauge, ink: 'var(--neon-cyan)' },
    { label: 'CPU CORES', value: 8, suffix: '', icon: GitBranch, ink: 'var(--neon-violet)' },
    { label: 'ON-DEVICE', value: 100, suffix: '%', icon: Layers, ink: 'var(--neon-magenta)' },
  ];

  const nextSteps = [t('embodied.next1'), t('embodied.next2'), t('embodied.next3')];

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="tech-grid pointer-events-none absolute inset-0 opacity-60" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 12% 0%, color-mix(in oklab, var(--glow-violet) 18%, transparent), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12 lg:px-8">
          <Reveal>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              {t('embodied.back')}
            </Link>
          </Reveal>

          <div className="mt-7 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Reveal delay={80}>
                <span className="mono-label">{t('embodied.kicker')}</span>
              </Reveal>
              <Reveal delay={140}>
                <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  <span className="text-aurora">{t('embodied.title')}</span>
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t('embodied.subtitle')}
                </p>
              </Reveal>
              <Reveal delay={260}>
                <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[color-mix(in_oklab,var(--neon-cyan)_30%,transparent)] bg-[color-mix(in_oklab,var(--neon-cyan)_8%,transparent)] px-3.5 py-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--neon-lime)] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--neon-lime)]" />
                  </span>
                  <span className="font-mono text-[11px] tracking-wide text-[color-mix(in_oklab,var(--neon-cyan)_85%,var(--foreground))]">
                    {t('embodied.tagline')}
                  </span>
                </div>
              </Reveal>
            </div>

            {/* 指标：一个面板切三格 + 细线分隔，避免三张同款阴影卡片 */}
            <Reveal delay={220} dir="scale">
              <GlassCard className="p-0" hud={false} spotlight={false} lift={false}>
                <div className={`${HAIRLINE_GRID} grid-cols-3`}>
                  {metrics.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.label} className="p-4 text-center">
                        <Icon className="mx-auto h-4 w-4" style={{ color: m.ink }} />
                        <p
                          className="mt-3 font-mono text-xl font-bold sm:text-2xl"
                          style={{ color: m.ink }}
                        >
                          <CountUp to={m.value} suffix={m.suffix} />
                        </p>
                        <p className="mt-1 font-mono text-[9px] tracking-[0.14em] text-muted-foreground">
                          {m.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 信号链：节点是浮在这一条带上的小面板，用 panel 材质即可，不必整段玻璃 */}
      <section className="relative border-y border-border/50 bg-[color-mix(in_oklab,var(--card)_35%,transparent)] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-between">
            {pipeline.map((node, i) => {
              const Icon = node.icon;
              return (
                <div key={node.label} className="flex w-full flex-col items-center lg:w-auto lg:flex-row">
                  <Reveal delay={i * 90} dir="scale" className="w-full lg:w-auto">
                    <div className="hud-frame panel mx-auto flex w-full max-w-[220px] items-center gap-3 rounded-2xl px-4 py-3 lg:w-auto lg:min-w-[150px]">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: `color-mix(in oklab, ${node.ink} 18%, transparent)`,
                          boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${node.ink} 40%, transparent)`,
                        }}
                      >
                        <Icon className="h-4 w-4" style={{ color: node.ink }} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium">{node.label}</span>
                        <span className="block truncate font-mono text-[9.5px] text-muted-foreground">
                          {node.sub}
                        </span>
                      </span>
                    </div>
                  </Reveal>
                  {i < pipeline.length - 1 && <FlowLink />}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 项目概述：上松下紧，和后面的紧凑区块形成节拍 */}
      <section className="relative pb-12 pt-20 sm:pb-14 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="OVERVIEW / 01" title={t('embodied.overviewTitle')} align="left" />
          <Reveal delay={100}>
            <GlassCard className="mt-8 p-6 sm:p-9">
              <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                {t('embodied.overview1')}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t('embodied.overview2')}
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* 核心能力：一个面板 + 发丝细线，替代四张带阴影的克隆卡片 */}
      <section className="relative py-14 sm:py-16">
        <div aria-hidden="true" className="tech-grid-fade pointer-events-none absolute inset-0 opacity-55" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="CAPABILITIES / 02" title={t('embodied.featuresTitle')} />
          <Reveal delay={90}>
            <GlassCard className="mt-10 p-0" hud={false} spotlight={false} lift={false}>
              <div className={`${HAIRLINE_GRID} sm:grid-cols-2`}>
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.title}
                      className="p-6 hover:bg-[color-mix(in_oklab,var(--glow-cyan)_6%,transparent)]"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, color-mix(in oklab, ${f.glow} 88%, white), color-mix(in oklab, ${f.glow} 50%, black))`,
                            boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${f.ink} 30%, transparent)`,
                          }}
                        >
                          <Icon className="h-5 w-5 text-slate-900" />
                        </span>
                        <h3 className="font-semibold">{f.title}</h3>
                      </div>
                      <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                        {f.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* 系统架构 */}
      <section className="relative pb-12 pt-20 sm:pb-14 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="ARCHITECTURE / 03"
            title={t('embodied.archTitle')}
            description={t('embodied.archDesc')}
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <Reveal delay={60}>
              <GlassCard className="h-full p-6">
                <h3 className="mono-label">{t('embodied.hardware')}</h3>
                <div className="mt-5 space-y-3">
                  {hardware.map((h) => {
                    const Icon = h.icon;
                    return (
                      <div
                        key={h.name}
                        className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted p-3.5 transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--neon-cyan)_38%,transparent)]"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon-cyan)]" />
                        <span>
                          <span className="block text-[13.5px] font-medium">{h.name}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {h.desc}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={130}>
              <GlassCard className="h-full p-6">
                <h3 className="mono-label">{t('embodied.software')}</h3>
                <div className="mt-5 space-y-3">
                  {software.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.name}
                        className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted p-3.5 transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--neon-violet)_38%,transparent)]"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon-violet)]" />
                        <span>
                          <span className="block text-[13.5px] font-medium">{s.name}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {s.desc}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>

                <h3 className="mono-label mt-7">{t('embodied.algo')}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {algorithms.map((algo) => (
                    <span
                      key={algo}
                      className="rounded-full border border-border/70 px-2.5 py-1 font-mono text-[10px] text-muted-foreground transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--neon-magenta)_45%,transparent)] hover:text-foreground"
                    >
                      {algo}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 开发进度 */}
      <section className="relative py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="PROGRESS / 04" title={t('embodied.progressTitle')} />

          <Reveal delay={100}>
            <GlassCard className="mt-10 p-6 sm:p-8" neon={false}>
              <ol className="relative space-y-1">
                {/* 竖线 */}
                <span
                  aria-hidden="true"
                  className="absolute left-[15px] top-3 bottom-3 w-px"
                  style={{
                    background:
                      'linear-gradient(180deg, color-mix(in oklab, var(--neon-lime) 55%, transparent), color-mix(in oklab, var(--neon-amber) 55%, transparent), color-mix(in oklab, var(--border) 100%, transparent))',
                  }}
                />
                {progress.map((item) => {
                  const meta = statusMeta[item.status as keyof typeof statusMeta];
                  const Icon = meta.icon;
                  return (
                    <li key={item.name} className="relative flex items-center gap-4 py-2.5">
                      <span
                        className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
                        style={{
                          borderColor: `color-mix(in oklab, ${meta.color} 45%, transparent)`,
                          background: 'var(--background)',
                        }}
                      >
                        <Icon
                          className={`h-3.5 w-3.5 ${item.status === 'inProgress' ? 'animate-spin-slow' : ''}`}
                          style={{ color: meta.color }}
                        />
                      </span>
                      <span className="flex-1 text-[13.5px] text-foreground/90">{item.name}</span>
                      <span
                        className="rounded-full px-2.5 py-1 font-mono text-[9.5px] tracking-[0.12em]"
                        style={{
                          background: `color-mix(in oklab, ${meta.color} 14%, transparent)`,
                          color: `color-mix(in oklab, ${meta.color} 88%, var(--foreground))`,
                        }}
                      >
                        {meta.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* 下一步：底部收得松一些，作为整页的落点 */}
      <section className="relative pb-20 pt-16 sm:pb-24 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 100%, color-mix(in oklab, var(--glow-violet) 16%, transparent), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="NEXT / 05" title={t('embodied.nextTitle')} />
          <Reveal delay={120}>
            <GlassCard className="mt-10 p-0" hud={false} spotlight={false} lift={false}>
              <div className={`${HAIRLINE_GRID} lg:grid-cols-3`}>
                {nextSteps.map((step, i) => (
                  <div key={step} className="p-6">
                    <span className="index-chip">0{i + 1}</span>
                    <p className="mt-4 text-[13.5px] leading-relaxed text-foreground/90">{step}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/XiaoZi-Li/robot-dog"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm"
              >
                <Github className="h-4 w-4" />
                {t('embodied.links.code')}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://github.com/XiaoZi-Li/robot-dog/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-tech inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium"
              >
                {t('embodied.links.issues')}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 底部技术跑马灯 */}
      <section className="relative border-t border-border/50 py-5">
        <Marquee reverse fast>
          {[...algorithms, 'RDK X5', 'ROS 2', 'VLA', 'Sim2Real'].map((tag) => (
            <span key={tag} className="mx-3 flex items-center gap-3 whitespace-nowrap">
              <span className="font-mono text-[11px] tracking-wide text-muted-foreground">
                {tag}
              </span>
              <span className="h-1 w-1 rounded-full bg-[color-mix(in_oklab,var(--neon-cyan)_60%,transparent)]" />
            </span>
          ))}
        </Marquee>
      </section>
    </div>
  );
}
