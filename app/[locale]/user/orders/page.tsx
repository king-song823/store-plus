import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/[locale]/components/ui/table';
import { getMyOrders } from '@/lib/actions/order.action';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import Pagination from '@/app/[locale]/components/shared/pagination';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('My_Orders'),
  };
}

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;
  const orders = await getMyOrders({
    page: Number(page) || 1,
  });

  const c = await getTranslations('Common');

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">{c('Orders')}</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{c('Id')}</TableHead>
              <TableHead>{c('Date')}</TableHead>
              <TableHead>{c('Total_price')}</TableHead>
              <TableHead>{c('Paid')}</TableHead>
              {/* <TableHead>{c('Delivered')}</TableHead> */}
              <TableHead>{c('Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(order.totalPrice))}
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : c('Not_paid')}
                </TableCell>
                {/* <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : c('Not_delivered')}
                </TableCell> */}
                <TableCell>
                  <Link href={`/order/${order.id}`}>
                    <span className="px-2">{c('Details')}</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {(orders.totalPages as number) > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={orders.totalPages as number}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
