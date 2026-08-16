'use client';

import { TechCityBackground } from '@/components/TechCityBackground';
import { 
  Download, MapPin, Mail, Phone, Briefcase, ArrowLeft, 
  GraduationCap, Trophy, Zap, Heart, ExternalLink, Code, Brain
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface IntentData {
  primary: string;
  direction: string;
  also: string;
  note: string;
  available: string;
}

interface PracticeData {
  title: string;
  role: string;
  period: string;
  desc: string;
}

interface PassionData {
  icon: string;
  title: string;
  desc: string;
}

interface TechCategoryData {
  title: string;
  color: string;
  skills: string[];
}

interface AwardData {
  award: string;
  date: string;
  emoji: string;
}

interface EducationData {
  school: string;
  major: string;
  period: string;
  courses: string;
}

interface ResumeData {
  title: string;
  subtitle: string;
  downloadPdf: string;
  personalInfo: string;
  techStack: string;
  awardsTitle: string;
  intentTitle: string;
  practiceTitle: string;
  passionTitle: string;
  contactTitle: string;
  contactDesc: string;
  sendEmail: string;
  name: string;
  position: string;
  educationStr: string;
  grade: string;
  location: string;
  phone: string;
  email: string;
  intent: IntentData;
  practices: PracticeData[];
  passions: PassionData[];
  techCategories: TechCategoryData[];
  awards: AwardData[];
  education: EducationData;
  selfEval: string;
  educationLabel: string;
  selfAssessmentLabel: string;
  techForumLabel: string;
  backToHome: string;
}

function getResumeData(lang: string): ResumeData {
  switch (lang) {
    case 'en':
      return {
        title: 'Resume',
        subtitle: 'Practice drives growth, passion shapes direction',
        downloadPdf: 'Download PDF',
        personalInfo: 'Personal Info',
        techStack: 'Tech Stack',
        awardsTitle: 'Awards',
        intentTitle: 'Career Objective',
        practiceTitle: 'Key Projects',
        passionTitle: 'Passions',
        contactTitle: "Let's Connect",
        contactDesc: 'Seeking 2025 summer internship opportunities. Feel free to reach out!',
        sendEmail: 'Send Email',
        name: 'Li Junjie',
        position: 'Embedded Engineer · Embodied Intelligence',
        educationStr: 'Tiangong University · Electronic Information Engineering',
        grade: 'Junior · Available for internship',
        location: 'Xiqing District, Tianjin',
        phone: '150-2202-2976',
        email: 'purplemist@qq.com',
        intent: {
          primary: 'Embedded Software/Hardware Development · Embodied Intelligence Internship',
          direction: 'ESP32 + Rust stack, embedded Rust ecosystem (embassy, esp-rs), safe & reliable systems programming',
          also: 'PCB design: schematic design, layout, routing, and prototyping verification',
          note: 'STM32 experienced but prefer ESP32 + Rust direction',
          available: 'Available immediately, remote or Tianjin/Beijing area',
        },
        practices: [
          { title: 'ReID Person Re-identification Research', role: 'Core Member', period: '2024/12 - 2026/03', desc: 'Participated in person re-id model training & optimization, responsible for hyperparameter tuning and loss function optimization using PyTorch' },
          { title: 'Service Outsourcing Innovation Competition · Smart Home IoT', role: 'Embedded Developer', period: '2025/01 - 2025/06', desc: 'Sensor data acquisition & wireless communication system based on HarmonyOS Hi3861, won National 3rd Prize' },
          { title: 'Embedded Chip & System Design Competition · FPGA Track', role: 'Team Member', period: '2025/09 - 2025/12', desc: 'FPGA-based image processing system, hardware acceleration of edge detection & image filtering in Verilog, won National 3rd Prize' },
          { title: 'XiaoZhi MCP Intelligent Control System', role: 'Team Leader', period: '2025/10 - 2025/12', desc: 'ESP32-based multi-sensor fusion system integrating MCP protocol for AI-embedded device interaction, won Provincial 1st Prize' },
        ],
        passions: [
          { icon: '🤖', title: 'Embodied Intelligence', desc: 'Believe embodied AI is the best path for AI in the physical world, eager to work on projects integrating intelligent algorithms with hardware' },
          { icon: '🦀', title: 'Rust Embedded', desc: 'Attracted by Rust memory safety and zero-cost abstractions, bringing Rust into embedded development practice' },
          { icon: '⚙️', title: 'Embedded HW/SW', desc: 'Enjoy full-stack development from low-level hardware to high-level applications, pursuing elegant HW-SW co-design solutions' },
        ],
        techCategories: [
          { title: 'Languages', color: 'violet', skills: ['C/C++ (Core)', 'Python (Core)', 'Verilog (Familiar)', 'Rust (Learning)', 'Cangjie (Learning)'] },
          { title: 'Hardware', color: 'emerald', skills: ['FPGA', 'ESP32', 'STM32', 'HarmonyOS Hi3861'] },
          { title: 'AI & Engineering', color: 'amber', skills: ['MCP Protocol', 'AI Agent', 'AI Skills', 'RAG'] },
          { title: 'Other Skills', color: 'blue', skills: ['PCB Design', 'Sensor Fusion', 'Embedded Full-stack', 'Next.js/TS Full-stack'] },
        ],
        awards: [
          { award: 'National Embedded Chip & System Design Competition — National 3rd Prize', date: '2025/12', emoji: '🥉' },
          { award: 'China Service Outsourcing Innovation Competition — National 3rd Prize', date: '2025/06', emoji: '🥉' },
          { award: 'Tianjin 8th "New Engineering" Competition — Provincial 1st Prize (Team Leader)', date: '2025/06', emoji: '🥇' },
        ],
        education: {
          school: 'Tiangong University',
          major: 'Electronic Information Engineering',
          period: '2023/09 - 2027/06',
          courses: 'Circuit Theory, Analog Electronics, Digital Electronics, Signals & Systems, Electromagnetics, Embedded System Design',
        },
        selfEval: 'Focusing on the intersection of embedded development and embodied intelligence, with a comprehensive "HW-SW-Algorithm-AI" perspective. Familiar with AI engineering concepts like MCP. Proven project delivery capability through high-value competitions in FPGA and IoT. Team leader experience with strong coordination and problem-solving skills.',
        educationLabel: 'Education',
        selfAssessmentLabel: 'Self Assessment',
        techForumLabel: 'Tech Forum',
        backToHome: 'Back to Home',
      };
    case 'jp':
      return {
        title: '履歴書',
        subtitle: '実践が成長を推進し、情熱が方向を決める',
        downloadPdf: 'PDF ダウンロード',
        personalInfo: '個人情報',
        techStack: '技術スタック',
        awardsTitle: '受賞歴',
        intentTitle: '就職希望',
        practiceTitle: '主要プロジェクト',
        passionTitle: '技術への情熱',
        contactTitle: 'お問い合わせ',
        contactDesc: '2025年サマーインターンシップを探しています。お気軽にご連絡ください！',
        sendEmail: 'メール送信',
        name: '李 俊杰',
        position: '組み込みエンジニア · 具現化知能',
        educationStr: '天津工業大学 · 電子情報工学',
        grade: '3年生 · インターン可能',
        location: '天津市西青区',
        phone: '150-2202-2976',
        email: 'purplemist@qq.com',
        intent: {
          primary: '組み込みソフトウェア/ハードウェア開発 · 具現化知能インターン',
          direction: 'ESP32 + Rust スタック、組み込み Rust エコシステム（embassy、esp-rs）、安全で信頼性の高いシステムプログラミング',
          also: 'PCB 設計：回路図設計、レイアウト、配線、試作検証',
          note: 'STM32 経験あり、ESP32 + Rust 方向を優先',
          available: 'すぐに勤務可能、リモートまたは天津/北京エリア',
        },
        practices: [
          { title: 'ReID 人物再識別研究プロジェクト', role: 'コアメンバー', period: '2024/12 - 2026/03', desc: '人物再識別モデルの訓練と最適化に参加、PyTorch によるハイパーパラメータ調整と Loss 関数最適化を担当' },
          { title: 'サービスアウトソーシングイノベーション大会 · スマートホーム IoT', role: '組み込み開発者', period: '2025/01 - 2025/06', desc: 'HarmonyOS Hi3861 ベースのスマートホームセンサーデータ収集・無線通信システム、国家級三等賞受賞' },
          { title: '組み込みチップ・システム設計大会 · FPGA トラック', role: 'チームメンバー', period: '2025/09 - 2025/12', desc: 'FPGA ベースの画像処理システム、Verilog によるエッジ検出・画像フィルタリングのハードウェア高速化、国家級三等賞受賞' },
          { title: 'XiaoZhi MCP インテリジェント制御システム', role: 'チームリーダー', period: '2025/10 - 2025/12', desc: 'ESP32 ベースのマルチセンサーフュージョンシステム、MCP プロトコル統合による AI-組み込みデバイス連携、省部級一等賞受賞' },
        ],
        passions: [
          { icon: '🤖', title: '具現化知能', desc: '具現化知能はAIが物理世界に着地する最良の道と信じ、知的アルゴリズムとハードウェアの融合プロジェクトに参加したい' },
          { icon: '🦀', title: 'Rust 組み込み', desc: 'Rust のメモリ安全性とゼロコスト抽象化に惹かれ、組み込み開発に Rust を導入中' },
          { icon: '⚙️', title: '組み込み HW/SW', desc: '低レイヤーハードウェアから高レイヤーアプリまで全スタック開発を楽しみ、エレガントな HW-SW 協調設計を追求' },
        ],
        techCategories: [
          { title: 'プログラミング言語', color: 'violet', skills: ['C/C++ (中核)', 'Python (中核)', 'Verilog (熟悉)', 'Rust (学習中)', '倉頡 (学習中)'] },
          { title: 'ハードウェア', color: 'emerald', skills: ['FPGA', 'ESP32', 'STM32', 'HarmonyOS Hi3861'] },
          { title: 'AI & エンジニアリング', color: 'amber', skills: ['MCP プロトコル', 'AI Agent', 'AI Skills', 'RAG'] },
          { title: 'その他', color: 'blue', skills: ['PCB 設計', 'センサーフュージョン', '組み込み全スタック', 'Next.js/TS フルスタック'] },
        ],
        awards: [
          { award: '全国組み込みチップ・システム設計大会 — 国家級三等賞', date: '2025/12', emoji: '🥉' },
          { award: '中国サービスアウトソーシングイノベーション大会 — 国家級三等賞', date: '2025/06', emoji: '🥉' },
          { award: '天津第8回「新工科」大会 — 省部級一等賞（リーダー）', date: '2025/06', emoji: '🥇' },
        ],
        education: {
          school: '天津工業大学',
          major: '電子情報工学',
          period: '2023/09 - 2027/06',
          courses: '回路理論、アナログ電子工学、デジタル電子工学、信号とシステム、電磁気学、組み込みシステム設計',
        },
        selfEval: '組み込み開発と具現化知能の交差点に注力、「HW-SW-アルゴリズム-AI」の包括的な視点を持つ。MCP などの AI エンジニアリング概念に精通。FPGA、IoT などの高価値コンテストでプロジェクト遂行能力を証明。チームリーダー経験あり、調整力と問題解決力に優れる。',
        educationLabel: '学歴',
        selfAssessmentLabel: '自己評価',
        techForumLabel: '技術交流',
        backToHome: 'ホームに戻る',
      };
    default: // cn
      return {
        title: '个人简历',
        subtitle: '实践驱动成长，热爱铸就方向',
        downloadPdf: '下载简历 PDF',
        personalInfo: '个人信息',
        techStack: '技术栈',
        awardsTitle: '竞赛获奖',
        intentTitle: '求职意向',
        practiceTitle: '核心实践',
        passionTitle: '技术热情',
        contactTitle: '期待与您交流',
        contactDesc: '正在寻找 2025 年暑期实习机会，欢迎联系！',
        sendEmail: '发送邮件',
        name: '李俊杰',
        position: '嵌入式工程师 · 具身智能方向',
        educationStr: '天津工业大学 · 电子信息工程',
        grade: '大三 · 随时可到岗实习',
        location: '天津市西青区',
        phone: '150-2202-2976',
        email: 'purplemist@qq.com',
        intent: {
          primary: '嵌入式软硬件开发 / 具身智能方向实习',
          direction: '偏重 ESP32 + Rust 技术路线，关注嵌入式 Rust 生态（embassy、esp-rs），追求安全可靠的系统级编程',
          also: 'PCB 绘制能力：能完成原理图设计、布局布线和打样验证全流程',
          note: 'STM32 使用过但非首选方向，更倾向 ESP32 + Rust 路线',
          available: '随时到岗，接受远程或天津/北京地区',
        },
        practices: [
          { title: 'ReID 行人重识别科研项目', role: '核心成员', period: '2024/12 - 2026/03', desc: '参与行人重识别模型训练与优化，负责超参数调整与 Loss 函数优化，基于 PyTorch 完成数据预处理、模型训练与评估全流程' },
          { title: '服务外包创新创业大赛 · 智能家居物联网', role: '嵌入式开发人员', period: '2025/01 - 2025/06', desc: '基于鸿蒙 Hi3861 的智能家居传感器数据采集与无线通信系统，开发传感器数据采集模块与无线通信模块，获国家级三等奖' },
          { title: '嵌入式芯片与系统设计竞赛 · FPGA 赛道', role: '队员', period: '2025/09 - 2025/12', desc: '基于 FPGA 的图像处理系统，以 Verilog 实现边缘检测、图像滤波等算法硬件加速，获国家级三等奖' },
          { title: '小智 MCP 智能控制系统', role: '队长', period: '2025/10 - 2025/12', desc: '基于 ESP32 的多传感器融合系统，集成 MCP 协议实现 AI 模型与嵌入式设备高效交互，获省部级一等奖' },
        ],
        passions: [
          { icon: '🤖', title: '具身智能', desc: '坚信具身智能是 AI 落地物理世界的最佳路径，渴望参与将智能算法与硬件深度融合的项目' },
          { icon: '🦀', title: 'Rust 嵌入式', desc: '被 Rust 的内存安全和零成本抽象所吸引，正在将 Rust 引入嵌入式开发实践' },
          { icon: '⚙️', title: '嵌入式软硬件', desc: '享受从底层硬件到上层应用的全链路开发过程，追求软硬件协同设计的优雅方案' },
        ],
        techCategories: [
          { title: '编程语言', color: 'violet', skills: ['C/C++ (核心掌握)', 'Python (核心掌握)', 'Verilog (熟悉)', 'Rust (学习中)', '仓颉 (学习中)'] },
          { title: '硬件平台', color: 'emerald', skills: ['FPGA', 'ESP32', 'STM32', '鸿蒙 Hi3861'] },
          { title: 'AI 与工程化', color: 'amber', skills: ['MCP 协议', 'AI Agent', 'AI Skills', 'RAG 技术'] },
          { title: '其他能力', color: 'blue', skills: ['PCB 绘制', '传感器融合', '嵌入式全流程开发', 'Next.js/TS 全栈'] },
        ],
        awards: [
          { award: '全国大学生嵌入式芯片与系统设计竞赛 国家级三等奖', date: '2025/12', emoji: '🥉' },
          { award: '中国大学生服务外包创新创业大赛 国家级三等奖', date: '2025/06', emoji: '🥉' },
          { award: '天津第八届"新工科"竞赛 省部级一等奖（队长）', date: '2025/06', emoji: '🥇' },
        ],
        education: {
          school: '天津工业大学',
          major: '电子信息工程',
          period: '2023/09 - 2027/06',
          courses: '电路原理、模拟电子技术、数字电子技术、信号与系统、电磁场与电磁波、嵌入式系统设计',
        },
        selfEval: '聚焦嵌入式开发与具身智能交叉领域，具备"硬件-软件-算法-AI"综合视角，熟悉 MCP 等 AI 工程化概念，拥有 AI 技术嵌入式落地实战经验；通过高含金量竞赛积累了 FPGA、物联网等场景的项目落地能力，曾担任竞赛队长，具备良好的统筹协调与问题解决能力。',
        educationLabel: '教育经历',
        selfAssessmentLabel: '自我评价',
        techForumLabel: '技术交流',
        backToHome: '返回首页',
      };
  }
}

export default function ResumePage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const r = getResumeData(language || 'cn');

  if (!mounted) {
    return <div className="min-h-screen bg-gray-950" />;
  }

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    violet: { bg: 'bg-violet-500/15', text: 'text-violet-200', border: 'border-violet-500/25' },
    emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-200', border: 'border-emerald-500/25' },
    amber: { bg: 'bg-amber-500/15', text: 'text-amber-200', border: 'border-amber-500/25' },
    blue: { bg: 'bg-blue-500/15', text: 'text-blue-200', border: 'border-blue-500/25' },
  };

  return (
    <div className="dark min-h-screen relative">
      <TechCityBackground />
      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-2 sm:pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-violet-300 hover:text-violet-200 transition-colors text-xs sm:text-sm mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {r.backToHome}
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pb-10 sm:pb-16">
          {/* Title Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">{r.title}</h1>
                <p className="text-violet-300 text-sm sm:text-lg">{r.subtitle}</p>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all hover:scale-105 shadow-lg shadow-violet-600/25"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {r.downloadPdf}
                </a>
                <a
                  href="mailto:purplemist@qq.com"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all border border-white/10"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{r.sendEmail}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Two Column Layout - single column on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
            {/* Left Column - Sidebar */}
            <div className="lg:col-span-1 space-y-3 sm:space-y-6">
              {/* Personal Info */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
                  {r.personalInfo}
                </h2>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-300">
                    <span className="text-sm sm:text-base">👤</span>
                    <div>
                      <p className="font-medium text-white">{r.name}</p>
                      <p className="text-[10px] sm:text-xs text-violet-300">{r.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400 shrink-0" />
                    <span>{r.educationStr}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400 shrink-0" />
                    <span>{r.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400 shrink-0" />
                    <span>{r.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400 shrink-0" />
                    <span>{r.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400 shrink-0" />
                    <span>{r.grade}</span>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
                  {r.techStack}
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {r.techCategories.map((cat) => {
                    const colors = colorMap[cat.color] || colorMap.violet;
                    return (
                      <div key={cat.title}>
                        <p className={`text-[10px] sm:text-xs ${colors.text} mb-1.5 sm:mb-2 font-medium`}>{cat.title}</p>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {cat.skills.map((s) => (
                            <span
                              key={s}
                              className={`px-1.5 sm:px-2 py-0.5 ${colors.bg} ${colors.text} rounded text-[10px] sm:text-xs border ${colors.border}`}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Awards */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  {r.awardsTitle}
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {r.awards.map((a, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-2.5">
                      <span className="text-sm sm:text-base mt-0.5">{a.emoji}</span>
                      <div>
                        <p className="text-xs sm:text-sm text-white leading-snug">{a.award}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{a.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  {r.educationLabel}
                </h2>
                <div className="text-xs sm:text-sm space-y-1.5 sm:space-y-2">
                  <p className="text-white font-medium">{r.education.school}</p>
                  <p className="text-violet-300">{r.education.major}</p>
                  <p className="text-gray-400">{r.education.period}</p>
                  <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed mt-1.5 sm:mt-2">{r.education.courses}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-6">
              {/* Job Intentions */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
                  {r.intentTitle}
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3 bg-violet-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-violet-500/20">
                    <span className="text-violet-300 text-xs sm:text-sm mt-0.5 shrink-0">📍</span>
                    <p className="text-gray-200 text-xs sm:text-sm">{r.intent.primary}</p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 bg-emerald-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-500/20">
                    <span className="text-emerald-300 text-xs sm:text-sm mt-0.5 shrink-0">🎯</span>
                    <p className="text-gray-200 text-xs sm:text-sm">{r.intent.direction}</p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 bg-blue-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-500/20">
                    <span className="text-blue-300 text-xs sm:text-sm mt-0.5 shrink-0">💡</span>
                    <p className="text-gray-200 text-xs sm:text-sm">{r.intent.also}</p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 bg-amber-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-500/20">
                    <span className="text-amber-300 text-xs sm:text-sm mt-0.5 shrink-0">⚡</span>
                    <p className="text-gray-200 text-xs sm:text-sm">{r.intent.note}</p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 bg-rose-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-rose-500/20">
                    <span className="text-rose-300 text-xs sm:text-sm mt-0.5 shrink-0">📌</span>
                    <p className="text-gray-200 text-xs sm:text-sm">{r.intent.available}</p>
                  </div>
                </div>
              </div>

              {/* Core Practice */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  {r.practiceTitle}
                </h2>
                <div className="space-y-2 sm:space-y-4">
                  {r.practices.map((practice, idx) => (
                    <div key={idx} className="group bg-white/5 hover:bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-5 border border-white/5 hover:border-violet-500/30 transition-all">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <span className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-300 font-bold text-xs sm:text-sm">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                            <h3 className="text-white font-semibold text-xs sm:text-sm group-hover:text-violet-200 transition-colors">
                              {practice.title}
                            </h3>
                            <span className="px-1.5 sm:px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-[10px] sm:text-xs border border-violet-500/30">
                              {practice.role}
                            </span>
                          </div>
                          <p className="text-gray-500 text-[10px] sm:text-xs mb-1 sm:mb-1.5">{practice.period}</p>
                          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            {practice.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What Drives Me */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                  {r.passionTitle}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {r.passions.map((passion, idx) => {
                    const gradients = [
                      'from-violet-500/20 to-purple-500/20 border-violet-500/30',
                      'from-orange-500/20 to-red-500/20 border-orange-500/30',
                      'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
                    ];
                    return (
                      <div key={idx} className={`bg-gradient-to-br ${gradients[idx]} rounded-lg sm:rounded-xl p-3 sm:p-4 border`}>
                        <span className="text-xl sm:text-2xl mb-1.5 sm:mb-2 block">{passion.icon}</span>
                        <p className="text-white font-medium text-xs sm:text-sm mb-1">{passion.title}</p>
                        <p className="text-gray-300 text-[10px] sm:text-xs leading-relaxed">{passion.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Self Evaluation */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  {r.selfAssessmentLabel}
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{r.selfEval}</p>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 backdrop-blur-xl border border-violet-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                <p className="text-white text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">{r.contactTitle}</p>
                <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">{r.contactDesc}</p>
                <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
                  <a
                    href="mailto:purplemist@qq.com"
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all hover:scale-105 shadow-lg shadow-violet-600/25"
                  >
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {r.sendEmail}
                  </a>
                  <a
                    href="/resume.pdf"
                    download
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {r.downloadPdf}
                  </a>
                  <Link
                    href="/messages"
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all border border-white/10"
                  >
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {r.techForumLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
