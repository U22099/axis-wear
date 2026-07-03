'use client';

import React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-black border-r border-border-blueprint flex flex-col md:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-blueprint">
              <div>
                <span className="font-display font-extrabold text-lg tracking-tighter uppercase">
                  AXIS // WEAR
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-zinc-600">
                  // Urban Outerwear
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close navigation"
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 p-4 grow">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="px-4 py-3.5 text-xs font-mono tracking-widest text-zinc-400 hover:text-white hover:bg-charcoal-900 transition-all border border-transparent hover:border-border-blueprint"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Footer metadata */}
            <div className="px-6 py-4 border-t border-border-blueprint/40 text-[9px] font-mono text-zinc-700 space-y-0.5">
              <div>AXIS_LABS_v4.1</div>
              <div>EST. 2026 // GLOBAL</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
