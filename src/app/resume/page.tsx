'use client';

import {
  MapPin, Mail, Briefcase, ArrowLeft,
  GraduationCap, Trophy, Zap, Heart, Code, Brain, MessageSquare, ExternalLink, BadgeCheck, X
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

interface CertData {
  title: string;
  issuer: string;
  date: string;
  viewHint: string;
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
  cert: CertData;
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
          direction: 'Embedded development workflow, 4-layer PCB design through fabrication and soldering, stereo vision and on-device model deployment',
          also: 'Skilled at AI-assisted development, with hands-on experience deploying a model on-device and wiring up the real-time inference pipeline',
          note: 'Co-first author of a paper in the SCI journal Pattern Analysis and Applications, responsible for ablation study design, result analysis and manuscript writing',
          available: 'Available immediately, remote or Tianjin/Beijing area',
        },
        practices: [
          { title: 'ReID Person Re-identification Research', role: 'Co-first Author', period: '2026/08', link: 'https://link.springer.com/article/10.1007/s10044-026-01761-5', linkLabel: 'Paper', desc: 'Paper CATSANet officially published in Pattern Analysis and Applications (SCI-indexed journal), credited as co-first author (the paper footnote states equal contribution with the third author); the companion code is open-sourced by the team. My contribution covered ablation study design and parameter tuning, result analysis and literature review, plus writing parts of the manuscript' },
          { title: 'FPGA-based Edge Intelligent Vision Terminal', role: 'System Integration & Documentation', period: '2025/09 - 2025/12', desc: '8th National Embedded Chip & System Design Competition, FPGA Track — National 3rd Prize. The project hardware-accelerates edge detection, image filtering and HSV colour recognition on an Anlu HX4S20 FPGA, with a multi-stage pipeline supporting 640×480@30fps real-time processing; I took part in system integration and documentation, able to read Verilog FSM logic and got the edge-detection function working by following the tutorials' },
          { title: 'Quadruped Robot Dog Multimodal Perception & Control System', role: 'System Definition & Integration', period: '2026/04 - 2026/07', desc: '9th National Embedded Chip & System Design Competition, Chip Application Track — National 3rd Prize (about 700–800 teams nationwide). Defined the gesture-to-action mapping rules and a three-level motion priority (emergency avoidance > gesture > voice), and scoped the boundaries of the perception pipeline; used AI coding tools to deploy the stereo depth-estimation model on-device, integrate MediaPipe gesture recognition and the voice Q&A link, and get the real-time chain working: camera capture → BPU inference → depth map → region judgement → control command; designed multi-frame confirmation and command filtering against accidental gesture triggers; wrote the full competition technical report independently' },
          { title: 'XiaoZhi AI & MCP Multi-device Smart Butler System', role: 'Independent Development', period: '2025/03 - 2025/12', desc: 'Tianjin 8th "New Engineering" Competition — Provincial 1st Prize (team lead) | China College Student Service Outsourcing Innovation & Entrepreneurship Competition — National 3rd Prize. Independently built the device-cloud voice control chain: microphone capture → speech-to-text → cloud LLM intent understanding → self-built MCP server (Python) running device control scripts → cloud platform issuing commands → device executes and reports back; delivered HarmonyOS Hi3861 board-level peripheral development (RGB LED / buzzer / fan) and Huawei Cloud IoT integration (thing model and MQTT data reporting)' },
        ],
        passions: [
          { icon: '🤖', title: 'Embodied Intelligence', desc: 'Hands-on robotics integration experience (ROS2 stereo vision, gesture control, motion control), believing AI + hardware is the future direction' },
          { icon: '🦀', title: 'Rust Embedded', desc: 'Attracted by Rust memory safety and zero-cost abstractions, bringing Rust into embedded development practice' },
          { icon: '⚙️', title: 'Embedded HW/SW', desc: 'Enjoy full-stack development from low-level hardware to high-level applications, pursuing elegant HW-SW co-design solutions' },
        ],
        techCategories: [
          { title: 'Languages', color: 'violet', skills: ['C/C++', 'Python', 'Rust'] },
          { title: 'Hardware', color: 'emerald', skills: ['RDK X5', 'ESP32', 'FPGA', 'HarmonyOS Hi3861'] },
          { title: 'Embedded Skills', color: 'amber', skills: ['On-device Deployment', 'Stereo Vision', 'PCB Design', 'ROS2'] },
          { title: 'AI Skills', color: 'blue', skills: ['PyTorch', 'MCP Protocol', 'AI Agent', 'AI-assisted Dev'] },
        ],
        awards: [
          { award: 'Embedded System Design Engineer Certification (Elementary)', date: 'Issued by China Institute of Electronics', emoji: '📜' },
          { award: '9th National Embedded Chip & System Design Competition — National 3rd Prize', date: '2026/08', emoji: '🥉' },
          { award: '8th National Embedded Chip & System Design Competition — National 3rd Prize (FPGA Track)', date: '2025/12', emoji: '🥉' },
          { award: 'China Service Outsourcing Innovation Competition — National 3rd Prize (Smart Home IoT)', date: '2025/08', emoji: '🥉' },
          { award: 'Tianjin 8th "New Engineering" Competition — Provincial 1st Prize (Team Leader)', date: '2025/12', emoji: '🥇' },
        ],
        education: {
          school: 'Tiangong University',
          major: 'Electronic Information Engineering',
          period: '2023/09 - 2027/06',
          courses: 'Circuit Theory, Analog Electronics, Digital Electronics, Signals & Systems, Electromagnetics, Embedded System Design',
        },
        cert: {
          title: 'Embedded System Design Engineer (Entry Level)',
          issuer: 'Chinese Institute of Electronics · Professional Certificate',
          date: '2026.08',
          viewHint: 'View Certificate',
        },
        selfEval: 'Focused on the intersection of embedded development and embodied intelligence, with a comprehensive "hardware-software-algorithm-AI" perspective. Familiar with AI engineering concepts such as RAG and MCP, with hands-on experience bringing AI technology into embedded devices; through high-value competitions I have built project delivery capability in FPGA and IoT scenarios, served as a competition team lead, and developed solid coordination and problem-solving skills.',
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
          direction: '組み込み開発の流れ、四層 PCB の設計から基板製造・はんだ付けまで、双目ステレオビジョンとエッジ側モデル配備',
          also: 'AI ツールを活用した開発を得意とし、モデルのエッジ側配備とリアルタイム推論経路の構築に実績あり',
          note: 'SCI ジャーナル Pattern Analysis and Applications に共第一著者として論文発表、消融実験の設計・結果分析・論文執筆を担当',
          available: 'すぐに勤務可能、リモートまたは天津/北京エリア',
        },
        practices: [
          { title: 'ReID 人物再識別研究プロジェクト', role: '共第一著者', period: '2026/08', link: 'https://link.springer.com/article/10.1007/s10044-026-01761-5', linkLabel: '論文', desc: '論文 CATSANet が SCI ジャーナル Pattern Analysis and Applications に正式掲載、共第一著者として署名（脚注に第三著者と同等の貢献と明記）、付属コードはチームにより公開。本人の担当は消融実験の設計とパラメータ調整、結果分析、文献調査、および一部章の執筆' },
          { title: 'FPGA ベースのエッジインテリジェントビジョン端末', role: 'システム連調・ドキュメント整理', period: '2025/09 - 2025/12', desc: '第8回全国組み込みチップ・システム設計大会 FPGA トラック — 国家級三等賞。本プロジェクトは安路 HX4S20 FPGA でエッジ検出・画像フィルタリング・HSV 色彩認識のハードウェア高速化を実現し、多段パイプラインで 640×480@30fps のリアルタイム処理をサポート。本人はシステム連調とドキュメント整理を担当し、Verilog のステートマシンロジックを読解でき、チュートリアルに沿ってエッジ検出機能を動作させた' },
          { title: '四足ロボットドッグのマルチモーダル知覚・制御システム', role: 'システム定義・統合', period: '2026/04 - 2026/07', desc: '第9回全国組み込みチップ・システム設計大会 チップ応用トラック — 国家級三等賞（全国約700〜800チーム）。ジェスチャー—動作のマッピング規則と三段階の運動優先度（緊急障害回避 > ジェスチャー > 音声）を定義し、知覚パイプラインの機能境界を切り分け；AI コーディングツールを活用して双目深度推定モデルの端側配備、MediaPipe ジェスチャー認識、音声 Q&A リンクの統合・デバッグを行い、「カメラ取り込み → BPU 推論 → 深度マップ → 領域判定 → 制御指令」のリアルタイム経路を開通；ジェスチャーの誤作動に対して多フレーム確認と指令フィルタ機構を設計；競技技術報告書の全文を独立して執筆' },
          { title: '小智 AI と MCP によるマルチデバイス・スマートバトラーシステム', role: '独立開発', period: '2025/03 - 2025/12', desc: '天津第8回「新工科」大会 — 省部級一等賞（チームリーダー）｜中国大学生サービス外包イノベーション・起業大会 — 国家級三等賞。端雲音声制御チェーンを独立構築：マイク収音 → 音声テキスト化 → クラウド大規模モデルによる意図理解 → 自前 MCP サーバー（Python）がデバイス制御スクリプトを実行 → クラウドプラットフォームが指令を送信 → デバイスが実行し結果を返送；鴻蒙 Hi3861 のボード側ペリフェラル開発（RGB ライト／ブザー／ファン）と Huawei Cloud IoT 接続（物模型と MQTT データ送信）を担当' },
        ],
        passions: [
          { icon: '🤖', title: '具現化知能', desc: 'ロボットシステム統合の実戦経験（ROS2 双目視覚、ジェスチャー制御、運動制御）を持ち、AI とハードウェアの融合が未来の方向と信じる' },
          { icon: '🦀', title: 'Rust 組み込み', desc: 'Rust のメモリ安全性とゼロコスト抽象化に惹かれ、組み込み開発に Rust を導入中' },
          { icon: '⚙️', title: '組み込み HW/SW', desc: '低レイヤーハードウェアから高レイヤーアプリまで全スタック開発を楽しみ、エレガントな HW-SW 協調設計を追求' },
        ],
        techCategories: [
          { title: 'プログラミング言語', color: 'violet', skills: ['C/C++', 'Python', 'Rust'] },
          { title: 'ハードウェア', color: 'emerald', skills: ['RDK X5', 'ESP32', 'FPGA', '鴻蒙 Hi3861'] },
          { title: '組み込み技術', color: 'amber', skills: ['エッジ側モデル配備', '双目ステレオビジョン', 'PCB 設計', 'ROS2'] },
          { title: 'AI 能力', color: 'blue', skills: ['PyTorch', 'MCP プロトコル', 'AI Agent', 'AI ツール支援開発'] },
        ],
        awards: [
          { award: '組み込みシステム設計エンジニア認定（初級）', date: '中国電子学会発行', emoji: '📜' },
          { award: '第9回全国組み込みチップ・システム設計大会 — 国家級三等賞', date: '2026/08', emoji: '🥉' },
          { award: '第8回全国組み込みチップ・システム設計大会 — 国家級三等賞（FPGA トラック）', date: '2025/12', emoji: '🥉' },
          { award: '中国サービスアウトソーシングイノベーション大会 — 国家級三等賞（スマートホーム IoT）', date: '2025/08', emoji: '🥉' },
          { award: '天津第8回「新工科」大会 — 省部級一等賞（リーダー）', date: '2025/12', emoji: '🥇' },
        ],
        education: {
          school: '天津工業大学',
          major: '電子情報工学',
          period: '2023/09 - 2027/06',
          courses: '回路理論、アナログ電子工学、デジタル電子工学、信号とシステム、電磁気学、組み込みシステム設計',
        },
        cert: {
          title: '組込みシステム設計エンジニア（初級）',
          issuer: '中国電子学会 · 専門技術証明書',
          date: '2026.08',
          viewHint: '証明書を見る',
        },
        selfEval: '組み込み開発と Embodied AI の交差領域に注力し、「ハードウェア-ソフトウェア-アルゴリズム-AI」を俯瞰する総合的な視点を持つ。RAG、MCP などの AI エンジニアリング概念に精通し、AI 技術を組み込み機器へ実装した実戦経験を有する。高難度の競技を通じて FPGA・IoT などの領域でプロジェクトを完遂する力を培い、競技ではチームリーダーを務めた経験があり、調整力と問題解決能力に優れる。',
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
          primary: '嵌入式软硬件开发 / 端侧 AI 部署方向实习',
          direction: '熟悉嵌入式系统开发流程，具备四层 PCB 设计、打样与焊接能力，掌握双目立体视觉与端侧模型部署',
          also: '善用主流 AI 工具辅助开发，具备模型端侧部署与实时推理链路打通的实战经验',
          note: '以共同第一作者在 SCI 期刊 Pattern Analysis and Applications 发表论文一篇，负责消融实验设计、结果分析与论文撰写',
          available: '随时到岗，接受远程或天津/北京地区',
        },
        practices: [
          { title: 'ReID 行人重识别科研项目', role: '共同第一作者', period: '2026/08', link: 'https://link.springer.com/article/10.1007/s10044-026-01761-5', linkLabel: '查看论文', desc: '论文 CATSANet 已在 Pattern Analysis and Applications（SCI 期刊）正式发表，署名共同第一作者（脚注注明与第三作者同等贡献），配套代码由团队开源。本人负责消融实验设计与参数调优、结果分析与文献调研，并参与部分章节撰写' },
          { title: '基于 FPGA 的边缘智能视觉终端', role: '系统联调与文档整理', period: '2025/09 - 2025/12', desc: '第八届全国大学生嵌入式芯片与系统设计竞赛 FPGA 创新设计赛道 · 国家级三等奖。项目基于安路 HX4S20 FPGA 实现边缘检测、图像滤波、HSV 色彩识别算法硬件加速，多级流水线支持 640×480@30fps 实时处理；本人参与系统联调与文档整理，能读懂 Verilog 状态机逻辑，配合教程调通边缘检测功能' },
          { title: '四足机器狗多模态感知与控制系统', role: '系统定义与集成', period: '2026/04 - 2026/07', desc: '第九届全国大学生嵌入式芯片与系统设计竞赛芯片应用赛道 · 国家级三等奖（全国约七八百支参赛队）。定义手势—动作映射规则与三级运动优先级（紧急避障 > 手势 > 语音），划分感知链路的功能边界；借助 AI 编程工具完成双目深度估计模型的端侧部署、MediaPipe 手势识别与语音问答链路的集成调试，打通「摄像头取流 → BPU 推理 → 深度图 → 区域判定 → 控制指令」的实时链路；针对手势误触发设计多帧确认与指令过滤机制；独立完成竞赛技术报告全文撰写' },
          { title: '基于小智 AI 与 MCP 的多设备智能管家系统', role: '独立开发', period: '2025/03 - 2025/12', desc: '天津市第八届"新工科"竞赛 · 省级一等奖（队长）｜中国大学生服务外包创新创业大赛 · 国家级三等奖。独立完成端云语音控制链路：麦克风采集 → 语音转文字 → 云端大模型意图理解 → 自建 MCP 服务端（Python）执行设备控制脚本 → 云平台下发指令 → 设备执行并回传结果；完成鸿蒙 Hi3861 板端外设开发（RGB 灯 / 蜂鸣器 / 风扇）与华为云 IoT 接入（物模型与 MQTT 数据上报）' },
        ],
        passions: [
          { icon: '🤖', title: '具身智能', desc: '拥有机器人系统集成实战经验（ROS2 双目视觉、手势控制、运动控制），坚信 AI 与硬件结合是未来方向' },
          { icon: '🦀', title: 'Rust 嵌入式', desc: '被 Rust 的内存安全和零成本抽象所吸引，正在将 Rust 引入嵌入式开发实践' },
          { icon: '⚙️', title: '嵌入式软硬件', desc: '享受从底层硬件到上层应用的全链路开发过程，追求软硬件协同设计的优雅方案' },
        ],
        techCategories: [
          { title: '编程语言', color: 'violet', skills: ['C/C++', 'Python', 'Rust'] },
          { title: '硬件平台', color: 'emerald', skills: ['RDK X5', 'ESP32', 'FPGA', '鸿蒙 Hi3861'] },
          { title: '嵌入式技术', color: 'amber', skills: ['端侧模型部署', '双目立体视觉', 'PCB 设计', 'ROS2'] },
          { title: 'AI 能力', color: 'blue', skills: ['PyTorch', 'MCP 协议', 'AI Agent', 'AI 工具辅助开发'] },
        ],
        awards: [
          { award: '嵌入式系统设计工程技术人员认证（初级）', date: '中国电子学会颁发', emoji: '📜' },
          { award: '第九届全国大学生嵌入式芯片与系统设计竞赛 国家级三等奖', date: '2026/08', emoji: '🥉' },
          { award: '第八届全国大学生嵌入式芯片与系统设计竞赛 国家级三等奖', date: '2025/12', emoji: '🥉' },
          { award: '中国大学生服务外包创新创业大赛 国家级三等奖（智能家居物联网）', date: '2025/08', emoji: '🥉' },
          { award: '天津第八届"新工科"竞赛 省部级一等奖（队长）', date: '2025/12', emoji: '🥇' },
        ],
        education: {
          school: '天津工业大学',
          major: '电子信息工程',
          period: '2023/09 - 2027/06',
          courses: '电路原理、模拟电子技术、数字电子技术、信号与系统、电磁场与电磁波、嵌入式系统设计',
        },
        cert: {
          title: '嵌入式系统设计工程师（初级）',
          issuer: '中国电子学会 · 专业技术证书',
          date: '2026.08',
          viewHint: '查看证书',
        },
        selfEval: '聚焦嵌入式开发与具身智能交叉领域，具备「硬件-软件-算法-AI」综合视角，熟悉 RAG、MCP 等 AI 工程化概念，拥有 AI 技术嵌入式落地实战经验；通过高含金量竞赛积累了 FPGA、物联网等场景的项目落地能力，曾担任竞赛队长，具备良好的统筹协调与问题解决能力。',
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
  const [showCert, setShowCert] = useState(false);
  
  useEffect(() => {
    const id = window.setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const r = getResumeData(language || 'cn');

  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    violet: { bg: 'bg-[color-mix(in_oklab,var(--neon-violet)_15%,transparent)]', text: 'text-[var(--neon-violet)]', border: 'border-[color-mix(in_oklab,var(--neon-violet)_25%,transparent)]' },
    emerald: { bg: 'bg-[color-mix(in_oklab,var(--neon-lime)_15%,transparent)]', text: 'text-[var(--neon-lime)]', border: 'border-[color-mix(in_oklab,var(--neon-lime)_25%,transparent)]' },
    amber: { bg: 'bg-[color-mix(in_oklab,var(--neon-amber)_15%,transparent)]', text: 'text-[var(--neon-amber)]', border: 'border-[color-mix(in_oklab,var(--neon-amber)_25%,transparent)]' },
    blue: { bg: 'bg-[color-mix(in_oklab,var(--neon-cyan)_15%,transparent)]', text: 'text-[var(--neon-cyan)]', border: 'border-[color-mix(in_oklab,var(--neon-cyan)_25%,transparent)]' },
  };

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-2 sm:pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-[var(--neon-violet)] hover:text-[var(--neon-violet)] transition-colors text-xs sm:text-sm mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {r.backToHome}
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pb-10 sm:pb-16">
          {/* Title Card */}
          <div className="bg-card backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl p-4 sm:p-8 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-1 sm:mb-2">{r.title}</h1>
                <p className="text-[var(--neon-violet)] text-sm sm:text-lg">{r.subtitle}</p>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <Link
                  href="/messages"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[var(--glow-violet)] hover:bg-[var(--glow-violet)] text-slate-900 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all hover:scale-105 shadow-lg"
                >
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {r.leaveMessage}
                </Link>
                <a
                  href="mailto:purplemist@qq.com"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-card hover:bg-card text-foreground rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all border border-border"
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
              <div className="bg-card backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--neon-violet)]" />
                  {r.personalInfo}
                </h2>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                    <span className="text-sm sm:text-base">👤</span>
                    <div>
                      <p className="font-medium text-foreground">{r.name}</p>
                      <p className="text-[11px] sm:text-xs text-[var(--neon-violet)]">{r.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--neon-violet)] shrink-0" />
                    <span>{r.educationStr}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--neon-violet)] shrink-0" />
                    <span>{r.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--neon-violet)] shrink-0" />
                    <span>{r.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--neon-violet)] shrink-0" />
                    <span>{r.grade}</span>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-card backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--neon-violet)]" />
                  {r.techStack}
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {r.techCategories.map((cat) => {
                    const colors = colorMap[cat.color] || colorMap.violet;
                    return (
                      <div key={cat.title}>
                        <p className={`text-[11px] sm:text-xs ${colors.text} mb-1.5 sm:mb-2 font-medium`}>{cat.title}</p>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {cat.skills.map((s) => (
                            <span
                              key={s}
                              className={`px-1.5 sm:px-2 py-0.5 ${colors.bg} ${colors.text} rounded text-[11px] sm:text-xs border ${colors.border}`}
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
              <div className="bg-card backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--neon-amber)]" />
                  {r.awardsTitle}
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {r.awards.map((a, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-2.5">
                      <span className="text-sm sm:text-base mt-0.5">{a.emoji}</span>
                      <div>
                        <p className="text-xs sm:text-sm text-foreground leading-snug">{a.award}</p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{a.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Professional Certificate */}
                <button
                  onClick={() => setShowCert(true)}
                  className="mt-4 w-full group text-left rounded-xl border border-border hover:border-[color-mix(in_oklab,var(--neon-violet)_50%,transparent)] p-3 transition-all hover:shadow-lg"
                  style={{ background: 'color-mix(in oklab, var(--neon-violet) 8%, var(--card))' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeCheck className="w-4 h-4 text-[var(--neon-violet)] shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-foreground">{r.cert.title}</span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/certificates/cie-embedded-cert.jpg"
                    alt={r.cert.title}
                    className="w-full rounded-lg border border-border shadow-md group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <p className="mt-2 text-[11px] sm:text-xs text-muted-foreground flex items-center justify-between">
                    <span>{r.cert.issuer} · {r.cert.date}</span>
                    <span className="text-[var(--neon-violet)] group-hover:text-[var(--neon-violet)]">{r.cert.viewHint} →</span>
                  </p>
                </button>
              </div>

              {/* Education */}
              <div className="bg-card backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--neon-cyan)]" />
                  {r.educationLabel}
                </h2>
                <div className="text-xs sm:text-sm space-y-1.5 sm:space-y-2">
                  <p className="text-foreground font-medium">{r.education.school}</p>
                  <p className="text-[var(--neon-violet)]">{r.education.major}</p>
                  <p className="text-muted-foreground">{r.education.period}</p>
                  <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed mt-1.5 sm:mt-2">{r.education.courses}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-6">
              {/* Job Intentions */}
              <div className="bg-card backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--neon-violet)]" />
                  {r.intentTitle}
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3 bg-[color-mix(in_oklab,var(--neon-violet)_10%,transparent)] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[color-mix(in_oklab,var(--neon-violet)_20%,transparent)]">
                    <span className="text-[var(--neon-violet)] text-xs sm:text-sm mt-0.5 shrink-0">📍</span>
                    <p className="text-muted-foreground text-xs sm:text-sm">{r.intent.primary}</p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 bg-[color-mix(in_oklab,var(--neon-lime)_10%,transparent)] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[color-mix(in_oklab,var(--neon-lime)_20%,transparent)]">
                    <span className="text-[var(--neon-lime)] text-xs sm:text-sm mt-0.5 shrink-0">🎯</span>
                    <p className="text-muted-foreground text-xs sm:text-sm">{r.intent.direction}</p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 bg-[color-mix(in_oklab,var(--neon-cyan)_10%,transparent)] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[color-mix(in_oklab,var(--neon-cyan)_20%,transparent)]">
                    <span className="text-[var(--neon-cyan)] text-xs sm:text-sm mt-0.5 shrink-0">💡</span>
                    <p className="text-muted-foreground text-xs sm:text-sm">{r.intent.also}</p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 bg-[color-mix(in_oklab,var(--neon-amber)_10%,transparent)] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[color-mix(in_oklab,var(--neon-amber)_20%,transparent)]">
                    <span className="text-[var(--neon-amber)] text-xs sm:text-sm mt-0.5 shrink-0">⚡</span>
                    <p className="text-muted-foreground text-xs sm:text-sm">{r.intent.note}</p>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 bg-[color-mix(in_oklab,var(--neon-magenta)_10%,transparent)] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-[color-mix(in_oklab,var(--neon-magenta)_20%,transparent)]">
                    <span className="text-[var(--neon-magenta)] text-xs sm:text-sm mt-0.5 shrink-0">📌</span>
                    <p className="text-muted-foreground text-xs sm:text-sm">{r.intent.available}</p>
                  </div>
                </div>
              </div>

              {/* Core Practice */}
              <div className="bg-card backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--neon-amber)]" />
                  {r.practiceTitle}
                </h2>
                <div className="space-y-2 sm:space-y-4">
                  {r.practices.map((practice, idx) => (
                    <div key={idx} className="group bg-card hover:bg-card rounded-lg sm:rounded-xl p-3 sm:p-5 border border-white/5 hover:border-[color-mix(in_oklab,var(--neon-violet)_30%,transparent)] transition-all">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <span className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[color-mix(in_oklab,var(--neon-violet)_20%,transparent)] flex items-center justify-center text-[var(--neon-violet)] font-bold text-xs sm:text-sm">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                            <h3 className="text-foreground font-semibold text-xs sm:text-sm group-hover:text-[var(--neon-violet)] transition-colors">
                              {practice.title}
                            </h3>
                            <span className="px-1.5 sm:px-2 py-0.5 bg-[color-mix(in_oklab,var(--neon-violet)_20%,transparent)] text-[var(--neon-violet)] rounded text-[11px] sm:text-xs border border-[color-mix(in_oklab,var(--neon-violet)_30%,transparent)]">
                              {practice.role}
                            </span>
                            {practice.link && (
                              <a
                                href={practice.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-[color-mix(in_oklab,var(--neon-cyan)_20%,transparent)] text-[var(--neon-cyan)] rounded text-[11px] sm:text-xs border border-[color-mix(in_oklab,var(--neon-cyan)_30%,transparent)] hover:bg-[color-mix(in_oklab,var(--neon-cyan)_40%,transparent)] hover:text-[var(--neon-cyan)] transition-colors"
                              >
                                <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                {practice.linkLabel}
                              </a>
                            )}
                          </div>
                          <p className="text-muted-foreground text-[11px] sm:text-xs mb-1 sm:mb-1.5">{practice.period}</p>
                          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                            {practice.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What Drives Me */}
              <div className="bg-card backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--neon-magenta)]" />
                  {r.passionTitle}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {r.passions.map((passion, idx) => {
                    /*
                     * --glow-* 是「亮色档」，设计系统里写明了只做填充、且只配近黑文字。
                     * 正文压在上面两个主题都会掉对比度：亮色主题下灰字在亮底上偏淡，
                     * 暗色主题下 --glow-* 与 --muted-foreground 明度几乎相同，基本看不见。
                     * 所以底色改用墨色档低透明度（叠加在 --card 上），
                     * 颜色身份保留在顶部强调条与描边上。
                     */
                    const accents = ['var(--neon-violet)', 'var(--neon-amber)', 'var(--neon-cyan)'];
                    const accent = accents[idx] ?? accents[0];
                    return (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-lg sm:rounded-xl border p-3 sm:p-4 transition-colors duration-300"
                        style={{
                          borderColor: `color-mix(in oklab, ${accent} 30%, transparent)`,
                          background: `color-mix(in oklab, ${accent} 9%, var(--card))`,
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-[2px]"
                          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
                        />
                        <span className="text-xl sm:text-2xl mb-1.5 sm:mb-2 block">{passion.icon}</span>
                        <p className="text-foreground font-medium text-xs sm:text-sm mb-1">{passion.title}</p>
                        <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed">{passion.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Self Evaluation */}
              <div className="bg-card backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--neon-cyan)]" />
                  {r.selfAssessmentLabel}
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{r.selfEval}</p>
              </div>

              {/* CTA：底同样不能用亮色档满填充 —— 标题与副文案都会被压掉 */}
              <div
                className="backdrop-blur-xl border rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
                style={{
                  borderColor: 'color-mix(in oklab, var(--neon-violet) 32%, transparent)',
                  background: 'color-mix(in oklab, var(--neon-violet) 9%, var(--card))',
                }}
              >
                <p className="text-foreground text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">{r.contactTitle}</p>
                <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">{r.contactDesc}</p>
                <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
                  <Link
                    href="/messages"
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[var(--glow-violet)] hover:bg-[var(--glow-violet)] text-slate-900 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all hover:scale-105 shadow-lg"
                  >
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {r.leaveMessage}
                  </Link>
                  <a
                    href="mailto:purplemist@qq.com"
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-card hover:bg-card text-foreground rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all border border-border"
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

      {/* Certificate Lightbox */}
      {showCert && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowCert(false)}
        >
          <button
            onClick={() => setShowCert(false)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-card hover:bg-card text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-[92vw] max-h-[88vh] flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/certificates/cie-embedded-cert.jpg"
              alt={r.cert.title}
              className="max-w-full max-h-[80vh] rounded-xl shadow-2xl border border-white/20"
            />
            <p className="text-xs sm:text-sm text-muted-foreground">{r.cert.title} · {r.cert.issuer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
