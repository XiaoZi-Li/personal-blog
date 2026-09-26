'use client';

import {
  MapPin, Mail, Briefcase, ArrowLeft,
  GraduationCap, Trophy, Zap, Heart, Code, Brain, MessageSquare, ExternalLink, BadgeCheck, X,
  Building2, FileText
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

interface InternshipData {
  company: string;
  role: string;
  period: string;
  desc: string;
}

interface AcademicData {
  title: string;
  role: string;
  period: string;
  link?: string;
  linkLabel?: string;
  desc: string;
}

interface SkillDetailData {
  label: string;
  content: string;
}

interface ResumeData {
  title: string;
  subtitle: string;
  personalInfo: string;
  techStack: string;
  awardsTitle: string;
  intentTitle: string;
  practiceTitle: string;
  internshipTitle: string;
  academicTitle: string;
  skillDetails: SkillDetailData[];
  internships: InternshipData[];
  academic: AcademicData[];
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
        techStack: 'Professional Skills',
        awardsTitle: 'Honors & Awards',
        intentTitle: 'Career Objective',
        practiceTitle: 'Projects',
        internshipTitle: 'Internship',
        academicTitle: 'Academic Work',
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
        skillDetails: [
          { label: 'Robotics & On-device Deployment', content: 'On-device deployment on RDK X5 (BPU 10 TOPS) and real-time inference pipeline integration; stereo depth-estimation model deployment and application; ROS2 (project experience)' },
          { label: 'Embedded & Hardware', content: 'Board-level peripheral development and sensor data acquisition on ESP32-S3 / HarmonyOS Hi3861; 4-layer PCB design and fabrication with JLC EDA (board brought up and working); able to read Verilog logic' },
          { label: 'Languages', content: 'C (primary, have written complete project code by hand), Python (scripting and prototyping), Rust (learning)' },
          { label: 'Cloud & Protocols', content: 'Huawei Cloud IoT (product / device / thing-model setup, MQTT reporting), MQTT, RTSP streaming, MCP server (LLM tool calling)' },
          { label: 'Tooling & Hands-on', content: 'Heavy user of AI coding tools such as Codex / Trae / Claude for system integration and debugging; skilled at soldering 0402 / QFP packages, capable of multimeter-level hardware troubleshooting' },
        ],
        internships: [
          { company: 'Zhijia Artificial Intelligence Technology (Tianjin) Co., Ltd.', role: 'Hardware Development Engineer (Intern)', period: '2026.09 - Present', desc: 'Communication links: mapped out the multiple communication channels of the wheeled robot (message queue / HTTP / real-time pose / video stream) and reused them in the in-house host application, enabling map loading, route management and real-time status display; Feature integration: wired up route execution, waypoint event scheduling, voice announcements and scheduled patrols, implementing mutual exclusion between concurrent tasks and cleanup of stale tasks; Full-stack development: built the console and operations panel on Next.js with a Python subprocess, including permission checks, audit logging and data backup.' },
        ],
        academic: [
          { title: 'CATSANet: Text-to-Image Person Re-identification', role: 'Co-first Author', period: '2026/08', link: 'https://link.springer.com/article/10.1007/s10044-026-01761-5', linkLabel: 'Paper', desc: 'Co-first author, published in the SCI journal Pattern Analysis and Applications (2026, 29:176), on text-to-image person re-identification; responsible for ablation studies and hyper-parameter tuning: ran multiple comparative experiments in a PyTorch / CLIP environment and assisted with hyper-parameter tuning, model training and ablation comparisons, then organised the experimental data and analysed the results; took part in solution discussions and idea generation, and handled literature review and writing of several sections.' },
        ],
        intent: {
          primary: 'Embedded Software/Hardware Development · Embodied Intelligence Internship',
          direction: 'Embedded development workflow, 4-layer PCB design through fabrication and soldering, stereo vision and on-device model deployment',
          also: 'Skilled at AI-assisted development, with hands-on experience deploying a model on-device and wiring up the real-time inference pipeline',
          note: 'Co-first author of a paper in the SCI journal Pattern Analysis and Applications, responsible for ablation study design, result analysis and manuscript writing',
          available: 'Available immediately, remote or Tianjin/Beijing area',
        },
        practices: [
          { title: 'Quadruped Robot Dog Multimodal Perception & Control System', role: 'System Definition & Integration', period: '2026/04 - 2026/07', desc: '9th National Embedded Chip & System Design Competition (Chip Application Track) — National 3rd Prize. RDK X5 (BPU 10 TOPS) / stereo vision / MediaPipe / ROS2 / Python. System definition & integration: defined the gesture-to-action mapping rules (open palm / scissors / fist → forward / turn left / lie down) and a three-level motion priority (emergency avoidance > gesture > voice), and scoped the boundaries of the perception pipeline; Perception pipeline: used AI coding tools to deploy the stereo depth-estimation model on-device, integrate MediaPipe gesture recognition and the voice Q&A link, and get the real-time chain working: camera capture → BPU inference → depth map → region judgement → control command; Command safety layer: designed multi-frame confirmation and command filtering against accidental gesture triggers (a hand sweeping past used to fire a command), reducing false actions; Technical documentation: wrote and organised the competition technical report (solution rationale, system architecture, test data).' },
          { title: 'XiaoZhi AI & MCP Multi-device Smart Butler System', role: 'Independent Development', period: '2025/03 - 2025/12', desc: 'Tianjin "New Engineering" Engineering Practice Innovation Competition — Undergraduate Group 1st Prize | China College Student Service Outsourcing Innovation & Entrepreneurship Competition — National 3rd Prize. HarmonyOS Hi3861 + JLC ESP32-S3 / XiaoZhi AI / self-built MCP server (Python) / Huawei Cloud IoT. Board & cloud platform: developed and debugged peripherals (RGB LED / buzzer / fan) on HarmonyOS Hi3861 and integrated sensor data acquisition for temperature-humidity, PIR and light sensors; set up products, devices and thing-model properties on Huawei Cloud IoT and reported device status and sensor data over MQTT; Device-cloud voice chain: deployed the XiaoZhi AI firmware on ESP32-S3 and built a Python MCP server exposing device data reads and control commands, connecting a cloud LLM for intent recognition and tool calling to close the loop: voice input → intent understanding → tool execution → device response → result feedback; Multi-device control: unified cross-device control interface supporting status queries and on/off control for lights, fans, buzzers and more.' },
          { title: 'FPGA-based Edge Intelligent Vision Terminal', role: 'System Integration & Documentation', period: '2025/09 - 2025/12', desc: '8th National Embedded Chip & System Design Competition, FPGA Track — National 3rd Prize. The project hardware-accelerates edge detection, image filtering and HSV colour recognition on an Anlu HX4S20 FPGA, with a multi-stage pipeline supporting 640×480@30fps real-time processing; I took part in system integration and documentation, able to read Verilog FSM logic and got the edge-detection function working by following the tutorials.' },
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
          { award: 'World Vocational College Skills Competition · AI Track · National Finals Bronze Award', date: '2026/09', emoji: '🥉' },
          { award: '9th National Embedded Chip & System Design Competition · Chip Application Track · National 3rd Prize', date: '2026/08', emoji: '🥉' },
          { award: '8th National Embedded Chip & System Design Competition · FPGA Track · National 3rd Prize', date: '2025/12', emoji: '🥉' },
          { award: 'China College Student Service Outsourcing Innovation & Entrepreneurship Competition · National 3rd Prize', date: '2025/08', emoji: '🥉' },
          { award: 'Tianjin "New Engineering" Engineering Practice Innovation Competition · Provincial 1st Prize', date: '2025/12', emoji: '🥇' },
        ],
        education: {
          school: 'Tiangong University',
          major: 'Electronic Information Engineering',
          period: '2023/09 - 2027/06',
          courses: 'Embedded System Design Innovation Practice 93 | C Programming 91 | AVR Microcontroller Programming & Practice 95 | Sensors & Detection Technology 88',
        },
        cert: {
          title: 'Embedded System Design Engineer (Entry Level)',
          issuer: 'Chinese Institute of Electronics · Professional Certificate',
          date: '2026.08',
          viewHint: 'View Certificate',
        },
        selfEval: 'Undergraduate in Electronic Information Engineering, focused on embodied intelligence and on-device AI deployment. Experienced in deploying a stereo depth-estimation model on-board and getting the real-time inference pipeline working, and able to independently complete 4-layer PCB design, fabrication and hardware troubleshooting; I use AI coding tools as my main development method and am good at system architecture and module decomposition. I prefer evidence before action: when something breaks I locate the root cause with experiments and data rather than guessing. A fast self-learner with strong adaptability — from embedded competitions to robot perception I have picked everything up by digging through the material myself — and I hold a long-term view of and commitment to embodied intelligence.',
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
        techStack: '専門スキル',
        awardsTitle: '受賞歴',
        intentTitle: '就職希望',
        practiceTitle: 'プロジェクト経験',
        internshipTitle: 'インターンシップ',
        academicTitle: '学術成果',
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
        skillDetails: [
          { label: 'ロボティクス・エッジ配備', content: 'RDK X5（BPU 10 TOPS）へのボード側配備とリアルタイム推論経路の構築；双目深度推定モデルの配備と応用；ROS2（プロジェクトでの使用）' },
          { label: '組み込み・ハードウェア', content: 'ESP32-S3 / 鴻蒙 Hi3861 のボード側ペリフェラル開発とセンサーデータ収集；嘉立創 EDA による四層基板の設計・試作（点灯確認済み）；Verilog ロジックの読解が可能' },
          { label: '開発言語', content: 'C（主力、プロジェクトコードを一通り自身で記述）、Python（スクリプト・プロトタイプ開発）、Rust（学習中）' },
          { label: 'クラウド・プロトコル', content: 'Huawei Cloud IoT（製品 / デバイス / 物模型の構築、MQTT 送信）、MQTT、RTSP ストリーミング、MCP サーバー（大規模モデルのツール呼び出し）' },
          { label: 'ツール・実作業', content: 'Codex / Trae / Claude などの AI コーディングツールを多用してシステム統合とデバッグを実施；0402 / QFP パッケージのはんだ付けが熟練、テスターを用いたハードウェア切り分けが可能' },
        ],
        internships: [
          { company: '智嘉人工智能科技（天津）有限責任会社', role: 'ハードウェア開発エンジニア（インターン）', period: '2026.09 - 現在', desc: '通信経路の構築：車輪型ロボットの複数通信経路（メッセージキュー / HTTP / リアルタイム姿勢 / 映像ストリーム）を整理し、自社開発の上位アプリで再利用、地図読み込み・ルート管理・リアルタイム状態表示を実現；機能統合：ルート実行、ウェイポイントイベントの編成、音声アナウンス、定時巡回を接続し、複数タスクの相互排他と残留タスクのクリアを実装；フロントエンド／バックエンド開発：Next.js + Python サブプロセスでコンソールと運用パネルを実装（権限チェック、監査ログ、データバックアップを含む）。' },
        ],
        academic: [
          { title: 'CATSANet テキストtoイメージ人物再識別', role: '共同第一著者', period: '2026/08', link: 'https://link.springer.com/article/10.1007/s10044-026-01761-5', linkLabel: '論文', desc: '共同第一著者として SCI ジャーナル Pattern Analysis and Applications（2026, 29:176）に掲載、研究方向はテキストtoイメージ人物再識別；消融実験とパラメータ調整を担当：PyTorch / CLIP 環境で複数案の比較実験を行い、パラメータ調整・モデル学習・消融実験の比較を補助し、実験データの整理と結果分析を担当；方針検討とアイデア提案に参加し、文献調査と一部章の執筆を担当。' },
        ],
        intent: {
          primary: '組み込みソフトウェア/ハードウェア開発 · 具現化知能インターン',
          direction: '組み込み開発の流れ、四層 PCB の設計から基板製造・はんだ付けまで、双目ステレオビジョンとエッジ側モデル配備',
          also: 'AI ツールを活用した開発を得意とし、モデルのエッジ側配備とリアルタイム推論経路の構築に実績あり',
          note: 'SCI ジャーナル Pattern Analysis and Applications に共第一著者として論文発表、消融実験の設計・結果分析・論文執筆を担当',
          available: 'すぐに勤務可能、リモートまたは天津/北京エリア',
        },
        practices: [
          { title: '四足ロボットドッグのマルチモーダル知覚・制御システム', role: 'システム定義・統合', period: '2026/04 - 2026/07', desc: '第9回全国組み込みチップ・システム設計大会（チップ応用トラック）— 国家級三等賞。RDK X5（BPU 10 TOPS）/ 双目ステレオビジョン / MediaPipe / ROS2 / Python。システム定義・統合：ジェスチャー—動作のマッピング規則（五指開き / チョキ / グー → 前進 / 左折 / 伏せ）と三段階の運動優先度（緊急障害回避 > ジェスチャー > 音声）を定義し、知覚パイプラインの機能境界を切り分け；知覚パイプライン構築：AI コーディングツールを活用して双目深度推定モデルの端側配備、MediaPipe ジェスチャー認識、音声 Q&A リンクの統合・デバッグを行い、「カメラ取り込み → BPU 推論 → 深度マップ → 領域判定 → 制御指令」のリアルタイム経路を開通；指令安全層：ジェスチャーの誤作動（手が横切っただけで反応）に対して多フレーム確認と指令フィルタ機構を設計し、誤動作を低減；技術文書：競技技術報告書の執筆と整理（方案論証、システムアーキテクチャ、テストデータ）を担当。' },
          { title: '小智 AI と MCP によるマルチデバイス・スマートバトラーシステム', role: '独立開発', period: '2025/03 - 2025/12', desc: '天津市「新工科」工程実践創新技術大会 — 学部生部門一等賞｜中国大学生サービス外包イノベーション・起業大会 — 国家級三等賞。鴻蒙 Hi3861 + 嘉立創 ESP32-S3 / 小智 AI / 自前 MCP サーバー（Python）/ Huawei Cloud IoT。ボード側とクラウド：鴻蒙 Hi3861 で RGB ライト・ブザー・ファンのペリフェラルドライバをデバッグし、温湿度・人感赤外・照度などのセンサーデータ収集を接続；Huawei Cloud IoT で製品・デバイス構築と物模型属性の定義を行い、MQTT でデバイス状態とセンサーデータを送信；端雲音声チェーン：ESP32-S3 に小智 AI ファームウェアを配備し、自前 MCP サーバー（Python）でデバイスデータ読み取りと制御指令送信をラップ、クラウド大規模モデルに接続して意図認識とツール呼び出しを実現し、「音声入力 → 意図理解 → ツール実行 → デバイス応答 → 結果返送」の閉ループを構築；マルチデバイス制御：デバイス横断の統合制御インターフェースを用意し、ライト・ファン・ブザーなどの状態照会とオンオフ制御に対応。' },
          { title: 'FPGA ベースのエッジインテリジェントビジョン端末', role: 'システム連調・ドキュメント整理', period: '2025/09 - 2025/12', desc: '第8回全国組み込みチップ・システム設計大会 FPGA トラック — 国家級三等賞。本プロジェクトは安路 HX4S20 FPGA でエッジ検出・画像フィルタリング・HSV 色彩認識のハードウェア高速化を実現し、多段パイプラインで 640×480@30fps のリアルタイム処理をサポート。本人はシステム連調とドキュメント整理を担当し、Verilog のステートマシンロジックを読解でき、チュートリアルに沿ってエッジ検出機能を動作させた。' },
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
          { award: '世界職業院校技能大会 · 人工知能トラック · 決勝戦銅賞', date: '2026/09', emoji: '🥉' },
          { award: '第9回全国組み込みチップ・システム設計大会 · チップ応用トラック · 国家級三等賞', date: '2026/08', emoji: '🥉' },
          { award: '第8回全国組み込みチップ・システム設計大会 · FPGA トラック · 国家級三等賞', date: '2025/12', emoji: '🥉' },
          { award: '中国大学生サービス外包イノベーション・起業大会 · 国家級三等賞', date: '2025/08', emoji: '🥉' },
          { award: '天津市「新工科」工程実践創新技術大会 · 省部級一等賞', date: '2025/12', emoji: '🥇' },
        ],
        education: {
          school: '天津工業大学',
          major: '電子情報工学',
          period: '2023/09 - 2027/06',
          courses: '組み込みシステム設計創新実践 93 ｜ C 言語プログラミング 91 ｜ AVR マイコン プログラミングと実践 95 ｜ センサー・検出技術 88',
        },
        cert: {
          title: '組込みシステム設計エンジニア（初級）',
          issuer: '中国電子学会 · 専門技術証明書',
          date: '2026.08',
          viewHint: '証明書を見る',
        },
        selfEval: '電子情報工学の学部生で、具現化知能とエッジ側 AI 配備に注力。双目深度推定モデルのボード側配備とリアルタイム推論経路の構築経験を持ち、四層基板の設計・試作・ハードウェア切り分けまで独力で対応可能；AI コーディングツールを主要な開発手段とし、システムアーキテクチャ設計とモジュール分割を得意とする。物事はまず証拠を取ってから動く習慣があり、問題が起きたら勘で推測せず実験とデータで真因を突き止める；自学と適応力が高く、組み込み競技からロボット知覚まで自分で資料を探して身につけてきた。具現化知能に対して長期的な見立てと投資意欲を持つ。',
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
        techStack: '专业技能',
        awardsTitle: '荣誉奖项',
        intentTitle: '求职意向',
        practiceTitle: '项目经历',
        internshipTitle: '实习经历',
        academicTitle: '学术成果',
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
        skillDetails: [
          { label: '机器人与端侧部署', content: 'RDK X5（BPU 10 TOPS）板端部署与实时推理链路打通；双目深度估计模型部署与应用；ROS2（项目使用）' },
          { label: '嵌入式与硬件', content: 'ESP32-S3 / 鸿蒙 Hi3861 板端外设开发与传感器数据采集；嘉立创 EDA 四层板设计与打样（已点亮）；能读懂 Verilog 逻辑' },
          { label: '开发语言', content: 'C（主力，手写过完整项目代码）、Python（脚本与原型开发）、Rust（学习中）' },
          { label: '云与协议', content: '华为云 IoT（产品 / 设备 / 物模型建设、MQTT 上报）、MQTT、RTSP 拉流、MCP 服务端（大模型工具调用）' },
          { label: '工程工具与动手', content: '重度使用 Codex / Trae / Claude 等 AI 编程工具完成系统集成与调试；熟练焊接 0402 / QFP 封装，具备万用表级硬件排障能力' },
        ],
        internships: [
          { company: '智嘉人工智能科技（天津）有限责任公司', role: '硬件开发工程师（实习）', period: '2026.09 - 至今', desc: '通信链路打通：梳理轮式机器人多路通信链路（消息队列 / HTTP / 实时位姿 / 视频流）并在自研上位机中复用，实现地图加载、路线管理与实时状态显示；功能集成：接入路线执行、点位事件编排、语音播报与定时巡检，实现多路任务互斥与残留任务清理；前后端开发：基于 Next.js + Python 子进程实现控制台与运维面板，含权限校验、审计日志与数据备份。' },
        ],
        academic: [
          { title: 'CATSANet 文本到图像行人重识别', role: '共同第一作者', period: '2026/08', link: 'https://link.springer.com/article/10.1007/s10044-026-01761-5', linkLabel: '查看论文', desc: '共同第一作者，发表于 SCI 期刊 Pattern Analysis and Applications（2026, 29:176），研究方向为文本到图像行人重识别；负责消融实验与参数调优：基于 PyTorch / CLIP 环境完成多组方案对比实验，辅助参数调优、模型训练与消融实验对比，并整理实验数据、分析实验结果；参与方案讨论与思路提出，负责文献调研与部分章节撰写。' },
        ],
        intent: {
          primary: '嵌入式软硬件开发 / 端侧 AI 部署方向实习',
          direction: '熟悉嵌入式系统开发流程，具备四层 PCB 设计、打样与焊接能力，掌握双目立体视觉与端侧模型部署',
          also: '善用主流 AI 工具辅助开发，具备模型端侧部署与实时推理链路打通的实战经验',
          note: '以共同第一作者在 SCI 期刊 Pattern Analysis and Applications 发表论文一篇，负责消融实验设计、结果分析与论文撰写',
          available: '随时到岗，接受远程或天津/北京地区',
        },
        practices: [
          { title: '四足机器狗多模态感知与控制系统', role: '系统定义与集成', period: '2026/04 - 2026/07', desc: '第九届全国大学生嵌入式芯片与系统设计竞赛（芯片应用赛道）· 国家级三等奖。RDK X5（BPU 10 TOPS）/ 双目立体视觉 / MediaPipe / ROS2 / Python。系统定义与集成：定义手势—动作映射规则（五指张开 / 剪刀手 / 拳头 → 直行 / 左转 / 趴下）与三级运动优先级（紧急避障 > 手势 > 语音），划分感知链路的功能边界；感知链路搭建：借助 AI 编程工具完成双目深度估计模型的端侧部署、MediaPipe 手势识别与语音问答链路的集成调试，打通「摄像头取流 → BPU 推理 → 深度图 → 区域判定 → 控制指令」的实时链路；指令安全层：针对手势误触发（手部划过即响应）设计多帧确认与指令过滤机制，降低误动作；技术文档：负责竞赛技术报告的撰写与整理（方案论证、系统架构、测试数据）。' },
          { title: '基于小智 AI 与 MCP 的多设备智能管家系统', role: '独立开发', period: '2025/03 - 2025/12', desc: '天津市"新工科"工程实践创新技术竞赛 · 本科组一等奖｜中国大学生服务外包创新创业大赛 · 国家级三等奖。鸿蒙 Hi3861 + 嘉立创 ESP32-S3 / 小智 AI / 自建 MCP 服务端（Python）/ 华为云 IoT。板端与云平台：基于鸿蒙 Hi3861 完成 RGB 灯光、蜂鸣器、风扇的外设驱动调试，接入温湿度、人体红外、光照等传感器数据采集；在华为云 IoT 完成产品与设备建设、物模型属性定义，通过 MQTT 上报设备状态与传感器数据；端云语音链路：在 ESP32-S3 上部署小智 AI 固件，自建 MCP 服务端（Python）封装设备数据读取与控制指令下发，接入云端大模型完成意图识别与工具调用，实现「语音输入 → 意图理解 → 工具执行 → 设备响应 → 结果回传」闭环；多设备控制：统一跨设备控制接口，支持灯光、风扇、蜂鸣器等设备的状态查询与开关控制。' },
          { title: '基于 FPGA 的边缘智能视觉终端', role: '系统联调与文档整理', period: '2025/09 - 2025/12', desc: '第八届全国大学生嵌入式芯片与系统设计竞赛 FPGA 创新设计赛道 · 国家级三等奖。项目基于安路 HX4S20 FPGA 实现边缘检测、图像滤波、HSV 色彩识别算法硬件加速，多级流水线支持 640×480@30fps 实时处理；本人参与系统联调与文档整理，能读懂 Verilog 状态机逻辑，配合教程调通边缘检测功能。' },
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
          { award: '世界职业院校技能大赛 · 人工智能赛道 · 总决赛争夺赛铜奖', date: '2026/09', emoji: '🥉' },
          { award: '第九届全国大学生嵌入式芯片与系统设计竞赛 · 芯片应用赛道 · 国家级三等奖', date: '2026/08', emoji: '🥉' },
          { award: '第八届全国大学生嵌入式芯片与系统设计竞赛 · FPGA 创新设计赛道 · 国家级三等奖', date: '2025/12', emoji: '🥉' },
          { award: '中国大学生服务外包创新创业大赛 · 国家级三等奖', date: '2025/08', emoji: '🥉' },
          { award: '天津市"新工科"工程实践创新技术竞赛 · 省级一等奖', date: '2025/12', emoji: '🥇' },
        ],
        education: {
          school: '天津工业大学',
          major: '电子信息工程',
          period: '2023/09 - 2027/06',
          courses: '嵌入式系统设计创新实践 93 ｜ C 语言程序设计 91 ｜ AVR 单片机程序设计与实践 95 ｜ 传感器与检测技术 88',
        },
        cert: {
          title: '嵌入式系统设计工程师（初级）',
          issuer: '中国电子学会 · 专业技术证书',
          date: '2026.08',
          viewHint: '查看证书',
        },
        selfEval: '电子信息工程本科，专注具身智能与端侧 AI 部署。具备双目深度估计模型的板端部署与实时推理链路打通经验，能独立完成四层板设计、打样与硬件排障；以 AI 编程工具为主要开发手段，擅长系统架构设计与模块划分。做事习惯先取证再动手，遇到问题先用实验和数据定位真因而不是凭感觉猜；自学与适应能力强，从嵌入式竞赛到机器人感知都是自己找资料啃下来的，对具身智能有长期判断与投入意愿。',
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

                {/* Detailed skill lines */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border space-y-2 sm:space-y-2.5">
                  {r.skillDetails.map((s, idx) => (
                    <div key={idx}>
                      <p className="text-[11px] sm:text-xs text-[var(--neon-violet)] font-medium mb-0.5">{s.label}</p>
                      <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed">{s.content}</p>
                    </div>
                  ))}
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

              {/* Internship */}
              <div className="bg-card backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--neon-lime)]" />
                  {r.internshipTitle}
                </h2>
                <div className="space-y-2 sm:space-y-4">
                  {r.internships.map((it, idx) => (
                    <div key={idx} className="rounded-lg sm:rounded-xl p-3 sm:p-5 border border-white/5" style={{ background: 'color-mix(in oklab, var(--neon-lime) 7%, var(--card))' }}>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <h3 className="text-foreground font-semibold text-xs sm:text-sm">{it.company}</h3>
                        <span className="px-1.5 sm:px-2 py-0.5 bg-[color-mix(in_oklab,var(--neon-lime)_20%,transparent)] text-[var(--neon-lime)] rounded text-[11px] sm:text-xs border border-[color-mix(in_oklab,var(--neon-lime)_30%,transparent)]">
                          {it.role}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px] sm:text-xs mb-1 sm:mb-1.5">{it.period}</p>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{it.desc}</p>
                    </div>
                  ))}
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

              {/* Academic */}
              <div className="bg-card backdrop-blur-xl border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--neon-cyan)]" />
                  {r.academicTitle}
                </h2>
                <div className="space-y-2 sm:space-y-4">
                  {r.academic.map((a, idx) => (
                    <div key={idx} className="rounded-lg sm:rounded-xl p-3 sm:p-5 border border-white/5" style={{ background: 'color-mix(in oklab, var(--neon-cyan) 7%, var(--card))' }}>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <h3 className="text-foreground font-semibold text-xs sm:text-sm">{a.title}</h3>
                        <span className="px-1.5 sm:px-2 py-0.5 bg-[color-mix(in_oklab,var(--neon-cyan)_20%,transparent)] text-[var(--neon-cyan)] rounded text-[11px] sm:text-xs border border-[color-mix(in_oklab,var(--neon-cyan)_30%,transparent)]">
                          {a.role}
                        </span>
                        {a.link && (
                          <a
                            href={a.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-[color-mix(in_oklab,var(--neon-violet)_20%,transparent)] text-[var(--neon-violet)] rounded text-[11px] sm:text-xs border border-[color-mix(in_oklab,var(--neon-violet)_30%,transparent)] transition-colors"
                          >
                            <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            {a.linkLabel}
                          </a>
                        )}
                      </div>
                      <p className="text-muted-foreground text-[11px] sm:text-xs mb-1 sm:mb-1.5">{a.period}</p>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{a.desc}</p>
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
