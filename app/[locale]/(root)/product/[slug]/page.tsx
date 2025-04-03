/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProductBySlug } from '@/lib/actions/product.actions';
// import { Badge } from '@/app/[locale]/components/ui/badge';
import { Card, CardContent } from '@/app/[locale]/components/ui/card';
import { notFound } from 'next/navigation';
import ProductPrice from '@/app/[locale]/components/shared/product/product-price';
import ProductImages from '@/app/[locale]/components/shared/product/product-images';
// import AddToCart from '@/app/[locale]/components/shared/product/add-to-cart';
// import { getMyCart } from '@/lib/actions/cart.action';
import { auth } from '@/auth';
import ReviewList from './review-list';
import Rating from '@/app/[locale]/components/shared/product/rating';
import { getTranslations } from 'next-intl/server';
import PageLink from './page-link';
import PageDownLoad from './page-download';
import { Link } from '@/i18n/navigation';

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const { slug } = params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound;
  // const cart = await getMyCart();
  const session = await auth();
  console.log('session', session);
  const user = session?.user;
  const userId = user?.id;
  const t = await getTranslations('Product');

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Images Column */}
          <div className="col-span-2">
            <ProductImages images={product.images!} />
          </div>

          {/* Details Column */}
          <div className="col-span-1 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <Rating value={Number(product.rating)} />
              <p>
                {product.numReviews} {t('Reviews')}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ProductPrice
                  value={Number(product.price)}
                  className="rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <p>{t('Description')}:</p>
              <p>{product.description}</p>
            </div>
          </div>
          <div className="col-span-2">
            <Card>
              <CardContent className="p-4">
                目录:
                <ul>
                  {product.files.map((i: any, index: number) => (
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
                {user?.role !== 'vip' && (
                  <div className="text-center">
                    <Link href="/place-order">
                      <span className="font-bold">成为VIP会员</span>
                      可查看更多讲义
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold  mb-5">{t('Customer_Reviews')}</h2>
        <ReviewList
          productId={product.id}
          productSlug={product.slug}
          userId={userId || ''}
        />
      </section>
      {/* <section>
        <div>
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex justify-between">
                <div>{t('Price')}</div>
                <div>
                  <ProductPrice value={Number(product.price)} />
                </div>
              </div>
              <div className="mb-2 flex justify-between">
                <div>{t('Status')}</div>
                {product.stock > 0 ? (
                  <Badge variant="outline">{t('In_tock')}</Badge>
                ) : (
                  <Badge variant="destructive">{t('Unavailable')}</Badge>
                )}
              </div>
              {product.stock > 0 && (
                <div className=" flex-center">
                  <AddToCart
                    userId={session?.user?.id as string}
                    cart={cart}
                    item={{
                      productId: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price,
                      qty: 1,
                      image: product.images![0],
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section> */}
    </>
  );
};

export default ProductDetailsPage;
