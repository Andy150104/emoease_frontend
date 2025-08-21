export const dynamic = "force-static";

import { Metadata } from "next";
import RegisterPage from "./Client";
export const metadata: Metadata = {
  title: "EmoEase – Đăng ký",
  description:
    "Đăng kí vào EmoEase để tiếp tục hành trình chăm sóc tinh thần của bạn.",
  openGraph: {
    title: "EmoEase",
    description: "EmoEase",
    url: "https://emoease-frontend.vercel.app/Login",
    images: [
      {
        url: "https://emoease-frontend.vercel.app/emo.png",
        width: 1200,
        height: 630,
        alt: "EmoEase logo",
      },
    ],
    siteName: "EmoEase",
  },
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/emo.png",
        href: "/emo.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/emo.png",
        href: "/emo.png",
      },
    ],
  },
};
export default function RegisterSSRPage() {
  return <RegisterPage />;
}
