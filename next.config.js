const createNextIntlPlugin = require('next-intl/plugin');
const bundleAnalyzer = require('@next/bundle-analyzer');

/** @type {import('next').NextConfig} */
const nextConfig = {}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin();

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
