import { ArrowRight, Cpu, Camera, Mic, Zap, Github, Code, Braces } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RoboticsPage() {
  const techStack = [
    { name: 'RDK X5', icon: Cpu, desc: '边缘计算开发板' },
    { name: 'dora-rs', icon: Code, desc: '数据流框架' },
    { name: 'Rust', icon: Braces, desc: '系统编程语言' },
    { name: 'YOLO', icon: Camera, desc: '目标检测模型' },
    { name: 'OpenCV', icon: Camera, desc: '计算机视觉' },
    { name: 'Whisper', icon: Mic, desc: '语音识别' },
  ];

  const features = [
    {
      title: '实时视觉感知',
      description: '基于 YOLO 系列模型实现多目标检测与跟踪，支持实时视频流处理',
      icon: Camera,
    },
    {
      title: '智能语音交互',
      description: '集成 Whisper 模型实现高精度语音识别，支持自然语言指令理解',
      icon: Mic,
    },
    {
      title: '运动规划控制',
      description: '基于 ROS2 框架实现路径规划与运动控制，支持多种机器人平台',
      icon: Zap,
    },
    {
      title: '多传感器融合',
      description: '集成摄像头、激光雷达、IMU 等多传感器数据，实现环境感知',
      icon: Cpu,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 dark:from-slate-950 dark:via-violet-950 dark:to-purple-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/projects" 
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 mb-6"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            返回项目列表
          </Link>
          
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Cpu className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                RDK X5 具身智能系统
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl">
                基于 RDK X5 边缘计算开发板和 dora-rs 数据流框架，构建高效、实时的具身智能机器人系统
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <Badge 
                key={tech.name}
                variant="secondary"
                className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <tech.icon className="w-4 h-4 mr-2" />
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Overview */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">项目概述</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              具身智能（Embodied Intelligence）是人工智能领域的重要发展方向，旨在让智能体具备在真实物理环境中感知、决策和行动的能力。本项目基于 RDK X5 边缘计算开发板，结合 dora-rs 高性能数据流框架，构建了一套完整的具身智能机器人系统。
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              项目实现了从传感器数据采集、视觉感知、语音交互到运动控制的端到端能力，为机器人自主导航、目标抓取、人机交互等任务提供了技术基础。
            </p>
          </CardContent>
        </Card>

        {/* Core Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {features.map((feature) => (
            <Card 
              key={feature.title}
              className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm group"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Architecture */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">系统架构</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-100">硬件平台</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-medium mb-2">RDK X5</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">瑞芯微 RK3588 SoC，8核 CPU + 6TOPS NPU</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-medium mb-2">摄像头模组</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">IMX415 / OV5640 高清摄像头</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-medium mb-2">麦克风阵列</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">4麦克风阵列，支持声源定位</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-100">软件框架</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-medium mb-2">dora-rs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">基于 Rust 的数据流框架，支持实时数据流处理</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-medium mb-2">ROS2</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">机器人操作系统，提供节点通信与消息传递</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-100">核心算法</h3>
              <div className="flex flex-wrap gap-2">
                {['YOLOv8', 'YOLO-NAS', 'Whisper-Large-v3', 'SAM', 'OpenCV', 'NumPy', 'PyTorch'].map((algo) => (
                  <Badge key={algo} variant="outline" className="text-sm">
                    {algo}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Progress */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">开发进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: '环境搭建与配置', status: 'completed', date: '2025.10' },
                { name: '摄像头图像采集与处理', status: 'completed', date: '2025.10' },
                { name: 'YOLO 目标检测模型部署', status: 'completed', date: '2025.11' },
                { name: '语音识别模块集成', status: 'completed', date: '2025.11' },
                { name: '数据流管道优化', status: 'in-progress', date: '进行中' },
                { name: '运动控制算法实现', status: 'planned', date: '计划中' },
                { name: '系统集成与测试', status: 'planned', date: '计划中' },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'in-progress' ? 'bg-yellow-500' :
                    'bg-slate-300'
                  }`} />
                  <div className="flex-1">
                    <span className="text-slate-800 dark:text-slate-100">{item.name}</span>
                  </div>
                  <span className="text-sm text-slate-500">{item.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <div className="flex flex-wrap gap-4">
          <a
            href="https://github.com/XiaoZi-Li/rdk-x5-robotics"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
          >
            <Github className="w-5 h-5" />
            查看源代码
          </a>
          <a
            href="https://github.com/XiaoZi-Li/rdk-x5-robotics/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            提交问题
          </a>
        </div>
      </div>
    </div>
  );
}
