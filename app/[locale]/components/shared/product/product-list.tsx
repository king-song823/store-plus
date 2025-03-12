import { getTranslations } from 'next-intl/server';
import ProductCard from './product-card';
import { Product } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProductList = async ({ data, title }: { data: any; title?: string }) => {
  const t = await getTranslations('Common');

  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-clos-4 gap-4">
          {data.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <>
          <p>{t('No_Prodcut_Found')}</p>
        </>
      )}
    </div>
  );
};

export default ProductList;
