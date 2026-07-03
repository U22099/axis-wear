'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Max width class, defaults to 'max-w-md' */
  maxWidth?: string;
  /** Show a close button in top-right corner */
  showClose?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-md',
  showClose = false,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={[
              'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
              'w-full p-8 bg-black border border-border-blueprint',
              maxWidth,
            ].join(' ')}
          >
            {showClose && (
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 text-zinc-500 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
