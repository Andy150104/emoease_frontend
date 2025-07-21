// src/stores/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { DeviceType } from "EmoEase/api/api";
import apiClient from "EmoEase/hooks/apiClient";

export interface AuthState {
  token: string | null;
  refreshTokenValue: string | null;
  login: (email: string, password: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
}

type PersistedAuth = {
  token: string | null;
  refreshTokenValue: string | null;
};

const cookieRawStorage = {
  getItem: (name: string) => Cookies.get(name) ?? null,
  setItem: (name: string, value: string) =>
    Cookies.set(name, value, { expires: 7, sameSite: "lax", path: "/" }),
  removeItem: (name: string) => Cookies.remove(name),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshTokenValue: null,

      reset: () => {
        set({ token: null, refreshTokenValue: null });
        Cookies.remove("auth-storage");
      },

      login: async (email, password) => {
        try {
          const resp = await apiClient.authService.auth.loginCreate(
            {
              email,
              password,
              deviceType: DeviceType.Web,
              clientDeviceId: navigator.userAgent,
            },
            { format: "json" },
          );
          const { token, refreshToken } = resp.data as unknown as {
            token: string;
            refreshToken: string;
          };
          set({ token, refreshTokenValue: refreshToken });
          apiClient.authService.setSecurityData({ token, refreshToken });
        } catch {
          throw new Error(
            "Đăng nhập thất bại, vui lòng kiểm tra email/mật khẩu.",
          );
        }
      },

      // 2) Refresh token và revoke khi cần
      refreshToken: async () => {
        const { token, refreshTokenValue } = get();
        if (!refreshTokenValue) {
          throw new Error("Không tìm thấy refresh token.");
        }
        try {
          const resp = await apiClient.authService.auth.refreshTokenCreate({
            token: token!,
            refreshToken: refreshTokenValue,
            clientDeviceId: navigator.userAgent,
          });
          const { token: newToken, refreshToken: newRefresh } =
            resp.data as never;
          set({ token: newToken, refreshTokenValue: newRefresh });
          apiClient.authService.setSecurityData({
            token: newToken,
            refreshToken: newRefresh,
          });
        } catch {
          // revoke token cũ nếu refresh thất bại
          apiClient.authService.auth
            .revokeTokenCreate({
              token: token!,
              refreshToken: refreshTokenValue,
              clientDeviceId: navigator.userAgent,
            })
            .catch(() => {});
          set({ token: null, refreshTokenValue: null });
          apiClient.authService.setSecurityData({
            token: null,
            refreshToken: null,
          });
          throw new Error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
        }
      },

      logout: async () => {
        const { token, refreshTokenValue } = get();
        if (token && refreshTokenValue) {
          await apiClient.authService.auth
            .revokeTokenCreate({
              token,
              refreshToken: refreshTokenValue,
              clientDeviceId: navigator.userAgent,
            })
            .catch(() => {});
        }
        set({ token: null, refreshTokenValue: null });
        apiClient.authService.setSecurityData({
          token: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage<PersistedAuth>(() => cookieRawStorage),
      partialize: (s) => ({
        token: s.token,
        refreshTokenValue: s.refreshTokenValue,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          apiClient.authService.setSecurityData({
            token: (state as PersistedAuth).token,
            refreshToken: (state as PersistedAuth).refreshTokenValue,
          });
        }
      },
    },
  ),
);
