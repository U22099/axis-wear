"use client";

import { db, Product, ProductVariant } from "@/lib/database";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { useEffect, useState } from "react";

interface ProductInfoProps {
  slug: string;
}

export default function ProductInfo({ slug }: ProductInfoProps) {
  const [product, setProduct] = useState<Product>();
  const [variants, setvariants] = useState<ProductVariant[]>();

  useEffect(() => {
    (async () => {
      const result = await db.getProductBySlug(slug);
      if (!result) {
        notFound();
      }
      setProduct(result);
      const variantsResult = await db.getProductVariants(result.id);
      setvariants(variantsResult);
    })();
  }, []);

  if (!product || !variants) return <ProductLoader />;

  return <ProductDetailClient product={product} variants={variants} />;
}

function ProductLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-xs font-mono text-zinc-500 gap-3">
      <div className="w-6 h-6 border-2 border-zinc-700 border-t-white animate-spin"></div>
      <span>DECRYPTING SECURE SEGMENT DATA...</span>
    </div>
  );
}
