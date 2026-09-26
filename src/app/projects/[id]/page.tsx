import { notFound } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';

// 项目数据（可以从API或数据库获取）
const projectsData: Record<string, {
  name: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  image?: string;
}> = {
  'reid-system': {
    name: 'ReID 行人重识别科研项目',
    description: '基于深度学习的 text-to-image 行人重识别研究项目。论文 CATSANet 已在 SCI 期刊 Pattern Analysis and Applications 正式发表，本人署名共同第一作者，负责消融实验设计与参数调优、结果分析与文献调研，并参与部分章节撰写；配套代码由团队开源。',
    tech: ['Python', 'PyTorch', '跨模态检索', '深度学习'],
    github: 'https://github.com/purplemist/reid-system',
    image: 'https://images.unsplash.com/photo-1555949911-6c1a8b8c8b8b?w=800',
  },
  'smart-mcp-assistant': {
    name: '基于小智 AI 与 MCP 的多设备智能管家系统',
    description: '基于小智 AI 与 MCP 协议构建的多设备智能管家系统：语音指令经云端大模型理解意图后，由自建 MCP 服务端（Python）调用设备控制脚本，云平台下发指令给设备执行并回传结果；完成鸿蒙 Hi3861 板端外设（RGB 灯 / 蜂鸣器 / 风扇）与华为云 IoT 接入（物模型与 MQTT 数据上报）。',
    tech: ['ESP32-S3', 'MCP 协议', 'Python', '鸿蒙 Hi3861', '华为云 IoT'],
    github: 'https://github.com/purplemist/smart-mcp-assistant',
    image: 'https://images.unsplash.com/photo-1558618666-ebe54879c9a3?w=800',
  },
  'smart-home-iot': {
    name: '服务外包创新创业大赛 · 智能家居物联网',
    description: '基于鸿蒙 Hi3861 的智能家居传感器数据采集与无线通信系统。开发传感器数据采集模块与无线通信模块，适配低功耗场景需求，完成设备间通信协议适配，解决信号稳定性问题。获中国大学生服务外包创新创业大赛国家级三等奖。',
    tech: ['鸿蒙 Hi3861', '物联网', '传感器采集', '无线通信', '低功耗'],
    github: 'https://github.com/XiaoZi-Li',
    image: 'https://images.unsplash.com/photo-1558002038-1055907531-9cfa346b8b8b?w=800',
  },
  'personal-blog': {
    name: '个人博客网站',
    description: '基于Next.js + TypeScript + Supabase构建的个人博客网站，支持多语言切换、暗色模式、留言墙、用户认证等功能。采用shadcn/ui组件库，实现现代化的UI设计。',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'shadcn/ui'],
    github: 'https://github.com/purplemist/personal-blog',
    demo: 'https://blog.purplemist.dev',
    image: 'https://images.unsplash.com/photo-1460925895917-afd47966f6a5?w=800',
  },
};

export async function generateStaticParams() {
  return Object.keys(projectsData).map((id) => ({ id }));
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProjectDetailClient params={params} />;
}
