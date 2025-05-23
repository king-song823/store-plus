'use server';

import { CartItem } from '@/types';
import { converToPlainObject, formatError, round2 } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validator';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

// Calculate cart price based on items
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    // shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    // taxPrice = round2(0.15 * itemsPrice),
    taxPrice = 0,
    shippingPrice = 0,
    // totalPrice = round2(itemsPrice + taxPrice + shippingPrice);
    totalPrice = round2(itemsPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // Get session and user ID
    const session = await auth();
    const c = await getTranslations('Common');
    const userId = session?.user?.id ? session.user.id : undefined;
    // Parse and validate submitted item data
    const item = cartItemSchema.parse(data);
    // Find product from database
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    });
    if (!product) throw new Error(c('Product_Not_Found'));
    // Get cart from database
    const cart = await getMyCart();

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId || null,
        items: [item],
        ...calcPrice([item]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
      // Add to database
      await prisma.cart.create({
        data: newCart,
      });
      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: c('Item_Added_To_Cart_Successfully'),
      };
    } else {
      // Check for existing item in cart
      const existItem = (cart.items as CartItem[]).find(
        (i) => i.productId === item.productId
      );

      // if not enough stock, threw error
      if (existItem) {
        if (product.stock < existItem.qty + 1) {
          throw new Error(c('Not_Enough_Stock'));
        }

        // Increase quanitily of existing item
        cart.items.find((i) => i.productId === item.productId)!.qty =
          existItem.qty + 1;
      } else {
        // If stock, add item to cart
        if (product.stock < 1) throw new Error(c('Not_Enough_Stock'));
        cart.items.push(item);
      }
      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existItem ? c('Updated_In') : c('Added_To')} ${c('Cart_Successfully')}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get user cart from database
export async function getMyCart() {
  // Check for cart cookie
  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;
  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: { userId: userId },
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return converToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

// Remove item from cart in database
export async function removeItemFromCart(productId: string) {
  try {
    // Check Product
    const c = await getTranslations('Common');
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) throw new Error(c('Product_Not_Found'));

    // Check Cart
    const cart = await getMyCart();
    if (!cart) throw new Error(c('Cart_Not_Found'));

    // Check Cart include Item
    const exist = cart.items.find((i) => i.productId === productId);
    if (!exist) throw new Error(c('Item_Not_Found'));

    // If cart has only one
    if (exist.qty === 1) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    } else {
      cart.items.find((x) => x.productId === productId)!.qty = exist.qty - 1;
    }

    // Update cart in database
    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        items: cart.items,
        ...calcPrice(cart.items),
      },
    });

    // Revalidate product page
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} ${cart.items.find((i) => i.productId === productId) ? c('Updated_In') : c('Removed_From')} ${c('Cart_Successfully')}`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
