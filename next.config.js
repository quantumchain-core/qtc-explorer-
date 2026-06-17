/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Set NEXT_PUBLIC_QTC_RPC_URL in your deployment environment
    // e.g. Vercel: Project Settings -> Environment Variables
    NEXT_PUBLIC_QTC_RPC_URL: process.env.NEXT_PUBLIC_QTC_RPC_URL ?? 'http://localhost:8545',
  },
};

module.exports = nextConfig;
