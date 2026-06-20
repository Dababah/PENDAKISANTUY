/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mengaktifkan React Strict Mode untuk mendeteksi potensi masalah pada aplikasi sejak dini
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", // Mengizinkan semua root domain tunggal
      },
      {
        protocol: "https",
        hostname: "**.*", // Mengizinkan semua domain beserta multi-subdomain (seperti images.unsplash.com)
      },
    ],
  },
};

module.exports = nextConfig;
