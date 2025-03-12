import '@/assets/styles/globals.css';
import type { Metadata } from 'next';
import { APP_NAME, APP_DESCRIPTION, SERVER_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  return children;
}
