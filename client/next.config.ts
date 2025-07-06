import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true, // включаем поддержку styled-components
  },
}

export default nextConfig