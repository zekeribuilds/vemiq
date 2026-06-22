/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  allowedDevOrigins: ['127.0.0.1'],
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
