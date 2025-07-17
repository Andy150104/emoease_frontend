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
    ], // thêm các domain bạn dùng
  },
};

export default nextConfig;
