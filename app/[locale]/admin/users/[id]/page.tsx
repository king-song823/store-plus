import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.actions';
import UpdateUserForm from './update-user-form';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Common');
  return {
    title: t('Update_User'),
  };
}

const UpdateUserPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const c = await getTranslations('Common'); // 获取翻译
  const { id } = await props.params;

  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">{c('Update_User')}</h1>
      <UpdateUserForm user={user} />
    </div>
  );
};

export default UpdateUserPage;
