'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, User, LogOut, Menu } from 'lucide-react';
import AuthModal from '@/components/layout/AuthModal';
import MobileNav from '@/components/layout/MobileNav';
import { NAV_LINKS } from '@/lib/constants';

export default function Header() {
  const { setIsOpen, count } = useCart();
  const { user, logout } = useAuth();

  const [isAuthOpen, setIsAuthOpen]   = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-black/85 backdrop-blur-md border-b border-border-blueprint py-4 px-6 md:px-12 flex items-center justify-between">

        <button
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open navigation"
          className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/" className="flex flex-col group">
          <span className="font-display font-extrabold text-lg md:text-xl tracking-tighter uppercase group-hover:text-zinc-300 transition-colors">
            AXIS // WEAR
          </span>
          <span className="text-[9px] font-mono tracking-widest text-zinc-600">

          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-zinc-400">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-[10px] font-mono text-zinc-500">
                {user.name?.split(' ')[0].toUpperCase()}
              </span>
              <div className="flex items-center border border-border-blueprint bg-charcoal-900">
                <Link
                  href="/checkout"
                  className="p-2.5 text-zinc-400 hover:text-white border-r border-border-blueprint hover:bg-black transition-colors"
                  title="Account & Orders"
                >
                  <User className="w-4 h-4" />
                </Link>
                <button
                  onClick={logout}
                  className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-black transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 border border-border-blueprint hover:border-white/40 text-xs font-mono text-zinc-400 hover:text-white transition-all bg-charcoal-900 hover:bg-black"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open shopping bag"
            className="flex items-center gap-2 p-2.5 bg-white text-black hover:bg-transparent hover:text-white border border-white transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-mono font-bold">
              {count > 0 ? count.toString().padStart(2, '0') : '—'}
            </span>
          </button>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <MobileNav isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}
