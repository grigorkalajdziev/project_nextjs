/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    forceSwcTransforms: true,
  },
  env: {
    PUBLIC_URL: "", // You can populate this with your actual domain
  },
  async redirects() {
    return [
      {
        source: '/old-url',
        destination: '/new-url',
        permanent: true, // 301 redirect helps indexing
      },
      // Add more as needed
    ];
  },
};

module.exports = nextConfig;