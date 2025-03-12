import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import ProfileForm from './profile-form';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('Customer_Profile'),
  };
}

const Profile = async () => {
  const session = await auth();
  const c = await getTranslations('Common');

  return (
    <div>
      <SessionProvider session={session}>
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="h2-bold">{c('User_Profile')}</h2>
          <ProfileForm />
        </div>
      </SessionProvider>
    </div>
  );
};

export default Profile;
