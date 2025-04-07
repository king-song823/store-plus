import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const WECHAT_APP_ID = process.env.WECHAT_APP_ID!;
const WECHAT_MCH_ID = process.env.WECHAT_MCH_ID!;
const WECHAT_SERIAL_NO = process.env.WECHAT_SERIAL_NO!;
// const WECHAT_NOTIFY_URL = process.env.NEXT_PUBLIC_SERVER_URL!;
const WECHAT_APICLIENT_KEY = process.env.WECHAT_APICLIENT_KEY!;
const WECHAT_API_URL = process.env.WECHAT_API_URL!;

// 读取商户私钥
// const privateKey = fs.readFileSync(
//   path.resolve(WECHAT_PRIVATE_KEY_PATH),
//   'utf8'
// );
const privateKey = Buffer.from(WECHAT_APICLIENT_KEY, 'base64').toString(
  'utf-8'
);

console.log('privateKey', privateKey);

/**
 * 生成随机字符串
 */
function generateNonceStr(length = 32) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

/**
 * 生成签名
 */
function generateSignature(
  method: string,
  url: string,
  body: string,
  timestamp: string,
  nonceStr: string
): string {
  // 拼接待签名字符串
  const message = `${method}\n${url}\n${timestamp}\n${nonceStr}\n${body}\n`;

  // 创建签名
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(message);
  sign.end();

  // 使用私钥签名，并转换为 Base64
  return sign.sign(privateKey, 'base64');
}

/**
 * 创建微信支付订单
 */
export async function POST(req: NextRequest) {
  try {
    const { out_trade_no, total_fee, description, orderIdOrigin } =
      await req.json();
    const nonceStr = generateNonceStr();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const body = JSON.stringify({
      appid: WECHAT_APP_ID,
      mchid: WECHAT_MCH_ID,
      description,
      out_trade_no,
      attach: orderIdOrigin,
      time_expire: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5分钟后过期
      // notify_url: `${WECHAT_NOTIFY_URL}/api/pay/wechat-notify`,
      notify_url: `https://7ec5-14-153-132-182.ngrok-free.app/api/pay/wechat-notify`,
      amount: {
        total: total_fee * 100,
        currency: 'CNY',
      },
    });

    // 生成签名
    const signature = generateSignature(
      'POST',
      '/v3/pay/transactions/native',
      body,
      timestamp,
      nonceStr
    );
    const authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${WECHAT_MCH_ID}",nonce_str="${nonceStr}",timestamp="${timestamp}",signature="${signature}",serial_no="${WECHAT_SERIAL_NO}"`;

    // 发送请求
    const response = await fetch(WECHAT_API_URL, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
