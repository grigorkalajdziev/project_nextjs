/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Keeping this false as per your current setup
  
  // 1. Critical for LCP/CLS: Remote Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Opt-in to ultra-modern formats
  },

  // 2. Production Optimizations
  swcMinify: true, 
  compiler: {
    // Remove consoles in production to save bytes
    removeConsole: process.env.NODE_ENV === "production",
    // Optimizes Emotion/MUI styles
    emotion: true,
  },

  env: {
    PUBLIC_URL: "",
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/home/trending",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // 3. Cache Control for static assets (helps LCP)
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;