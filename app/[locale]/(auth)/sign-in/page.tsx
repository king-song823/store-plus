import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/[locale]/components/ui/card';
import { Link } from '@/i18n/navigation';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import CredentialsSignInForm from './credentials-signin-form';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('Sign_In'),
  };
}
const SignIn = async (props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) => {
  const session = await auth();
  const t = await getTranslations('Common');

  const { callbackUrl } = await props.searchParams;
  if (session) {
    return redirect(callbackUrl ?? '/');
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              priority={true}
              src="/images/logo.webp"
              width={100}
              height={100}
              className="rounded"
              alt={`${APP_NAME} logo`}
            />
          </Link>
          <CardTitle className="text-center">{t('Sign_In')}</CardTitle>
          <CardDescription className="text-center">
            {t('Login_Method')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
