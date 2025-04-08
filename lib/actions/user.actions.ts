'use server';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { auth, signIn, signOut } from '@/auth';
import {
  paymentMethodSchema,
  // shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateProfilePasswordSchema,
  updateUserSchema,
} from '../validator';
import { compare, hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError, handleError } from '../utils';
// import { ShippingAddress } from '@/types';
import { z } from 'zod';
import { PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

// Sign in the user with credentials
export async function signInWithCredentials(_: unknown, formData: FormData) {
  const c = await getTranslations('Common');
  try {
    const user = await signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    await signIn('credentials', user);
    return { success: true, message: c('Signed_in_successfully') };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: c('Invalid_email_or_password') };
  }
}

// Sign the user out
export async function signOutUser() {
  await signOut();
}

// Register a new user
export async function signUp(prevState: unknown, formData: FormData) {
  const c = await getTranslations('Common');

  try {
    const user = await signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      confirmPassword: formData.get('confirmPassword'),
      password: formData.get('password'),
    });

    const plainPassword = user.password;
    user.password = hashSync(plainPassword, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: c('User_created_successfully') };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  const c = await getTranslations('Common');
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error(c('User_not_found'));
  return user;
}

// change profile password
export async function updateProfilePassword(
  values: z.infer<typeof updateProfilePasswordSchema>
) {
  const c = await getTranslations('Common');

  try {
    const data = await updateProfilePasswordSchema.parse(values);
    const session = await auth();

    const currentUser = (await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;

    if (!currentUser) throw new Error(c('User_not_found'));
    const isCorrect = await compare(data.currentPassword, currentUser.password);
    if (!isCorrect) {
      return {
        success: false,
        message: c('Incorrect_Current_Password'),
      };
    }
    const isSame = await compare(data.newPassword, currentUser.password);
    if (isSame) {
      return {
        success: false,
        message: c('New_Password_Cannot_Be_Same_As_Old'),
      };
    }
    const newPasswordHash = hashSync(data.newPassword, 10);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { password: newPasswordHash },
    });
    await signOut({ redirect: false });

    return {
      success: true,
      message: c('Password_Changed_Successfully'),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update user's address
// export async function updateUserAddress(data: ShippingAddress) {
//   const c = await getTranslations('Common');
//   try {
//     // find userId
//     const session = await auth();
//     // find user
//     const currentUser = await getUserById(session?.user?.id as string);
//     if (!currentUser) throw new Error(c('User_not_found'));

//     // params
//     const address = shippingAddressSchema.parse(data);

//     // update user address
//     await prisma.user.update({
//       where: {
//         id: currentUser.id,
//       },
//       data: {
//         address,
//       },
//     });

//     return {
//       success: true,
//       message: c('Shipping_updated_successfully'),
//     };
//   } catch (error) {
//     return {
//       message: formatError(error),
//       success: false,
//     };
//   }
// }

// Update payment methods
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  const c = await getTranslations('Common');
  try {
    // check user is exsit
    const session = await auth();
    const currentUser = await getUserById(session?.user?.id as string);
    if (!currentUser) throw new Error(c('User_not_found'));

    // params
    const params = paymentMethodSchema.parse(data);
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        paymentMethod: params.type,
      },
    });
    return {
      success: true,
      message: c('Payment_method_updated_successfully'),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update User Profile
export async function updateProfile(user: { name: string; email: string }) {
  const c = await getTranslations('Common');
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error(c('User_not_found'));

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: c('User_updated_successfully'),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query?: string;
}) {
  const filterQuery: Prisma.UserWhereInput =
    query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        }
      : {};
  const data = await prisma.user.findMany({
    where: {
      ...filterQuery,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete user by ID
export async function deleteUser(id: string) {
  const c = await getTranslations('Common');
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: c('User_deleted_successfully'),
    };
  } catch (error) {
    return handleError(error);
  }
}

// Update user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  const c = await getTranslations('Common');
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: c('User_updated_successfully'),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
