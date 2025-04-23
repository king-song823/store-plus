import {
  Card,
  CardContent,
  CardHeader,
} from '@/app/[locale]/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import ProductPrice from '@/app/[locale]/components/shared/product/product-price';
// import { Product } from '@/types';
import Rating from './rating';
import { getTranslations } from 'next-intl/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProductCard = async ({ product }: { product: any }) => {
  const c = await getTranslations('Common');
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pt-8 items-center">
        <Link href={`/product/${product.slug}`}>
          <Image
            priority={true}
            src={product.images![0]}
            alt={product.name}
            className="aspect-square object-cover rounded"
            height={300}
            width={300}
          ></Image>
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <Rating value={Number(product.rating)} />
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">{c('Out_Of_Stock')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
