import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function converToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

// Format Errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any): string {
  const { name, errors, code, meta } = error;
  if (name === 'ZodError') {
    const fieldErrors = Object.keys(errors).map((field) => {
      const message = errors[field].message;
      return typeof message === 'string' ? message : JSON.stringify(message);
    });
    return fieldErrors.join('. ');
  } else if (name === 'PrismaClientKnownRequestError' && code === 'P2002') {
    const field = meta?.target ? meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    // Handle other errors
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}

// Round to 2 decimal places
export const round2 = (value: number | string) => {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100; // avoid rounding errors
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('value is not a number nor a string');
  }
};

const CURRENCY_FORMATTER = new Intl.NumberFormat('zh-CN', {
  currency: 'CNY', // 人民币
  style: 'currency',
  minimumFractionDigits: 2,
});

export function generateOrderId() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.T]/g, '')
    .slice(2, 16); // 获取当前时间的前14位字符，去掉符号
  const random = Math.random().toString(36).substring(2, 11); // 生成9个字符的随机字符串
  return `lingpao_${timestamp}_${random}`; // 拼接成最终的 ID 格式
}

// Format currency
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
}

export const calculateVipExpiresAt = (packageDays: number) => {
  const vipExpiresAt = new Date();
  vipExpiresAt.setDate(vipExpiresAt.getDate() + packageDays);
  return vipExpiresAt;
};

// Shorten ID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // 缩写的月份名称（例如，'10月'）
    year: 'numeric', // 数字年份（例如，'2023'）
    day: 'numeric', // 数字的日期（例如，'25'）
    hour: 'numeric', // 数字小时（例如，'8'）
    minute: 'numeric', // 数字分钟（例如，'30'）
    hour12: true, // 使用12小时制（true）还是24小时制（false）
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // 缩写的星期几（例如，'周一'）
    month: 'short', // 缩写的月份名称（例如，'10月'）
    year: 'numeric', // 数字年份（例如，'2023'）
    day: 'numeric', // 数字的日期（例如，'25'）
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // 数字小时（例如，'8'）
    minute: 'numeric', // 数字分钟（例如，'30'）
    hour12: true, // 使用12小时制（true）还是24小时制（false）
  };

  // 设置为中国北京时区
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'zh-CN',
    { ...dateTimeOptions, timeZone: 'Asia/Shanghai' }
  );
  const formattedDate: string = new Date(dateString).toLocaleString('zh-CN', {
    ...dateOptions,
    timeZone: 'Asia/Shanghai',
  });
  const formattedTime: string = new Date(dateString).toLocaleString('zh-CN', {
    ...timeOptions,
    timeZone: 'Asia/Shanghai',
  });

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Form Pagination Links
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    { skipNull: true }
  );
}

//  Format Numbers
const NUMBER_FORMATTER = new Intl.NumberFormat('zh-CN');
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export function handleError(error: unknown, params?: object) {
  return {
    success: false,
    message: formatError(error),
    ...params,
  };
}
