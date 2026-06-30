"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Product, ProductVariant } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  variants: ProductVariant[];
  wide?: boolean; // span 2 columns for featured items
}

export default function ProductCard({
  product,
  variants,
  wide = false,
}: ProductCardProps) {
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
  const availableSizes = variants.filter((v) => v.stock > 0).map((v) => v.size);

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group relative flex flex-col border border-border-blueprint bg-charcoal-900/30
        hover:bg-charcoal-900 hover:border-zinc-700 transition-all duration-500 ${wide ? "md:flex-row" : ""} `}
    >
      {/* Product image */}
      <div
        className={`relative overflow-hidden bg-zinc-950 shrink-0
        ${wide ? "w-full md:w-[55%] h-125" : "w-full h-80"}`}
      >
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes={
            wide
              ? "(max-width:768px) 100vw, 55vw"
              : "(max-width:768px) 100vw, 33vw"
          }
          className="object-cover brightness-90 group-hover:brightness-100 group-hover:scale-[1.03] transition-all duration-700"
        />
        {/* Status badge */}
        {totalStock === 0 && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            <span className="text-[11px] font-mono text-red-500 tracking-widest border border-red-900/60 px-3 py-1.5">
              SOLD OUT
            </span>
          </div>
        )}
        {totalStock > 0 && totalStock <= 5 && (
          <div className="absolute top-3 left-3 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 text-[9px] font-mono text-amber-400 tracking-wider">
            LOW STOCK
          </div>
        )}
      </div>

      {/* Info */}
      <div
        className={`flex flex-col justify-between p-5 ${wide ? "flex-1" : ""}`}
      >
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600">
            <span>// {product.category.toUpperCase()}</span>
            <span>
              {totalStock > 0 ? `${totalStock} units` : "Out of stock"}
            </span>
          </div>
          <h3 className="text-base font-display font-bold uppercase tracking-tight text-white group-hover:text-zinc-200 transition-colors line-clamp-2">
            {product.name}
          </h3>
          {wide && (
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 font-sans mt-1">
              {product.description}
            </p>
          )}

          {/* Available sizes */}
          {availableSizes.length > 0 && (
            <div className="flex gap-1.5 pt-1 flex-wrap">
              {availableSizes.map((s) => (
                <span
                  key={s}
                  className="text-[9px] font-mono border border-zinc-800 text-zinc-500 px-1.5 py-0.5"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-blueprint/40">
          <span className="text-base font-mono font-bold text-white">
            ${product.price.toFixed(2)}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 group-hover:text-white transition-colors uppercase">
            View Details
            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
