'use client';

import React from 'react';
import Link from 'next/link';

const EXPLORE_LINKS = [
  { label: '[ ALL SHIELDS ]',   href: '/#catalog' },
  { label: '[ OUTERWEAR ]',     href: '/#catalog?category=Outerwear' },
  { label: '[ CORE SYSTEMS ]',  href: '/#catalog?category=Core' },
  { label: '[ HARDWARE DATA ]', href: '/#specs' },
];

const PORTAL_LINKS = [
  { label: '[ ORDER TRACKING ]',     href: '/checkout', disabled: false },
  { label: '[ SHIPPING LOGISTICS ]', href: '/checkout', disabled: true },
  { label: '[ RETURN PROTOCOLS ]',   href: '/checkout', disabled: true },
  { label: '[ SYSTEM STATUS: OK ]',  href: '/checkout', disabled: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-blueprint bg-black text-zinc-500 py-16 px-6 md:px-12 relative overflow-hidden">
      {/* Blueprint grid watermark */}
      <div className="absolute inset-0 blueprint-grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        {/* Brand column */}
        <div className="space-y-4 md:col-span-2 border-r border-border-blueprint/40 pr-8">
          <div className="space-y-1">
            <h4 className="text-sm font-display font-extrabold tracking-tighter text-white uppercase">
              AXIS // WEAR CO.
            </h4>
            <span className="block text-[9px] font-mono tracking-widest text-zinc-600">
              EST. 2026 // INDUSTRIAL OUTERWEAR LAB
            </span>
          </div>
          <p className="text-xs max-w-sm leading-relaxed text-zinc-500 font-mono">
            Modular protective gear engineered to resist unpredictable urban
            environments. Designed for tactical versatility and low visual signatures.
          </p>
          <div className="pt-4 space-y-1 font-mono text-[9px] text-zinc-600">
            <div>[SECTOR // SHIELD] SYSTEM v4.1</div>
            <div>[LAT // 6.5244° N] [LON // 3.3792° E]</div>
            <div>[LICENSE // SANDBOX_PAYSTACK_MOCK]</div>
          </div>
        </div>

        {/* Explore links */}
        <div className="space-y-4">
          <span className="block text-xs font-mono tracking-widest text-zinc-400">
            // EXPLORE COLLECTION
          </span>
          <ul className="space-y-2 text-xs font-mono">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.href + link.label}>
                <Link href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer portal links */}
        <div className="space-y-4">
          <span className="block text-xs font-mono tracking-widest text-zinc-400">
            // CUSTOMER PORTAL
          </span>
          <ul className="space-y-2 text-xs font-mono">
            {PORTAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-white transition-colors">
                  {link.disabled ? (
                    <span className="text-zinc-600 cursor-not-allowed">{link.label}</span>
                  ) : (
                    link.label
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border-blueprint/40 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-600 relative z-10">
        <div>© 2026 AXISWEAR. CO. ALL SYSTEMS CODIFIED.</div>
        <div className="flex gap-6">
          <span className="hover:text-zinc-400 transition-colors cursor-pointer">
            [ TERMS_OF_DEPLOYMENT ]
          </span>
          <span className="hover:text-zinc-400 transition-colors cursor-pointer">
            [ SECURITY_CRED ]
          </span>
        </div>
      </div>
    </footer>
  );
}
