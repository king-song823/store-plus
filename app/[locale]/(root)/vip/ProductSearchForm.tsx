/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Input } from '@/app/[locale]/components/ui/input';
import { Label } from '@/app/[locale]/components/ui/label';
import { Button } from '@/app/[locale]/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/[locale]/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { useTranslations } from 'next-intl';
import { ADMIN_ROlE, VIP_ROlE } from '@/lib/constants';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => String(currentYear - i));

export default function ProductSearchForm({
  categorise,
  role,
}: {
  categorise: any;
  role?: string;
}) {
  const searchParams = useSearchParams();
  const c = useTranslations('Common');
  const router = useRouter();

  const [year, setYear] = useState(searchParams.get('year') || '');
  const [name, setName] = useState(searchParams.get('name') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const [fileName, setFileName] = useState(searchParams.get('fileName') || '');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (year) params.set('year', year);
    if (name) params.set('name', name);
    if (fileName) params.set('fileName', fileName);
    if (category) params.set('category', category);

    router.push(`/vip?${params.toString()}`);
  };

  const handleReset = () => {
    setCategory('all');
    setName('');
    setFileName('');
    setYear('all');
    router.push(`/vip`);
  };

  return (
    <div className="flex flex-wrap gap-10 mb-4 items-end">
      <div className="flex flex-col space-y-1 gap-2">
        <Label>产品名称</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="支持模糊搜索"
          className="w-[200px]"
        />
      </div>
      <div className="flex flex-col space-y-1 gap-2">
        <Label>附件名称</Label>
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="支持模糊搜索"
          className="w-[200px]"
        />
      </div>
      <div className="flex flex-col space-y-1 gap-2">
        <Label className="space-y-2">{c('Year')}</Label>
        <Select value={year} onValueChange={(val) => setYear(val)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="全部" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col space-y-1 gap-2">
        <Label className="space-y-2">{c('Department')}</Label>
        <Select value={category} onValueChange={(val) => setCategory(val)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="全部" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            {categorise.map((y: any) => (
              <SelectItem key={y.category} value={y.category}>
                {y.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button
          disabled={role !== VIP_ROlE && role !== ADMIN_ROlE}
          onClick={handleSearch}
          className="h-10"
        >
          查询
        </Button>

        <Button
          disabled={role !== VIP_ROlE && role !== ADMIN_ROlE}
          onClick={handleReset}
        >
          重置
        </Button>
      </div>
    </div>
  );
}
