/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Card, CardContent } from '@/app/[locale]/components/ui/card';
import PageLink from './page-link';
import PageDownLoad from './page-download';
import { Link } from '@/i18n/navigation';
import { User } from '@prisma/client';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const HandoutsPage = ({
  files,
  user,
  currentUser,
}: {
  files: any;
  user: any;
  currentUser: User;
}) => {
  useEffect(() => {
    if (
      (user?.role !== 'vip' &&
        currentUser?.vipExpiresAt &&
        new Date(currentUser?.vipExpiresAt) < new Date()) ||
      !currentUser?.vipExpiresAt
    ) {
      toast({
        variant: 'destructive',
        description: 'VIP 已过期, 请续费',
      });
    }
  }, [user, currentUser]);
  return (
    <>
      <Card>
        <CardContent className="p-4">
          目录:
          <ul>
            {files.map((i: any, index: number) => (
              <li className="mt-2 mb-2" key={index}>
                {user?.role === 'vip' ? (
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
          {(user?.role !== 'vip' &&
            currentUser?.vipExpiresAt &&
            new Date(currentUser?.vipExpiresAt) < new Date()) ||
            (!currentUser?.vipExpiresAt && (
              <div className="text-center">
                <Link href={user ? '/place-order' : '/sign-in'}>
                  <span className="font-bold">成为VIP会员</span>
                  可查看更多讲义
                </Link>
              </div>
            ))}
        </CardContent>
      </Card>
    </>
  );
};

export default HandoutsPage;
