'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '@/app/[locale]/components/ui/input';
import { productDefaultValues } from '@/lib/constants';
import { insertProductSchema, updateProductSchema } from '@/lib/validator';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import slugify from 'slugify';
import { Button } from '@/app/[locale]/components/ui/button';
import { Textarea } from '@/app/[locale]/components/ui/textarea';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { toast } from '@/hooks/use-toast';
import { useRouter } from '@/i18n/navigation';
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent } from '@/app/[locale]/components/ui/card';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
// import { Checkbox } from '@/components/ui/checkbox';

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}) => {
  const t = useTranslations('Admin');
  const getSchema = (type: string) => {
    return type === 'Update' ? updateProductSchema : insertProductSchema;
  };
  const form = useForm<z.infer<ReturnType<typeof getSchema>>>({
    resolver: zodResolver(getSchema(type)),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  });

  const files = form.watch('files');
  const images = form.watch('images');

  const router = useRouter();
  const a = useTranslations('Admin');

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values
  ) => {
    if (type === 'Create') {
      const res = await createProduct(values);
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push(`/admin/products`);
      }
    } else {
      if (!productId) {
        router.push(`/admin/products`);
        return;
      }
      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        router.push(`/admin/products`);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'name'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>{t('Product_Name')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('Input_Placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Slug */}
          <FormField
            name="slug"
            control={form.control}
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'slug'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>{t('Slug')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={t('Input_Placeholder')}
                      {...field}
                    ></Input>
                    <Button
                      type="button"
                      disabled={!form.getValues('name')}
                      className="bg-gray-500 text-white px-4 py-1 mt-2 hover:bg-gray-600"
                      onClick={() => {
                        form.setValue(
                          'slug',
                          slugify(form.getValues('name'), { lower: true })
                        );
                      }}
                    >
                      {t('Generate')}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Category */}
          <FormField
            name="category"
            control={form.control}
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'category'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>{t('Category')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('Input_Placeholder')}
                    {...field}
                  ></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'brand'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>{t('Brand')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('Input_Placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'price'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>{t('Price')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('Input_Placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Stock  */}
          <FormField
            control={form.control}
            name="stock"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'stock'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>{t('STOCK')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('Input_Placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field flex flex-col gap-5 md:flex-row">
          {/* Files */}
          <FormField
            control={form.control}
            name="files"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>{t('Files')}</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {files?.map((file, index: number) => (
                        <div
                          key={file.url}
                          className="flex justify-center items-center gap-2"
                        >
                          <Link href={file.url} target="_blank">
                            {file.name}
                          </Link>
                          <button
                            className=" bg-red-500 text-white rounded-full p-1"
                            onClick={() => {
                              const newFiles = files.filter(
                                (_, i) => i !== index
                              );
                              form.setValue('files', newFiles);
                            }}
                          >
                            <X className="text-white" size={12} />
                          </button>
                        </div>
                      ))}

                      <FormControl>
                        <UploadButton
                          endpoint="pdfUploader"
                          onClientUploadComplete={(
                            res: { url: string; name: string }[]
                          ) => {
                            form.setValue('files', [
                              ...files,
                              { name: res[0].name, url: res[0].url },
                            ]);
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field md:flex-row">
          {/*Images */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>{t('Images')}</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.map((image: string, index: number) => (
                        <div
                          key={image}
                          className="flex justify-center items-center gap-2"
                        >
                          <Image
                            key={image}
                            src={image}
                            alt="product image"
                            className="w-20 h-20 object-cover object-center rounded-sm"
                            width={100}
                            height={100}
                            unoptimized
                          />
                          <button
                            className=" bg-red-500 text-white rounded-full p-1"
                            onClick={() => {
                              const newImages = images.filter(
                                (_, i) => i !== index
                              );
                              form.setValue('images', newImages);
                            }}
                          >
                            <X className="text-white" size={12} />
                          </button>
                        </div>
                      ))}

                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'description'
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>{t('Description')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('Input_Placeholder')}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting
              ? t('Submitting_Loading')
              : `${type === 'Update' ? a('Update') : a('Create')} ${t('Products')}`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
