import React from 'react';

import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

const CheckoutSteps = async ({ current = 0 }) => {
  const c = await getTranslations('Common');
  return (
    <div className="flex-between  flex-col md:flex-row  space-x-2 space-y-2 mb-10">
      {[
        c('User_Login'),
        // c('Shipping_Address'),
        c('Payment_Method'),
        c('Orders'),
      ].map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              'p-2 w-80 rounded-full text-center  text-sm',
              index === current ? 'bg-secondary' : ''
            )}
          >
            {step}
          </div>
          {step !== c('Orders') && (
            <hr className="w-28 border-t border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
export default CheckoutSteps;
