'use client';

import React from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import { CATEGORIES, SIZES } from '@/lib/constants';

interface CatalogFiltersProps {
  selectedCategory: string;
  selectedSize: string;
  hideOutOfStock: boolean;
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
  onCategoryChange: (cat: string) => void;
  onSizeChange: (size: string) => void;
  onToggleInStock: () => void;
  onReset: () => void;
}

export default function CatalogFilters({
  selectedCategory,
  selectedSize,
  hideOutOfStock,
  hasActiveFilters,
  filteredCount,
  totalCount,
  onCategoryChange,
  onSizeChange,
  onToggleInStock,
  onReset,
}: CatalogFiltersProps) {
  return (
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
            onClick={() => onCategoryChange(cat)}
            className={[
              'px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors',
              selectedCategory === cat
                ? 'bg-white text-black border-white'
                : 'border-border-blueprint text-zinc-500 hover:text-zinc-200 hover:border-zinc-600',
            ].join(' ')}
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
            onClick={() => onSizeChange(size)}
            className={[
              'w-9 h-9 text-[10px] font-mono border transition-colors',
              selectedSize === size
                ? 'bg-white text-black border-white'
                : 'border-border-blueprint text-zinc-500 hover:text-zinc-200 hover:border-zinc-600',
            ].join(' ')}
          >
            {size}
          </button>
        ))}
      </div>

      <div className="text-zinc-800 hidden md:block">|</div>

      <button
        onClick={onToggleInStock}
        className={[
          'flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono border transition-colors uppercase',
          hideOutOfStock
            ? 'bg-white text-black border-white'
            : 'border-border-blueprint text-zinc-500 hover:text-zinc-200',
        ].join(' ')}
      >
        In Stock Only
      </button>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono text-zinc-600 hover:text-white transition-colors border border-transparent hover:border-zinc-800"
        >
          <RefreshCw className="w-3 h-3" />
          Clear Filters
        </button>
      )}

      <span className="ml-auto text-[10px] font-mono text-zinc-600">
        {filteredCount} of {totalCount} shown
      </span>
    </div>
  );
}
