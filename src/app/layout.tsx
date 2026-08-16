import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: {
    default: '李俊杰 | 个人博客 - 嵌入式开发工程师',
    template: '%s | 李俊杰',
  },
  description:
    '天津工业大学电子信息工程专业大三学生李俊杰，专注于嵌入式开发、Rust语言、AI工程化。拥有多项国家级/省级竞赛获奖经历。',
  keywords: [
    '李俊杰',
    'XiaoZi-Li',
    '天津工业大学',
    '电子信息工程',
    '嵌入式开发',
    'Rust',
    'ESP32',
    'MCP',
    'RAG',
    'FPGA',
  ],
  authors: [{ name: '李俊杰', url: 'https://github.com/XiaoZi-Li' }],
  openGraph: {
    title: '李俊杰 | 嵌入式开发工程师 - 具身智能技术',
    description:
      '电子信息工程专业大三学生，聚焦嵌入式开发与具身智能交叉领域，具备"硬件-软件-算法-AI"的综合技术视角。获得多项国家级竞赛奖项。',
    type: 'website',
    url: process.env.COZE_PROJECT_DOMAIN_DEFAULT 
      ? `https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}` 
      : 'https://zenithfall.top',
    siteName: '李俊杰的个人博客',
    images: [
      {
        url: process.env.COZE_PROJECT_DOMAIN_DEFAULT 
          ? `https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}/og-image.jpg`
          : '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '李俊杰 - 嵌入式开发工程师',
      },
    ],
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '李俊杰 | 嵌入式开发工程师',
    description:
      '电子信息工程专业大三学生，聚焦嵌入式开发与具身智能交叉领域',
    images: process.env.COZE_PROJECT_DOMAIN_DEFAULT 
      ? [`https://${process.env.COZE_PROJECT_DOMAIN_DEFAULT}/og-image.jpg`]
      : ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://zenithfall.top'),
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
        <Providers>
          {isDev && <Inspector />}
          <Navigation />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
