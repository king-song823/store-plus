'use client';

import { Cart } from '@/types';
import { Link } from '@/i18n/navigation';
import { Button } from '@/app/[locale]/components/ui/button';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/[locale]/components/ui/table';
import { ArrowRight, Loader, Minus, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action';
import { useTransition } from 'react';
import { Card, CardContent } from '@/app/[locale]/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const CartTable = ({ cart }: { cart?: Cart }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const c = useTranslations('Common');
  const p = useTranslations('Product');

  return (
    <>
      <h1 className=" py-4 h2-bold">{c('Carts')}</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          {c('Cart_Is_Empty')} <Link href="/">{c('Go_Shopping')}</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{p('Item')}</TableHead>
                  <TableHead className="text-center">{p('Quantity')}</TableHead>
                  <TableHead className="text-center">{p('Price')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((i) => (
                  <TableRow key={i.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${i.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={i.image}
                          alt={i.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{i.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(i.productId);
                            if (!res.success) {
                              toast({
                                variant: 'destructive',
                                description: res.message,
                              });
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4  animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>
                      <span>{i.qty}</span>
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await addItemToCart(i);
                            if (!res.success) {
                              toast({
                                variant: 'destructive',
                                description: res.message,
                              });
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4  animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">¥{i.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                {p('Subtotal')}({cart.items.reduce((a, c) => a + c.qty, 0)}):
                <span className="font-bold">
                  {' '}
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                onClick={() =>
                  startTransition(() => router.push('/shipping-address'))
                }
                className="w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                {p('Proceed_To_Checkout')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
