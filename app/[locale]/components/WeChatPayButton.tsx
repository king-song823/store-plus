'use client';
import { Button } from '@/app/[locale]/components/ui/button';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { getOrderById } from '@/lib/actions/order.action';
import { useRouter } from 'next/navigation';
import { Order } from '@/types';

export default function PaymentPage({
  orderId,
  totalPrice,
}: {
  orderId: string;
  totalPrice: string;
}) {
  const [loading, setLoading] = useState(false);
  const c = useTranslations('Common');
  const router = useRouter();

  const [codeUrl, setQrcode] = useState('');

  const startPolling = (orderId: string) => {
    const interval = setInterval(async () => {
      const order = (await getOrderById(orderId)) as unknown as Order;
      if (order.isPaid) {
        clearInterval(interval);
        router.refresh();
      }
    }, 3000);
  };
  const createOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pay/wechat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIdOrigin: orderId,
          out_trade_no: orderId.slice(0, 32),
          total_fee: totalPrice,
          description: orderId.slice(0, 32),
        }),
      });

      const data = await res.json();
      if (data.code_url) {
        setQrcode(data.code_url); // 设置二维码链接
        startPolling(orderId);
      } else {
        toast({
          variant: 'destructive',
          description: data.error.message,
        });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="default"
        disabled={loading}
        className="mt-4 w-full "
        onClick={createOrder}
      >
        {loading ? c('Wechat_Loading') : c('WeChat_Pay')}
      </Button>
      {codeUrl ? (
        <QRCodeSVG className="mt-2" value={codeUrl} size={256} />
      ) : (
        <p></p>
      )}
    </div>
  );
}
