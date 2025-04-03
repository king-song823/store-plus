// import { getMyCart } from '@/lib/actions/cart.action';
// import CartTable from './cart-table';
import { getTranslations } from 'next-intl/server';
export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('Shopping_Cart'),
  };
}
const Cartpage = async () => {
  // const cart = await getMyCart();
  return <>{/* <CartTable cart={cart} /> */}</>;
};

export default Cartpage;
