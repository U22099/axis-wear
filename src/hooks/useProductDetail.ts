'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/database';
import type { Product, ProductVariant } from '@/lib/types';

interface UseProductDetailResult {
  product: Product | null;
  variants: ProductVariant[];
  loading: boolean;
  notFound: boolean;
}

export function useProductDetail(slug: string): UseProductDetailResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const result = await db.getProductBySlug(slug);
      if (!result) {
        setNotFound(true);
        return;
      }
      setProduct(result);
      const variantsResult = await db.getProductVariants(result.id);
      setVariants(variantsResult);
    } catch (err) {
      console.error('[useProductDetail]', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  return { product, variants, loading, notFound };
}
