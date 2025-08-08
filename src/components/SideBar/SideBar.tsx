"use client";

import React, { CSSProperties, useEffect, useState } from "react";
import Image from "next/image";
import { Knewave } from "next/font/google";
import {
  PieChartOutlined,
  DesktopOutlined,
  LogoutOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Layout, theme } from "antd";
import imageEmoLogo from "EmoEase/assets/emo.webp";
import { useTheme } from "EmoEase/Provider/ThemeProvider";
import { ThemeSwitch } from "../Themes/Theme";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "EmoEase/stores/Auth/AuthStore";
import { useNotification } from "EmoEase/Provider/NotificationProvider";
import { useLoadingStore } from "EmoEase/stores/Loading/LoadingStore";

const { Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

interface CSSVarProperties extends CSSProperties {
  "--ant-primary-color"?: string;
}

const knewave = Knewave({
  weight: "400",
  subsets: ["latin"],
});

type NavMenuItem = {
  label: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: NavMenuItem[];
  path?: string;
};

const getItem = (
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: NavMenuItem[],
  path?: string,
): NavMenuItem => ({ label, key, icon, children, path });

const navItems: NavMenuItem[] = [
  getItem(
    "Dashboard Doanh Thu",
    "dashboard",
    <PieChartOutlined />,
    undefined,
    "/Admin",
  ),
  getItem(
    "Dashboard Người dùng",
    "dashboard-user",
    <DesktopOutlined />,
    undefined,
    "/Admin/profiles",
  ),
  getItem(
    "Subscriptions",
    "subscriptions",
    <SolutionOutlined />,
    undefined,
    "/Admin/subscriptions",
  ),
  getItem("Đăng xuất", "logout", <LogoutOutlined />),
  getItem("", "", <ThemeSwitch />),
];

/* ---------- HELPERS ---------- */
function flatten(items: NavMenuItem[], acc: Record<string, string> = {}) {
  for (const it of items) {
    if (it.path) acc[it.key] = it.path;
    if (it.children) flatten(it.children, acc);
  }
  return acc;
}
const keyPathMap = flatten(navItems);

const pathKeyMap = Object.entries(keyPathMap).reduce<Record<string, string>>(
  (m, [k, p]) => ((m[p] = k), m),
  {},
);

function getSelectedKeys(pathname: string): string[] {
  if (pathKeyMap[pathname]) return [pathKeyMap[pathname]];
  // fallback: tìm path dài nhất là prefix
  let matchKey = "";
  let matchLen = -1;
  for (const [k, p] of Object.entries(keyPathMap)) {
    if (pathname.startsWith(p) && p.length > matchLen) {
      matchKey = k;
      matchLen = p.length;
    }
  }
  return matchKey ? [matchKey] : [];
}

const toAntdItems = (items: NavMenuItem[]): MenuItem[] =>
  items.map((it) => ({
    key: it.key,
    icon: it.icon,
    label: it.label,
    children: it.children ? toAntdItems(it.children) : undefined,
  })) as MenuItem[];

/* ---------- COMPONENT ---------- */
interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  menuItems?: NavMenuItem[]; // cho phép override
  defaultSelectedKeys?: string[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onCollapse,
  menuItems = navItems,
  defaultSelectedKeys,
}) => {
  const [mounted, setMounted] = useState(false);
  const { isDarkMode } = useTheme();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const messageApi = useNotification();
  const pathname = usePathname();
  const router = useRouter();

  // useEffect(() => {
  //   navItems.forEach((item) => {
  //     if (item.path) router.prefetch(item.path);
  //     item.children?.forEach(
  //       (child) => child.path && router.prefetch(child.path),
  //     );
  //   });
  // }, [router]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ width: collapsed ? 80 : 240 }} />;

  const siderStyle: CSSVarProperties = {
    backgroundColor: isDarkMode ? "#030a14" : "#ffffff",
    color: isDarkMode ? "#ffffff" : "#000000",
    "--ant-primary-color": colorPrimary,
  };

  const antItems = toAntdItems(menuItems);
  const selectedKeys = defaultSelectedKeys ?? getSelectedKeys(pathname);

  const handleMenuClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "logout") {
      const { showLoading, hideLoading } = useLoadingStore.getState();
      showLoading();
      useAuthStore.getState().logout();
      useAuthStore.persist.clearStorage();
      messageApi.success("Đăng xuất thành công!")
      // window.location.href = "/Login"
      await router.push("/Login");
      await hideLoading();
      return;
    }
    const path = keyPathMap[key];
    if (path) {
      router.push(path);
    }
  };

  return (
    <Sider
      style={siderStyle}
      breakpoint="md"
      collapsedWidth={80}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      trigger={null}
    >
      {/* Logo */}
      <div
        style={{
          height: 48,
          margin: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          overflow: "hidden",
        }}
      >
        {collapsed ? (
          <Image
            src={imageEmoLogo}
            alt="EmoEase Logo"
            width={32}
            height={32}
            priority
            placeholder="empty"
            className="object-cover"
          />
        ) : (
          <div
            className={`${knewave.className} text-[#4a2580] text-3xl font-light tracking-widest ml-9`}
          >
            EmoEase
          </div>
        )}
      </div>

      {/* Menu */}
      <Menu
        theme={isDarkMode ? "dark" : "light"}
        mode="inline"
        items={antItems}
        selectedKeys={selectedKeys}
        onClick={handleMenuClick}
        style={{
          border: "none",
          background: "transparent",
          marginTop: 16,
          flex: 1,
        }}
      />
    </Sider>
  );
};
