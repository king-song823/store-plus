'use client';

import { Button } from '@/app/[locale]/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/[locale]/components/ui/form';
import { Input } from '@/app/[locale]/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  updateProfileSchema,
  updateProfilePasswordSchema,
} from '@/lib/validator';
import {
  updateProfile,
  updateProfilePassword,
} from '@/lib/actions/user.actions';
import { useTranslations } from 'next-intl';

const ProfileForm = () => {
  const { data: session, update } = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  });

  const passwordForm = useForm<z.infer<typeof updateProfilePasswordSchema>>({
    resolver: zodResolver(updateProfilePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const c = useTranslations('Common');

  // Submit form to update profile
  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    const res = await updateProfile(values);

    if (!res.success)
      return toast({
        variant: 'destructive',
        description: res.message,
      });

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    };

    await update(newSession);

    toast({
      description: res.message,
    });
  }

  const onPasswordSubmit = async (
    values: z.infer<typeof updateProfilePasswordSchema>
  ) => {
    const res = await updateProfilePassword({ ...values });
    toast({
      variant: !res?.success ? 'destructive' : 'default',
      description: res?.message,
    });
  };

  return (
    <div className="flex gap-4 flex-col justify-between">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{c('Email')}</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="Email"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{c('Profile')}</FormLabel>

                  <FormControl>
                    <Input {...field} className="input-field" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting
              ? c('Submitting_Loading')
              : c('Update_Profile')}
          </Button>
        </form>
      </Form>
      <div className="border-t border-gray-200 my-4 mt-10 mb-10" />
      <div>
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-5">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{c('Old_Password')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{c('New_Password')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{c('Confirm_Password')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={passwordForm.formState.isSubmitting}
              className="button col-span-2 w-full"
            >
              {passwordForm.formState.isSubmitting
                ? c('Submitting_Loading')
                : c('Change_Password')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default ProfileForm;
