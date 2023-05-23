/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "mosaic.scdn.co",
      "i.scdn.co",
      "api.spotify.com",
      "spotify.com",
      "open.spotify.com",
      "i1.wp.com",
      "spotify",
    ],
  },
};

module.exports = nextConfig;
