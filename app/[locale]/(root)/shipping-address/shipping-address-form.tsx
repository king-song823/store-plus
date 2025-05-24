'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { ShippingAddress } from '@/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingAddressSchema } from '@/lib/validator';
import { ControllerRenderProps } from 'react-hook-form';
import { shippingAddressDefaultValues } from '@/lib/constants';
// import { toast } from '@/hooks/use-toast';
import { useTransition } from 'react';
// import { updateUserAddress } from '@/lib/actions/user.actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/[locale]/components/ui/form';
import { Input } from '@/app/[locale]/components/ui/input';
import { Button } from '@/app/[locale]/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

const ShippingAddressForm = ({
  address,
}: {
  address: ShippingAddress | null;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const c = useTranslations('Common');

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = (
    values
  ) => {
    startTransition(async () => {
      console.log(values);
      // const res = await updateUserAddress(values);
      // if (!res.message) {
      //   toast({
      //     variant: 'destructive',
      //     description: res.message,
      //   });
      //   return;
      // }
      router.push(`/payment-method`);
    });
  };
  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">{c('Shipping_Address')}</h1>
        <p className="text-sm text-muted-foreground">{c('Enter_Address')}</p>
        <Form {...form}>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="fullName"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    'fullName'
                  >;
                }) => (
                  <FormItem className="w-full">
                    <FormLabel>{c('Full_Name')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={c('Input_Placeholder')}
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div>
              <FormField
                control={form.control}
                name="streetAddress"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    'streetAddress'
                  >;
                }) => (
                  <FormItem className="w-full">
                    <FormLabel>{c('Street_Address')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={c('Input_Placeholder')}
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="city"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    'city'
                  >;
                }) => (
                  <FormItem>
                    <FormLabel>{c('City')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={c('Input_Placeholder')}
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="country"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    'country'
                  >;
                }) => (
                  <FormItem className="w-full">
                    <FormLabel>{c('Country')}</FormLabel>
                    <FormControl>
                      <Input placeholder={c('Input_Placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>,
                    'postalCode'
                  >;
                }) => (
                  <FormItem className="w-full">
                    <FormLabel>{c('Postal_Code')}</FormLabel>
                    <FormControl>
                      <Input placeholder={c('Input_Placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                {c('Continue')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ShippingAddressForm;
