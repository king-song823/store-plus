import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.action';
import { redirect } from 'next/navigation';
import ShippingAddressForm from './shipping-address-form';
import CheckoutSteps from '@/app/[locale]/components/shared/check-steps';
import { getUserById } from '@/lib/actions/user.actions';
import { ShippingAddress } from '@/types';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('Shipping_Address'),
  };
}
const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect('/cart');
  const session = await auth();

  const user = await getUserById(session?.user?.id as string);

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm
        address={user.address as ShippingAddress}
      ></ShippingAddressForm>
    </>
  );
};

export default ShippingAddressPage;
