'use client';

import { Badge } from '@/app/[locale]/components/ui/badge';
import { Card, CardContent } from '@/app/[locale]/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/[locale]/components/ui/table';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  approvePayPalOrder,
  createPayPalOrder,
  updateOrderToPaidByCOD,
  deliverOrder,
} from '@/lib//actions/order.action';
import { toast, useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { Button } from '@/app/[locale]/components/ui/button';
import StripePayment from './stripe-payment';
import { useTranslations } from 'next-intl';
import AliPayButton from '@/app/[locale]/components/AlipayButton';
import { RMB } from '@/lib/constants';
// Checks the loading status of the PayPal script
function PrintLoadingState() {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  let status = '';
  if (isPending) {
    status = 'Loading PayPal...';
  } else if (isRejected) {
    status = 'Error in loading PayPal.';
  }
  return status;
}

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Omit<Order, 'paymentResult'>;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {
  const {
    // shippingAddress,
    orderItems,
    // itemsPrice,
    // taxPrice,
    // shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    // deliveredAt,
  } = order;

  const c = useTranslations('Common');
  const a = useTranslations('Admin');
  const p = useTranslations('Product');

  // Creates a PayPal order
  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);
    if (!res.success)
      return toast({
        description: res.message,
        variant: 'destructive',
      });
    return res.data;
  };

  // Approves a PayPal order
  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    toast({
      description: res.message,
      variant: res.success ? 'default' : 'destructive',
    });
  };

  // Button To mark the order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidByCOD(order.id);
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            });
          })
        }
      >
        {isPending ? c('Processing') : c('Mark_As_Paid')}
      </Button>
    );
  };

  // Button To mark the order as delivered
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            });
          })
        }
      >
        {isPending ? c('Processing') : c('Mark_As_Delivered')}
      </Button>
    );
  };

  return (
    <>
      <h1 className="py-4 text-2xl">
        {' '}
        {a('Orders')} {formatId(order.id)}
      </h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="overflow-x-auto md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{c('Payment_Method')}</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  {c('Paid_At')} : {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">{c('Not_Paid')}</Badge>
              )}
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{c('Shipping_Address')}</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <Badge variant="secondary">
                  {c('Delivered_At')} {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">{c('Not_Delivered')}</Badge>
              )}
            </CardContent>
          </Card> */}
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{c('Not_Delivered')}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{p('Item')}</TableHead>
                    <TableHead>{p('Quantity')}</TableHead>
                    <TableHead>{p('Price')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
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
                        <span className="text-center">
                          {RMB}
                          {item.price}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 space-y-4 gap-4">
              <h2 className="text-xl pb-4">{c('Order_Summary')}</h2>
              {/* <div className="flex justify-between">
                <div>{p('Item')}</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div> */}
              {/* <div className="flex justify-between">
                <div>{c('Tax')}</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>{c('Shipping_Address')}</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div> */}
              <div className="flex justify-between">
                <div>{c('Total')}</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {/* PayPal Payment */}
              {!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                />
              )}
              {!isPaid && paymentMethod === 'PayPal' && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
              {!isPaid && paymentMethod === 'Alipay_Payment' && (
                <div className="w-full">
                  <AliPayButton
                    orderId={order.id}
                    amount={order.totalPrice}
                    subject={order.id}
                  />
                </div>
              )}
              {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
