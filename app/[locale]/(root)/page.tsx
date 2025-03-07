import ProductList from '@/app/[locale]/components/shared/product/product-list';
import { getLastestProdcuts } from '@/lib/actions/product.actions';
import { getFeaturedProducts } from '@/lib/actions/product.actions';
// import ProductCarousel from '@/components/shared/product/product-carousel';
import ViewAllProductsButton from '@/app/[locale]/components/view-all-products-button';
// import IconBoxes from '@/app/[locale]/components/icon-boxes';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const lastestProdcuts = await getLastestProdcuts();
  const featuredProducts = await getFeaturedProducts();
  const t = await getTranslations('HomePage');
  return (
    <div className="space-y-8">
      {/* {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )} */}
      <ProductList title={t('NewestArrivals')} data={lastestProdcuts} />
      {featuredProducts.length > 0 && <ViewAllProductsButton />}
      {/* <IconBoxes /> */}
    </div>
  );
}
