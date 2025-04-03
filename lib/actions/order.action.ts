'use server';

import { auth } from '@/auth';
import { converToPlainObject, formatError, handleError } from '../utils';
import { getUserById } from './user.actions';
import { insertOrderSchema } from '../validator';
import { prisma } from '@/db/prisma';
import { paypal } from '../paypal';
import { revalidatePath } from 'next/cache';
import { PAGE_SIZE } from '../constants';
import { Prisma } from '@prisma/client';
import { PaymentResult } from '@/types';
// import { sendPurchaseReceipt } from '@/email';
import { getLocale, getTranslations } from 'next-intl/server';
export async function createOrder(totalPrice: string) {
  try {
    const session = await auth();
    const locale = await getLocale();
    const c = await getTranslations('Common');
    if (!session) throw new Error(c('User_Is_Not_Authenticated'));

    const userId = session?.user?.id;
    if (!userId) throw new Error(c('User_Not_Found'));

    const user = await getUserById(userId);

    if (!user.paymentMethod) {
      return {
        success: false,
        message: c('No_Payment_Method'),
        redirectTo: `/${locale}/payment-method`,
      };
    }

    // Create order object
    const order = insertOrderSchema.parse({
      // id: orderId,
      userId: user.id,
      // shippingAddress: user.address,
      // shippingAddress: shippingAddressDefaultValues,
      paymentMethod: user.paymentMethod,
      itemsPrice: totalPrice,
      shippingPrice: totalPrice,
      taxPrice: totalPrice,
      totalPrice: totalPrice,
    });

    // Create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      const insertedOrder = await tx.order.create({ data: order });
      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error(c('Order_Not_Created'));
    return {
      success: true,
      message: c('Order_Created'),
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// GetOrder
export async function getOrderById(orderId: string) {
  try {
    const res = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            id: true,
          },
        },
      },
    });
    return converToPlainObject(res);
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Create a PayPal order
export async function createPayPalOrder(orderId: string) {
  try {
    // Find current order
    const c = await getTranslations('Common');

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    // Creat a order by orderId
    if (order) {
      const res = await paypal.createOrder(Number(order.totalPrice));
      // update Order information

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          paymentResult: {
            id: res.id,
            emailAddress: '',
            status: '',
            pricePaid: '0',
          },
        },
      });
      // Return the paypal order id
      return {
        success: true,
        message: c('PayPal_Order_Created_uccessfully'),
        data: res.id,
      };
    } else {
      throw new Error(c('Order_Not_Found'));
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Approve Paypal Order
export async function approvePayPalOrder(
  orderId: string,
  data: {
    orderID: string;
  },
  userId: string
) {
  try {
    // Check order not found
    const c = await getTranslations('Common');

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (!order) throw new Error(c('Order_Not_Found'));
    // Check order is already paid
    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult).id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error(c('Order_Not_Found'));
    }
    // Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        emailAddress: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payment?.capture[0]?.amount?.value,
      },
      userId,
    });

    revalidatePath(`/order/${orderId}`);
    return {
      success: true,
      message: c('Your_Order_Has_Been_Successfully_Paid_By_AliPay'),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Aprove AliPay Order
export async function approveAliPayOrder(
  orderId: string,
  captureData: {
    id: string;
    status: string;
    total_amount: string;
  },
  userId: string
) {
  try {
    // Check order not found
    const c = await getTranslations('Common');

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    if (!order) throw new Error(c('Order_Not_Found'));
    // Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        emailAddress: '',
        pricePaid: captureData.total_amount,
      },
      userId,
    });

    return {
      success: true,
      message: c('Your_Order_Has_Been_Successfully_Paid_By_AliPay'),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update order to paid in database
export async function updateOrderToPaid({
  orderId,
  paymentResult,
  userId,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
  userId?: string;
}) {
  //Check order found
  const c = await getTranslations('Common');
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {},
  });
  if (!order) throw new Error(c('User_Not_Found'));
  //Check order is paid
  if (order.isPaid) throw new Error(c('Order_Is_Already_Paid'));
  console.log('order', userId);

  await prisma.$transaction(async (tx) => {
    // Set order to paid
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
    //update user to vip roel
    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        role: 'vip',
      },
    });
  });

  // Get the updated order after the tansaction
  const updatedOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  if (!updatedOrder) throw new Error(c('Order_Not_Found'));
  // const params = {
  //   ...updatedOrder,
  //   itemsPrice: String(updatedOrder.itemsPrice),
  //   shippingPrice: String(updatedOrder.shippingPrice),
  //   taxPrice: String(updatedOrder.taxPrice),
  //   totalPrice: String(updatedOrder.totalPrice),
  // };
  // Send the purchase receipt email with the updated order
  // sendPurchaseReceipt({
  //   order: {
  //     ...params,
  //     // shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
  //     paymentResult: updatedOrder.paymentResult as PaymentResult,
  //   },
  // });
}

// Get User Order
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  try {
    const session = await auth();
    const c = await getTranslations('Common');

    if (!session) throw new Error(c('User_Is_Not_Authenticated'));
    const data = await prisma.order.findMany({
      where: {
        userId: session?.user?.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    const dataCount = await prisma.order.count({
      where: {
        userId: session?.user?.id,
      },
    });
    return {
      data,
      totalPages: Math.ceil(dataCount / limit),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
      data: [],
    };
  }
}

type SalesDataType = {
  day: string;
  totalSales: number;
}[];
// Get sales data and order summary
export async function getOrderSummary() {
  // Get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Calculate total sales
  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  });

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ day: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'YYYY-MM-DD') as "day", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'YYYY-MM-DD') ORDER BY "day" ASC`;
  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    day: entry.day,
    totalSales: Number(entry.totalSales), // Convert Decimal to number
  }));

  // Get latest sales order
  const latestOrders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    take: 10,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestOrders,
    salesData,
  };
}

// Get all orders (Admin)
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query?: string;
}) {
  try {
    const queryFilter: Prisma.OrderWhereInput =
      query && query !== 'all'
        ? {
            user: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          }
        : {};
    const data = await prisma.order.findMany({
      where: {
        ...queryFilter,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const dataCount = await prisma.order.count();
    return {
      success: true,
      data,
      totalPages: Math.ceil(dataCount / limit),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
      data: [],
      totalPages: 0,
    };
  }
}

// Delete Order (Admin)
export async function deleteOrder(id: string) {
  try {
    const c = await getTranslations('Common');

    await prisma.order.delete({
      where: {
        id,
      },
    });
    revalidatePath(`/admin/orders`);
    return {
      success: true,
      message: c('Order_Deleted_Successfully'),
    };
  } catch (error) {
    return handleError(error);
  }
}

// Update order to paid by COD
export async function updateOrderToPaidByCOD(orderId: string) {
  try {
    const c = await getTranslations('Common');
    await updateOrderToPaid({ orderId });
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: c('Order_Paid_Successfully') };
  } catch (error) {
    return handleError(error);
  }
}

// Update Order To Delivered
export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });
    const c = await getTranslations('Common');

    if (!order) throw new Error(c('User_Not_Found'));
    if (!order.isPaid) throw new Error(c('Order_Not_Created'));

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: c('Order_Delivered_Successfully') };
  } catch (error) {
    return handleError(error);
  }
}
