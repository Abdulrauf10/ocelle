const createNextIntlPlugin = require('next-intl/plugin');
const bundleAnalyzer = require('@next/bundle-analyzer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /typeorm/ },
      { module: /app-root-path/, message: /the request of a dependency is an expression/ },
    ];
    return config;
  }
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin();

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
