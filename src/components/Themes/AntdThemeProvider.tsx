// src/AntdThemeProvider.tsx
"use client";
import React from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useTheme } from "EmoEase/Provider/ThemeProvider";

export function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: isDarkMode
          ? {
              colorBgLayout: "#020712",
              colorBgContainer: "#050D18",
              colorText: "#ffffff",
            }
          : {},
      }}
    >
      {children}
    </ConfigProvider>
  );
}
