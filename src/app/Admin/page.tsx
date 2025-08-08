export const revalidate = 60; // ISR: regen mỗi 60s

import { Metadata } from "next";
import DashboardRevenuePage from "./Client";
export const metadata: Metadata = {
  title: 'EmoEase – Admin Dashboard',
  description: 'Đăng nhập vào EmoEase để tiếp tục hành trình chăm sóc tinh thần của bạn.',
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
export default function Page() {
  return <DashboardRevenuePage />;
}