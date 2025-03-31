'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function PayButton({
  orderId,
  amount,
  subject,
}: {
  orderId: string;
  amount: string;
  subject: string;
}) {
  const [loading, setLoading] = useState(false);
  const c = useTranslations('Common');

  const handlePay = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pay/alipay', {
        method: 'POST',
        body: JSON.stringify({
          orderId,
          amount,
          subject,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const url = JSON.parse(JSON.stringify(data.payUrl));
        window.location.href = url;
      } else {
        alert(`${c('Pay_Fail')}: ${data.message}`);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded w-full"
    >
      {loading ? c('Redirecting_Loading') : c('AliPay')}
    </button>
  );
}
