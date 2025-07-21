// src/apiClient.ts
import axios, { AxiosInstance, Method, AxiosRequestConfig } from "axios";
import { Api as PaymentApi } from "EmoEase/api/api-payment-service";
import { Api as ProfileApi } from "EmoEase/api/api-profile-service";
import { Api as AuthApi } from "EmoEase/api/api";
import { Api as SubscriptionApi } from "EmoEase/api/api-subscription-service";
import { useAuthStore } from "EmoEase/stores/Auth/AuthStore";
import { useValidateStore } from "EmoEase/stores/Validate/ValidateStore";

// 1) Tạo axios instance chung
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ví dụ: "https://api.emoease.vn"
});

axiosInstance.interceptors.request.use((cfg) => {
  const { token } = useAuthStore.getState();
  if (token && cfg.headers) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403 || status === 418) {
      // if (typeof window !== "undefined") {
      //   window.location.href = "/Login";
      // }
      useAuthStore.getState().logout();
      useAuthStore.persist.clearStorage();
      useValidateStore.getState().setInValid(true);
    }
    return Promise.reject(error);
  },
);
// 2) Adapter để Swagger-client gọi qua axios
const axiosFetch: typeof fetch = async (input, init = {}) => {
  const url = input.toString();

  // Chuẩn hóa headers từ HeadersInit → Record<string,string>
  let headers: Record<string, string> = {};
  if (init.headers instanceof Headers) {
    headers = Object.fromEntries(init.headers.entries());
  } else if (Array.isArray(init.headers)) {
    headers = Object.fromEntries(init.headers);
  } else if (init.headers && typeof init.headers === "object") {
    headers = init.headers as Record<string, string>;
  }

  const params = (init as unknown as { params?: Record<string, unknown> })
    .params;

  const config: AxiosRequestConfig = {
    url,
    method: (init.method as Method) ?? "GET",
    headers,
    data: init.body,
    params,
  };

  const res = await axiosInstance.request(config);

  // Chuyển axios headers thành HeadersInit (Headers)
  const responseHeaders = new Headers();
  Object.entries(res.headers).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => responseHeaders.append(key, String(v)));
    } else if (value != null) {
      responseHeaders.set(key, String(value));
    }
  });

  // Trả về Response giống Fetch API
  return new Response(JSON.stringify(res.data), {
    status: res.status,
    headers: responseHeaders,
  });
};

// 3) Khởi tạo các client từ swagger-gen
export const paymentClient = new PaymentApi<null>({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/payment-service`,
  customFetch: axiosFetch,
});

export const AuthClient = new AuthApi({
  baseUrl: process.env.NEXT_PUBLIC_PAYMENT_URL || "/auth-service",
  customFetch: axiosFetch,
});

export const profileClient = new ProfileApi({
  baseUrl: process.env.NEXT_PUBLIC_PROFILE_URL || "/profile-service",
  customFetch: axiosFetch,
});

export const subscriptionClient = new SubscriptionApi({
  baseUrl: process.env.NEXT_PUBLIC_SUBSCRIPTION_API_URL || "/subscription-service",
  customFetch: axiosFetch,
});

const apiClient = {
  paymentService: paymentClient,
  authService: AuthClient,
  profileService: profileClient,
  subscriptionService: subscriptionClient,
};

export default apiClient;
