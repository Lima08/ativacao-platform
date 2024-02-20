/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false
  },
  images: {
    domains: [
      'bucket-ativacaotec.s3.us-east-1.amazonaws.com',
      'ativacao-bucket-s3-homolog.s3.amazonaws.com',
      'bucket-ativacaotec.s3.amazonaws.com'
    ],
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
