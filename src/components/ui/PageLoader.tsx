'use client';

import React from 'react';

interface PageLoaderProps {
  label?: string;
  fullPage?: boolean;
}

export default function PageLoader({
  label = 'LOADING...',
  fullPage = true,
}: PageLoaderProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center gap-4',
        fullPage ? 'min-h-[70vh]' : 'py-24',
      ].join(' ')}
    >

      <div className="w-6 h-6 border-2 border-zinc-800 border-t-white animate-spin" />
      <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}
