/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configure webpack for react-pdf compatibility
  webpack: (config, { isServer }) => {
    // Fix for react-pdf
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  // Configure webhook payload size and proxying
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    return [
      {
        source: '/api/:path*',
        // proxy to backend, remove trailing slash if any on env variable
        destination: `${apiUrl.replace(/\/$/, '')}/:path*`, 
      },
    ];
  },
}

export default nextConfig
