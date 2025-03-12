'use client';

import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
const links = [
  { key: 'Overview', href: '/admin/overview' },
  { key: 'Products', href: '/admin/products' },
  { key: 'Orders', href: '/admin/orders' },
  { key: 'Users', href: '/admin/users' },
];
export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const c = useTranslations('Admin');

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname.includes(item.href) ? '' : 'text-muted-foreground'
          )}
        >
          {c(item.key)}
        </Link>
      ))}
    </nav>
  );
}
