// import CheckoutSteps from '@/app/[locale]/components/shared/check-steps';

import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@/auth';
// import { Cart, ShippingAddress } from '@/types';
// import { Cart } from '@/types';
// import { Link } from '@/i18n/navigation';
// import { Button } from '@/app/[locale]/components/ui/button';
// import { getMyCart } from '@/lib/actions/cart.action';
import { getTranslations } from 'next-intl/server';
import PackageSelector from './package-selector';
// import { RMB } from '@/lib/constants';
export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('Orders'),
  };
}

const PlaceOrder = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('User not found');
  const user = await getUserById(userId);
  // const userAddress = user.address as ShippingAddress;
  // const cart = (await getMyCart()) as Cart;
  const c = await getTranslations('Common');
  // const a = await getTranslations('Admin');
  // const p = await getTranslations('Product');

  return (
    <>
      {/* <CheckoutSteps current={1} /> */}
      <h1 className="py-4 text-2xl">{c('Order_Summary')}</h1>

      <PackageSelector user={user} />
    </>
  );
};

export default PlaceOrder;
