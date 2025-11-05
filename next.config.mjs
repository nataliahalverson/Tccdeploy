import path from 'node:path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR/ISR preset for Netlify: use default .next at project root
  images: {
    // Desativa otimização para evitar 403 de hosts externos no Netlify
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/photos/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // Garante alias '@' -> 'src' também no webpack em ambientes onde o tsconfig paths não é aplicado
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    }
    return config
  },
}

export default nextConfig
