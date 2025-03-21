import { NextRequest, NextResponse } from 'next/server';
import { AlipaySdk } from 'alipay-sdk';
import { SERVER_URL } from '@/lib/constants';

const alipaySdk = new AlipaySdk({
  appId: process.env.ALIPAY_APP_ID!,
  privateKey: process.env.ALIPAY_PRIVATE_KEY!,
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY!,
  gateway: process.env.ALIPAY_GATEWAY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderId, amount, subject } = body;
  try {
    // 生成支付 URL
    const result = await alipaySdk.pageExecute('alipay.trade.page.pay', {
      method: 'GET',
      signType: 'RSA2',
      bizContent: {
        out_trade_no: orderId,
        product_code: 'FAST_INSTANT_TRADE_PAY',
        total_amount: amount,
        subject,
      },
      return_url: `${SERVER_URL}/order/${orderId}`,
      notify_url: `https://3169-14-153-129-71.ngrok-free.app/api/pay/alipay-notify`,
    });
    return NextResponse.json({ success: true, payUrl: result });
  } catch (error) {
    return NextResponse.json({ success: false, message: '支付失败', error });
  }
}
