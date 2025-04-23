'use client';
import { Button } from '@/app/[locale]/components/ui/button';
import { Input } from '@/app/[locale]/components/ui/input';
import { Label } from '@/app/[locale]/components/ui/label';
import Link from 'next/link';
import { signInDefaultValues } from '@/lib/constants';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    message: '',
    success: false,
  });
  const searchParams = useSearchParams();
  const c = useTranslations('Common');
  const locale = useLocale();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? c('Signing_Loading') : c('Sign_In_With_Credentials')}
      </Button>
    );
  };
  return (
    <div>
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <div>
            <Label htmlFor="email">{c('Email')}</Label>
            <Input
              id="email"
              name="email"
              required
              type="email"
              defaultValue={signInDefaultValues.email}
              autoComplete="email"
            ></Input>
          </div>
          <div>
            <Label htmlFor="password">{c('Password')}</Label>
            <Input
              id="password"
              name="password"
              required
              type="password"
              defaultValue={signInDefaultValues.password}
              autoComplete="current-password"
            ></Input>
          </div>
          <div>
            <SignInButton />
            {data && !data.success && (
              <div className="text-center text-destructive">{data.message}</div>
            )}
          </div>
          <div className="text-sm text-center text-muted-foreground">
            {locale === 'en'
              ? `localeDon${'&apos'}t have an account?`
              : c('No_Account')}{' '}
            <Link target="_self" className="link" href="/sign-up">
              {c('Sign_Up')}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CredentialsSignInForm;
