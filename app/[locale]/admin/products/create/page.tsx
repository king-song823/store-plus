import ProductForm from '@/app/[locale]/components/shared/admin/prodcut-form';
import { getTranslations } from 'next-intl/server';
export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('Create_Product'),
  };
}

const CreateProductPage = async () => {
  const t = await getTranslations('Admin');

  return (
    <>
      <h2 className="h2-bold">{t('Create_Product')}</h2>
      <div className="my-8">
        {' '}
        <ProductForm type={'Create'} />
      </div>
    </>
  );
};
export default CreateProductPage;
