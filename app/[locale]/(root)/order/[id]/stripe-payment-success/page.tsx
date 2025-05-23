/* eslint-disable @typescript-eslint/no-explicit-any */

import { notFound, redirect } from 'next/navigation';
import Stripe from 'stripe';
import { getOrderById } from '@/lib/actions/order.action';
import { Button } from '@/app/[locale]/components/ui/button';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('Stripe_Payment_Success'),
  };
}
const SuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  //  Get the order id and payment intent id from the URL
  const { id } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  // Fetch order
  const order = (await getOrderById(id)) as any;
  if (!order) notFound();

  // Retrieve the payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // Check if the payment intent is valid
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound();
  }

  // Check if the payment intent is successful
  const isSuccess = paymentIntent.status === 'succeeded';

  if (!isSuccess) return redirect(`/order/${id}`);

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center ">
        <h1 className="h1-bold">Thanks for your purchase</h1>
        <div>We are now processing your order.</div>
        <Button asChild>
          <Link href={`/order/${id}`}>View order</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
