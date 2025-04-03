'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/[locale]/components/ui/card';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/app/[locale]/components/ui/radio-group';
import { Label } from '../../components/ui/label';
import PlaceOrderForm from './place-order-form';
import { User } from '@prisma/client';
import { formatCurrency } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { HALF_YEAR_VIP, ONE_YEAR_VIP } from '@/lib/constants';

const PackageSelector = ({ user }: { user: User }) => {
  const c = useTranslations('Common');
  const [totalPrice, setTotalPrice] = useState('199');

  return (
    <>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="overflow-x-auto md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{c('Payment_Method')}</h2>
              <p>{c(user.paymentMethod)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{c('Order_Items')}</h2>
              <h3 className="pb-4">🎓 精选学习套餐，助力高效提升！</h3>
              <RadioGroup
                defaultValue={HALF_YEAR_VIP}
                onValueChange={(i) => setTotalPrice(i)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={HALF_YEAR_VIP} id="r1" />
                  <Label htmlFor="r1">套餐A</Label>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>📌 半年套餐（183天）</CardTitle>
                    <CardDescription className="gap-4">
                      高效学习半年，紧跟讲义更新，知识尽在掌握！
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="gap-4">
                    <p>
                      ✅ 原价 <del className="">¥299</del>，新用户限时优惠{' '}
                      <mark className="font-bold">¥{HALF_YEAR_VIP}</mark>
                    </p>
                    <p>✅ 支持讲义下载，随时随地学习，不受网络限制</p>
                    <p>✅ 在有效期内随时查看讲义内容，掌握关键知识点</p>
                    <p>✅ 讲义持续更新，确保您获取最新的学习资料</p>
                  </CardContent>
                </Card>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={ONE_YEAR_VIP} id="r2" />
                  <Label htmlFor="r2">套餐B</Label>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>📌 一年套餐（365天）</CardTitle>
                    <CardDescription className="gap-4">
                      全程畅学一年，持续获取最新讲义，助力深度成长！
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="gap-4">
                    <p>
                      ✅ 原价 <del>¥399</del>，新用户限时优惠{' '}
                      <mark className="font-bold">¥{ONE_YEAR_VIP}</mark>{' '}
                    </p>
                    <p>✅ 享受与半年套餐相同的权益，学习时间更充裕 </p>
                    <p>✅ 长期规划，稳步提升，让知识沉淀更扎实</p>
                  </CardContent>
                </Card>
              </RadioGroup>
              <p className="mt-4">
                🔹 限时优惠，助力学习成长！
                立即选择适合您的套餐，让学习更高效、更便捷！ 🚀
              </p>
              <div className="flex justify-start gap-4"></div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>{c('Total')}</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              <PlaceOrderForm totalPrice={totalPrice} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PackageSelector;
