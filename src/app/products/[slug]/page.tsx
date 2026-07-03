
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ProductInfo from './ProductInfo';
import PageLoader from '@/components/ui/PageLoader';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <Header />
      <CartDrawer />
      <main className="grow bg-black">
        <Suspense fallback={<PageLoader label="DECRYPTING SECURE SEGMENT DATA..." />}>
          {params.then(({ slug }) => (
            <ProductInfo slug={slug} />
          ))}
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
