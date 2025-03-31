import { auth } from '@/auth';
// import CheckoutSteps from '@/app/[locale]/components/shared/check-steps';
import PaymentMethodForm from './payment-method-form';
import { getUserById } from '@/lib/actions/user.actions';
import { getTranslations } from 'next-intl/server';
export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('Payment_Method'),
  };
}

const PaymentMthodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  const currentUser = await getUserById(userId as string);

  if (!userId) {
    throw new Error('User ID not found');
  }
  return (
    <>
      {/* <CheckoutSteps current={1} /> */}
      <PaymentMethodForm
        preferredPaymentMethod={currentUser.paymentMethod}
      ></PaymentMethodForm>
    </>
  );
};

export default PaymentMthodPage;
