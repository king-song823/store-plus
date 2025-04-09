export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A modern store built with Next.js';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: '',
  password: '',
};

export const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const shippingAddressDefaultValues = {
  fullName: '重庆市渝北区嵩山北路',
  streetAddress: '9栋2单元401',
  city: '中国',
  postalCode: '123456',
  country: '重庆',
};

export const PAYMENT_METHODS = ['Alipay_Payment', 'WeChat_Payment'];
export const DEFAULT_PAYMENT_METHOD = 'WeChat_Payment';
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;
export const productDefaultValues = {
  id: '',
  name: '',
  slug: '',
  category: '',
  images: [],
  files: [],
  brand: '',
  description: '',
  price: '',
  stock: 0,
  rating: '',
  numReviews: '',
  fileNamesStr: '',
  // isFeatured: false,
  // banner: null,
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(', ')
  : ['admin', 'techer', 'user', 'vip'];

export const reviewFormDefaultValues = {
  title: '',
  comment: '',
  rating: 0,
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

export const RMB = '¥';
export const HALF_YEAR_VIP = '1';
export const ONE_YEAR_VIP = '2';
