import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    unoptimized: true
  },
  experimental: {
    instantNavigationDevToolsToggle: true,
  },
};

export default nextConfig;
