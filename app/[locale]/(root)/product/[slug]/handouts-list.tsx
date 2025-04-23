/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Card, CardContent } from '@/app/[locale]/components/ui/card';
import PageLink from './page-link';
import PageDownLoad from './page-download';
import Link from 'next/link';
import { User } from '@prisma/client';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ADMIN_ROlE, VIP_ROlE } from '@/lib/constants';
import { Button } from '@/app/[locale]/components/ui/button';
import { ToastAction } from '@radix-ui/react-toast';
import { useRouter } from 'next/navigation';

const HandoutsPage = ({
  files,
  user,
  currentUser,
}: {
  files: any;
  user: any;
  currentUser: User;
}) => {
  const router = useRouter();
  console.log('user', user);
  useEffect(() => {
    if (user) {
      if (user?.role !== ADMIN_ROlE) {
        if (user?.role !== VIP_ROlE && !currentUser?.vipExpiresAt) {
          toast({
            variant: 'default',
            description: '点击此处成为VIP',
            action: (
              <ToastAction
                altText="VIP"
                onClick={() =>
                  user ? router.push('/place-order') : router.push('/sign-in')
                }
              >
                成为VIP会员
              </ToastAction>
            ),
          });
        } else if (
          user?.role !== VIP_ROlE &&
          currentUser?.vipExpiresAt &&
          new Date(currentUser?.vipExpiresAt) < new Date()
        ) {
          toast({
            variant: 'default',
            description: 'VIP 已过期, 请续费',
            action: (
              <ToastAction
                altText="撤销"
                onClick={() =>
                  user ? router.push('/place-order') : router.push('/sign-in')
                }
              >
                续费
              </ToastAction>
            ),
          });
        }
      }
    }
  }, [user, currentUser, router]);
  return (
    <>
      <Card>
        <CardContent className="p-4">
          目录:
          <ul className="max-h-[500px] overflow-y-auto">
            {files.map((i: any, index: number) => (
              <li className="mt-2 mb-2" key={index}>
                {user?.role === VIP_ROlE || user?.role === ADMIN_ROlE ? (
                  <div className="flex justify-between items-center">
                    <span>{i.name}</span>
                    <div className="flex gap-2">
                      <PageDownLoad pdfUrl={i.url} pdfName={i.name} />
                      <PageLink url={i.url} />
                    </div>
                  </div>
                ) : index <= 1 ? (
                  <div className="flex justify-between items-center">
                    <span>{i.name}</span>
                    <div className="flex gap-2">
                      <PageDownLoad pdfUrl={i.url} pdfName={i.name} />
                      <PageLink url={i.url} />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </li>
            ))}
          </ul>
          {(user?.role !== VIP_ROlE &&
            currentUser?.vipExpiresAt &&
            new Date(currentUser?.vipExpiresAt) < new Date()) ||
            (!currentUser?.vipExpiresAt && user?.role !== ADMIN_ROlE && (
              <div className="text-left flex items-center gap-4">
                <Link href={user ? '/place-order' : '/sign-in'}>
                  <Button size="sm">成为VIP会员</Button>
                </Link>{' '}
                可查看更多讲义
              </div>
            ))}
        </CardContent>
      </Card>
    </>
  );
};

export default HandoutsPage;
