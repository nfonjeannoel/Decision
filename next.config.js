/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow type errors to compile for deployment
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['source.unsplash.com', 'images.unsplash.com'],
  },
}

module.exports = nextConfig 