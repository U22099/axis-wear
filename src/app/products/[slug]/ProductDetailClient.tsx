"use client";

import { useState } from "react";
import { Product, ProductVariant } from "@/lib/database";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  ShoppingCart,
  Cpu,
  AlertTriangle,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  variants: ProductVariant[];
}

export default function ProductDetailClient({
  product,
  variants,
}: ProductDetailClientProps) {
  const { addToCart, setIsOpen } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectSize = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setFeedback(null);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setFeedback({
        success: false,
        message: "Please select a sizing variant.",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await addToCart(product, selectedVariant, quantity);
    setIsSubmitting(false);

    setFeedback({ success: result.ok, ...result });
    if (result.ok) {
      // Auto-open cart drawer after adding
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    }
  };

  // Total stock check
  const totalStockAvailable = variants.reduce((acc, v) => acc + v.stock, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      {/* Return to Catalog Link */}
      <Link
        href="/#catalog"
        className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 hover:text-white transition-colors mb-12 uppercase"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>// RETURN TO CATALOG</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Product Cinematic Image */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative w-full h-[65vh] border border-border-blueprint bg-charcoal-900/50 overflow-hidden group blueprint-corner">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-102 filter brightness-[0.9]"
            />
            {/* Corner tags for Blueprint aesthetic */}
            <div className="absolute bottom-3 left-3 text-[9px] font-mono text-zinc-500 bg-black/60 px-2 py-0.5 border border-zinc-900">
              FRAME // CORE_LOCK
            </div>
            <div className="absolute bottom-3 right-3 text-[9px] font-mono text-zinc-500 bg-black/60 px-2 py-0.5 border border-zinc-900">
              AXIS_WEAR_CO_2026
            </div>
          </div>
        </div>

        {/* Right Column: Garment Specs and Add-to-cart */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            {/* Header Product Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  // DEPLOYMENT LEVEL: {product.category}
                </span>
                <span className="text-[9px] font-mono text-emerald-500 border border-emerald-950 px-2 py-0.5 bg-emerald-950/10">
                  READY
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight uppercase leading-tight">
                {product.name}
              </h2>
              <div className="text-2xl font-bold font-mono text-white pt-2">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {/* Description Editorial copy */}
            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
              {product.description}
            </p>

            <div className="border-t border-border-blueprint my-6"></div>

            {/* Variant Size Selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  // CHOOSE SIZE VARIANT
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {selectedVariant
                    ? `SKU: ${selectedVariant.sku}`
                    : `SELECT ONE`}
                </span>
              </div>

              {totalStockAvailable === 0 ? (
                <div className="flex items-center gap-2 p-3 bg-red-950/20 border border-red-900/50 text-red-400 text-xs font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>PERIMETER SYSTEM NOTICE: OUT OF STOCK</span>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const isOutOfStock = v.stock <= 0;
                    return (
                      <button
                        key={v.id}
                        onClick={() => !isOutOfStock && handleSelectSize(v)}
                        disabled={isOutOfStock}
                        className={`py-3.5 text-center text-xs font-mono border transition-all relative ${
                          isOutOfStock
                            ? "border-zinc-950 bg-zinc-950 text-zinc-700 cursor-not-allowed"
                            : isSelected
                              ? "border-white bg-white text-black font-extrabold"
                              : "border-zinc-800 text-zinc-300 hover:border-zinc-500 hover:bg-charcoal-900"
                        }`}
                      >
                        {v.size}
                        {/* Tiny stock indicator inside square */}
                        {!isOutOfStock && (
                          <span
                            className={`absolute bottom-1 right-1.5 text-[8px] ${isSelected ? "text-zinc-600" : "text-zinc-500"}`}
                          >
                            {v.stock}
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="absolute bottom-1 right-1 text-[8px] text-red-900">
                            OUT
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected size inventory metrics */}
            {selectedVariant && (
              <div className="p-4 border border-border-blueprint bg-charcoal-900/30 font-mono text-[11px] text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>VARIANT ID:</span>
                  <span className="text-white">{selectedVariant.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>STOCK METRIC:</span>
                  <span
                    className={
                      selectedVariant.stock < 3
                        ? "text-amber-500"
                        : "text-emerald-500"
                    }
                  >
                    {selectedVariant.stock} UNITS AVAILABLE
                  </span>
                </div>
              </div>
            )}

            {/* Feedback alert notification */}
            {feedback && (
              <div
                className={`p-3 border text-xs font-mono text-center flex items-center justify-center gap-2 ${
                  feedback.success
                    ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-400"
                    : "bg-red-950/20 border-red-900/50 text-red-400"
                }`}
              >
                {feedback.success ? (
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Quantity Selector & Add to Cart button */}
            <div className="flex gap-4 pt-4">
              {selectedVariant && selectedVariant.stock > 0 && (
                <div className="flex items-center border border-border-blueprint bg-black shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-3 text-zinc-400 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(selectedVariant.stock, q + 1))
                    }
                    className="px-3 py-3 text-zinc-400 hover:text-white transition-colors"
                    disabled={quantity >= selectedVariant.stock}
                  >
                    +
                  </button>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={
                  totalStockAvailable === 0 || !selectedVariant || isSubmitting
                }
                className="flex-1 py-4 bg-white text-black font-bold text-xs font-mono tracking-widest hover:bg-zinc-200 transition-colors uppercase border border-white disabled:opacity-50 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-900 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>CONNECT TO CART</span>
              </button>
            </div>
          </div>

          {/* Garment details blueprint specifications block */}
          <div className="border-t border-border-blueprint pt-6 space-y-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
              // FABRIC SPEC SHEET
            </span>
            <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-zinc-400">
              <div className="space-y-1">
                <div>MATERIAL // Ripstop Cordura</div>
                <div>ZIPLOCKS // YKK AquaGuard®</div>
              </div>
              <div className="space-y-1">
                <div>LINING // Recycled Poly</div>
                <div>CERT // SHIELD-STD-04</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
