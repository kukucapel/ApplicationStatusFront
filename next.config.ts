import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://192.168.8.12:5000/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
