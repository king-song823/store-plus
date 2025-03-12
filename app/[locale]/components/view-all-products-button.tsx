'use client';

import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { useRouter } from '@/i18n/navigation';

const ViewAllProductsButton = () => {
  const router = useRouter();
  const c = useTranslations('Common');

  return (
    <div className="flex justify-center items-center my-8">
      <Button
        onClick={() => router.push(`/search`)}
        className="px-8 py-4 text-lg font-semibold"
      >
        {c('View_All_Products')}
      </Button>
    </div>
  );
};

export default ViewAllProductsButton;
