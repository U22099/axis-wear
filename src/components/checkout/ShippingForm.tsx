'use client';

import React from 'react';
import { UserCheck } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export interface AddressData {
  fullName: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
}

interface ShippingFormProps {
  shipping: AddressData;
  useSameAddress: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  onShippingChange: (updates: Partial<AddressData>) => void;
  onToggleSameAddress: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ShippingForm({
  shipping,
  useSameAddress,
  isSaving,
  saveSuccess,
  onShippingChange,
  onToggleSameAddress,
  onSubmit,
}: ShippingFormProps) {
  return (
    <div className="border border-border-blueprint bg-charcoal-900/40 p-8 relative blueprint-corner">
      <div className="absolute top-2 right-2 text-[8px] font-mono text-zinc-700">
        PROFILE ADDRESS // DEPLOY_ v4.1
      </div>

      <form onSubmit={onSubmit} className="space-y-6">

        <div className="flex items-center gap-2 border-b border-border-blueprint pb-4">
          <UserCheck className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-mono tracking-widest text-white uppercase">
            SHIPPING DISPATCH DETAILS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="FULL DEPLOYMENT NAME"
            type="text"
            required
            value={shipping.fullName}
            onChange={(e) => onShippingChange({ fullName: e.target.value })}
            placeholder="Stealth Operator"
          />
          <Input
            label="SHIPPING ADDRESS LINE 1"
            type="text"
            required
            value={shipping.addressLine1}
            onChange={(e) => onShippingChange({ addressLine1: e.target.value })}
            placeholder="12 Sector Gate Ave"
          />
          <Input
            label="CITY"
            type="text"
            required
            value={shipping.city}
            onChange={(e) => onShippingChange({ city: e.target.value })}
            placeholder="Sector Delta"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="STATE"
              type="text"
              required
              value={shipping.state}
              onChange={(e) => onShippingChange({ state: e.target.value })}
              placeholder="Lagos"
            />
            <Input
              label="ZIP INDEX"
              type="text"
              required
              value={shipping.zip}
              onChange={(e) => onShippingChange({ zip: e.target.value })}
              placeholder="100001"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="sameAddr"
            checked={useSameAddress}
            onChange={(e) => onToggleSameAddress(e.target.checked)}
            className="w-3.5 h-3.5 bg-black border border-border-blueprint text-white focus:ring-0 cursor-pointer"
          />
          <label
            htmlFor="sameAddr"
            className="text-[10px] font-mono text-zinc-400 cursor-pointer uppercase"
          >
            BILLING ADAPTS TO SHIPPING DETAILS
          </label>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-border-blueprint/40">
          {saveSuccess && (
            <span className="text-[10px] font-mono text-emerald-400 uppercase">
              ✓ DEPLOYMENT PROFILES AUTO-SAVED
            </span>
          )}
          <Button
            type="submit"
            variant="outline"
            isLoading={isSaving}
            className="ml-auto"
          >
            {isSaving ? 'WRITING...' : 'SAVE DISPATCH PROFILE'}
          </Button>
        </div>
      </form>
    </div>
  );
}
