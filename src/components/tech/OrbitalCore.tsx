'use client';

import { useState } from 'react';
import { Cpu, Eye, Footprints } from 'lucide-react';

/**
 * OrbitalCore —— Hero 区的核心视觉：一个「感知 → 决策 → 行动」的闭环。
 *
 * 三颗节点绕着中央核心缓慢公转，三角形连线用流动的虚线表示数据在环路中循环，
 * 这正是具身智能的本质：感知不断进入，动作不断输出，策略在闭环里被反复修正。
 *
 * 悬停任意节点，会点亮经过它的那两条边、同时压暗另外两条 ——
 * 不是装饰，而是把「这个环节在闭环里的位置」讲清楚。
 */
export default function OrbitalCore() {
  const nodes = [
    {
      key: 'perceive',
      label: '感知',
      sub: 'PERCEPTION',
      icon: Eye,
      left: '50%',
      top: '14%',
      /** 该节点连接的两条边（三角形顶点顺序：0 上、1 右下、2 左下） */
      edges: [2, 0],
    },
    {
      key: 'decide',
      label: '决策',
      sub: 'POLICY',
      icon: Cpu,
      left: '81%',
      top: '68%',
      edges: [0, 1],
    },
    {
      key: 'act',
      label: '行动',
      sub: 'ACTION',
      icon: Footprints,
      left: '19%',
      top: '68%',
      edges: [1, 2],
    },
  ];

  const vertex = ['210,60', '340,285', '80,285'];
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[430px] select-none">
      {/* 背景光晕 */}
      <div className="animate-pulse-glow absolute inset-[12%] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--glow-violet)_28%,transparent),transparent_70%)] blur-2xl" />

      <svg viewBox="0 0 420 420" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="oc-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--glow-cyan)" stopOpacity="0.9" />
            <stop offset="55%" stopColor="var(--glow-violet)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--glow-magenta)" stopOpacity="0.5" />
          </linearGradient>
          {/*
            核心是这块画面上唯一「不跟随主题」的元素：它是一颗深色晶体，
            不是可读表面。用固定的深色渐变，白色文字在亮/暗两个主题下都成立
            （对白字约 12.6:1 / 15.6:1），避免亮色主题里白字压在浅色圆盘上。
          */}
          <radialGradient id="oc-core" cx="50%" cy="38%" r="70%">
            <stop offset="0%" stopColor="oklch(0.34 0.12 268)" />
            <stop offset="55%" stopColor="oklch(0.26 0.11 282)" />
            <stop offset="100%" stopColor="oklch(0.2 0.08 292)" />
          </radialGradient>
        </defs>

        {/* 外圈：缓慢顺时针 */}
        <g className="animate-spin-slower" style={{ transformOrigin: '210px 210px' }}>
          <circle
            cx="210"
            cy="210"
            r="196"
            fill="none"
            stroke="url(#oc-ring)"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="2 12"
          />
        </g>

        {/* 中圈：逆时针，刻度感更强 */}
        <g className="animate-spin-reverse" style={{ transformOrigin: '210px 210px' }}>
          <circle
            cx="210"
            cy="210"
            r="150"
            fill="none"
            stroke="var(--neon-cyan)"
            strokeOpacity="0.28"
            strokeWidth="1"
            strokeDasharray="30 16"
          />
        </g>

        {/* 内圈：实线细环 */}
        <circle
          cx="210"
          cy="210"
          r="104"
          fill="none"
          stroke="var(--neon-violet)"
          strokeOpacity="0.25"
          strokeWidth="1"
        />

        {/* 闭环：三条边分开画，才能按悬停的节点单独点亮 */}
        <polygon points={vertex.join(' ')} fill="var(--glow-violet)" fillOpacity="0.04" />
        {[
          [0, 1],
          [1, 2],
          [2, 0],
        ].map(([a, b]) => {
          const isLit = active !== null && nodes[active].edges.includes(a) && nodes[active].edges.includes(b);
          const isDimmed = active !== null && !isLit;
          return (
            <line
              key={`${a}-${b}`}
              x1={vertex[a].split(',')[0]}
              y1={vertex[a].split(',')[1]}
              x2={vertex[b].split(',')[0]}
              y2={vertex[b].split(',')[1]}
              className="animate-dash transition-[stroke,stroke-width,stroke-opacity] duration-500"
              stroke="var(--glow-violet)"
              strokeWidth={isLit ? 2 : 1.2}
              strokeOpacity={isLit ? 0.95 : isDimmed ? 0.18 : 0.55}
            />
          );
        })}

        {/* 公转的粒子点 */}
        <g className="animate-spin-slow" style={{ transformOrigin: '210px 210px' }}>
          <circle cx="210" cy="14" r="3.4" fill="var(--glow-cyan)" />
          <circle cx="210" cy="14" r="7" fill="var(--glow-cyan)" fillOpacity="0.18" />
        </g>
        <g className="animate-spin-reverse" style={{ transformOrigin: '210px 210px' }}>
          <circle cx="210" cy="60" r="2.4" fill="var(--glow-magenta)" />
          <circle cx="210" cy="60" r="5.5" fill="var(--glow-magenta)" fillOpacity="0.2" />
        </g>

        {/* 中心深色晶体 */}
        <circle cx="210" cy="210" r="66" fill="url(#oc-core)" fillOpacity="0.45" />
        <g className="animate-spin-slow" style={{ transformOrigin: '210px 210px' }}>
          <circle
            cx="210"
            cy="210"
            r="78"
            fill="none"
            stroke="var(--neon-cyan)"
            strokeOpacity="0.5"
            strokeWidth="1.2"
            strokeDasharray="14 22"
          />
        </g>
        <circle
          cx="210"
          cy="210"
          r="56"
          fill="none"
          stroke="var(--neon-cyan)"
          strokeOpacity="0.6"
          strokeWidth="1.3"
        />
        <circle cx="210" cy="210" r="42" fill="url(#oc-core)" />
        <circle
          cx="210"
          cy="210"
          r="42"
          fill="none"
          stroke="var(--glow-cyan)"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      </svg>

      {/* 中心文字：白字压在深色晶体上 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-[13px] font-bold leading-none text-white">具身智能</div>
          <div className="mt-2 font-mono text-[8.5px] tracking-[0.24em] text-white/80">
            EMBODIED AI
          </div>
        </div>
      </div>

      {/* 三个节点标签 */}
      {nodes.map((node, i) => {
        const Icon = node.icon;
        const isActive = active === i;
        const isDimmed = active !== null && !isActive;
        return (
          <div
            key={node.key}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: node.left, top: node.top }}
          >
            <div
              className={`panel flex items-center gap-2 rounded-full px-3 py-1.5 shadow-lg transition-all duration-500 ${
                isActive ? 'scale-[1.06]' : ''
              } ${isDimmed ? 'opacity-45' : 'opacity-100'}`}
              style={
                isActive
                  ? {
                      borderColor: `color-mix(in oklab, var(--neon-cyan) 60%, transparent)`,
                      boxShadow: `0 0 26px -8px color-mix(in oklab, var(--glow-cyan) 85%, transparent)`,
                    }
                  : undefined
              }
            >
              <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[var(--glow-cyan)] to-[var(--glow-violet)]">
                <Icon className="h-3 w-3 text-slate-900" />
                {isActive && (
                  <span className="animate-ping-ring absolute inset-0 rounded-full bg-[var(--glow-cyan)]" />
                )}
              </span>
              <span className="text-[11px] font-medium leading-none">
                {node.label}
                <span className="ml-1.5 font-mono text-[8px] tracking-widest text-muted-foreground">
                  {node.sub}
                </span>
              </span>
            </div>
          </div>
        );
      })}

      {/* 底部状态行 */}
      <div className="absolute inset-x-0 -bottom-1 flex justify-center">
        <div className="mono-label rounded-full border border-[color-mix(in_oklab,var(--neon-cyan)_25%,transparent)] px-3 py-1">
          closed_loop · 60Hz
        </div>
      </div>
    </div>
  );
}
