'use client';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from './[locale]/components/ui/button';

const NotFoundPage = () => {
  const t = useTranslations('Not_Found');
  return (
    <div className="flex flex-col items-center  justify-center min-h-screen">
      <Image
        src="/images/logo.webp"
        width={48}
        height={48}
        className="rounded"
        alt={`${APP_NAME} logo`}
        priority={true}
      />
      <div className="p-6 w-1/4 rounded-lg shadow-md  text-center">
        <h1 className="text-3xl font-bold mb-4 ">{t('Title')}</h1>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={() => (window.location.href = '/')}
        >
          {t('Button')}
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
