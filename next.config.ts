import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Charger TypeORM/pg depuis node_modules (non bundlés) : évite les problèmes
  // de bundling des libs à réflexion / bindings natifs en environnement serverless.
  serverExternalPackages: ["typeorm", "pg"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
