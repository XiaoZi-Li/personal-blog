import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CATSANet 科研复盘 | 李俊杰',
  description:
    'CATSANet 文本到图像行人重识别的实验执行、工程落地与成稿记录：复现基线、PACL 静默失效修复、融合模块对照实验与论文 Table 3 关键消融行。',
};

export default function CatsanetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
