'use client';
import { Check, Loader } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/app/[locale]/components/ui/button';
import { createOrder } from '@/lib/actions/order.action';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const PlaceOrderForm = ({ totalPrice }: { totalPrice: string }) => {
  const router = useRouter();
  const c = useTranslations('Common');
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await createOrder(totalPrice);
    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };
  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}{' '}
        {c('Place_Order')}
      </Button>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <PlaceOrderButton />
      </form>
    </>
  );
};

export default PlaceOrderForm;
