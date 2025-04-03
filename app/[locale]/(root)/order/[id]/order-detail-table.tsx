'use client';

import { Badge } from '@/app/[locale]/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/[locale]/components/ui/card';

import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';

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
import WeChatPayButton from '@/app/[locale]/components/WeChatPayButton';
import { HALF_YEAR_VIP, ONE_YEAR_VIP } from '@/lib/constants';
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
  userId,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Omit<Order, 'paymentResult'>;
  userId: string;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {
  const {
    // shippingAddress,
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
    const res = await approvePayPalOrder(order.id, data, userId);

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
              <p>{c(paymentMethod)}</p>
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
              <h2 className="text-xl pb-4">{c('Order_Items')}</h2>

              {order.totalPrice === HALF_YEAR_VIP ? (
                <Card>
                  <CardHeader>
                    <CardTitle>📌 半年套餐（183天）</CardTitle>
                    <CardDescription className="gap-4">
                      高效学习半年，紧跟讲义更新，知识尽在掌握！
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="gap-4">
                    <p>
                      ✅ 原价 <del className="">¥299</del>，新用户限时优惠{' '}
                      <mark className="font-bold">¥{HALF_YEAR_VIP}</mark>
                    </p>
                    <p>✅ 支持讲义下载，随时随地学习，不受网络限制</p>
                    <p>✅ 在有效期内随时查看讲义内容，掌握关键知识点</p>
                    <p>✅ 讲义持续更新，确保您获取最新的学习资料</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>📌 一年套餐（365天）</CardTitle>
                    <CardDescription className="gap-4">
                      全程畅学一年，持续获取最新讲义，助力深度成长！
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="gap-4">
                    <p>
                      ✅ 原价 <del>¥399</del>，新用户限时优惠{' '}
                      <mark className="font-bold">¥{ONE_YEAR_VIP}</mark>{' '}
                    </p>
                    <p>✅ 享受与半年套餐相同的权益，学习时间更充裕 </p>
                    <p>✅ 长期规划，稳步提升，让知识沉淀更扎实</p>
                  </CardContent>
                </Card>
              )}
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
              {!isPaid && paymentMethod === 'WeChat_Payment' && (
                <div className="w-full">
                  <WeChatPayButton
                    orderId={order.id}
                    totalPrice={order.totalPrice}
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
