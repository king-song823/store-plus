import { PAYMENT_METHODS } from './constants/index';
import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';
// Make sure price is formatted with two decimal places
const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    'Price must have exactly two decimal places (e.g., 49.99)'
  );

const imageSchema = z.object({
  name: z.string(),
  url: z.string(),
});

import i18JsonZh from '../messages/zh.json';

// Schema for inserting a product
export const insertProductSchema = z.object({
  name: z
    .string()
    .min(2, i18JsonZh['Common']['Name_Must_Be_At_Least_3_Characters']),
  slug: z
    .string()
    .min(2, i18JsonZh['Common']['Slug_Must_Be_At_Least_3_Characters']),
  category: z
    .string()
    .min(2, i18JsonZh['Common']['Category_Must_Be_At_Least_3_Characters']),
  brand: z
    .string()
    .min(2, i18JsonZh['Common']['Brand_Must_Be_At_Least_3_Characters']),
  description: z
    .string()
    .min(2, i18JsonZh['Common']['Description_Must_Be_At_Least_3_Characters']),
  stock: z.coerce.number(),
  files: z
    .array(imageSchema)
    .min(1, i18JsonZh['Common']['Files_Must_Have_At_Least_One_File'])
    .default([]),
  images: z.array(
    z
      .string()
      .min(1, i18JsonZh['Common']['Images_Must_Have_At_Least_One_Image'])
  ),
  price: currency,
});

// Schema for signing in a user
export const signInFormSchema = z.object({
  email: z
    .string()
    .email(i18JsonZh['Common']['Invalid_Email_Address'])
    .min(3, i18JsonZh['Common']['Email_Must_Be_At_Least_3_Characters']),
  password: z
    .string()
    .min(6, i18JsonZh['Common']['Password_Must_Be_At_Least_6_Characters']),
});

// Schema for signing up a user
export const signUpFormSchema = z.object({
  name: z
    .string()
    .min(2, i18JsonZh['Common']['Name_Must_Be_At_Least_3_Characters']),
  email: z
    .string()
    .email(i18JsonZh['Common']['Invalid_Email_Address'])
    .min(3, i18JsonZh['Common']['Email_Must_Be_At_Least_3_Characters']),
  password: z
    .string()
    .min(6, i18JsonZh['Common']['Password_Must_Be_At_Least_6_Characters'])
    .regex(/[a-z]/, i18JsonZh.Common.Password_Need_Lowercase)
    .regex(/\d/, i18JsonZh.Common.Password_Need_Number)
    .regex(/[@$!%*?#&_]/, i18JsonZh.Common.Password_Need_SpecialChar),
  confirmPassword: z
    .string()
    .min(
      6,
      i18JsonZh['Common']['Confirm_Password_Must_Be_At_Least_3_Characters']
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .refine((data: any) => data.password === data.confirmPassword, {
      message: i18JsonZh['Common']['Passwords_Dont_Match'],
      path: ['confirmPassword'],
    }),
});

// Schema for Cart
export const cartItemSchema = z.object({
  productId: z.string().min(1, i18JsonZh['Common']['Product_Is_Required']),
  name: z.string().min(1, i18JsonZh['Common']['Name_Is_Required']),
  slug: z.string().min(1, i18JsonZh['Common']['Slug_Is_Required']),
  qty: z
    .number()
    .int()
    .nonnegative(i18JsonZh['Common']['Quantity_Must_Be_A_Positive_Number']),
  image: z.string().min(1, i18JsonZh['Common']['Image_Is_Required']),
  price: currency,
});

// Schema for Insert a Cart
export const insertCartSchema = z.object({
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  userId: z.string().optional().nullable(),
});

// Schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z
    .string()
    .min(3, i18JsonZh['Common']['Name_Must_Be_At_Least_3_Characters']),
  streetAddress: z
    .string()
    .min(2, i18JsonZh['Common']['Address_Must_Be_At_Least_3_Characters']),
  city: z
    .string()
    .min(2, i18JsonZh['Common']['City_Must_Be_At_Least_3_Characters']),
  postalCode: z
    .string()
    .min(3, i18JsonZh['Common']['Postal_Code_Must_Be_At_Least_3_Characters']),
  country: z
    .string()
    .min(2, i18JsonZh['Common']['Country_Must_Be_At_Least_3_Characters']),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Schema for paymemtMethods
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, i18JsonZh['Common']['Payment_Method_Is_Required']),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: i18JsonZh['Common']['Invalid_Payment_Method'],
  });

// Insert order schema
export const insertOrderSchema = z.object({
  userId: z.string().min(1, i18JsonZh['Common']['User_Is_Required']),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: i18JsonZh['Common']['Invalid_Payment_Method'],
  }),
  // shippingAddress: shippingAddressSchema,
});

// Insert orderItem shema
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});
// PaymentResult
export const paymentResultSchema = z.object({
  id: z.string(),
  emailAddress: z.string(),
  status: z.string(),
  pricePaid: z.string(),
});

// Update Profile Schema
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, i18JsonZh['Common']['Name_Must_Be_At_Least_3_Characters']),
  email: z
    .string()
    .min(3, i18JsonZh['Common']['Email_Must_Be_At_Least_3_Characters']),
  password: z
    .string()
    .min(6, i18JsonZh['Common']['Password_Must_Be_At_Least_6_Characters'])
    .regex(/[a-z]/, i18JsonZh.Common.Password_Need_Lowercase)
    .regex(/\d/, i18JsonZh.Common.Password_Need_Number)
    .regex(/[@$!%*?#&_]/, i18JsonZh.Common.Password_Need_SpecialChar),
  confirmPassword: z
    .string()
    .min(
      6,
      i18JsonZh['Common']['Confirm_Password_Must_Be_At_Least_3_Characters']
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .refine((data: any) => data.password === data.confirmPassword, {
      message: i18JsonZh['Common']['Passwords_Dont_Match'],
      path: ['confirmPassword'],
    }),
});
// Schema for updating a product
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, i18JsonZh['Common']['Id_Is_Required']),
});

// Update User Schema
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, i18JsonZh['Common']['Id_Is_Required']),
  role: z.string().min(1, i18JsonZh['Common']['Role_Is_Required']),
});

// Schema for a review
export const insertReviewSchema = z.object({
  rating: z.coerce
    .number()
    .int()
    .min(1, i18JsonZh['Common']['Rating_Must_Be_At_Least_1'])
    .max(5, i18JsonZh['Common']['Rating_Must_Be_At_Most_5']),
  title: z
    .string()
    .min(2, i18JsonZh['Common']['Title_Must_Be_At_Least_3_Characters']),
  description: z
    .string()
    .min(2, i18JsonZh['Common']['Description_Must_Be_At_Least_3_Characters']),
  productId: z.string().min(1, i18JsonZh['Common']['Product_Is_Required']),
  userId: z.string().min(1, i18JsonZh['Common']['User_Is_Required']),
});
