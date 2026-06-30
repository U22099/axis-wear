'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, User, LogOut, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

export default function Header() {
  const { setIsOpen, count } = useCart();
  const { user, loginWithGoogle, loginWithOTP, verifyOTP, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const closeModal = () => {
    setIsAuthOpen(false);
    setEmail('');
    setOtp('');
    setOtpSent(false);
    setAuthError(null);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setAuthError(null);
    setIsLoggingIn(true);
    const res = await loginWithOTP(email);
    setIsLoggingIn(false);
    if (res.success) {
      setOtpSent(true);
    } else {
      setAuthError(res.error ?? 'Failed to send verification code.');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setAuthError(null);
    setIsLoggingIn(true);
    const res = await verifyOTP(email, otp);
    setIsLoggingIn(false);
    if (res.success) {
      closeModal();
    } else {
      setAuthError(res.error ?? 'Invalid verification code.');
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsLoggingIn(true);
    const res = await loginWithGoogle();
    setIsLoggingIn(false);
    if (res.error) {
      setAuthError(res.error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-black/85 backdrop-blur-md border-b border-border-blueprint py-4 px-6 md:px-12 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex flex-col group">
          <span className="font-display font-extrabold text-lg md:text-xl tracking-tighter uppercase group-hover:text-zinc-300 transition-colors">
            AXIS // WEAR
          </span>
          <span className="text-[9px] font-mono tracking-widest text-zinc-600">// Urban Outerwear</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-zinc-400">
          <Link href="/#catalog" className="hover:text-white transition-colors">[ Collection ]</Link>
          <Link href="/#specs" className="hover:text-white transition-colors">[ Tech Specs ]</Link>
          <Link href="/checkout" className="hover:text-white transition-colors">[ Checkout ]</Link>
        </nav>

        {/* Actions */}
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
              className="flex items-center gap-2 px-4 py-2 border border-border-blueprint hover:border-white/40 text-xs font-mono text-zinc-400 hover:text-white transition-all bg-charcoal-900 hover:bg-black"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart */}
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

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-8 bg-black border border-border-blueprint"
            >
              <div className="absolute top-2 right-2 text-[8px] font-mono text-zinc-700">SECURE AUTH v4.1</div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono tracking-widest text-zinc-500">// SIGN IN</span>
                  <h3 className="text-2xl font-display font-bold tracking-tight uppercase">Access Account</h3>
                  <p className="text-xs text-zinc-400">
                    Sign in to save shipping details, track orders, and check out faster.
                  </p>
                </div>

                {authError && (
                  <div className="p-3 bg-red-950/20 border border-red-900/50 text-red-400 text-xs font-mono text-center">
                    {authError}
                  </div>
                )}

                {/* Google Sign In */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="flex items-center justify-center gap-3 w-full py-3 bg-zinc-900 border border-border-blueprint text-xs font-mono text-zinc-300 hover:text-white hover:bg-black transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.52 0-6.386-2.864-6.386-6.385s2.866-6.385 6.386-6.385c1.602 0 3.06.59 4.19 1.558l3.03-3.03C19.262 2.378 15.932 1.2 12.24 1.2c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.81 0 10.87-4.12 10.87-11 0-.756-.08-1.503-.23-2.215H12.24z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="grow border-t border-border-blueprint" />
                  <span className="shrink mx-4 text-[10px] font-mono text-zinc-600">OR EMAIL</span>
                  <div className="grow border-t border-border-blueprint" />
                </div>

                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-charcoal-900 border border-border-blueprint text-zinc-300 px-4 py-3 text-xs font-mono focus:outline-none focus:border-zinc-500 pl-10"
                        />
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoggingIn || !email}
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-black font-bold text-xs font-mono tracking-widest hover:bg-zinc-200 transition-colors uppercase disabled:opacity-50"
                    >
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">6-Digit Code</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="000000"
                        className="w-full bg-charcoal-900 border border-border-blueprint text-center text-lg font-mono tracking-[0.75em] text-white py-3 focus:outline-none focus:border-zinc-500"
                      />
                      <p className="text-[9px] font-mono text-zinc-500 text-center mt-1">
                        Check your inbox at {email} for the 6-digit code.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="w-1/3 py-3 border border-border-blueprint text-xs font-mono text-zinc-500 hover:text-white transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoggingIn || otp.length < 6}
                        className="flex-1 py-3 bg-white text-black font-bold text-xs font-mono tracking-widest hover:bg-zinc-200 transition-colors uppercase disabled:opacity-50"
                      >
                        Verify & Sign In
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
