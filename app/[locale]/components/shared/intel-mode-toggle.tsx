'use client';

import { Button } from '@/app/[locale]/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/[locale]/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
const ModeToggle = () => {
  const locale = useLocale();
  const router = useRouter();

  const [language, setLanguage] = useState(locale);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Common');
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const handleLanguageChange = (lang: string) => {
    const segments = pathname.split('/');
    segments[1] = lang; // 修改语言部分
    const newPath = segments.join('/');
    router.push(newPath);
    router.refresh();
    setLanguage(lang);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            {language === 'en' ? (
              <span>🇺🇸 English (US)</span>
            ) : language === 'zh' ? (
              <span> 🇨🇳 中文</span>
            ) : (
              <Languages />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={language === 'en'}
            onClick={() => handleLanguageChange('en')}
          >
            {t('English')}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={language === 'zh'}
            onClick={() => handleLanguageChange('zh')}
          >
            {t('Chinese')}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ModeToggle;
