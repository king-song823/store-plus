'use client'; // 必须添加
import { signOut } from 'next-auth/react';
import { Button } from '@/app/[locale]/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/app/[locale]/components/ui/dropdown-menu';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { signOutUser } from '@/lib/actions/user.actions';

interface UserButtonClientProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  firstInitial: string;
  translations: {
    Sign_In: string;
    Order_History: string;
    Admin: string;
    User_Profile: string;
    Sign_Out: string;
  };
}

export function UserButtonClient({
  user,
  firstInitial,
  translations,
}: UserButtonClientProps) {
  const router = useRouter();
  const handleSignIn = async () => {
    await signOut({ redirect: false });
    router.push('/sign-in');
  };

  if (!user || Object.keys(user).length === 0) {
    return <Button onClick={handleSignIn}>{translations.Sign_In}</Button>;
  }

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-300"
          >
            {firstInitial}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link className="w-full" href="/user/orders">
              {translations.Order_History}
            </Link>
          </DropdownMenuItem>
          {user.role === 'admin' && (
            <DropdownMenuItem asChild>
              <Link className="w-full" href="/admin/overview">
                {translations.Admin}
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link className="w-full" href="/user/profile">
              {translations.User_Profile}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant="ghost"
              >
                {translations.Sign_Out}
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
