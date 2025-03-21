import CheckoutSteps from '@/app/[locale]/components/shared/check-steps';
import { Card, CardContent } from '@/app/[locale]/components/ui/card';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/[locale]/components/ui/table';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@/auth';
// import { Cart, ShippingAddress } from '@/types';
import { Cart } from '@/types';
import { Link } from '@/i18n/navigation';
import { Button } from '@/app/[locale]/components/ui/button';
import { getMyCart } from '@/lib/actions/cart.action';
import { formatCurrency } from '@/lib/utils';
import PlaceOrderForm from './place-order-form';
import { getTranslations } from 'next-intl/server';
import { RMB } from '@/lib/constants';

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
  const cart = (await getMyCart()) as Cart;
  const c = await getTranslations('Common');
  const a = await getTranslations('Admin');
  const p = await getTranslations('Product');

  return (
    <>
      <CheckoutSteps current={2} />
      <h1 className="py-4 text-2xl">{c('Order_Summary')}</h1>

      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="overflow-x-auto md:col-span-2 space-y-4">
          {/* <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{c('Shipping_Address')}</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}, {''}
                {userAddress.postalCode}, {userAddress.country}, {''}
              </p>
              <div className="mt-3">
                <Link href="/shipping-address">
                  <Button variant="outline">{a('Edit')}</Button>
                </Link>
              </div>
            </CardContent>
          </Card> */}
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{c('Payment_Method')}</h2>
              <p>{c(user.paymentMethod)}</p>
              <div className="mt-3">
                <Link href="/payment-method">
                  <Button variant="outline">{a('Edit')}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{c('Order_Items')}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{p('Item')}</TableHead>
                    <TableHead>{p('Quantity')}</TableHead>
                    <TableHead>{p('Price')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart?.items.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          className="flex items-center"
                          href={`/prodcut/${item.slug}`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 text-center">
                          {RMB}
                          {item.price}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Link href="/cart">
                <Button variant="outline">{a('Edit')}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              {/* <div className="flex justify-between">
                <div>{p('Item')}</div>
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div> */}
              {/* <div className="flex justify-between">
                <div>{c('Tax')}</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div> */}
              {/* <div className="flex justify-between">
                <div>{c('Shipping')}</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div> */}
              <div className="flex justify-between">
                <div>{c('Total')}</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
