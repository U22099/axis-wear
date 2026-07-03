'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import InfiniteMarquee from '@/components/home/InfiniteMarquee';

export default function HeroSection() {
  return (
    <section className="relative w-full flex flex-col overflow-hidden border-b border-border-blueprint">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="AxisWear — Urban Outerwear"
          fill
          priority
          className="object-cover opacity-50 filter blur-[2px] brightness-[0.35] scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/70" />
        <div className="absolute inset-0 blueprint-grid-bg opacity-20" />
      </div>

      {/* Corner metadata */}
      <div className="absolute top-6 left-6 hidden md:block text-[9px] font-mono text-zinc-600 space-y-1 z-10">
        <div>// GEO: 6.5244°N 3.3792°E</div>
        <div>// SECTOR: DELTA-URBAN</div>
        <div>// STATUS: ACTIVE</div>
      </div>
      <div className="absolute top-6 right-6 hidden md:block text-[9px] font-mono text-zinc-600 text-right space-y-1 z-10">
        <div>EST. 2026 // GLOBAL</div>
        <div>SHIELD CLASS // MOD-4</div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[88vh] text-center px-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-3"
        >
          <span className="text-xs font-mono tracking-[0.4em] text-zinc-400 uppercase block">
            // Engineered Urban Shielding
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-extrabold tracking-tighter text-white uppercase leading-none">
            AXIS&thinsp;//<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-zinc-300 to-zinc-600">
              WEAR
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="text-sm max-w-md text-zinc-400 font-sans leading-relaxed"
        >
          High-performance modular outerwear built for unpredictable environments.
          Technical fabrics. Tactical geometry. Minimal visual signature.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 pt-2"
        >
          <a
            href="#catalog"
            className="px-8 py-4 bg-white text-black text-xs font-mono font-bold tracking-widest hover:bg-zinc-100 transition-colors uppercase border border-white"
          >
            Shop Collection
          </a>
          <a
            href="#specs"
            className="px-8 py-4 border border-zinc-700 hover:border-zinc-400 text-xs font-mono text-zinc-300 hover:text-white transition-colors uppercase bg-black/50"
          >
            View Specifications
          </a>
        </motion.div>
      </div>

      {/* Bottom label strip */}
      <div className="relative z-10 flex justify-between items-center px-6 md:px-12 py-3 border-t border-border-blueprint/40 text-[10px] font-mono text-zinc-700">
        <span>AXIS_LABS_v4.1</span>
        <span>SCROLL TO EXPLORE</span>
        <span>ALL RIGHTS RESERVED</span>
      </div>

      {/* Infinite marquee */}
      <InfiniteMarquee />
    </section>
  );
}
