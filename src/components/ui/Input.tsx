'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export default function Input({
  label,
  icon,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          {...props}
          className={[
            'w-full bg-black border border-border-blueprint text-zinc-300',
            'px-4 py-2.5 text-xs font-mono',
            'focus:outline-none focus:border-zinc-500',
            'placeholder:text-zinc-700',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            icon ? 'pl-10' : '',
            error ? 'border-red-900/70 focus:border-red-700' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
            {icon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-[10px] font-mono text-red-400">{error}</p>
      )}
    </div>
  );
}
