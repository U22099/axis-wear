'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useProductDetail } from '@/hooks/useProductDetail';
import ProductDetailClient from './ProductDetailClient';
import PageLoader from '@/components/ui/PageLoader';

interface ProductInfoProps {
  slug: string;
}

export default function ProductInfo({ slug }: ProductInfoProps) {
  const { product, variants, loading, notFound } = useProductDetail(slug);
  const router = useRouter();

  // Redirect to 404 page when product is not found — done in an effect
  // so it happens after initial render (valid in 'use client' components)
  useEffect(() => {
    if (notFound) {
      router.replace('/not-found');
    }
  }, [notFound, router]);

  if (loading || notFound) {
    return <PageLoader label="DECRYPTING SECURE SEGMENT DATA..." />;
  }

  if (!product) return null;

  return <ProductDetailClient product={product} variants={variants} />;
}
