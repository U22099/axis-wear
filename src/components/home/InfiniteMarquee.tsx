'use client';

import { MARQUEE_ITEMS } from '@/lib/constants';

function MarqueeTrack() {
  return (
    <div className="flex shrink-0 items-center animate-marquee">
      {MARQUEE_ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="whitespace-nowrap px-6 text-xs font-mono tracking-[0.35em] text-zinc-500 uppercase">
            {item}
          </span>
          <span className="text-zinc-800 select-none">//</span>
        </span>
      ))}
    </div>
  );
}

export default function InfiniteMarquee() {
  return (
    <div className="w-full overflow-hidden border-t border-b border-border-blueprint py-3 bg-black relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-linear-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-linear-to-l from-black to-transparent pointer-events-none" />

      <div className="flex w-max">
        <MarqueeTrack />
        <MarqueeTrack />
        <MarqueeTrack />
      </div>
    </div>
  );
}
