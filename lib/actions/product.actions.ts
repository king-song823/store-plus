'use server';
import { prisma } from '@/db/prisma';
import { converToPlainObject, formatError, handleError } from '../utils';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validator';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { Product } from '@/types';
import { getTranslations } from 'next-intl/server';
// Get the lastest products
export async function getLastestProdcuts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return converToPlainObject(data);
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
    },
  });
}

// Get all products
export async function getAllProducts({
  limit = PAGE_SIZE,
  page,
  query,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  try {
    // Filter by rating
    const ratingFilter =
      rating && rating !== 'all' ? { rating: { gte: Number(rating) } } : {};
    // Filter by price
    const priceFilter: Prisma.ProductWhereInput =
      price && price !== 'all'
        ? {
            price: {
              gte: Number(price.split('-')[0]),
              lte: Number(price.split('-')[1]),
            },
          }
        : {};
    // Filter by query
    const queryFilter: Prisma.ProductWhereInput =
      query && query !== 'all'
        ? {
            name: {
              contains: query,
              mode: 'insensitive',
            } as Prisma.StringFilter,
          }
        : {};
    // Filter by category
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const data = await prisma.product.findMany({
      where: {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      },
      skip: (page - 1) * limit,
      orderBy:
        sort === 'lowest'
          ? { price: 'asc' }
          : sort === 'highest'
            ? { price: 'desc' }
            : sort === 'rating'
              ? { rating: 'desc' }
              : { createdAt: 'desc' },
      take: limit,
    });

    const dataCount = await prisma.product.count();

    return {
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

// Delete Product
export async function deleteProduct(id: string) {
  try {
    const c = await getTranslations('Common');
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error(c('Product_Not_Found'));

    await prisma.product.delete({ where: { id } });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: c('Product_Deleted_Successfully'),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create Product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    // Validate and create product
    const c = await getTranslations('Common');
    const fileNamesStr = data.files.map((f) => f.name).join(' ');
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: { ...product, fileNamesStr } });

    revalidatePath('/zh/admin/products');

    return {
      success: true,
      message: c('Product_Created_Successfully'),
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function getProducts({
  page = 1,
  pageSize = 10,
  year,
  name,
  fileName,
  category,
}: {
  page: number;
  pageSize?: number;
  year?: number | string;
  name?: string;
  fileName?: string;
  category?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereConditions: any = {};

  if (category) {
    whereConditions.category = {
      contains: category === 'all' ? '' : category,
      mode: 'insensitive',
    };
  }

  if (name) {
    whereConditions.name = {
      contains: name,
      mode: 'insensitive',
    };
  }

  if (fileName) {
    whereConditions.fileNamesStr = { contains: fileName, mode: 'insensitive' };
  }

  if (year) {
    if (year === 'all') {
      whereConditions.createdAt = {
        gte: '',
        lte: '',
      };
    } else {
      whereConditions.createdAt = {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      };
    }
  }

  const products = await prisma.product.findMany({
    where: whereConditions,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalProducts = await prisma.product.count({
    where: whereConditions,
  });

  return {
    products,
    totalPages: Math.ceil(totalProducts / pageSize),
  };
}

// Update prodcut
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const fileNamesStr = data.files.map((f) => f.name).join(' ');
    const params = updateProductSchema.parse(data);
    console.log('params', params, fileNamesStr);

    const c = await getTranslations('Common');

    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
      },
    });
    if (!product) throw new Error(c('Product_Not_Found'));
    await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        ...params,
        fileNamesStr,
      },
    });
    revalidatePath('/admin/products');
    return {
      success: true,
      message: c('Product_Updated_Successfully'),
    };
  } catch (error) {
    return handleError(error);
  }
}

// Get single product by id
export async function getProductById(
  productId: string
): Promise<Product | null> {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return converToPlainObject(data as unknown as Product);
}

// Get prodcut categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });
  return data;
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
  });
  return converToPlainObject(data);
}
