/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {    
    forceSwcTransforms: true,
  },
  env: {
    PUBLIC_URL: "https://www.kikamakeupandbeautyacademy.com", 
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