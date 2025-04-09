'use client';

import { Button } from '../ui/button';
import { formUrlQuery } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
const Pagination = ({
  page,
  totalPages,
  urlParamName,
}: {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
}) => {
  const router = useRouter();
  const c = useTranslations('Common');
  const searchParams = useSearchParams();
  // Handle Page Change
  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
      >
        {c('Previous')}
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
      >
        {c('Next')}
      </Button>
    </div>
  );
};

export default Pagination;
