export const unstable_instant = { prefetch: 'static' };

import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductInfo from './ProductInfo';

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
        <Suspense fallback={<ProductLoader />}>
          {params.then(({ slug }) => (
            <ProductInfo slug={slug} />
          ))}
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function ProductLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-xs font-mono text-zinc-500 gap-3">
      <div className="w-6 h-6 border-2 border-zinc-700 border-t-white animate-spin"></div>
      <span>DECRYPTING SECURE SEGMENT DATA...</span>
    </div>
  );
}
