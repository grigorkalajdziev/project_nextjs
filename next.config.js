/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {    
    forceSwcTransforms: true,
  },
  env: {
    PUBLIC_URL: "", 
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