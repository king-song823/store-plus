'use client';
import { CartItem } from '@/types';
import { Loader, Minus, Plus } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useToast } from '@/hooks/use-toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action';
import { Cart } from '@/types';
import { useTransition } from 'react';
import { throttle } from 'lodash';
import { ToastAction } from '../../ui/toast';
import { Button } from '../../ui/button';
import { useTranslations } from 'next-intl';

const AddToCart = ({
  userId,
  cart,
  item,
}: {
  userId: string;
  cart?: Cart;
  item: Omit<CartItem, 'cartId'>;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('Product');

  const [isPending, startTransition] = useTransition();
  const c = useTranslations('Common');
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  // Remove item from cart
  const handleRemoveFromCart = () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast({
        variant: res.success ? 'default' : 'destructive',
        description: res.message,
      });

      return;
    });
  };
  const handleAddToCart = () => {
    startTransition(async () => {
      if (!userId) {
        router.push('/sign-in');
        return;
      }
      // addItemCart
      const res = await addItemToCart(item);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
        return;
      }

      toast({
        description: `${item.name} ${c('Added_To_The_Cart')}`,
        action: (
          <ToastAction
            className="bg-primary text-white hover:bg-gray-800"
            onClick={() => router.push('/cart')}
            altText="Go to cart"
          >
            {t('Go_To_Cart')}
          </ToastAction>
        ),
      });
    });
  };
  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={throttle(handleRemoveFromCart, 1000)}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        onClick={throttle(handleAddToCart, 1000)}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      onClick={throttle(handleAddToCart, 1000)}
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      {t('Add_To_Cart')}
    </Button>
  );
};

export default AddToCart;
