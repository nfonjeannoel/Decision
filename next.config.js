/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow type errors to compile for deployment
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 