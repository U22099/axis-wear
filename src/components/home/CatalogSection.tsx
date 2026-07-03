'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';
import ExternalProductGrid from '@/components/product/ExternalProductGrid';
import CatalogFilters from '@/components/home/CatalogFilters';
import SectionLabel from '@/components/ui/SectionLabel';

interface CatalogSectionProps {
  products: Product[];
  variants: ProductVariant[];
  refreshProducts: () => void;
}

export default function CatalogSection({
  products,
  variants,
  refreshProducts,
}: CatalogSectionProps) {
  const [activeTab, setActiveTab] = useState<'ours' | 'external'>('ours');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [hideOutOfStock, setHideOutOfStock] = useState(false);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory)
      return false;

    const productVariants = variants.filter((v) => v.product_id === product.id);

    if (selectedSize !== 'All') {
      const hasSize = productVariants.some(
        (v) => v.size === selectedSize && v.stock > 0,
      );
      if (!hasSize) return false;
    }

    if (hideOutOfStock) {
      const totalStock = productVariants.reduce((sum, v) => sum + v.stock, 0);
      if (totalStock <= 0) return false;
    }

    return true;
  });

  const hasActiveFilters =
    selectedCategory !== 'All' || selectedSize !== 'All' || hideOutOfStock;

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSize('All');
    setHideOutOfStock(false);
    refreshProducts();
  };

  return (
    <section id="catalog" className="py-20 border-t border-border-blueprint bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header + tab switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionLabel index="03" tag="PRODUCT CATALOG" title="Shop The Collection" />

          <div className="flex w-fit gap-2 p-1 border border-border-blueprint bg-charcoal-900/50">
            {(['ours', 'external'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  'px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all',
                  activeTab === tab
                    ? 'bg-white text-black'
                    : 'text-zinc-500 hover:text-white',
                ].join(' ')}
              >
                {tab === 'ours' ? 'AxisWear Drops' : 'External Sector'}
              </button>
            ))}
          </div>
        </div>

        {/* AxisWear products */}
        {activeTab === 'ours' && (
          <>
            <CatalogFilters
              selectedCategory={selectedCategory}
              selectedSize={selectedSize}
              hideOutOfStock={hideOutOfStock}
              hasActiveFilters={hasActiveFilters}
              filteredCount={filteredProducts.length}
              totalCount={products.length}
              onCategoryChange={setSelectedCategory}
              onSizeChange={setSelectedSize}
              onToggleInStock={() => setHideOutOfStock((v) => !v)}
              onReset={resetFilters}
            />

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-border-blueprint">
                {filteredProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className={[
                      'bg-black',
                      i === 0 && filteredProducts.length > 3 ? 'md:col-span-2' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <ProductCard
                      product={product}
                      variants={variants.filter((v) => v.product_id === product.id)}
                      wide={i === 0 && filteredProducts.length > 3}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 space-y-4 border border-dashed border-border-blueprint">
                <span className="text-zinc-700 font-mono text-4xl">//</span>
                <p className="text-sm font-mono text-zinc-500">
                  No products match the selected filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="text-xs font-mono text-zinc-400 hover:text-white border border-zinc-800 px-4 py-2 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}

        {/* External grid */}
        {activeTab === 'external' && <ExternalProductGrid />}
      </div>
    </section>
  );
}
