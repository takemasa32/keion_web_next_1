/** @type {import('next').NextConfig} */
const nextConfig = {
  // パフォーマンス最適化のための設定
  reactStrictMode: true,
  swcMinify: true,

  // 画像最適化
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // CDNからの画像読み込みを許可するドメイン（必要に応じて追加）
    domains: [],
    // 画像の最適化の品質設定
    minimumCacheTTL: 60,
  },

  // セキュリティ強化
  poweredByHeader: false,

  // 実験的機能を有効化
  experimental: {
    // ブラウザでのメモリ使用を最適化
    optimizeCss: true,
    // 高度なキャッシュ戦略（ハードリフレッシュ時もキャッシュを保持）
    // nextScriptWorkers: true,
  },

  // 静的最適化の設定
  compress: true,

  // 環境変数を明示的に公開
  env: {
    APP_VERSION: process.env.npm_package_version || "1.0.0",
  },

  // Webpackの設定をカスタマイズ
  webpack: (config, { dev, isServer }) => {
    // スマートフォン向けに最適化
    if (!dev && !isServer) {
      // 本番環境での最適化
      Object.assign(config.optimization.splitChunks.cacheGroups, {
        commons: {
          name: "commons",
          chunks: "all",
          reuseExistingChunk: true,
        },
      });
    }

    return config;
  },
};

export default nextConfig;
