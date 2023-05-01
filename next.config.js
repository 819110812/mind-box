/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'golearning.oss-cn-shanghai.aliyuncs.com',
      }
    ],
  },
}

module.exports = nextConfig
