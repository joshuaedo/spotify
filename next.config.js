/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "image-cdn-ak.spotifycdn.com",
      "image-cdn-fa.spotifycdn.com",
      "newjams-images.scdn.co",
      "images-ak.spotifycdn.com",
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
