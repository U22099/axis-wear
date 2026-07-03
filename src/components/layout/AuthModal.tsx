'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, ArrowRight } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { loginWithGoogle, loginWithOTP, verifyOTP } = useAuth();

  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    onClose();
    // Reset state after animation
    setTimeout(() => {
      setEmail('');
      setOtp('');
      setOtpSent(false);
      setAuthError(null);
    }, 300);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setAuthError(null);
    setIsLoading(true);
    const res = await loginWithOTP(email);
    setIsLoading(false);
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
    setIsLoading(true);
    const res = await verifyOTP(email, otp);
    setIsLoading(false);
    if (res.success) {
      handleClose();
    } else {
      setAuthError(res.error ?? 'Invalid verification code.');
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsLoading(true);
    const res = await loginWithGoogle();
    setIsLoading(false);
    if (res.error) setAuthError(res.error);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} showClose>
      {/* Version tag */}
      <div className="absolute top-2 right-8 text-[8px] font-mono text-zinc-700">
        SECURE AUTH v4.1
      </div>

      <div className="space-y-6">
        {/* Heading */}
        <div className="space-y-2">
          <span className="text-xs font-mono tracking-widest text-zinc-500">// SIGN IN</span>
          <h3 className="text-2xl font-display font-bold tracking-tight uppercase">
            Access Account
          </h3>
          <p className="text-xs text-zinc-400">
            Sign in to save shipping details, track orders, and check out faster.
          </p>
        </div>

        {/* Error */}
        {authError && (
          <div className="p-3 bg-red-950/20 border border-red-900/50 text-red-400 text-xs font-mono text-center">
            {authError}
          </div>
        )}

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 w-full py-3 bg-zinc-900 border border-border-blueprint text-xs font-mono text-zinc-300 hover:text-white hover:bg-black transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.52 0-6.386-2.864-6.386-6.385s2.866-6.385 6.386-6.385c1.602 0 3.06.59 4.19 1.558l3.03-3.03C19.262 2.378 15.932 1.2 12.24 1.2c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.81 0 10.87-4.12 10.87-11 0-.756-.08-1.503-.23-2.215H12.24z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-border-blueprint" />
          <span className="shrink mx-4 text-[10px] font-mono text-zinc-600">OR EMAIL</span>
          <div className="grow border-t border-border-blueprint" />
        </div>

        {/* OTP flow */}
        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              icon={<Mail className="w-4 h-4" />}
            />
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!email}
              fullWidth
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Send Verification Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase">
                6-Digit Code
              </label>
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
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={otp.length < 6}
                className="flex-1 py-3"
              >
                Verify &amp; Sign In
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
