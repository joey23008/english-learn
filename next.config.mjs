/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/lessons',
        permanent: true,
      },
      {
        source: '/frontend',
        destination: '/frontend/lessons',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
