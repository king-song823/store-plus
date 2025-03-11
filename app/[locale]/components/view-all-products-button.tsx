'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const ViewAllProductsButton = () => {
  const router = useRouter();
  const c = useTranslations('Common');
  const locale = useLocale();

  return (
    <div className="flex justify-center items-center my-8">
      <Button
        onClick={() => router.push(`/${locale}/search`)}
        className="px-8 py-4 text-lg font-semibold"
      >
        {c('View_All_Products')}
      </Button>
    </div>
  );
};

export default ViewAllProductsButton;
