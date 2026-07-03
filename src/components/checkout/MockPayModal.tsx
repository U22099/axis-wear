'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface MockPayModalProps {
  isOpen: boolean;
  reference: string;
  total: number;
  onSimulate: (success: boolean) => void;
}

export default function MockPayModal({
  isOpen,
  reference,
  total,
  onSimulate,
}: MockPayModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onSimulate(false)}
      maxWidth="max-w-md"
    >
      <div className="space-y-6 text-center">
        <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">

        </span>

        <div className="space-y-2">
          <h3 className="text-xl font-display font-extrabold text-white uppercase">
            AUTHORIZE MOCK TRANSACTION
          </h3>
          <p className="text-xs text-zinc-400 font-mono">REF: {reference}</p>
          <p className="text-xs text-zinc-400">
            No API keys were detected in your configurations. Accept simulation to
            execute the status transitions and verify the system&apos;s pipeline.
          </p>
        </div>

        <div className="border border-border-blueprint p-4 bg-charcoal-900/40 text-left font-mono text-[10px] text-zinc-500 space-y-1">
          <div>AMOUNT: ${total.toFixed(2)} USD</div>
          <div>CONVERTED: ₦{(total * 1600).toFixed(2)} NGN</div>
          <div>GATEWAY: PAYSTACK_SANDBOX_MOCK</div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => onSimulate(false)}
            variant="danger"
            fullWidth
          >
            DECLINE PAYMENT
          </Button>
          <Button
            onClick={() => onSimulate(true)}
            variant="primary"
            fullWidth
          >
            AUTHORIZE SUCCESS
          </Button>
        </div>
      </div>
    </Modal>
  );
}
