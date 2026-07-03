'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import HeroSection from '@/components/home/HeroSection';
import CatalogSection from '@/components/home/CatalogSection';
import SpecsSection from '@/components/home/SpecsSection';
import PageLoader from '@/components/ui/PageLoader';
import { useCatalog } from '@/hooks/useCatalog';

export default function Home() {
  const { products, variants, loading, refresh } = useCatalog();

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="grow bg-black flex flex-col">
        <HeroSection />

        {loading ? (
          <section className="py-32 border-t border-border-blueprint bg-black">
            <PageLoader label="LOADING CATALOG..." fullPage={false} />
          </section>
        ) : (
          <CatalogSection
            products={products}
            variants={variants}
            refreshProducts={refresh}
          />
        )}

        <SpecsSection />
      </main>

      <Footer />
    </>
  );
}
