'use client';

import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function ResumeDownloadButton() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/resume.pdf');
      if (!response.ok) throw new Error('下载失败');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '李俊杰_简历.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
      // 降级方案：直接打开链接
      window.open('/resume.pdf', '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-70"
      >
        <Download className="w-4 h-4" />
        {isDownloading ? '下载中...' : '下载简历 PDF'}
      </Button>
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <FileText className="w-3 h-3" />
        <span>电子Z2301_2310910205_李俊杰.pdf</span>
      </div>
    </div>
  );
}
