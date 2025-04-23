'use client';
import { Button } from '@/app/[locale]/components/ui/button';
import { useEffect, useRef, useState } from 'react';
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 启动轮询
  const startPolling = () => {
    if (intervalRef.current) return; // 避免重复创建定时器

    intervalRef.current = setInterval(async () => {
      const order = (await getOrderById(orderId)) as unknown as Order;
      if (order?.isPaid) {
        stopPolling();

        setTimeout(() => {
          toast({
            variant: 'default',
            description: '🎉恭喜你,已成为VIP!',
          });
        }, 1000);
        router.push('/vip');
      }
    }, 3000);

    console.log('✅ 轮询已启动');
  };

  // 停止轮询
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('⛔ 轮询已停止');
    }
  };
  // 页面卸载时清除定时器
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  const [codeUrl, setQrcode] = useState('');
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
        startPolling();
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
