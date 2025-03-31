import crypto from 'crypto';

function decryptWeChatPay(apiV3Key, ciphertext, associatedData, nonce) {
  try {
    const key = Buffer.from(apiV3Key, 'utf8');
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

    console.log('Key length:', Buffer.from(apiV3Key, 'utf8').length); // 应该是 32
    console.log('Nonce length:', Buffer.from(nonce, 'base64').length); // 应该是 12
    console.log('Ciphertext length:', Buffer.from(ciphertext, 'base64').length); // 应该 >= 1

    return JSON.parse(decrypted.toString('utf8'));
  } catch (error) {
    console.error('解密失败:', {
      message: error.message,
      stack: error.stack,
      keyLength: Buffer.from(apiV3Key, 'utf8').length,
      nonceLength: Buffer.from(nonce, 'base64').length,
      ciphertextLength: Buffer.from(ciphertext, 'base64').length,
    });
    console.error('解密失败:', error.message);
    return null;
  }
}

// 测试用参数
const apiV3Key = '093c66cd4f85da1794b8ccc5b0bd8633';
const params = {
  ciphertext:
    'aaJoJmoB685W8MumUvetYmoLN5WlRKK7DnuhYdVz4O0EOSMn7xvjZlxvrN/yrDXSzjj8kAmj5CuQ8cPNHNR4YOZcSpfwcvaCAZS/vNZjeke2Vszaa8QWdtulxvQGRsbfe4WEkoCUN6CVH+ESc/F1htue5O1GuwaKey1rfVdPhWA+IKtWlTFjc8NJlnsQnpbk4Q2L1Rr57mniJvf6Dxj06h9+y+tjL9cWvvCwu/LTTqboVJX+MUco/jlGzjOgMCGo3NoJUI9YO/YEHBmCeTCu4AcZyfPBlVlmGelwnTN5coGKXqUzZrC+6kuQISH6kuHJ44TMzzYKn9y5f4KeG0o6k45CfmpZXU3nR7cKpmIGU1gr4gATasbzaHi9YnDTr8KsO2d3wU9+IyEZ4+kY3nw/uOlIRT+gw7CAE3sx10FGHAh8m/IMaJ5HvJJJuci6FbRg802TGFt3XPQidW2VhREolWhoqVmmNuXjsZV2RJIbqqYCVdNV/sT9XGcHvkCXHPM2DjzT5vOrJj/JKK7oGQYbR7eDfp5IiylrlpD0iNjsThc+irrBG7HOMVzHiRMdVADaMY2uvNFqdETlO1M/A6PGZQ==',
  associatedData: 'transaction',
  nonce: '6yjPnq2wnEy3',
};

// 进行解密测试
const result = decryptWeChatPay(
  apiV3Key,
  params.ciphertext,
  params.associatedData,
  params.nonce
);
console.log('解密结果:', result);
