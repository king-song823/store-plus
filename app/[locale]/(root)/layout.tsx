import '@/assets/styles/globals.css';
import Header from '@/app/[locale]/components/shared/header';
import Footer from '@/app/[locale]/components/footer';
import Loading from '../loading';
import { Suspense } from 'react';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
      <Footer />
    </div>
  );
}
