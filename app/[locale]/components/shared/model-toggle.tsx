'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/app/[locale]/components/ui/button';
import { useTranslations } from 'next-intl';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/[locale]/components/ui/dropdown-menu';
import { MoonIcon, SunMoon, SunIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Common');
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            {theme === 'system' ? (
              <SunMoon />
            ) : theme === 'dark' ? (
              <MoonIcon />
            ) : (
              <SunIcon />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel> {t('Appearance')}</DropdownMenuLabel>
          <DropdownMenuSeparator></DropdownMenuSeparator>
          <DropdownMenuCheckboxItem
            checked={theme === 'system'}
            onClick={() => setTheme('system')}
          >
            {t('System_Theme')}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme === 'light'}
            onClick={() => setTheme('light')}
          >
            {t('Light_Theme')}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme === 'dark'}
            onClick={() => setTheme('dark')}
          >
            {t('Dark_Theme')}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ModeToggle;
