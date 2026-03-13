import { 
  ArrowRight, MapPin, GraduationCap, Mail, Phone, 
  Trophy, Target, Code, Brain, Zap, Award,
  Calendar, Users, Cpu, CircuitBoard, Bot,
  Briefcase, Star, Globe
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  // 技能分类
  const skillCategories = [
    {
      title: '编程语言',
      icon: Code,
      skills: [
        { name: 'C/C++', level: '核心掌握' },
        { name: 'Python', level: '核心掌握' },
        { name: 'Verilog', level: '熟悉应用' },
        { name: 'Shell', level: '熟悉应用' },
        { name: 'Rust', level: '学习进阶' },
      ]
    },
    {
      title: '硬件平台',
      icon: Cpu,
      skills: [
        { name: 'FPGA', level: '' },
        { name: 'ESP32', level: '' },
        { name: 'STM32', level: '' },
        { name: '鸿蒙Hi3861', level: '' },
      ]
    },
    {
      title: 'AI技术栈',
      icon: Brain,
      skills: [
        { name: 'RAG技术', level: '' },
        { name: 'MCP协议', level: '' },
        { name: 'AI Skills', level: '' },
      ]
    },
  ];

  // 竞赛经历
  const competitions = [
    {
      title: '全国大学生嵌入式芯片与系统设计竞赛',
      award: '国家级三等奖',
      date: '2025年12月',
      role: '队员',
      track: 'FPGA创新设计赛道',
      details: [
        '使用Verilog语言完成图像处理模块开发，包括边缘检测、图像滤波等算法的硬件实现',
        '负责FPGA逻辑与时序优化，解决跨时钟域信号处理、资源约束等关键问题',
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: '中国大学生服务外包创新创业大赛',
      award: '国家级三等奖',
      date: '2025年7月',
      role: '队员',
      track: '物联网方向',
      details: [
        '基于鸿蒙Hi3861开发板，参与智能家居系统的传感器数据采集与无线通信模块开发',
        '协助完成设备间通信协议适配，解决低功耗场景下的信号稳定性问题',
      ],
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: '天津市"新工科"工程实践创新技术竞赛',
      award: '省级一等奖',
      date: '2025年12月',
      role: '队长',
      track: '小智MCP项目',
      details: [
        '设计基于ESP32的多传感器融合方案，集成MCP协议构建AI模型与设备上下文交互机制',
        '统筹3人团队分工，突破实时数据传输与边缘计算的资源平衡问题',
      ],
      color: 'from-purple-500 to-pink-500',
    },
  ];

  // 项目经历
  const projects = [
    {
      title: 'ReID行人重识别科研项目',
      period: '2024.12 - 2026.03',
      role: '核心成员',
      description: '参与行人重识别模型训练，负责超参数调整与Loss函数优化',
      tags: ['深度学习', '计算机视觉', 'PyTorch'],
    },
    {
      title: '小智MCP智能控制系统',
      period: '2025.10 - 2025.12',
      role: '队长',
      description: '基于ESP32的多传感器融合系统，集成MCP协议实现AI模型与嵌入式设备的高效交互',
      tags: ['ESP32', 'MCP', '边缘计算', '传感器融合'],
    },
    {
      title: '个人博客网站',
      period: '2026.02',
      role: '独立开发',
      description: '基于Next.js + TypeScript + Supabase技术栈开发的个人博客，包含项目展示、留言墙等功能',
      tags: ['Next.js', 'TypeScript', 'Supabase'],
    },
  ];

  // 荣誉奖项
  const honors = [
    { title: '全国大学生嵌入式芯片与系统设计竞赛', level: '国家级', award: '三等奖', year: '2025' },
    { title: '中国大学生服务外包创新创业大赛', level: '国家级', award: '三等奖', year: '2025' },
    { title: '天津市"新工科"工程实践创新技术竞赛', level: '省级', award: '一等奖', year: '2025' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
        <div className="absolute inset-0 bg-grid-slate-100 dark:opacity-5" />
        
        {/* 浮动装饰 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 dark:bg-purple-900/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300/30 dark:bg-indigo-900/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* 左侧：基本信息卡片 */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                
                <CardContent className="pt-8 text-center">
                  {/* 头像 */}
                  <div className="relative inline-block mb-6">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-xl">
                      <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                        <span className="text-5xl">👨‍💻</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  
                  {/* 姓名 */}
                  <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    李俊杰
                  </h1>
                  
                  {/* 求职意向 */}
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-4">
                    嵌入式开发工程师 / 具身智能技术岗位
                  </p>
                  
                  {/* 联系方式 */}
                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>15022022976</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>purplemist@qq.com</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>天津</span>
                    </div>
                  </div>
                  
                  {/* 教育背景简述 */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium text-sm">教育背景</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">天津工业大学</p>
                    <p className="text-xs text-muted-foreground">电子信息工程 · 本科</p>
                    <p className="text-xs text-muted-foreground">2023.09 - 2027.07（预计）</p>
                  </div>
                  
                  {/* 语言能力 */}
                  <div className="mt-4 flex justify-center gap-3">
                    <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-0">
                      CET-4 441分
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-0">
                      普通话二甲
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* 右侧：详细信息 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 自我介绍 */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    电子信息工程专业大三学生，聚焦<span className="font-semibold text-indigo-600 dark:text-indigo-400">嵌入式开发</span>与<span className="font-semibold text-purple-600 dark:text-purple-400">具身智能</span>交叉领域，具备"硬件-软件-算法-AI"的综合技术视角。熟悉RAG、MCP、Skills等AI工程化概念，在多项国家级/省级竞赛中获奖，具备嵌入式系统全栈开发与项目统筹能力。
                  </p>
                </CardContent>
              </Card>
              
              {/* 核心优势 */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: Trophy, label: '国家级奖项', value: '2项', color: 'from-amber-500 to-orange-500' },
                  { icon: Award, label: '省级一等奖', value: '1项', color: 'from-purple-500 to-pink-500' },
                  { icon: Briefcase, label: '项目经验', value: '3+', color: 'from-blue-500 to-cyan-500' },
                ].map((item, i) => (
                  <Card key={i} className="border-0 shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6 text-center">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* CTA按钮 */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  查看项目
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="mailto:purplemist@qq.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  联系我
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 技术技能 */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Code className="w-8 h-8 text-indigo-500" />
              技术技能
            </h2>
            <p className="text-muted-foreground">我掌握和使用的技术工具</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {skillCategories.map((category, i) => (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, j) => (
                      <Badge 
                        key={j} 
                        variant="secondary"
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                      >
                        {skill.name}
                        {skill.level && <span className="ml-1 text-xs opacity-60">· {skill.level}</span>}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* 专业领域 */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-500" />
              专业领域
            </h3>
            <div className="flex flex-wrap gap-2">
              {['嵌入式系统', '物联网', '图像处理', '深度学习', 'PCB设计', 'AI Agent开发', 'FPGA', '边缘计算'].map((tag, i) => (
                <Badge key={i} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 竞赛经历 */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8 text-amber-500" />
              竞赛经历
            </h2>
            <p className="text-muted-foreground">参与的重要竞赛与获奖情况</p>
          </div>

          <div className="space-y-6">
            {competitions.map((comp, i) => (
              <Card 
                key={i} 
                className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${comp.color}`} />
                <CardContent className="pt-6 pl-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{comp.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {comp.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {comp.role}
                        </span>
                        <Badge variant="outline" className="text-xs">{comp.track}</Badge>
                      </div>
                    </div>
                    <Badge className={`bg-gradient-to-r ${comp.color} text-white border-0 shadow-md`}>
                      <Trophy className="w-3 h-3 mr-1" />
                      {comp.award}
                    </Badge>
                  </div>
                  <ul className="space-y-2">
                    {comp.details.map((detail, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 项目经历 */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Briefcase className="w-8 h-8 text-indigo-500" />
              项目经历
            </h2>
            <p className="text-muted-foreground">参与和主导的项目</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((proj, i) => (
              <Card 
                key={i} 
                className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 dark:bg-slate-900/80 group"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {proj.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">{proj.role}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {proj.period}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tags.map((tag, j) => (
                      <Badge key={j} variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 荣誉奖项 */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Award className="w-8 h-8 text-amber-500" />
              荣誉奖项
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {honors.map((honor, i) => (
              <Card 
                key={i} 
                className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 text-center hover:scale-105 transition-transform"
              >
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{honor.title}</h3>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Badge className={`${
                      honor.level === '国家级' 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    } border-0`}>
                      {honor.level}
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-0">
                      {honor.award}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{honor.year}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 自我评价 */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Star className="w-8 h-8 text-purple-500" />
              自我评价
            </h2>
          </div>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <CardContent className="pt-8">
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: '技术定位', desc: '聚焦嵌入式开发与具身智能交叉领域，具备"硬件-软件-算法-AI"的综合技术视角' },
                  { title: 'AI能力', desc: '熟悉RAG、MCP、Skills等AI工程化概念，具备将AI技术落地到嵌入式系统的实战经验' },
                  { title: '实战能力', desc: '通过3项高含金量竞赛积累项目经验，在FPGA、物联网、多传感器融合等场景具备落地能力' },
                  { title: '团队协作', desc: '担任竞赛队长期间统筹技术方案与团队分工，具备良好的沟通协调与问题解决能力' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60">
                    <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
