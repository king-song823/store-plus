'use client';

import { Button } from '@/app/[locale]/components/ui/button';

const PageLink = ({ url }: { url: string }) => {
  const handleLink = () => {
    window.open(url, '_blank');
  };
  return (
    <Button size="sm" onClick={handleLink}>
      预览
    </Button>
  );
};

export default PageLink;
