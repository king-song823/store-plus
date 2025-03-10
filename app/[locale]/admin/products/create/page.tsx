import { Metadata } from 'next';
import ProductForm from '@/app/[locale]/components/shared/admin/prodcut-form';
import { getTranslations } from 'next-intl/server';
export const metadata: Metadata = {
  title: 'Create product',
};

const CreateProductPage = async () => {
  const t = await getTranslations('Admin');

  return (
    <>
      <h2 className="h2-bold">{t('Create_Product')}</h2>
      <div className="my-8">
        {' '}
        <ProductForm type={t('Create') as 'Create'} />
      </div>
    </>
  );
};
export default CreateProductPage;
