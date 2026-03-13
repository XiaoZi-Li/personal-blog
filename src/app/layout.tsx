import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: {
    default: '李俊杰 | 个人博客',
    template: '%s | 李俊杰',
  },
  description:
    '天津工业大学电子信息工程专业大三学生李俊杰，专注于嵌入式开发、Rust语言、RDK X5具身智能系统开发。',
  keywords: [
    '李俊杰',
    'XiaoZi-Li',
    '天津工业大学',
    '电子信息工程',
    '嵌入式开发',
    'Rust',
    'RDK X5',
    'dora-rs',
    '具身智能',
    'FPGA',
    'MCP',
  ],
  authors: [{ name: '李俊杰', url: 'https://github.com/XiaoZi-Li' }],
  openGraph: {
    title: '李俊杰 | 个人博客',
    description:
      '天津工业大学电子信息工程专业大三学生，专注于嵌入式开发与具身智能系统。',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        <Navigation />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
