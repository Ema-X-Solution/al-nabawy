import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@google-cloud/firestore'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
