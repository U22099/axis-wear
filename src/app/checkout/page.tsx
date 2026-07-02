"use client";

import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function CheckoutPage() {
  return (
    <>
      <Header />

      <Suspense fallback={<PageLoader />}>
        <CheckoutPage />
      </Suspense>

      <Footer />
    </>
  );
}

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-xs font-mono text-zinc-500 gap-3">
      <div className="w-6 h-6 border-2 border-zinc-700 border-t-white animate-spin"></div>
      <span>LOADING SECURE SEGMENT DATA...</span>
    </div>
  );
}