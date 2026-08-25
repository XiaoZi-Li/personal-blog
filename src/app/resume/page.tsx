'use client';

import { TechCityBackground } from '@/components/TechCityBackground';
import {
  MapPin, Mail, Briefcase, ArrowLeft,
  GraduationCap, Trophy, Zap, Heart, Code, Brain, MessageSquare, ExternalLink
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
  link?: string;
  linkLabel?: string;
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
  leaveMessage: string;
  backToHome: string;
}

function getResumeData(lang: string): ResumeData {
  switch (lang) {
    case 'en-US':
      return {
        title: 'Resume',
        subtitle: 'Practice drives growth, passion shapes direction',
        personalInfo: 'Personal Info',
        techStack: 'Tech Stack',
        awardsTitle: 'Awards',
        intentTitle: 'Career Objective',
        practiceTitle: 'Key Projects',
        passionTitle: 'Passions',
        contactTitle: "Let's Connect",
        contactDesc: 'Seeking embedded / embodied intelligence internship opportunities. Feel free to reach out!',
        sendEmail: 'Send Email',
        name: 'Li Junjie',
        position: 'Embedded / Embodied Intelligence',
        educationStr: 'Tiangong University · Electronic Information Engineering',
        grade: 'Class of 2027 · Available for internship',
        location: 'Xiqing District, Tianjin',
        email: 'purplemist@qq.com',
        intent: {
          primary: 'Embedded Software/Hardware Development · Embodied Intelligence Internship',
          direction: 'Full-stack embedded development, PCB design, sensor fusion & edge computing solutions',
          also: 'Skilled at AI-assisted development with hands-on experience deploying AI models on embedded devices',
          note: 'Proficient in PyTorch model training & validation, with SCI paper writing and open-source experience',
          available: 'Available immediately, remote or Tianjin/Beijing area',
        },
        practices: [
          { title: 'ReID Person Re-identification Research', role: 'Co-first Author', period: '2024/12 - 2026/02', link: 'https://link.springer.com/article/10.1007/s10044-026-01761-5', linkLabel: 'Paper', desc: 'Paper CATSANet accepted by Pattern Analysis and Applications (SCI journal), code open-sourced. Built full PyTorch/CLIP training & evaluation pipeline; co-proposed cross-modal semantic token selection module and Sinkhorn optimal-transport part alignment loss (PACL), validated by ablation studies' },
          { title: 'FPGA-based Edge Intelligent Vision Terminal', role: 'Logic Design & System Integration', period: '2025/09 - 2025/12', desc: '8th National Embedded Chip & System Design Competition, FPGA Track — Final 3rd Prize. Hardware acceleration of edge detection, image filtering & HSV recognition on Anlu HX4S20 FPGA, multi-stage pipeline supporting 640×480@30fps, resolved multi-clock-domain metastability issues' },
          { title: 'Quadruped Robot Dog Perception & Motion Control', role: 'Perception & Motion Control Developer', period: '2026/04 - 2026/07', desc: '9th National Embedded Chip & System Design Competition, Chip Application Track — National Final 3rd Prize. Built stereo depth obstacle avoidance, MediaPipe gesture control and 3-level motion arbiter on RDK X5 (BPU 10 TOPS) + ROS2, completed gait tuning and system integration' },
          { title: 'XiaoZhi MCP Intelligent Control System', role: 'Team Leader', period: '2025/10 - 2025/12', desc: 'ESP32-based multi-sensor fusion system integrating MCP protocol for efficient AI-model-to-device interaction. Won Provincial 1st Prize in Tianjin "New Engineering" Competition; designed the multi-sensor fusion scheme, led a 3-member team, balancing real-time data transmission and edge computing resources' },
          { title: 'Service Outsourcing Innovation Competition · Smart Home IoT', role: 'Embedded Developer', period: '2025/01 - 2025/06', desc: 'Smart home sensor data acquisition & wireless communication system based on HarmonyOS Hi3861. Won National 3rd Prize in China College Student Service Outsourcing Competition; developed sensor acquisition and wireless modules for low-power scenarios, solved device protocol adaptation and signal stability issues' },
        ],
        passions: [
          { icon: '🤖', title: 'Embodied Intelligence', desc: 'Hands-on robotics integration experience (ROS2 stereo vision, gesture control, motion control), believing AI + hardware is the future direction' },
          { icon: '🦀', title: 'Rust Embedded', desc: 'Attracted by Rust memory safety and zero-cost abstractions, bringing Rust into embedded development practice' },
          { icon: '⚙️', title: 'Embedded HW/SW', desc: 'Enjoy full-stack development from low-level hardware to high-level applications, pursuing elegant HW-SW co-design solutions' },
        ],
        techCategories: [
          { title: 'Languages', color: 'violet', skills: ['C/C++', 'Python', 'Rust'] },
          { title: 'Hardware', color: 'emerald', skills: ['ESP32', 'RDK X5', 'STM32', 'FPGA'] },
          { title: 'Embedded Skills', color: 'amber', skills: ['Sensor Fusion', 'Edge Computing', 'PCB Design', 'ROS2'] },
          { title: 'AI Skills', color: 'blue', skills: ['PyTorch', 'On-device AI Deployment', 'MCP Protocol', 'AI-assisted Dev'] },
        ],
        awards: [
          { award: 'Embedded System Design Engineer Certification (Elementary)', date: 'Issued by China Institute of Electronics', emoji: '📜' },
          { award: '9th National Embedded Chip & System Design Competition — National Final 3rd Prize', date: '2026/07', emoji: '🥉' },
          { award: '8th National Embedded Chip & System Design Competition — Final 3rd Prize (FPGA Track)', date: '2025/12', emoji: '🥉' },
          { award: 'China Service Outsourcing Innovation Competition — National 3rd Prize (Smart Home IoT)', date: '2025/06', emoji: '🥉' },
          { award: 'Tianjin 8th "New Engineering" Competition — Provincial 1st Prize (Team Leader)', date: '2025/06', emoji: '🥇' },
        ],
        education: {
          school: 'Tiangong University',
          major: 'Electronic Information Engineering',
          period: '2023/09 - 2027/06',
          courses: 'Circuit Theory, Analog Electronics, Digital Electronics, Signals & Systems, Electromagnetics, Embedded System Design',
        },
        selfEval: 'Focusing on the intersection of embedded systems and embodied intelligence with full-stack "HW-SW-Algorithm-AI" capabilities. Proficient in PyTorch model training & validation, with SCI paper writing and open-source experience; skilled in FPGA, MCU development and PCB design, familiar with ROS2, MCP and MQTT; hands-on experience in on-device AI deployment and robotics system integration, combining technical delivery with project coordination skills.',
        educationLabel: 'Education',
        selfAssessmentLabel: 'Self Assessment',
        leaveMessage: 'Leave a Message',
        backToHome: 'Back to Home',
      };
    case 'ja-JP':
      return {
        title: '履歴書',
        subtitle: '実践が成長を推進し、情熱が方向を決める',
        personalInfo: '個人情報',
        techStack: '技術スタック',
        awardsTitle: '受賞歴',
        intentTitle: '就職希望',
        practiceTitle: '主要プロジェクト',
        passionTitle: '技術への情熱',
        contactTitle: 'お問い合わせ',
        contactDesc: '組み込み / 具現化知能方向のインターンシップを探しています。お気軽にご連絡ください！',
        sendEmail: 'メール送信',
        name: '李 俊杰',
        position: '組み込み / 具現化知能',
        educationStr: '天津工業大学 · 電子情報工学',
        grade: '2027年卒 · インターン可能',
        location: '天津市西青区',
        email: 'purplemist@qq.com',
        intent: {
          primary: '組み込みソフトウェア/ハードウェア開発 · 具現化知能インターン',
          direction: '組み込みシステム開発の全工程、PCB 設計、センサーフュージョンとエッジコンピューティングソリューション',
          also: 'AI ツールによる開発支援に長け、AI モデルの組み込みデバイスへの展開実績あり',
          note: 'PyTorch によるモデル訓練・検証が可能、SCI 論文執筆とオープンソース経験あり',
          available: 'すぐに勤務可能、リモートまたは天津/北京エリア',
        },
        practices: [
          { title: 'ReID 人物再識別研究プロジェクト', role: '共第一著者', period: '2024/12 - 2026/02', link: 'https://link.springer.com/article/10.1007/s10044-026-01761-5', linkLabel: '論文', desc: '論文 CATSANet が SCI ジャーナル Pattern Analysis and Applications に採録、コード公開済み。PyTorch/CLIP による訓練・評価パイプラインを構築、クロスモーダル意味トークン選択モジュールと最適輸送に基づく部位整合損失（PACL）を共同提案、消融実験で検証' },
          { title: 'FPGA ベースのエッジインテリジェントビジョン端末', role: 'ロジック設計・システム連調', period: '2025/09 - 2025/12', desc: '第8回全国組み込みチップ・システム設計大会 FPGA トラック — 決勝三等賞。安路 HX4S20 FPGA でエッジ検出・画像フィルタリング・HSV 認識をハードウェア高速化、多段パイプラインで 640×480@30fps リアルタイム処理、マルチクロックドメインのメタスタビリティ問題を解決' },
          { title: '四足ロボットドッグの知覚・運動制御システム', role: '知覚・運動制御開発', period: '2026/04 - 2026/07', desc: '第9回全国組み込みチップ・システム設計大会 チップ応用トラック — 全国決勝三等賞。RDK X5（BPU 10 TOPS）+ ROS2 で双目深度障害回避、MediaPipe ジェスチャー制御、3段優先度運動アービタを構築、歩容調整とシステム統合を完了' },
          { title: '小智 MCP インテリジェント制御システム', role: 'チームリーダー', period: '2025/10 - 2025/12', desc: 'ESP32 ベースのマルチセンサーフュージョンシステム、MCP プロトコル統合により AI モデルとデバイスの効率的な連携を実現。天津「新工科」大会で省部級一等賞を受賞；マルチセンサーフュージョン設計を担当、3人チームを統括しリアルタイムデータ伝送とエッジコンピューティングリソースのバランスを最適化' },
          { title: 'サービスアウトソーシングイノベーション大会 · スマートホーム IoT', role: '組み込み開発者', period: '2025/01 - 2025/06', desc: '鴻蒙 Hi3861 ベースのスマートホームセンサーデータ収集・無線通信システム。中国大学生サービスアウトソーシング大会で国家級三等賞を受賞；低電力シーン向けのセンサー収集・無線モジュールを開発、デバイス間プロトコルアダプトと信号安定性問題を解決' },
        ],
        passions: [
          { icon: '🤖', title: '具現化知能', desc: 'ロボットシステム統合の実戦経験（ROS2 双目視覚、ジェスチャー制御、運動制御）を持ち、AI とハードウェアの融合が未来の方向と信じる' },
          { icon: '🦀', title: 'Rust 組み込み', desc: 'Rust のメモリ安全性とゼロコスト抽象化に惹かれ、組み込み開発に Rust を導入中' },
          { icon: '⚙️', title: '組み込み HW/SW', desc: '低レイヤーハードウェアから高レイヤーアプリまで全スタック開発を楽しみ、エレガントな HW-SW 協調設計を追求' },
        ],
        techCategories: [
          { title: 'プログラミング言語', color: 'violet', skills: ['C/C++', 'Python', 'Rust'] },
          { title: 'ハードウェア', color: 'emerald', skills: ['ESP32', 'RDK X5', 'STM32', 'FPGA'] },
          { title: '組み込み技術', color: 'amber', skills: ['センサーフュージョン', 'エッジコンピューティング', 'PCB 設計', 'ROS2'] },
          { title: 'AI 能力', color: 'blue', skills: ['PyTorch', 'AI モデル組み込み展開', 'MCP プロトコル', 'AI ツール支援開発'] },
        ],
        awards: [
          { award: '組み込みシステム設計エンジニア認定（初級）', date: '中国電子学会発行', emoji: '📜' },
          { award: '第9回全国組み込みチップ・システム設計大会 — 全国決勝三等賞', date: '2026/07', emoji: '🥉' },
          { award: '第8回全国組み込みチップ・システム設計大会 — 決勝三等賞（FPGA トラック）', date: '2025/12', emoji: '🥉' },
          { award: '中国サービスアウトソーシングイノベーション大会 — 国家級三等賞（スマートホーム IoT）', date: '2025/06', emoji: '🥉' },
          { award: '天津第8回「新工科」大会 — 省部級一等賞（リーダー）', date: '2025/06', emoji: '🥇' },
        ],
        education: {
          school: '天津工業大学',
          major: '電子情報工学',
          period: '2023/09 - 2027/06',
          courses: '回路理論、アナログ電子工学、デジタル電子工学、信号とシステム、電磁気学、組み込みシステム設計',
        },
        selfEval: '組み込みと具現化知能の交差領域に注力し、「ハードウェア-ソフトウェア-アルゴリズム-AI」の全スタック実践能力を持つ。PyTorch によるモデル構築・訓練・検証が可能で、SCI 論文執筆とオープンソース経験あり。FPGA、マイコン開発、PCB 設計を習得し、ROS2、MCP、MQTT プロトコルに精通。AI の組み込み展開とロボットシステム統合の実戦蓄積があり、技術実装力とプロジェクト統括力を兼ね備える。',
        educationLabel: '学歴',
        selfAssessmentLabel: '自己評価',
        leaveMessage: 'メッセージを残す',
        backToHome: 'ホームに戻る',
      };
    default: // cn
      return {
        title: '个人简历',
        subtitle: '实践驱动成长，热爱铸就方向',
        personalInfo: '个人信息',
        techStack: '技术栈',
        awardsTitle: '竞赛获奖',
        intentTitle: '求职意向',
        practiceTitle: '核心实践',
        passionTitle: '技术热情',
        contactTitle: '期待与您交流',
        contactDesc: '正在寻找嵌入式 / 具身智能方向实习机会，欢迎联系！',
        sendEmail: '发送邮件',
        name: '李俊杰',
        position: '嵌入式 / 具身智能',
        educationStr: '天津工业大学 · 电子信息工程',
        grade: '2027届 · 随时可到岗实习',
        location: '天津市西青区',
        email: 'purplemist@qq.com',
        intent: {
          primary: '嵌入式软硬件开发 / 具身智能方向实习',
          direction: '熟悉嵌入式系统开发全流程，具备 PCB 设计能力，掌握传感器融合与边缘计算方案',
          also: '善于利用主流 AI 工具辅助开发，拥有 AI 模型在嵌入式设备落地的实战经验',
          note: '能使用 PyTorch 完成模型搭建、调参训练与实验验证，拥有 SCI 论文写作与项目开源经验',
          available: '随时到岗，接受远程或天津/北京地区',
        },
        practices: [
          { title: 'ReID 行人重识别科研项目', role: '共同第一作者', period: '2024/12 - 2026/02', link: 'https://link.springer.com/article/10.1007/s10044-026-01761-5', linkLabel: '查看论文', desc: '论文 CATSANet 已被 Pattern Analysis and Applications（SCI 期刊）录用，代码已开源。基于 PyTorch/CLIP 构建数据预处理、训练与评估全流程，参与提出跨模态语义 Token 选择模块与基于 Sinkhorn 最优传输的部件对齐损失（PACL），通过消融实验验证其对检索精度的提升' },
          { title: '基于 FPGA 的边缘智能视觉终端', role: '协助逻辑设计与系统联调', period: '2025/09 - 2025/12', desc: '第八届全国大学生嵌入式芯片与系统设计竞赛 FPGA 创新设计赛道 · 决赛三等奖。基于安路 HX4S20 FPGA 实现边缘检测、图像滤波、HSV 色彩识别算法硬件加速，多级流水线支持 640×480@30fps 实时处理，解决多时钟域亚稳态问题' },
          { title: '四足机器狗感知与运动控制系统', role: '感知与运动控制系统开发', period: '2026/04 - 2026/07', desc: '第九届全国大学生嵌入式芯片与系统设计竞赛芯片应用赛道 · 全国总决赛三等奖。基于 RDK X5（BPU 10 TOPS）+ ROS2 开发双目深度避障、MediaPipe 手势控制与三级优先级运动仲裁器，完成步态调优与系统集成调试' },
          { title: '小智 MCP 智能控制系统', role: '队长', period: '2025/10 - 2025/12', desc: '基于 ESP32 的多传感器融合系统，集成 MCP 协议实现 AI 模型与嵌入式设备高效交互。获天津市"新工科"工程实践创新技术竞赛省部级一等奖；设计多传感器融合方案，打通 AI 模型与硬件设备间的上下文交互链路，统筹 3 人团队，解决实时数据传输与边缘计算资源平衡问题' },
          { title: '服务外包创新创业大赛 · 智能家居物联网', role: '嵌入式开发人员', period: '2025/01 - 2025/06', desc: '基于鸿蒙 Hi3861 的智能家居传感器数据采集与无线通信系统。获中国大学生服务外包创新创业大赛国家级三等奖；开发传感器数据采集模块与无线通信模块，适配低功耗场景需求，完成设备间通信协议适配，解决信号稳定性问题' },
        ],
        passions: [
          { icon: '🤖', title: '具身智能', desc: '拥有机器人系统集成实战经验（ROS2 双目视觉、手势控制、运动控制），坚信 AI 与硬件结合是未来方向' },
          { icon: '🦀', title: 'Rust 嵌入式', desc: '被 Rust 的内存安全和零成本抽象所吸引，正在将 Rust 引入嵌入式开发实践' },
          { icon: '⚙️', title: '嵌入式软硬件', desc: '享受从底层硬件到上层应用的全链路开发过程，追求软硬件协同设计的优雅方案' },
        ],
        techCategories: [
          { title: '编程语言', color: 'violet', skills: ['C/C++', 'Python', 'Rust'] },
          { title: '硬件平台', color: 'emerald', skills: ['ESP32', 'RDK X5', 'STM32', 'FPGA'] },
          { title: '嵌入式技术', color: 'amber', skills: ['传感器融合', '边缘计算', 'PCB 设计', 'ROS2'] },
          { title: 'AI 能力', color: 'blue', skills: ['PyTorch', 'AI 模型嵌入式落地', 'MCP 协议', 'AI 工具辅助开发'] },
        ],
        awards: [
          { award: '嵌入式系统设计工程技术人员认证（初级）', date: '中国电子学会颁发', emoji: '📜' },
          { award: '第九届全国大学生嵌入式芯片与系统设计竞赛 全国总决赛三等奖', date: '2026/07', emoji: '🥉' },
          { award: '第八届全国大学生嵌入式芯片与系统设计竞赛 决赛三等奖', date: '2025/12', emoji: '🥉' },
          { award: '中国大学生服务外包创新创业大赛 国家级三等奖（智能家居物联网）', date: '2025/06', emoji: '🥉' },
          { award: '天津第八届"新工科"竞赛 省部级一等奖（队长）', date: '2025/06', emoji: '🥇' },
        ],
        education: {
          school: '天津工业大学',
          major: '电子信息工程',
          period: '2023/09 - 2027/06',
          courses: '电路原理、模拟电子技术、数字电子技术、信号与系统、电磁场与电磁波、嵌入式系统设计',
        },
        selfEval: '聚焦嵌入式软硬件与具身智能交叉领域，具备「硬件-软件-算法-AI」全栈实践能力。能够使用 PyTorch 完成模型搭建、调参训练与实验验证，拥有 SCI 论文写作与项目开源经验；掌握 FPGA、单片机开发与 PCB 设计焊接，熟悉 ROS2 机器人框架及 MCP、MQTT 协议，具备 AI 嵌入式落地、机器人系统集成的实战积累，兼具技术落地能力与项目统筹意识。',
        educationLabel: '教育经历',
        selfAssessmentLabel: '自我评价',
        leaveMessage: '给我留言',
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
                <Link
                  href="/messages"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all hover:scale-105 shadow-lg shadow-violet-600/25"
                >
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {r.leaveMessage}
                </Link>
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
                            {practice.link && (
                              <a
                                href={practice.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[10px] sm:text-xs border border-blue-500/30 hover:bg-blue-500/40 hover:text-blue-200 transition-colors"
                              >
                                <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                {practice.linkLabel}
                              </a>
                            )}
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
                  <Link
                    href="/messages"
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all hover:scale-105 shadow-lg shadow-violet-600/25"
                  >
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {r.leaveMessage}
                  </Link>
                  <a
                    href="mailto:purplemist@qq.com"
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all border border-white/10"
                  >
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {r.sendEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
