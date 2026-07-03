'use client';

import React from 'react';

interface SectionLabelProps {
  index?: string;      // e.g. "03"
  tag?: string;        // e.g. "PRODUCT CATALOG"
  title: string;       // e.g. "Shop The Collection"
  className?: string;
}

/**
 * Reusable section header used across the app.
 * Renders a monospace tag line  `// XX — TAG`  above a display-font heading.
 */
export default function SectionLabel({
  index,
  tag,
  title,
  className = '',
}: SectionLabelProps) {
  const tagLine = [index && index, tag].filter(Boolean).join(' — ');

  return (
    <div className={['space-y-1', className].join(' ')}>
      {tagLine && (
        <span className="block text-[10px] font-mono text-zinc-600 tracking-widest">
          // {tagLine}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-display font-bold uppercase text-white tracking-tight leading-tight">
        {title}
      </h2>
    </div>
  );
}
