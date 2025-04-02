'use client';

import { Button } from '@/app/[locale]/components/ui/button';

export default function DownloadButton({
  pdfUrl,
  pdfName,
}: {
  pdfUrl: string;
  pdfName: string;
}) {
  const handleDownload = async () => {
    const response = await fetch(pdfUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = pdfName; // 指定下载文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // 释放 URL
  };

  return <Button onClick={handleDownload}>下载</Button>;
}
