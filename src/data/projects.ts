// GitHub 项目扩展信息（中文描述、技术亮点等）
export const projectDescriptions: Record<string, {
  description: string;
  highlights: string[];
  status?: string;
}> = {
  'personal-blog': {
    description: '基于 Next.js + TypeScript + Supabase 的个人博客系统，支持项目展示、留言墙、用户认证等功能',
    highlights: [
      '使用 Next.js 16 + React 19 开发',
      '集成 Supabase 实现数据库和认证',
      '支持 Markdown 博客文章',
      '响应式设计，支持暗色模式',
      '内置访问统计和 SEO 优化',
    ],
    status: '已完成',
  },
  'study': {
    description: '学习笔记和代码仓库，包含嵌入式开发、FPGA 设计、算法实现等技术内容',
    highlights: [
      'FPGA Verilog 设计实例',
      '嵌入式 C/C++ 开发笔记',
      '机器学习算法实现',
      '常用工具和脚本集合',
    ],
    status: '维护中',
  },
  'ReID-Pedestrian-Reidentification': {
    description: '行人重识别科研项目，专注于行人特征提取和跨摄像头追踪算法',
    highlights: [
      '基于 PyTorch 深度学习框架',
      '实现多种 ReID 主干网络',
      '支持 Triplet Loss 和 Center Loss',
      '提供完整的数据预处理流程',
    ],
    status: '研究项目',
  },
  'mcp-esp32': {
    description: '基于 ESP32 的 MCP（Model Context Protocol）智能控制系统，实现 AI 模型与嵌入式设备的高效交互',
    highlights: [
      '实现 MCP 协议的嵌入式端',
      '支持多传感器数据采集',
      '边缘计算与 AI 模型联动',
      '低功耗设计',
    ],
    status: '已完成',
  },
};
