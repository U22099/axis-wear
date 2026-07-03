import React from 'react';
import { SPEC_DATA } from '@/lib/constants';
import SectionLabel from '@/components/ui/SectionLabel';

export default function SpecsSection() {
  return (
    <section
      id="specs"
      className="py-16 border-t border-border-blueprint bg-charcoal-900/30"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-10">
          <SectionLabel index="04" tag="TECHNICAL SPECIFICATIONS" title="Built Different" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-blueprint">
          {SPEC_DATA.map(({ label, value, sub }) => (
            <div key={label} className="bg-black p-8 space-y-2">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block">
                {label}
              </span>
              <p className="font-display font-bold text-lg uppercase text-white leading-tight">
                {value}
              </p>
              <p className="text-xs font-sans text-zinc-500">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
