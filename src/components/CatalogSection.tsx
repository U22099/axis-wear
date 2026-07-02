"use client";

import React, { useState } from "react";
import { Filter, RefreshCw } from "lucide-react";
import { Product, ProductVariant } from "@/lib/types";
import ProductCard from "./ProductCard";
import ExternalProductGrid from "./ExternalProductGrid";

interface CatalogSectionProps {
  products: Product[];
  variants: ProductVariant[];
  refreshProducts: () => void;
}

const CATEGORIES = ["All", "Outerwear", "Core"];
const SIZES = ["All", "S", "M", "L", "XL"];

export default function CatalogSection({
  products,
  variants,
  refreshProducts,
}: CatalogSectionProps) {
  const [activeTab, setActiveTab] = useState<"ours" | "external">("ours");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [hideOutOfStock, setHideOutOfStock] = useState(false);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "All" && product.category !== selectedCategory)
      return false;

    const productVariants = variants.filter((v) => v.product_id === product.id);

    if (selectedSize !== "All") {
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

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedSize("All");
    setHideOutOfStock(false);
    refreshProducts();
  };

  const hasActiveFilters =
    selectedCategory !== "All" || selectedSize !== "All" || hideOutOfStock;

  return (
    <section
      id="catalog"
      className="py-20 border-t border-border-blueprint bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[10px] font-mono text-zinc-600 block mb-2 tracking-widest">
              // 03 — PRODUCT CATALOG
            </span>
            <h2 className="text-4xl font-display font-bold uppercase text-white tracking-tight">
              Shop The Collection
            </h2>
          </div>

          <div className="flex w-fit gap-2 p-1 border border-border-blueprint bg-charcoal-900/50">
            <button
              onClick={() => setActiveTab("ours")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all
                ${activeTab === "ours" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
            >
              AxisWear Drops
            </button>
            <button
              onClick={() => setActiveTab("external")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all
                ${activeTab === "external" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
            >
              External Sector
            </button>
          </div>
        </div>

        {activeTab === "ours" && (
          <>
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-border-blueprint">
              <div className="flex items-center gap-2">
                <Filter className="w-3 h-3 text-zinc-600" />
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  Filter
                </span>
              </div>

              <div className="flex gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors
                      ${
                        selectedCategory === cat
                          ? "bg-white text-black border-white"
                          : "border-border-blueprint text-zinc-500 hover:text-zinc-200 hover:border-zinc-600"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="text-zinc-800 hidden md:block">|</div>

              <div className="flex gap-1.5">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-9 h-9 text-[10px] font-mono border transition-colors
                      ${
                        selectedSize === size
                          ? "bg-white text-black border-white"
                          : "border-border-blueprint text-zinc-500 hover:text-zinc-200 hover:border-zinc-600"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="text-zinc-800 hidden md:block">|</div>

              <button
                onClick={() => setHideOutOfStock(!hideOutOfStock)}
                className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono border transition-colors uppercase
                  ${
                    hideOutOfStock
                      ? "bg-white text-black border-white"
                      : "border-border-blueprint text-zinc-500 hover:text-zinc-200"
                  }`}
              >
                In Stock Only
              </button>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono text-zinc-600 hover:text-white transition-colors border border-transparent hover:border-zinc-800"
                >
                  <RefreshCw className="w-3 h-3" />
                  Clear Filters
                </button>
              )}

              <span className="ml-auto text-[10px] font-mono text-zinc-600">
                {filteredProducts.length} of {products.length} shown
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-border-blueprint">
                {filteredProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className={`bg-black
                    ${i === 0 && filteredProducts.length > 3 ? "md:col-span-2" : ""}`}
                  >
                    <ProductCard
                      product={product}
                      variants={variants.filter(
                        (v) => v.product_id === product.id,
                      )}
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

        {activeTab === "external" && <ExternalProductGrid />}
      </div>
    </section>
  );
}
