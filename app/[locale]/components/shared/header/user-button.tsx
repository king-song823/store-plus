import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import { UserButtonClient } from './user-button-client';

export default async function UserButton() {
  const session = await auth();
  const firstInitial = session?.user?.name?.charAt(0).toUpperCase() ?? '';
  const t = await getTranslations('Common');

  return (
    <UserButtonClient
      user={session?.user}
      firstInitial={firstInitial}
      translations={{
        Sign_In: t('Sign_In'),
        Order_History: t('Order_History'),
        Admin: t('Admin'),
        User_Profile: t('User_Profile'),
        Sign_Out: t('Sign_Out'),
      }}
    />
  );
}
