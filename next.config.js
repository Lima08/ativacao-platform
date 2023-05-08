/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ativacao-bucket-s3-homolog.s3.us-east-1.amazonaws.com'
        // port: '',
        // pathname: '/account123/**',
      }
    ]
  }
}

module.exports = nextConfig
