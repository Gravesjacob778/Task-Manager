/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  i18n: {
    locales: ['zh-TW', 'en'],
    defaultLocale: 'zh-TW',
  },
};

module.exports = nextConfig;
