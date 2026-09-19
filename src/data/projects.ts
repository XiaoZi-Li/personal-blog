// GitHub 项目扩展信息（中文描述、技术亮点等）
// ⚠️ key 必须与 GitHub 仓库名逐字一致 —— projects 页是按 repo.name 查表的，
// 对不上的 key 不会报错，只是静默失效（回落到仓库自身的 description）。
export const projectDescriptions: Record<string, {
  description: string;
  highlights: string[];
  status?: string;
}> = {
  'robot-dog': {
    description:
      '基于 RDK X5 + ROS2 的四足机器狗端侧具身智能项目：双目立体视觉、BPU 端侧推理与运动控制跑在同一块板子上',
    highlights: [
      'RDK X5（BPU 10 TOPS）端侧部署双目深度模型',
      '三区域占比判定 + 方向性避障状态机',
      'MediaPipe 手势控制，多帧确认防抖、手势消失即停',
      'USB 摄像头单进程复用（手势 / 障碍语义 / VLM 问答）',
      '指令安全层（斜坡平滑 / 限幅 / 超时保护 / 动作锁）与三级优先级仲裁',
    ],
    status: '已完成',
  },
  'esp32s3-smart-rover': {
    description:
      '基于 ESP32-S3 + FreeRTOS 的多传感器智能小车，集成离线语音识别、摄像头目标检测、超声波自主避障与 MQTT 端云数据同步',
    highlights: [
      'ESP-SR 离线语音识别',
      'OV2640 摄像头图像采集与目标检测',
      '超声波自主避障',
      'MQTT 上报云端，设备数据同步',
    ],
    status: '维护中',
  },
  'personal-blog': {
    description:
      '基于 Next.js + TypeScript + Supabase 的个人站点：简历页、项目展示、留言墙与用户认证',
    highlights: [
      'Next.js App Router + TypeScript',
      'Supabase 数据库与用户认证',
      '留言墙 / 项目讨论 / 通知中心',
      '响应式布局，暗色模式与 SEO 优化',
    ],
    status: '维护中',
  },
  'RDK-Test': {
    description:
      'RDK X5 板端测试与验证工程，记录端侧环境搭建与推理链路的调试过程',
    highlights: [
      'RDK X5 端侧环境搭建',
      'Python 脚本与链路调试记录',
    ],
    status: '维护中',
  },
  'Remote-control-car-51-': {
    description:
      '基于 51 单片机的遥控小车，从寄存器与定时器层面实现电机驱动与无线遥控',
    highlights: [
      '51 单片机寄存器级开发',
      '电机驱动与无线遥控',
      '定时器 / 中断实践',
    ],
    status: '已完成',
  },
  'study': {
    description:
      '学习笔记与代码仓库，收录嵌入式开发、算法实现与常用工具脚本',
    highlights: [
      '嵌入式 C/C++ 开发笔记',
      '机器学习算法实现',
      '常用工具与脚本集合',
    ],
    status: '维护中',
  },
};
