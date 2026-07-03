'use client';

import React from 'react';

type BadgeVariant =
  | 'paid'
  | 'pending'
  | 'failed'
  | 'cancelled'
  | 'sold-out'
  | 'low-stock'
  | 'ready'
  | 'external';

const variantClasses: Record<BadgeVariant, string> = {
  paid:      'bg-emerald-950/20 border-emerald-900/50 text-emerald-400',
  pending:   'bg-amber-950/20  border-amber-900/50  text-amber-500',
  failed:    'bg-red-950/20    border-red-900/50    text-red-500',
  cancelled: 'bg-red-950/20    border-red-900/50    text-red-500',
  'sold-out':'bg-black/75      border-red-900/60    text-red-500',
  'low-stock':'bg-amber-950/80  border-amber-800/60  text-amber-400',
  ready:     'bg-emerald-950/10 border-emerald-950  text-emerald-500',
  external:  'bg-transparent   border-zinc-800      text-zinc-500',
};

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-block px-2 py-0.5 border text-[9px] uppercase font-bold tracking-wider font-mono',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
