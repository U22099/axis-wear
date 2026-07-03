'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/database';
import type { Product, ProductVariant } from '@/lib/types';

interface UseCatalogResult {
  products: Product[];
  variants: ProductVariant[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useCatalog(): UseCatalogResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prods = await db.getProducts();
      setProducts(prods);

      const results = await Promise.all(prods.map((p) => db.getProductVariants(p.id)));
      setVariants(results.flat());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load catalog.';
      setError(msg);
      console.error('[useCatalog]', msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { products, variants, loading, error, refresh: load };
}
