import { EllipsisVertical, ShoppingCart } from 'lucide-react';
import { Button } from '@/app/[locale]/components/ui/button';
import UserButton from './user-button';
import Search from './search';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/app/[locale]/components/ui/sheet';
import ModeToggle from '../model-toggle';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
const Menu = async () => {
  const t = await getTranslations('Common');
  return (
    <>
      <div className="flex justify-end gap-3">
        <nav className="md:flex hidden w-full max-w-xs gap-1">
          <ModeToggle />
          <Button asChild variant="ghost">
            <Link href="/cart" locale="zh">
              <ShoppingCart />
              {t('Carts')}
            </Link>
          </Button>
          <UserButton />
        </nav>
        <nav className="md:hidden">
          <Sheet>
            <SheetTrigger className="align-middle">
              <EllipsisVertical />
            </SheetTrigger>
            <SheetContent className="flex flex-col items-start">
              <div className="mt-10">
                <Search />
              </div>
              <SheetTitle>{t('Menu')}</SheetTitle>
              <ModeToggle />
              <Button asChild variant="ghost">
                <Link href="/cart">
                  <ShoppingCart />
                  {t('Carts')}
                </Link>
              </Button>
              <UserButton />
              {/* <Button asChild>
                <Link href="/sign-in">
                  <UserIcon />
                  Sign In
                </Link>
              </Button> */}
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
};

export default Menu;
