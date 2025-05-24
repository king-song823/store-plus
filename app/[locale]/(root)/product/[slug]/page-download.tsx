'use client';
import { useState } from 'react';
import { Button } from '@/app/[locale]/components/ui/button';
export default function DownloadButton({
  pdfUrl,
  pdfName,
}: {
  pdfUrl: string;
  pdfName: string;
}) {
  const [loading, setLoading] = useState(false);
  const handleDownload = async () => {
    try {
      setLoading(true);

      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = pdfName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
      // 你可以在这里提示 toast 等错误信息
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button onClick={handleDownload} disabled={loading} size="sm">
      {loading ? <>下载中...</> : '下载'}
    </Button>
  );
}
