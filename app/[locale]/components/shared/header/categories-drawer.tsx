import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/app/[locale]/components/ui/drawer';
import { getAllCategories } from '@/lib/actions/product.actions';
import { Button } from '@/app/[locale]/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

const CategoriesDrawer = async () => {
  const categories = await getAllCategories();
  const t = await getTranslations('Common');
  const locale = await getLocale();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className="h-full max-w-sm"
        aria-describedby="dialog-description"
      >
        <DrawerHeader>
          <DrawerTitle>{t('Select_Category')}</DrawerTitle>
          <DrawerDescription />

          <div className="space-y-1">
            {categories.map((x) => (
              <Button
                className="w-full justify-start"
                variant="ghost"
                key={x.category}
                asChild
              >
                <div>
                  <DrawerClose asChild>
                    <Link href={`/${locale}/search?category=${x.category}`}>
                      {x.category} ({x._count})
                    </Link>
                  </DrawerClose>
                </div>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoriesDrawer;
