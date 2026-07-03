'use client';

interface SectionLabelProps {
  index?: string;      // e.g. "03"
  tag?: string;        // e.g. "PRODUCT CATALOG"
  title: string;       // e.g. "Shop The Collection"
  className?: string;
}

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

        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-display font-bold uppercase text-white tracking-tight leading-tight">
        {title}
      </h2>
    </div>
  );
}
