'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh-CN' | 'en-US' | 'ja-JP';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Record<Language, any>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh-CN');

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'zh-CN' || saved === 'en-US' || saved === 'ja-JP')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation data
const translations = {
  'zh-CN': {
    // Navigation
    nav: {
      home: '首页',
      projects: '项目',
      messages: '留言',
      resume: '简历',
      admin: '管理后台',
      settings: '设置',
      notifications: '通知',
      login: '登录',
      register: '注册',
      logout: '退出登录',
      github: 'GitHub',
      adminRole: '管理员',
      userRole: '用户',
    },
    // Language
    language: {
      switch: '切换语言',
      zh: '中文',
      en: 'English',
      ja: '日本語'
    },
    // Home Page
    home: {
      greeting: '你好，我是',
      name: '李俊杰',
      subtitle: '嵌入式开发 / Rust学习者 / 具身智能热爱者',
      about: '关于我',
      aboutContent: '电子信息工程专业大四学生，对嵌入式软硬件开发和具身智能方向充满热情。目前还在不断学习中，借助AI工具完成了一些项目实践，希望能在实习中快速成长，也期待与各位技术同好交流切磋。',
      contact: '联系方式',
      skills: '技术栈',
      projects: '项目经历',
      honors: '荣誉奖项',
      github: 'GitHub',
      email: '邮箱',
      university: '天津工业大学',
      major: '电子信息工程',
      grade: '大四',
      // Skills
      skillLevels: {
        core: '有所实践',
        familiar: '了解使用',
        learning: '正在学习'
      },
      skillCategories: {
        programming: '编程语言',
        hardware: '硬件平台',
        ai: 'AI工具链'
      },
      // 自我评价
      evaluations: {
        embodiedLove: '热爱具身智能',
        embodiedLoveDesc: '对具身智能领域充满热情，坚信AI与硬件结合是未来方向，渴望在此方向深耕',
        embeddedPassion: '嵌入式热爱',
        embeddedPassionDesc: '热爱嵌入式软硬件开发，从底层驱动到上层应用，享受从零构建的成就感',
        rustEnthusiast: 'Rust爱好者',
        rustEnthusiastDesc: '对Rust语言充满热爱，相信它在嵌入式和系统编程中的潜力，正在持续学习',
        humbleLearner: '谦逊学习者',
        humbleLearnerDesc: '善用 AI 工具提升开发效率，深知学无止境，保持虚心求索的态度',
        teamWork: '团队协作',
        teamWorkDesc: '积极沟通协作，相信团队力量大于个人',
        aiAssisted: 'AI辅助实践',
        aiAssistedDesc: '借助AI辅助完成MCP、AI Agent等项目开发，善于利用工具提升效率',
      },
      // 求职与交流
      career: {
        title: '求职与交流',
        heading: '期待与你的连接',
        internship: '寻找实习机会',
        internshipDesc: '正在寻找具身智能方向的暑期实习机会，希望在真实项目中成长，为团队贡献价值。拥有竞赛经验和项目实践，虽然技术尚浅，但充满学习热情和行动力。',
        community: '技术交流',
        communityDesc: '欢迎各位开发者和技术爱好者一起交流学习！无论是嵌入式、Rust、具身智能还是其他技术方向，都期待与志同道合的朋友共同进步、互相启发。',
        goToResume: '查看完整简历',
        goToForum: '进入技术交流区',
      },
      // 专业领域
      specialties: ['嵌入式系统', '物联网', '图像处理', '深度学习', 'PCB设计', 'AI Agent', 'FPGA', '边缘计算', 'Rust'],
      // 统计
      stats: {
        totalAwards: '总计获奖',
        certification: '职业认证',
        projects: '项目经历'
      },
      research: {
        badge: '论文发表',
        title: '科研经历',
        paper: 'CATSANet —— 跨模态行人重识别',
        period: '2024.12 - 2026.02',
        role: '共同第一作者',
        status: 'SCI 已录用',
        journal: 'Pattern Analysis and Applications',
        desc: '论文被 SCI 期刊 Pattern Analysis and Applications 录用，代码已开源。提出跨模态语义 Token 选择模块与基于 Sinkhorn 最优传输的部件对齐损失（PACL），构建 PyTorch/CLIP 全流程训练评估管线，消融实验验证对检索精度的提升。'
      },
      resume: {
        title: '个人简历与求职意向',
        subtitle: '实践驱动成长，热爱铸就方向',
        objective: {
          label: '求职意向',
          position: '嵌入式软硬件开发 / 具身智能方向实习',
          available: '随时到岗，可全职实习',
          location: '接受远程或天津/北京地区',
        },
        highlights: {
          label: '核心实践亮点',
          rdk: 'RDK X5 具身智能开发',
          rdkDesc: '基于 RDK X5 开发板与 dora-rs 框架，完成机器人感知-决策-控制一体化系统开发，涵盖视觉感知、运动规划、语音交互和多传感器融合',
          esp32: 'ESP32 全栈开发实践',
          esp32Desc: '基于 ESP32 构建 MCP 智能控制系统，实现 AI 模型与硬件设备的高效交互，具备 Wi-Fi/Bluetooth 通信和传感器集成经验',
          rust: 'Rust 嵌入式探索',
          rustDesc: '正在学习 Rust 在嵌入式领域的应用，关注嵌入式 Rust 生态（embassy、esp-rs），追求安全可靠的系统级编程',
          pcb: 'PCB 绘制能力',
          pcbDesc: '具备 PCB 电路板绘制能力，能完成原理图设计、布局布线和打样验证全流程',
          stm32: 'STM32 开发经验',
          stm32Desc: '使用过 STM32 进行嵌入式开发，了解 HAL 库和中断机制，但更倾向于 ESP32 + Rust 技术路线',
        },
        passion: {
          label: '技术热情',
          embodied: '具身智能',
          embodiedDesc: '坚信具身智能是 AI 落地物理世界的最佳路径，渴望参与将智能算法与硬件深度融合的项目',
          embedded: '嵌入式软硬件',
          embeddedDesc: '享受从底层硬件到上层应用的全链路开发过程，追求软硬件协同设计的优雅方案',
          rustLang: 'Rust 语言',
          rustLangDesc: '被 Rust 的内存安全和零成本抽象所吸引，正在将 Rust 引入嵌入式开发实践',
        },
        attitude: {
          label: '工作态度',
          item1: '快速学习：面对新技术能够迅速上手，在项目中边学边做',
          item2: '团队协作：新工科竞赛担任队长，擅长沟通协调和任务分配',
          item3: '务实落地：每个项目都追求从想法到可运行原型的完整闭环',
          item4: '持续精进：保持对前沿技术的关注，每日技术学习和实践',
        }
      }
    },
    // Skills
    skills: {
      cpp: 'C/C++',
      python: 'Python',
      verilog: 'Verilog',
      rust: 'Rust',
      cangjie: '仓颉',
      fpga: 'FPGA',
      esp32: 'ESP32',
      stm32: 'STM32',
      harmony: '鸿蒙Hi3861',
      mcp: 'MCP协议',
      aiSkills: 'AI Agent'
    },
    // Competitions
    competitions: {
      title: '竞赛经历',
      member: '队员',
      captain: '队长',
      award: {
        national: '国家级',
        provincial: '省级',
        provincialTop: '省部级',
        first: '一等奖',
        second: '二等奖',
        third: '三等奖'
      },
      // Competition 0 (新工科)
      comp0: {
        title: '天津第八届大学生信息技术"新工科"工程实践创新技术竞赛',
        award: '省部级一等奖',
        date: '2025年6月',
        track: '智能系统赛道',
        detail1: '基于小智AI与MCP协议开发多设备智能管家系统',
        detail2: '担任队长，负责系统架构设计与核心功能开发'
      },
      // Competition 1 (第九届 机器狗)
      comp1: {
        title: '全国大学生嵌入式芯片与系统设计竞赛（第九届）',
        award: '全国总决赛三等奖',
        date: '2026年7月',
        track: '芯片应用赛道',
        detail1: '基于RDK X5（BPU 10 TOPS）+ ROS2开发机器狗双目深度避障、MediaPipe手势控制与三级优先级运动仲裁器',
        detail2: '负责感知与运动控制系统开发，完成步态参数整定与系统集成调试'
      },
      // Competition 2 (第八届 FPGA)
      comp2: {
        title: '全国大学生嵌入式芯片与系统设计竞赛（第八届）',
        award: '决赛三等奖',
        date: '2025年12月',
        track: 'FPGA创新设计赛道',
        detail1: '基于安路HX4S20 FPGA实现边缘检测、图像滤波、HSV色彩识别硬件加速，多级流水线支持640×480@30fps实时处理',
        detail2: '负责核心逻辑设计、时序约束与资源优化，解决多时钟域信号跨域传输的亚稳态问题'
      },
      // Competition 3 (服务外包)
      comp3: {
        title: '中国大学生服务外包创新创业大赛',
        award: '国家级三等奖',
        date: '2025年6月',
        track: '智能家居物联网',
        detail1: '基于鸿蒙Hi3861开发智能家居传感器数据采集与无线通信系统，适配低功耗场景需求',
        detail2: '完成设备间通信协议适配，解决信号稳定性问题'
      }
    },
    // Projects
    projects: {
      title: '项目展示',
      description: '以下是我的一些开源项目和个人项目',
      noRepos: '暂无公开项目',
      viewDetails: '查看详情',
      viewGithub: '查看 GitHub',
      stars: 'Stars',
      status: {
        completed: '已完成',
        ongoing: '持续迭代'
      },
      // Project 1
      project1: {
        title: 'ReID行人重识别科研项目',
        period: '2024.12 - 2026.02',
        role: '共同第一作者',
        description: '论文CATSANet已被SCI期刊Pattern Analysis and Applications录用，代码已开源；参与提出跨模态语义Token选择模块与基于最优传输的部件对齐损失',
        tags: ['深度学习', '跨模态检索', 'PyTorch']
      },
      // Project 2
      project2: {
        title: '四足机器狗感知与运动控制系统',
        period: '2026.04 - 2026.07',
        role: '感知与运动控制开发',
        description: '基于RDK X5与ROS2开发双目深度避障、手势控制与三级优先级运动仲裁器，获全国总决赛三等奖',
        tags: ['具身智能', 'ROS2', 'RDK X5']
      },
      // Project 3
      project3: {
        title: '个人博客网站',
        period: '2026.02 - 至今',
        role: '核心成员',
        description: '基于Next.js + TypeScript + Supabase构建的个人博客网站',
        tags: ['Next.js', 'TypeScript', 'Supabase']
      }
    },
    // Messages
    messages: {
      title: '留言墙',
      subtitle: '有什么想说的？给我留言吧！',
      leaveMessage: '给我留言',
      postMessage: '发表留言',
      placeholder: '写下你的留言...',
      replyPlaceholder: '写下你的回复...',
      send: '发送',
      submit: '发送留言',
      reply: '回复',
      delete: '删除',
      cancel: '取消',
      noMessages: '暂无留言，快来留言吧！',
      pinned: '置顶',
      blogger: '博主',
      replyTo: '回复',
      loadMore: '加载更多',
      anonymous: '匿名用户',
      loading: '加载中...',
      loadFailed: '加载失败',
      loadFailedDesc: '无法加载留言',
      sendFailed: '发送失败',
      networkError: '网络错误',
      sendSuccess: '发送成功',
      sendSuccessDesc: '留言已发布',
      replySuccess: '回复成功',
      replySuccessDesc: '回复已发布',
      page: '第',
      pageOf: '页',
      prevPage: '上一页',
      nextPage: '下一页',
    },
    // Auth
    auth: {
      loginTitle: '登录',
      login: '登录',
      loginBtn: '登录',
      loginDesc: '登录您的账号以使用更多功能',
      registerTitle: '注册账号',
      register: '注册',
      registerBtn: '注册',
      registerDesc: '注册后可以在留言墙留言',
      email: '邮箱',
      emailPlaceholder: '请输入邮箱（登录凭证）',
      password: '密码',
      passwordPlaceholder: '请输入密码（至少6位）',
      confirmPassword: '确认密码',
      confirmPasswordPlaceholder: '请再次输入密码',
      username: '昵称',
      nicknamePlaceholder: '显示的昵称（可选）',
      captcha: '验证码',
      captchaHint: '请计算：',
      captchaPlaceholder: '请输入答案',
      submit: '提交',
      noAccount: '还没有账号？',
      hasAccount: '已有账号？',
      goToRegister: '立即注册',
      goToLogin: '立即登录',
      loggingIn: '登录中...',
      registering: '注册中...',
      loadingCaptcha: '加载中...',
      invalidCredentials: '请检查邮箱和密码',
      emailExists: '该邮箱已被注册',
      registerSuccess: '注册成功',
      registerSuccessDesc: '请使用邮箱登录',
      loginSuccess: '登录成功',
      loginFailed: '登录失败',
      registerFailed: '注册失败',
      captchaError: '验证码错误',
      passwordMismatch: '两次输入的密码不一致',
      passwordTooShort: '密码长度至少6位',
      networkError: '网络错误，请稍后重试',
      captchaRequired: '请先获取验证码',
      captchaFetchFailed: '获取验证码失败',
      refreshPage: '请刷新页面重试',
      tryAgain: '请稍后重试',
    },
    // Admin
    admin: {
      title: '管理后台',
      dashboard: '仪表盘',
      users: '用户管理',
      messages: '留言管理',
      stats: '统计数据',
      totalUsers: '总用户数',
      totalMessages: '总留言数',
      todayViews: '今日访问',
      deleteUser: '删除用户',
      deleteMessage: '删除留言',
      confirmDelete: '确认删除',
      cancel: '取消'
    },
    // Settings
    settings: {
      title: '个人设置',
      profile: '个人资料',
      avatar: '头像',
      nickname: '昵称',
      updateProfile: '更新资料',
      changePassword: '修改密码',
      oldPassword: '原密码',
      newPassword: '新密码',
      confirmPassword: '确认密码',
      updateSuccess: '更新成功'
    },
    // Common
    common: {
      loading: '加载中...',
      error: '出错了',
      success: '成功',
      cancel: '取消',
      confirm: '确认',
      delete: '删除',
      edit: '编辑',
      save: '保存',
      search: '搜索',
      close: '关闭',
      submit: '提交',
      back: '返回',
      more: '更多',
      viewAll: '查看全部',
      share: '分享',
      copy: '复制',
      copySuccess: '已复制到剪贴板',
      required: '必填项',
      optional: '选填'
    }
  },
  'en-US': {
    // Navigation
    nav: {
      home: 'Home',
      projects: 'Projects',
      messages: 'Messages',
      resume: 'Resume',
      admin: 'Admin',
      settings: 'Settings',
      notifications: 'Notifications',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      github: 'GitHub',
      adminRole: 'Admin',
      userRole: 'User',
    },
    // Language
    language: {
      switch: 'Switch Language',
      zh: '中文',
      en: 'English',
      ja: '日本語'
    },
    // Home Page
    home: {
      greeting: 'Hi, I\'m',
      name: 'Li Junjie',
      subtitle: 'Embedded Developer / Rust Learner / Embodied AI Enthusiast',
      about: 'About Me',
      aboutContent: 'Senior student in Electronic Information Engineering. Passionate about embedded hardware/software development and embodied AI. Still learning and growing — I\'ve completed projects with AI assistance, and I\'m looking for an internship to level up. Always happy to connect and learn from fellow developers.',
      contact: 'Contact',
      skills: 'Tech Stack',
      projects: 'Projects',
      honors: 'Honors',
      github: 'GitHub',
      email: 'Email',
      university: 'Tianjin Polytechnic University',
      major: 'Electronic Information Engineering',
      grade: 'Senior',
      // Skills
      skillLevels: {
        core: 'Practiced',
        familiar: 'Used Before',
        learning: 'Currently Learning'
      },
      skillCategories: {
        programming: 'Programming Languages',
        hardware: 'Hardware Platforms',
        ai: 'AI Toolchain'
      },
      // Self Evaluations
      evaluations: {
        embodiedLove: 'Love Embodied AI',
        embodiedLoveDesc: 'Passionate about embodied intelligence, believing AI + hardware is the future, eager to dive deep',
        embeddedPassion: 'Embedded Passion',
        embeddedPassionDesc: 'Love embedded HW/SW development, from low-level drivers to applications, enjoy building from scratch',
        rustEnthusiast: 'Rust Enthusiast',
        rustEnthusiastDesc: 'Deeply passionate about Rust, believing in its potential for embedded and systems programming',
        humbleLearner: 'Humble Learner',
        humbleLearnerDesc: 'Skilled at leveraging AI tools to boost efficiency, while staying humble and eager to keep growing',
        teamWork: 'Teamwork',
        teamWorkDesc: 'Active communicator and collaborator, believing team power exceeds individuals',
        aiAssisted: 'AI-Assisted Practice',
        aiAssistedDesc: 'Completed MCP, AI Agent projects with AI-assisted development, skilled at leveraging tools',
      },
      // Career & Community
      career: {
        title: 'Career & Community',
        heading: 'Looking Forward to Connecting',
        internship: 'Seeking Internship',
        internshipDesc: 'Looking for a summer internship in embodied AI. Eager to grow in real projects and contribute value. Have competition experience and hands-on practice — while skills are still developing, full of learning passion and drive.',
        community: 'Tech Exchange',
        communityDesc: 'Welcome all developers and tech enthusiasts to exchange and learn together! Whether it\'s embedded, Rust, embodied AI or other directions, looking forward to growing together with like-minded friends.',
        goToResume: 'View Full Resume',
        goToForum: 'Enter Tech Forum',
      },
      // Resume page
      resume: {
        title: 'Resume & Job Intentions',
        subtitle: 'Practice-Driven Developer | Embedded & Embodied AI',
        intentTitle: 'Job Intentions',
        intentPosition: 'Position: Embedded Software Engineer / Embodied AI Engineer',
        intentDirection: 'Direction: ESP32 + Rust development, RDK X5 embodied intelligence, AI Agent application',
        intentAlso: 'Also Consider: PCB design, hardware development',
        intentNote: 'Note: Have used STM32 but not preferred direction',
        intentAvailability: 'Availability: Immediately available for internship',
        practiceTitle: 'Practice Highlights',
        practices: [
          { title: 'RDK X5 Embodied Intelligence System', desc: 'Built perception-decision-control integrated system with dora-rs framework on RDK X5 board, implementing multi-sensor fusion and robot control' },
          { title: 'ESP32 + MCP Smart Control System', desc: 'Developed AI-hardware interaction system using MCP protocol, enabling AI model to directly control ESP32 devices' },
          { title: 'FPGA Image Processing', desc: 'Hardware-accelerated image edge detection and filtering algorithms using Verilog on FPGA platform' },
          { title: 'HarmonyOS IoT Development', desc: 'Built smart home sensor data collection and wireless communication modules on HarmonyOS Hi3861' },
        ],
        passionTitle: 'What Drives Me',
        passions: ['Love for embodied intelligence - bridging AI and the physical world', 'Passion for Rust - pursuing safe and efficient systems programming', 'Enthusiasm for embedded hardware-software co-design', 'Desire to learn and grow with a team of talented engineers'],
        contactTitle: 'Let\'s Connect',
      },
      // Specialties
      specialties: ['Embedded Systems', 'IoT', 'Image Processing', 'Deep Learning', 'PCB Design', 'AI Agent', 'FPGA', 'Edge Computing', 'Rust'],
      // Stats
      stats: {
        totalAwards: 'Total Awards',
        certification: 'Certifications',
        projects: 'Projects'
      },
      research: {
        badge: 'Publication',
        title: 'Research Experience',
        paper: 'CATSANet — Cross-modal Person Re-identification',
        period: '2024.12 - 2026.02',
        role: 'Co-first Author',
        status: 'SCI Accepted',
        journal: 'Pattern Analysis and Applications',
        desc: 'Paper accepted by SCI journal Pattern Analysis and Applications, code open-sourced. Proposed a cross-modal semantic token selection module and a Sinkhorn optimal-transport part alignment loss (PACL), built the full PyTorch/CLIP training and evaluation pipeline, with retrieval gains validated by ablation studies.'
      },
    },
    // Skills
    skills: {
      cpp: 'C/C++',
      python: 'Python',
      verilog: 'Verilog',
      rust: 'Rust',
      cangjie: 'Cangjie',
      fpga: 'FPGA',
      esp32: 'ESP32',
      stm32: 'STM32',
      harmony: 'HarmonyOS Hi3861',
      mcp: 'MCP Protocol',
      aiSkills: 'AI Agent'
    },
    // Competitions
    competitions: {
      title: 'Competitions',
      member: 'Member',
      captain: 'Captain',
      award: {
        national: 'National',
        provincial: 'Provincial',
        provincialTop: 'Provincial-Ministerial',
        first: 'First Prize',
        second: 'Second Prize',
        third: 'Third Prize'
      },
      // Competition 0 (新工科)
      comp0: {
        title: 'Tianjin 8th College Student Information Technology "New Engineering" Practice Innovation Competition',
        award: 'Provincial-Ministerial First Prize',
        date: 'June 2025',
        track: 'Intelligent Systems Track',
        detail1: 'Developed multi-device smart home system based on Xiaozhi AI and MCP protocol',
        detail2: 'Served as team captain, responsible for system architecture design and core functionality development'
      },
      // Competition 1 (9th, Robot Dog)
      comp1: {
        title: 'National College Student Embedded Chip and System Design Competition (9th)',
        award: 'National Final Third Prize',
        date: 'July 2026',
        track: 'Chip Application Track',
        detail1: 'Developed stereo depth obstacle avoidance, MediaPipe gesture control and 3-level priority motion arbiter for a quadruped robot dog on RDK X5 (BPU 10 TOPS) + ROS2',
        detail2: 'Responsible for perception and motion control system development, completed gait parameter tuning and system integration'
      },
      // Competition 2 (8th, FPGA)
      comp2: {
        title: 'National College Student Embedded Chip and System Design Competition (8th)',
        award: 'Final Third Prize',
        date: 'December 2025',
        track: 'FPGA Innovation Design Track',
        detail1: 'Hardware acceleration of edge detection, image filtering and HSV color recognition on Anlu HX4S20 FPGA, multi-stage pipeline supporting 640×480@30fps real-time processing',
        detail2: 'Responsible for core logic design, timing constraints and resource optimization, resolved multi-clock-domain metastability issues'
      },
      // Competition 3 (Service Outsourcing)
      comp3: {
        title: 'China College Student Service Outsourcing Innovation Competition',
        award: 'National 3rd Prize',
        date: 'June 2025',
        track: 'Smart Home IoT',
        detail1: 'Smart home sensor data acquisition & wireless communication system based on HarmonyOS Hi3861, adapted for low-power scenarios',
        detail2: 'Completed device protocol adaptation, solved signal stability issues'
      }
    },
    // Projects
    projects: {
      title: 'Projects',
      description: 'Here are some of my open source and personal projects',
      noRepos: 'No public repos yet',
      viewDetails: 'View Details',
      viewGithub: 'View GitHub',
      stars: 'Stars',
      status: {
        completed: 'Completed',
        ongoing: 'Ongoing'
      },
      // Project 1
      project1: {
        title: 'ReID Person Re-identification Research Project',
        period: '2024.12 - 2026.02',
        role: 'Co-first Author',
        description: 'Paper CATSANet accepted by SCI journal Pattern Analysis and Applications, code open-sourced; co-proposed cross-modal semantic token selection module and optimal-transport part alignment loss',
        tags: ['Deep Learning', 'Cross-modal Retrieval', 'PyTorch']
      },
      // Project 2
      project2: {
        title: 'Quadruped Robot Dog Perception & Motion Control System',
        period: '2026.04 - 2026.07',
        role: 'Perception & Motion Control Developer',
        description: 'Developed stereo depth obstacle avoidance, gesture control and motion arbiter on RDK X5 + ROS2, won National Final Third Prize',
        tags: ['Embodied Intelligence', 'ROS2', 'RDK X5']
      },
      // Project 3
      project3: {
        title: 'Personal Blog Website',
        period: '2026.02 - Present',
        role: 'Core Member',
        description: 'Personal blog website built with Next.js + TypeScript + Supabase',
        tags: ['Next.js', 'TypeScript', 'Supabase']
      }
    },
    // Messages
    messages: {
      title: 'Message Wall',
      subtitle: 'What would you like to say? Leave me a message!',
      leaveMessage: 'Leave a Message',
      postMessage: 'Post Message',
      placeholder: 'Write your message...',
      replyPlaceholder: 'Write your reply...',
      send: 'Send',
      submit: 'Submit',
      reply: 'Reply',
      delete: 'Delete',
      cancel: 'Cancel',
      noMessages: 'No messages yet, be the first to leave one!',
      pinned: 'Pinned',
      blogger: 'Blogger',
      replyTo: 'Reply to',
      loadMore: 'Load More',
      anonymous: 'Anonymous',
      loading: 'Loading...',
      loadFailed: 'Load Failed',
      loadFailedDesc: 'Unable to load messages',
      sendFailed: 'Send Failed',
      networkError: 'Network Error',
      sendSuccess: 'Sent Successfully',
      sendSuccessDesc: 'Message has been published',
      replySuccess: 'Reply Sent',
      replySuccessDesc: 'Reply has been published',
      page: 'Page',
      pageOf: 'of',
      prevPage: 'Previous',
      nextPage: 'Next',
    },
    // Auth
    auth: {
      loginTitle: 'Login',
      login: 'Login',
      loginBtn: 'Login',
      loginDesc: 'Log in to your account to access more features',
      registerTitle: 'Register',
      register: 'Register',
      registerBtn: 'Register',
      registerDesc: 'Register to leave messages on the message wall',
      email: 'Email',
      emailPlaceholder: 'Enter your email (login credential)',
      password: 'Password',
      passwordPlaceholder: 'Enter your password (at least 6 characters)',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Enter password again',
      username: 'Nickname',
      nicknamePlaceholder: 'Display nickname (optional)',
      captcha: 'Captcha',
      captchaHint: 'Calculate: ',
      captchaPlaceholder: 'Enter the answer',
      submit: 'Submit',
      noAccount: 'Don\'t have an account?',
      hasAccount: 'Already have an account?',
      goToRegister: 'Register Now',
      goToLogin: 'Login Now',
      loggingIn: 'Logging in...',
      registering: 'Registering...',
      loadingCaptcha: 'Loading...',
      invalidCredentials: 'Invalid email or password',
      emailExists: 'This email is already registered',
      registerSuccess: 'Registration successful',
      registerSuccessDesc: 'Please login with your email',
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      registerFailed: 'Registration failed',
      captchaError: 'Invalid captcha',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      networkError: 'Network error, please try again later',
      captchaRequired: 'Please get the captcha first',
      captchaFetchFailed: 'Failed to fetch captcha',
      refreshPage: 'Please refresh the page and try again',
      tryAgain: 'Please try again later',
    },
    // Admin
    admin: {
      title: 'Admin Dashboard',
      dashboard: 'Dashboard',
      users: 'Users',
      messages: 'Messages',
      stats: 'Statistics',
      totalUsers: 'Total Users',
      totalMessages: 'Total Messages',
      todayViews: 'Today\'s Views',
      deleteUser: 'Delete User',
      deleteMessage: 'Delete Message',
      confirmDelete: 'Confirm Delete',
      cancel: 'Cancel'
    },
    // Settings
    settings: {
      title: 'Settings',
      profile: 'Profile',
      avatar: 'Avatar',
      nickname: 'Nickname',
      updateProfile: 'Update Profile',
      changePassword: 'Change Password',
      oldPassword: 'Old Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      updateSuccess: 'Update Successful'
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      search: 'Search',
      close: 'Close',
      submit: 'Submit',
      back: 'Back',
      more: 'More',
      viewAll: 'View All',
      share: 'Share',
      copy: 'Copy',
      copySuccess: 'Copied to clipboard',
      required: 'Required',
      optional: 'Optional'
    }
  },
  'ja-JP': {
    // Navigation
    nav: {
      home: 'ホーム',
      projects: 'プロジェクト',
      messages: 'メッセージ',
      admin: '管理ダッシュボード',
      settings: '設定',
      notifications: '通知',
      login: 'ログイン',
      register: '登録',
      logout: 'ログアウト',
      github: 'GitHub',
      resume: '履歴書',
      adminRole: '管理者',
      userRole: 'ユーザー',
    },
    // Language
    language: {
      switch: '言語切り替え',
      zh: '中国語',
      en: 'English',
      ja: '日本語'
    },
    // Home Page
    home: {
      greeting: 'こんにちは、私は',
      name: '李俊杰（Li Junjie）',
      subtitle: '組込み開発者 / Rust学習者 / 具身AI愛好家',
      about: '私について',
      aboutContent: '電子情報工学専攻の4年生です。組込みハードウェア・ソフトウェア開発と具身AIに情熱を持っています。まだ学びの途中で、AIの支援を受けながらプロジェクトを完成させました。インターンシップで成長したいと考えています。同じ志を持つ開発者との交流も歓迎します。',
      contact: '連絡先',
      skills: 'スキル',
      projects: 'プロジェクト',
      honors: '栄誉賞',
      github: 'GitHub',
      email: 'メール',
      university: '天津工業大学',
      major: '電子情報工学',
      grade: '4年生',
      // Skills
      skillLevels: {
        core: '実践経験あり',
        familiar: '使用経験あり',
        learning: '現在学習中'
      },
      skillCategories: {
        programming: 'プログラミング言語',
        hardware: 'ハードウェアプラットフォーム',
        ai: 'AIツールチェーン'
      },
      // Self Evaluations
      evaluations: {
        embodiedLove: '具身AIへの情熱',
        embodiedLoveDesc: '具身知能に深い情熱を持ち、AI+ハードウェアが未来だと信じ、深く探求したい',
        embeddedPassion: '組込みへの情熱',
        embeddedPassionDesc: '組込みHW/SW開発を愛し、低レイヤからアプリまで、ゼロから構築する楽しさを知る',
        rustEnthusiast: 'Rust愛好家',
        rustEnthusiastDesc: 'Rustに深い情熱を持ち、組込みとシステムプログラミングでの可能性を信じる',
        humbleLearner: '謙虚な学習者',
        humbleLearnerDesc: 'AI ツールを活用して開発効率を高めつつ、学びは終わらないと謙虚に探究し続ける',
        teamWork: 'チームワーク',
        teamWorkDesc: '積極的なコミュニケーションと協力を重視し、チームの力は個人を超えると信じる',
        aiAssisted: 'AI支援実践',
        aiAssistedDesc: 'MCP、AIエージェントプロジェクトをAI支援で完了、ツールを活用する能力を持つ',
      },
      // Career & Community
      career: {
        title: 'キャリア＆コミュニティ',
        heading: 'つながりを大切に',
        internship: 'インターンシップ募集中',
        internshipDesc: '具身AI分野のサマーインターンを探しています。実プロジェクトで成長し、価値を貢献したい。コンテスト経験と実践的な取り組みがあり、技術力はまだ伸びしろがありますが、学ぶ情熱と原動力に溢れています。',
        community: '技術交流',
        communityDesc: 'すべての開発者や技術愛好家との交流を歓迎します！組込み、Rust、具身AIなどの分野を問わず、志を同じくする仲間と一緒に成長できることを楽しみにしています。',
        goToResume: '履歴書を見る',
        goToForum: '技術フォーラムへ',
      },
      // Resume page
      resume: {
        title: '履歴書・就職意向',
        subtitle: '実践重視の開発者｜組込み＆具身AI',
        intentTitle: '就職意向',
        intentPosition: '志望職種：組込みソフトウェアエンジニア／具身AIエンジニア',
        intentDirection: '方向：ESP32 + Rust開発、RDK X5具身知能、AI Agent応用',
        intentAlso: 'その他：PCB設計、ハードウェア開発も検討可能',
        intentNote: '補足：STM32の使用経験はありますが、主な志望方向ではありません',
        intentAvailability: '勤務可能：インターン即日可能',
        practiceTitle: '実践ハイライト',
        practices: [
          { title: 'RDK X5 具身知能システム', desc: 'RDK X5ボードとdora-rsフレームワークで知覚・意思決定・制御統合システムを構築し、マルチセンサフュージョンとロボット制御を実現' },
          { title: 'ESP32 + MCP スマート制御システム', desc: 'MCPプロトコルでAIとハードウェアの連携システムを開発し、AIモデルによるESP32デバイスの直接制御を実現' },
          { title: 'FPGA画像処理', desc: 'VerilogでFPGA上にハードウェア高速化のエッジ検出・フィルタリングアルゴリズムを実装' },
          { title: 'HarmonyOS IoT開発', desc: 'HarmonyOS Hi3861でスマートホームセンサーデータ収集と無線通信モジュールを構築' },
        ],
        passionTitle: '私の原動力',
        passions: ['具身知能への愛 - AIと物理世界の架け橋', 'Rustへの情熱 - 安全で効率的なシステムプログラミング', '組込みハードウェア・ソフトウェア協調設計への熱意', '優秀なエンジニアチームと学び成長したい欲求'],
        contactTitle: 'お問い合わせ',
      },
      // Specialties
      specialties: ['組込みシステム', 'IoT', '画像処理', 'ディープラーニング', 'PCB設計', 'AIエージェント', 'FPGA', 'エッジコンピューティング', 'Rust'],
      // Stats
      stats: {
        totalAwards: '総受賞数',
        certification: '職業認定',
        projects: 'プロジェクト'
      },
      research: {
        badge: '論文発表',
        title: '研究経歴',
        paper: 'CATSANet — クロスモーダル歩行者再識別',
        period: '2024.12 - 2026.02',
        role: '共第一著者',
        status: 'SCI 採録済み',
        journal: 'Pattern Analysis and Applications',
        desc: '論文が SCI ジャーナル Pattern Analysis and Applications に採録、コード公開済み。クロスモーダル意味トークン選択モジュールと Sinkhorn 最適輸送に基づく部位整合損失（PACL）を提案、PyTorch/CLIP による訓練・評価パイプラインを構築、消融実験で検索精度の向上を検証。'
      },
    },
    // Skills
    skills: {
      cpp: 'C/C++',
      python: 'Python',
      verilog: 'Verilog',
      rust: 'Rust',
      cangjie: '倉頡言語',
      fpga: 'FPGA',
      esp32: 'ESP32',
      stm32: 'STM32',
      harmony: '鴻蒙Hi3861',
      mcp: 'MCPプロトコル',
      aiSkills: 'AI Skills',
    },
    // Competitions
    competitions: {
      title: 'コンテスト経歴',
      member: 'メンバー',
      captain: 'キャプテン',
      award: {
        national: '国家級',
        provincial: '省級',
        provincialTop: '省部級',
        first: '一等賞',
        second: '二等賞',
        third: '三等賞'
      },
      // Competition 0 (新工科)
      comp0: {
        title: '天津第八回大学生情報技術「新工科」エンジニアリング実践イノベーションコンテスト',
        award: '省部級一等賞',
        date: '2025年6月',
        track: 'インテリジェントシステムトラック',
        detail1: '小智AIとMCPプロトコルに基づくマルチデバイス智能管家システムを担当',
        detail2: 'キャプテンとして、システムアーキテクチャ設計とコア機能開発を担当'
      },
      // Competition 1 (第9回 ロボットドッグ)
      comp1: {
        title: '全国大学生組込みチップ・システム設計コンテスト（第9回）',
        award: '全国決勝三等賞',
        date: '2026年7月',
        track: 'チップ応用トラック',
        detail1: 'RDK X5（BPU 10 TOPS）+ ROS2 で四足ロボットドッグの双目深度障害回避、MediaPipe ジェスチャー制御、3段優先度運動アービタを開発',
        detail2: '知覚・運動制御システム開発を担当、歩容パラメータ調整とシステム統合デバッグを完了'
      },
      // Competition 2 (第8回 FPGA)
      comp2: {
        title: '全国大学生組込みチップ・システム設計コンテスト（第8回）',
        award: '決勝三等賞',
        date: '2025年12月',
        track: 'FPGAイノベーション設計トラック',
        detail1: '安路 HX4S20 FPGA でエッジ検出・画像フィルタ・HSV色彩認識のハードウェア高速化を実現、多段パイプラインで 640×480@30fps リアルタイム処理をサポート',
        detail2: 'コアロジック設計、タイミング制約とリソース最適化を担当、マルチクロックドメインのメタスタビリティ問題を解決'
      },
      // Competition 3 (サービス外包)
      comp3: {
        title: '中国大学生サービス外包イノベーション大会',
        award: '国家級三等賞',
        date: '2025年6月',
        track: 'スマートホームIoT',
        detail1: '鴻蒙Hi3861ベースのスマートホームセンサーデータ収集・無線通信システム、低電力シーンに適応',
        detail2: 'デバイス間通信プロトコルアダプトを完了、信号安定性問題を解決'
      }
    },
    // Projects
    projects: {
      title: 'プロジェクト',
      description: '以下は私のオープンソースプロジェクトと個人プロジェクトです',
      noRepos: '公開プロジェクトはまだありません',
      viewDetails: '詳細を見る',
      viewGithub: 'GitHubで見る',
      stars: 'Stars',
      status: {
        completed: '完了',
        ongoing: '継続中'
      },
      // Project 1
      project1: {
        title: 'ReID歩行者再識別研究プロジェクト',
        period: '2024.12 - 2026.02',
        role: '共第一著者',
        description: '論文 CATSANet が SCI ジャーナル Pattern Analysis and Applications に採録、コード公開済み；クロスモーダル意味トークン選択モジュールと最適輸送部位整合損失を共同提案',
        tags: ['ディープラーニング', 'クロスモーダル検索', 'PyTorch']
      },
      // Project 2
      project2: {
        title: '四足ロボットドッグ知覚・運動制御システム',
        period: '2026.04 - 2026.07',
        role: '知覚・運動制御開発',
        description: 'RDK X5 + ROS2 で双目深度障害回避、ジェスチャー制御、運動アービタを開発、全国決勝三等賞を受賞',
        tags: ['具現化知能', 'ROS2', 'RDK X5']
      },
      // Project 3
      project3: {
        title: '個人ブログウェブサイト',
        period: '2026.02 - 現在',
        role: 'コアメンバー',
        description: 'Next.js + TypeScript + Supabaseで構築した個人ブログウェブサイト',
        tags: ['Next.js', 'TypeScript', 'Supabase']
      }
    },
    // Messages
    messages: {
      title: 'メッセージボード',
      subtitle: '何か言いたいことはありますか？メッセージを残してください！',
      leaveMessage: 'メッセージを残す',
      postMessage: 'メッセージを投稿',
      placeholder: 'メッセージを書く...',
      replyPlaceholder: '返信を書く...',
      send: '送信',
      submit: '送信',
      reply: '返信',
      delete: '削除',
      cancel: 'キャンセル',
      noMessages: 'まだメッセージがありません、最初のメッセージを残してください！',
      pinned: 'ピン留め',
      blogger: 'ブロガー',
      replyTo: '返信',
      loadMore: 'さらに読み込む',
      anonymous: '匿名ユーザー',
      loading: '読み込み中...',
      loadFailed: '読み込み失敗',
      loadFailedDesc: 'メッセージを読み込めません',
      sendFailed: '送信失敗',
      networkError: 'ネットワークエラー',
      sendSuccess: '送信成功',
      sendSuccessDesc: 'メッセージが公開されました',
      replySuccess: '返信送信成功',
      replySuccessDesc: '返信が公開されました',
      page: 'ページ',
      pageOf: '/',
      prevPage: '前へ',
      nextPage: '次へ',
    },
    // Auth
    auth: {
      loginTitle: 'ログイン',
      login: 'ログイン',
      loginBtn: 'ログイン',
      loginDesc: 'アカウントにログインして更多機能にアクセス',
      registerTitle: '登録',
      register: '登録',
      registerBtn: '登録',
      registerDesc: '新規アカウントを作成',
      email: 'メール',
      emailPlaceholder: 'メールアドレスを入力',
      password: 'パスワード',
      passwordPlaceholder: 'パスワードを入力（最低6文字）',
      confirmPassword: 'パスワード確認',
      confirmPasswordPlaceholder: 'パスワードを再入力',
      username: 'ニックネーム',
      nicknamePlaceholder: '表示名（オプション）',
      captcha: 'キャプチャ',
      captchaHint: '計算：',
      captchaPlaceholder: '答えを入力',
      submit: '送信',
      noAccount: 'アカウントをお持ちではありませんか？',
      hasAccount: '既にアカウントをお持ちですか？',
      goToRegister: '今すぐ登録',
      goToLogin: '今すぐログイン',
      loggingIn: 'ログイン中...',
      registering: '登録中...',
      loadingCaptcha: '読み込み中...',
      invalidCredentials: 'メールアドレスまたはパスワードが正しくありません',
      emailExists: 'このメールアドレスは既に登録されています',
      registerSuccess: '登録成功',
      registerSuccessDesc: 'メールでログインしてください',
      loginSuccess: 'ログイン成功',
      loginFailed: 'ログイン失敗',
      registerFailed: '登録失敗',
      captchaError: 'キャプチャが正しくありません',
      passwordMismatch: 'パスワードが一致しません',
      passwordTooShort: 'パスワードは最低6文字である必要があります',
      networkError: 'ネットワークエラー、後でもう一度お試しください',
      captchaRequired: 'まずキャプチャを取得してください',
      captchaFetchFailed: 'キャプチャ取得失敗',
      refreshPage: 'ページを更新して再試行してください',
      tryAgain: '後でもう一度お試しください',
    },
    // Admin
    admin: {
      title: '管理ダッシュボード',
      dashboard: 'ダッシュボード',
      users: 'ユーザー管理',
      messages: 'メッセージ管理',
      stats: '統計データ',
      totalUsers: '総ユーザー数',
      totalMessages: '総メッセージ数',
      todayViews: '今日の閲覧',
      deleteUser: 'ユーザー削除',
      deleteMessage: 'メッセージ削除',
      confirmDelete: '削除確認',
      cancel: 'キャンセル'
    },
    // Settings
    settings: {
      title: '設定',
      profile: 'プロフィール',
      avatar: 'アバター',
      nickname: 'ニックネーム',
      updateProfile: 'プロフィール更新',
      changePassword: 'パスワード変更',
      oldPassword: '現在のパスワード',
      newPassword: '新しいパスワード',
      confirmPassword: 'パスワード確認',
      updateSuccess: '更新成功'
    },
    // Common
    common: {
      home: 'ホーム',
      back: '戻る',
      more: '詳細を見る',
      view: '表示',
      search: '検索',
      loading: '読み込み中...',
      save: '保存',
      cancel: 'キャンセル',
      confirm: '確認',
      edit: '編集',
      delete: '削除',
      submit: '送信',
      close: '閉じる',
      open: '開く',
      refresh: '更新',
      download: 'ダウンロード',
      upload: 'アップロード',
      send: '送信',
      reply: '返信',
      github: 'GitHub',
      viewProfile: 'プロフィール表示',
      projects: 'プロジェクト経歴',
      skills: 'スキル',
      competitions: 'コンテスト栄誉',
      contact: 'お問い合わせ',
      about: '私について',
      error: 'エラー',
      success: '成功',
      viewAll: 'すべて表示',
      share: '共有',
      copy: 'コピー',
      copySuccess: 'クリップボードにコピーしました',
      required: '必須',
      optional: 'オプション',
      noMessages: 'まだメッセージがありません'
    }
  }
};
