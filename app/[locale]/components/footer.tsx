import { APP_NAME } from '@/lib/constants';
import { getTranslations } from 'next-intl/server';

const Footer = async () => {
  const currentYear = new Date().getFullYear();
  const t = await getTranslations('Common');

  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        {currentYear} {APP_NAME}. {t('All_Rights_Reserved')}
      </div>
    </footer>
  );
};

export default Footer;
