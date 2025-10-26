/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,  
  env: {
    PUBLIC_URL: "", 
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home/trending',
        permanent: true, // 301 redirect helps indexing
      },
      // Add more as needed
    ];
  },
};

module.exports = nextConfig;