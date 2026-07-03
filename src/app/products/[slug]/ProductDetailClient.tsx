'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ShieldCheck,
  ShoppingCart,
  AlertTriangle,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { FABRIC_SPECS } from '@/lib/constants';

interface ProductDetailClientProps {
  product: Product;
  variants: ProductVariant[];
}

export default function ProductDetailClient({
  product,
  variants,
}: ProductDetailClientProps) {
  const { addToCart, setIsOpen } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalStockAvailable = variants.reduce((acc, v) => acc + v.stock, 0);

  const handleSelectSize = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setFeedback(null);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setFeedback({ success: false, message: 'Please select a sizing variant.' });
      return;
    }
    setIsSubmitting(true);
    const result = await addToCart(product, selectedVariant, quantity);
    setIsSubmitting(false);
    setFeedback({ success: result.ok, message: result.message });
    if (result.ok) {
      setTimeout(() => setIsOpen(true), 500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">

      <Link
        href="/#catalog"
        className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 hover:text-white transition-colors mb-12 uppercase"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>// RETURN TO CATALOG</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        <div className="lg:col-span-7 space-y-6">
          <div className="relative w-full h-[65vh] border border-border-blueprint bg-charcoal-900/50 overflow-hidden group blueprint-corner">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02] brightness-[0.9]"
            />
            <div className="absolute bottom-3 left-3 text-[9px] font-mono text-zinc-500 bg-black/60 px-2 py-0.5 border border-zinc-900">
              FRAME // CORE_LOCK
            </div>
            <div className="absolute bottom-3 right-3 text-[9px] font-mono text-zinc-500 bg-black/60 px-2 py-0.5 border border-zinc-900">
              AXIS_WEAR_CO_2026
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">

                </span>
                <Badge variant="ready">READY</Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight uppercase leading-tight">
                {product.name}
              </h2>
              <div className="text-2xl font-bold font-mono text-white pt-2">
                ${product.price.toFixed(2)}
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
              {product.description}
            </p>

            <div className="border-t border-border-blueprint" />

            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">

                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {selectedVariant ? `SKU: ${selectedVariant.sku}` : 'SELECT ONE'}
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
                    const isOos = v.stock <= 0;
                    return (
                      <button
                        key={v.id}
                        onClick={() => !isOos && handleSelectSize(v)}
                        disabled={isOos}
                        className={[
                          'py-3.5 text-center text-xs font-mono border transition-all relative',
                          isOos
                            ? 'border-zinc-950 bg-zinc-950 text-zinc-700 cursor-not-allowed'
                            : isSelected
                            ? 'border-white bg-white text-black font-extrabold'
                            : 'border-zinc-800 text-zinc-300 hover:border-zinc-500 hover:bg-charcoal-900',
                        ].join(' ')}
                      >
                        {v.size}
                        {!isOos && (
                          <span
                            className={`absolute bottom-1 right-1.5 text-[8px] ${
                              isSelected ? 'text-zinc-600' : 'text-zinc-500'
                            }`}
                          >
                            {v.stock}
                          </span>
                        )}
                        {isOos && (
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
                      selectedVariant.stock < 3 ? 'text-amber-500' : 'text-emerald-500'
                    }
                  >
                    {selectedVariant.stock} UNITS AVAILABLE
                  </span>
                </div>
              </div>
            )}

            {feedback && (
              <div
                className={[
                  'p-3 border text-xs font-mono text-center flex items-center justify-center gap-2',
                  feedback.success
                    ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400'
                    : 'bg-red-950/20 border-red-900/50 text-red-400',
                ].join(' ')}
              >
                {feedback.success ? (
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

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
                    disabled={quantity >= selectedVariant.stock}
                    className="px-3 py-3 text-zinc-400 hover:text-white transition-colors disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={totalStockAvailable === 0 || !selectedVariant}
                isLoading={isSubmitting}
                fullWidth
                size="lg"
                leftIcon={<ShoppingCart className="w-4 h-4" />}
              >
                CONNECT TO CART
              </Button>
            </div>
          </div>

          <div className="border-t border-border-blueprint pt-6 space-y-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">

            </span>
            <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-zinc-400">
              {FABRIC_SPECS.map(({ label, value }) => (
                <div key={label}>
                  {label} {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
