/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['mosaic.scdn.co', 'i.scdn.co'],
  },
};

module.exports = nextConfig;
