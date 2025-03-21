import { NextRequest, NextResponse } from 'next/server';
import { AlipaySdk } from 'alipay-sdk';
import { approveAliPayOrder } from '@/lib/actions/order.action';

const alipaySdk = new AlipaySdk({
  appId: process.env.ALIPAY_APP_ID!,
  privateKey: process.env.ALIPAY_PRIVATE_KEY!,
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY!,
  gateway: process.env.ALIPAY_GATEWAY,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const params = Object.fromEntries(formData.entries());
  console.log('params', params);

  // 1️⃣ **校验支付宝签名**
  const isValid = alipaySdk.checkNotifySign(params);
  if (!isValid) {
    return NextResponse.json({ success: false, message: '签名验证失败' });
  }

  // Check order is already paid
  if (params.trade_status === 'TRADE_SUCCESS') {
    const orderId = params.out_trade_no; // 获取商户订单号
    const tradeNo = params.trade_no; // 支付宝交易号
    await approveAliPayOrder(
      orderId as string,
      params as {
        id: string;
        status: string;
        total_amount: string;
      }
    );
    console.log(`✅ 订单 ${orderId} 支付成功，支付宝交易号：${tradeNo}`);
  } else {
    console.log(
      `❌ 订单 ${params.out_trade_no} 支付失败，状态：${params.trade_status}`
    );
  }

  return new Response('success'); // 🚀 必须返回 "success"，否则支付宝会重复通知
}
