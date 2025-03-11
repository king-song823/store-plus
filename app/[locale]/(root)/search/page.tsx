import ProductCard from '@/app/[locale]/components/shared/product/product-card';
import { Button } from '@/app/[locale]/components/ui/button';
import {
  getAllProducts,
  getAllCategories,
} from '@/lib/actions/product.actions';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

const prices = [
  {
    name: '¥1 - ¥50',
    value: '1-50',
  },
  {
    name: '¥51 - ¥100',
    value: '51-100',
  },
  {
    name: '¥101 - ¥200',
    value: '101-200',
  },
  {
    name: '¥201 - ¥500',
    value: '201-500',
  },
  {
    name: '¥501 - ¥1000',
    value: '501-1000',
  },
  {
    name: '¥1000+',
    value: '1000-99999999',
  },
];

const ratings = [5, 4, 3, 2, 1];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await props.searchParams;
  const c = await getTranslations('Common');
  const a = await getTranslations('Admin');

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet =
    category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      ${c('Search')} ${isQuerySet ? q : ''} 
      ${isCategorySet ? `: ${a('CATEGORY')} ${category}` : ''}
      ${isPriceSet ? `: ${a('Price')} ${price}` : ''}
      ${isRatingSet ? `:${a('RATING')} ${rating}` : ''}`,
    };
  } else {
    return {
      title: c('Search_Products'),
    };
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await props.searchParams;

  // Construct filter url
  const getFilterUrl = async ({
    c,
    p,
    s,
    r,
    pg,
  }: {
    c?: string;
    p?: string;
    s?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}` as string;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();
  const c = await getTranslations('Common');
  const a = await getTranslations('Admin');

  const sortOrders = [
    { value: 'newest', label: c('Newest') },
    { value: 'lowest', label: c('Lowest') },
    { value: 'highest', label: c('Highest') },
    { value: 'rating', label: c('Rating') },
  ];

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Category Links */}
        <div className="text-xl mb-2 mt-3">{c('Department')}</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (category === 'all' || category === '') && 'font-bold'
                }`}
                href={await getFilterUrl({ c: 'all' })}
              >
                {c('All')}
              </Link>
            </li>
            {categories.map(async (x) => (
              <li key={x.category}>
                <Link
                  className={`${category === x.category && 'font-bold'}`}
                  href={await getFilterUrl({ c: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Price Links */}
        <div className="text-xl mb-2 mt-8">{c('Price')}</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === 'all' && 'font-bold'}`}
                href={await getFilterUrl({ p: 'all' })}
              >
                {c('All')}
              </Link>
            </li>
            {prices.map(async (p) => (
              <li key={p.value}>
                <Link
                  className={`${price === p.value && 'font-bold'}`}
                  href={await getFilterUrl({ p: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Rating Links */}
        <div className="text-xl mb-2 mt-8">{c('Customer_Ratings')}</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${rating === 'all' && 'font-bold'}`}
                href={await getFilterUrl({ r: 'all' })}
              >
                {c('All')}
              </Link>
            </li>
            {ratings.map(async (r) => (
              <li key={r}>
                <Link
                  className={`${rating === r.toString() && 'font-bold'}`}
                  href={await getFilterUrl({ r: `${r}` })}
                >
                  {`${r} ${c('Stars_Up')}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== 'all' && q !== '' && `${c('Search')}: ` + q}
            {category !== 'all' &&
              category !== '' &&
              ` ${a('CATEGORY')}: ` + category}
            {price !== 'all' && ` ${a('Price')}: ` + price}
            {rating !== 'all' &&
              ` ${a('RATING')}: ` + rating + ` ${c('Stars_Up')}`}
            &nbsp;
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            rating !== 'all' ||
            price !== 'all' ? (
              <Button variant={'link'} asChild>
                <Link href={`/search`}>{c('Clear')}</Link>
              </Button>
            ) : null}
          </div>
          <div>
            {c('Sort_By')}{' '}
            {sortOrders.map(async (s) => (
              <Link
                key={s.value}
                className={`mx-2 ${sort == s.value && 'font-bold'}`}
                href={await getFilterUrl({ s: s.value })}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>{c('No_Products_Found')}</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
