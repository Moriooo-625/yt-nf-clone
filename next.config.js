/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID,
  },
}

module.exports = nextConfig 