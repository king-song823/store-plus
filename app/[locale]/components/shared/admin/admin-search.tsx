'use client';
import { Input } from '@/app/[locale]/components/ui/input';
import React, { useEffect, useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
const AdminSearch = () => {
  const pathname = usePathname();
  const formActionUrl = pathname.includes('/admin/orders')
    ? '/admin/orders'
    : pathname.includes('/admin/users')
      ? '/admin/users'
      : '/admin/products';
  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get('query') || '');
  const c = useTranslations('Common');

  useEffect(() => {
    setQueryValue(searchParams.get('query') || '');
  }, [searchParams]);
  return (
    <>
      <form action={formActionUrl} method="GET">
        <Input
          type="search"
          placeholder={c('Search_Loading')}
          name="query"
          value={queryValue}
          onChange={(e) => setQueryValue(e.target.value)}
          className="md-w-[100px] lg:w-[300px]"
        />
        <button type="submit" className="sr-only">
          {c('Search')}
        </button>
      </form>
    </>
  );
};

export default AdminSearch;
