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
    name: 'ReID行人重识别系统',
    description: '基于深度学习的行人重识别系统，用于跨摄像头场景下的行人追踪与识别。项目采用ResNet50作为骨干网络，结合PCB（Part-based Convolutional Baseline）策略进行局部特征提取，有效提升不同姿态、光照条件下的识别准确率。',
    tech: ['Python', 'PyTorch', 'OpenCV', 'ResNet50', 'PCB'],
    github: 'https://github.com/purplemist/reid-system',
    image: 'https://images.unsplash.com/photo-1555949911-6c1a8b8c8b8b?w=800',
  },
  'smart-mcp-assistant': {
    name: '小智MCP智能控制系统',
    description: '基于ESP32和MCP协议构建的智能家居控制系统，实现AI模型与硬件设备的高效交互。系统支持语音控制、传感器数据采集、设备状态监控等功能，通过MCP协议实现与AI助手的无缝对接。',
    tech: ['ESP32', 'MCP协议', 'Python', 'TypeScript', 'IoT'],
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
