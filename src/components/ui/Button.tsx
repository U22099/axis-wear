'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-white text-black border border-white hover:bg-zinc-200 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-900',
  ghost:
    'bg-transparent text-zinc-400 border border-border-blueprint hover:text-white hover:border-zinc-600 disabled:opacity-40',
  outline:
    'bg-charcoal-900 text-zinc-300 border border-border-blueprint hover:border-zinc-500 hover:text-white disabled:opacity-40',
  danger:
    'bg-transparent text-red-500 border border-red-900 hover:bg-red-950/20 disabled:opacity-40',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-xs',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 font-mono font-bold tracking-widest uppercase transition-all duration-200',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        'disabled:cursor-not-allowed',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
