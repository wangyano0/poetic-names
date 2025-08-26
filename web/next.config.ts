import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 移除已废弃的配置
  },
  serverExternalPackages: ['better-sqlite3', 'nodejieba'],
  // 禁用Turbopack以避免兼容性问题
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
