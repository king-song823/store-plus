import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/[locale]/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SignUpForm from './signup-form';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('Sign_Up'),
  };
}

const SignUp = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const { callbackUrl } = searchParams;
  const session = await auth();
  const c = await getTranslations('Common');
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
          <CardTitle className="text-center">{c('Create_Account')}</CardTitle>
          <CardDescription className="text-center">
            {c('Create_Account')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
