'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HeroSection from '@/components/HeroSection';
import CatalogSection from '@/components/CatalogSection';
import { db, Product, ProductVariant } from '@/lib/database';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCatalog() {
    try {
      const prods = await db.getProducts();
      setProducts(prods);
  
      const variantPromises = prods.map((p) => db.getProductVariants(p.id));
      const variantsResults = await Promise.all(variantPromises);
      
      const allVariants = variantsResults.flat();
      setVariants(allVariants);
    } catch (err: any) {
      console.error('Failed to load catalog:', err.message);
    } finally {
      setLoading(false);
    }
  }

  const refreshProducts = () => {
    loadCatalog().catch(error => console.error('Failed refresh:', error.message))
  }
  useEffect(() => {
    loadCatalog();
  }, []);

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="grow bg-black">
        <HeroSection />

        {loading ? (
          <section className="flex items-center justify-center py-32 border-t border-border-blueprint bg-black">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-6 h-6 text-zinc-600 animate-spin" />
              <span className="text-xs font-mono text-zinc-600 tracking-widest">LOADING CATALOG...</span>
            </div>
          </section>
        ) : (
          <CatalogSection products={products} variants={variants} refreshProducts={refreshProducts} />
        )}

        <section id="specs" className="py-16 border-t border-border-blueprint bg-charcoal-900/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-10">
              <span className="text-[10px] font-mono text-zinc-600 block mb-2 tracking-widest">// 04 — TECHNICAL SPECIFICATIONS</span>
              <h2 className="text-3xl font-display font-bold uppercase text-white tracking-tight">Built Different</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-blueprint">
              {[
                { label: 'Shell Material', value: '3-Layer Technical Nylon', sub: 'DWR Treated, 20K/20K Rated' },
                { label: 'Seam Sealing', value: 'Fully Taped', sub: 'Critical seams heat-welded' },
                { label: 'Insulation', value: '650-Fill Down / PrimaLoft', sub: 'Hydrophobic treated' },
                { label: 'Zippers', value: 'YKK AquaGuard', sub: 'Water-resistant coil' },
                { label: 'Pockets', value: '6–8 Pockets', sub: 'Mesh, zippered, phone-compatible' },
                { label: 'Packability', value: 'Packable to Stuff Sack', sub: 'Fist-sized compression' },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-black p-8 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block">{label}</span>
                  <p className="font-display font-bold text-lg uppercase text-white leading-tight">{value}</p>
                  <p className="text-xs font-sans text-zinc-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
