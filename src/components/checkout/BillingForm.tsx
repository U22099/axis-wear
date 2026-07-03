'use client';

import React from 'react';
import Input from '@/components/ui/Input';
import type { AddressData } from '@/components/checkout/ShippingForm';

interface BillingFormProps {
  billing: AddressData;
  onBillingChange: (updates: Partial<AddressData>) => void;
}

export default function BillingForm({ billing, onBillingChange }: BillingFormProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-border-blueprint">
      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
        // BILLING MATRIX
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="BILLING NAME"
          type="text"
          value={billing.fullName}
          onChange={(e) => onBillingChange({ fullName: e.target.value })}
          placeholder="Stealth Operator"
        />
        <Input
          label="BILLING ADDRESS LINE 1"
          type="text"
          value={billing.addressLine1}
          onChange={(e) => onBillingChange({ addressLine1: e.target.value })}
          placeholder="12 Sector Gate Ave"
        />
        <Input
          label="CITY"
          type="text"
          value={billing.city}
          onChange={(e) => onBillingChange({ city: e.target.value })}
          placeholder="Sector Delta"
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="STATE"
            type="text"
            value={billing.state}
            onChange={(e) => onBillingChange({ state: e.target.value })}
            placeholder="Lagos"
          />
          <Input
            label="ZIP INDEX"
            type="text"
            value={billing.zip}
            onChange={(e) => onBillingChange({ zip: e.target.value })}
            placeholder="100001"
          />
        </div>
      </div>
    </div>
  );
}
