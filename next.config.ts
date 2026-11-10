import type { NextConfig } from 'next';

/**
 * The site is exported as plain static files (see docs/adr/0001-next-static-export.md).
 * Anything that needs a server at request time is intentionally unavailable.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    // No image optimizer exists on a static host; assets are sized and compressed at author time.
    unoptimized: true,
  },
};

export default nextConfig;
