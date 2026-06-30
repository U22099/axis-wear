import type { Metadata } from 'next';
import { Geist, Syne, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AxisWear // Shield & Utility Outerwear',
  description: 'A high-end, editorial-style e-commerce storefront for urban modular outerwear brands. Engineered for high-performance city shielding.',
  keywords: ['outerwear', 'tactical', 'monochromatic', 'urban clothing', 'waterproof tech', 'modular vest'],
  authors: [{ name: 'AxisWear Team' }],
  openGraph: {
    title: 'AxisWear // Shield & Utility Outerwear',
    description: 'High-end, editorial e-commerce landing page and storefront for an urban outerwear brand.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${syne.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-white selection:text-black">
        <AuthProvider>
          <CartProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
