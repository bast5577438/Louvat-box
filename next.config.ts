import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "biscuiterie-louvat.com",
        pathname: "/cdn/shop/**",
      },
    ],
  },
};

export default nextConfig;
