import { auth } from '@/auth';
import Pagination from '@/app/[locale]/components/shared/pagination';
import { Button } from '@/app/[locale]/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/[locale]/components/ui/table';
import { getAllOrders, deleteOrder } from '@/lib/actions/order.action';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Link from 'next/link';
import DeleteDialog from '@/app/[locale]/components/shared/delete-dialog';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('Admin_Orders'),
  };
}

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  const c = await getTranslations('Common');
  const { page = '1', query: searchText } = await props.searchParams;

  const session = await auth();
  if (session?.user.role !== 'admin')
    throw new Error(c('Admin_permission_required'));

  const orders = await getAllOrders({
    page: Number(page),
    query: searchText,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">{c('Orders')}</h1>
        {searchText && (
          <div>
            {c('Filtered_by')} <i>&quot;{searchText}&quot;</i>{' '}
            <Link href={`/admin/orders`}>
              <Button variant="outline" size="sm">
                {c('Remove_Filter')}
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{c('ID')}</TableHead>
              <TableHead>{c('Buyer')}</TableHead>
              <TableHead>{c('Date')}</TableHead>
              <TableHead>{c('Total')}</TableHead>
              <TableHead>{c('Paid')}</TableHead>
              <TableHead>{c('Delivered')}</TableHead>
              <TableHead>{c('Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(order.totalPrice))}
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : c('Not_Paid')}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : c('Not_Delivered')}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order/${order.id}`}>{c('Details')}</Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={orders?.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
