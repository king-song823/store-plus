import { getAllCategories, getProducts } from '@/lib/actions/product.actions';
import ProductSearchForm from './ProductSearchForm';
import ProductTable from '@/app/[locale]/components/ProductTable';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/app/[locale]/components/ui/card';
import { auth } from '@/auth';
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    page: string;
    year?: string;
    name?: string;
    fileName?: string;
    category?: string;
  };
}) {
  const session = await auth();
  console.log('session', session);
  const user = session?.user;
  const { page = '1', year, name, fileName, category } = await searchParams;
  let products: unknown = [];
  let totalPages = null;
  const categorise = await getAllCategories();

  if (user?.role === 'vip') {
    const res = await getProducts({
      page: Number(page),
      year: year ? Number(year) : undefined,
      name,
      fileName,
      category,
    });
    products = res.products;
    totalPages = res.totalPages;
  } else {
  }

  return (
    <Card>
      <CardHeader className="space-y-2" />
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <ProductSearchForm
            role={user?.role}
            categorise={JSON.parse(JSON.stringify(categorise))}
          />
          <ProductTable
            products={JSON.parse(JSON.stringify(products))}
            totalPages={totalPages}
            currentPage={Number(page)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
