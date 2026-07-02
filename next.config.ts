import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    unoptimized: true
  },
  // Manage memory
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    instantNavigationDevToolsToggle: true,
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
