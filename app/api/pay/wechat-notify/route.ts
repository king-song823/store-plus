/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { approveAliPayOrder } from '@/lib/actions/order.action';
import { revalidatePath } from 'next/cache';

// 读取商户 API V3 证书的 **微信支付平台公钥**
const WECHAT_PUBLIC_KEY_PATH = process.env.WECHAT_PUBLIC_KEY_PATH!;
const WECHAT_API_V3_KEY = process.env.WECHAT_API_V3_KEY!;

// 读取公钥（用于验证微信支付签名）
const wechatPublicKey = fs.readFileSync(
  path.resolve(WECHAT_PUBLIC_KEY_PATH),
  'utf8'
);

/**
 * 验证微信支付签名
 */
async function verifySignature(req: NextRequest) {
  const timestamp = req.headers.get('wechatpay-timestamp')!;
  const nonce = req.headers.get('wechatpay-nonce')!;
  const signature = req.headers.get('wechatpay-signature')!;

  // 组合签名字符串
  const message = `${timestamp}\n${nonce}\n${req.body}\n`;

  // 使用微信支付平台公钥验签
  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(message);
  verify.end();

  return verify.verify(wechatPublicKey, signature, 'base64');
}

/**
 * 解密微信支付回调数据
 */
function decryptWechatData(
  nonce: string,
  associatedData: string,
  ciphertext: string
): any {
  try {
    const key = Buffer.from(WECHAT_API_V3_KEY, 'utf8');
    const iv = Buffer.from(nonce, 'utf8');
    const ciphertextBuffer = Buffer.from(ciphertext, 'base64');
    const authTagLength = 16;

    // 检查缓冲区长度是否足够
    if (ciphertextBuffer.length < authTagLength) {
      throw new Error('Ciphertext too short');
    }

    // 提取 AuthTag 和加密数据
    const authTag = ciphertextBuffer.slice(-authTagLength);
    const encryptedData = ciphertextBuffer.slice(0, -authTagLength);

    // 创建解密器
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    decipher.setAAD(Buffer.from(associatedData, 'utf8'));

    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return JSON.parse(decrypted.toString('utf8'));
  } catch (error: any) {
    console.error('解密失败:', error.message);
    return null;
  }
}

/**
 * 处理微信支付回调
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // **验证签名，防止伪造**
    if (!verifySignature(req)) {
      return NextResponse.json({ error: '签名验证失败' }, { status: 401 });
    }

    // **解密回调数据**
    const { resource } = body;
    const decryptedData = decryptWechatData(
      resource.nonce,
      resource.associated_data,
      resource.ciphertext
    );

    // **更新订单状态**
    const { trade_state, amount, attach } = decryptedData;
    if (trade_state === 'SUCCESS') {
      const res = await approveAliPayOrder(attach as string, {
        id: attach,
        status: trade_state,
        total_amount: String(Number(amount.total) / 100),
      });
      if (res.success) {
        console.log('还执行吗', res, revalidatePath);
        revalidatePath('/user/orders');
        revalidatePath('/user/orders', 'page');
        revalidatePath('/user/orders', 'layout');
      }
    }

    // **返回成功响应**
    return NextResponse.json({ code: 'SUCCESS' }, { status: 200 });
  } catch (error) {
    console.error('处理支付回调时发生错误:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
