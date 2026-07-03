'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import PageLoader from '@/components/ui/PageLoader';

interface ExternalProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  rating: { rate: number; count: number };
}

export default function ExternalProductGrid() {
  const [products, setProducts] = useState<ExternalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/category/men's%20clothing")
      .then((r) => r.json())
      .then((data: ExternalProduct[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load external catalog. Check your connection.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <PageLoader label="CONNECTING TO EXTERNAL SECTOR..." fullPage={false} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 border border-dashed border-border-blueprint">
        <span className="text-4xl text-zinc-700 font-mono">//</span>
        <p className="text-sm font-mono text-zinc-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-3 pb-4 border-b border-border-blueprint">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
          Live Feed // Fake Store API — Men&apos;s Clothing
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group border border-border-blueprint bg-charcoal-900/20 hover:bg-charcoal-900 hover:border-zinc-700 transition-all duration-500 flex flex-col"
          >

            <div className="relative h-56 bg-zinc-950/80 overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-6 group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
              />
            </div>

            <div className="flex flex-col flex-1 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">

                </span>
                <span className="text-[9px] font-mono text-zinc-600">
                  ★ {product.rating.rate} ({product.rating.count})
                </span>
              </div>
              <h3 className="text-xs font-display font-bold text-white line-clamp-2 uppercase leading-tight">
                {product.title}
              </h3>
              <p className="text-[10px] font-sans text-zinc-500 line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-center justify-between pt-3 mt-auto border-t border-border-blueprint/40">
                <span className="text-sm font-mono font-bold text-white">
                  ${product.price.toFixed(2)}
                </span>
                <a
                  href="https://fakestoreapi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[9px] font-mono text-zinc-500 hover:text-white transition-colors uppercase"
                >
                  External Source
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-mono text-zinc-700 text-center pt-2">
        Products sourced from Fake Store API for demonstration purposes only.
      </p>
    </div>
  );
}
