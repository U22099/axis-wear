'use client';

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CheckoutContent from '@/components/CheckoutContent';
import PageLoader from '@/components/ui/PageLoader';

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <CartDrawer />

      <Suspense fallback={<PageLoader label="LOADING SECURE SEGMENT DATA..." />}>
        <CheckoutContent />
      </Suspense>

      <Footer />
    </>
  );
}