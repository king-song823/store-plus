'use client';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import { Button } from '@/app/[locale]/components/ui/button';
import { formatError } from '@/lib/utils';
import { useTranslations } from 'next-intl';
const ErrorPage = ({ error }: { error: Error }) => {
  const t = useTranslations('Not_Found');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.webp"
        width={48}
        height={48}
        alt={`${APP_NAME} logo`}
        priority={true}
      />
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">{t('Error_Page')}</h1>
        <p className="text-destructive">{formatError(error)}</p>
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

export default ErrorPage;
