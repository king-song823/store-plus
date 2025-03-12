import { notFound } from 'next/navigation';

import ProductForm from '@/app/[locale]/components/shared/admin/prodcut-form';
import { getProductById } from '@/lib/actions/product.actions';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('Update_Product'),
  };
}

const UpdateProductPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;
  const c = await getTranslations('Common');

  const product = await getProductById(id);

  if (!product) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">{c('Update_Product')}</h1>
      <ProductForm type="Update" product={product} productId={product.id} />
    </div>
  );
};

export default UpdateProductPage;
