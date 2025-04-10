import { getAllCategories, getProducts } from '@/lib/actions/product.actions';
import ProductSearchForm from './ProductSearchForm';
import ProductTable from '@/app/[locale]/components/ProductTable';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/app/[locale]/components/ui/card';
import { auth } from '@/auth';
import { Button } from '../../components/ui/button';
import { Link } from '@/i18n/navigation';
import { Label } from '../../components/ui/label';
import { ADMIN_ROlE, VIP_ROlE } from '@/lib/constants';
import { getUserById } from '@/lib/actions/user.actions';

function getVipRemainingDays(vipExpiresAt: Date): number {
  if (!vipExpiresAt) {
    return 0;
  }
  const now = new Date();
  const diffTime = vipExpiresAt.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page: string;
    year?: string;
    name?: string;
    fileName?: string;
    category?: string;
  }>;
}) {
  const session = await auth();
  const user = session?.user;
  const currentUser = await getUserById(user?.id as string);
  let products: unknown = [];
  let totalPages = null;
  const categorise = await getAllCategories();
  const remainingDays = getVipRemainingDays(currentUser?.vipExpiresAt as Date);
  const { page = '1', year, name, fileName, category } = await searchParams;
  if (user?.role === VIP_ROlE || user?.role === ADMIN_ROlE) {
    const res = await getProducts({
      page: Number(page),
      year: year ? Number(year) : undefined,
      name,
      fileName,
      category,
    });
    products = res.products;
    totalPages = res.totalPages || null;
  }

  return (
    <Card>
      {user?.role !== VIP_ROlE && user?.role !== ADMIN_ROlE && (
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-4">
            <Label>您还不是VIP, 暂时无法查看更多讲义</Label>
            <Button size="sm">
              <Link href={user ? '/place-order' : 'sign-in'}>成为VIP</Link>
            </Button>
          </div>
        </CardHeader>
      )}
      {user?.role === VIP_ROlE ||
        (user?.role === ADMIN_ROlE && (
          <CardHeader className="space-y-2">
            {remainingDays > 0 ? (
              <p className="text-green-600">
                您的 VIP 还有{' '}
                {user?.role === ADMIN_ROlE ? (
                  <></>
                ) : (
                  <div>
                    <span className="font-bold text-lg">{remainingDays}</span>{' '}
                    天
                  </div>
                )}
              </p>
            ) : user?.role === ADMIN_ROlE ? (
              <></>
            ) : (
              <div className="flex gap-4 items-center">
                <Label>您的 VIP 已过期</Label>
                <Button size="sm">
                  <Link href={user ? '/place-order' : 'sign-in'}>成为VIP</Link>
                </Button>
              </div>
            )}
          </CardHeader>
        ))}
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
