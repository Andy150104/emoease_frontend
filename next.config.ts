import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "tailwindcss.com",
      "static-cse.canva.com",
      "rubicmarketing.com",
      "www.yarooms.com",
      "randomuser.me",
      'via.placeholder.com',
      'cdnphoto.dantri.com.vn'
    ], // thêm các domain bạn dùng
  },
  // experimental: {
  //   optimizeCss: true,
  // },
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production",
  // },
};

export default nextConfig;
