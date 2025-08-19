// src/lib/serverPayment.ts
import { Api as PaymentApi } from "EmoEase/api/api-payment-service";
import { cookies } from "next/headers";

const customFetch: (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response> = async (input, init = {}) => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("auth-storage")?.value;
  let token: string | undefined;

  if (raw) {
    try {
      const { token: t } = JSON.parse(decodeURIComponent(raw));
      token = t;
    } catch {}
  }

  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, { ...init, headers });
};

export const serverPayment = new PaymentApi({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/payment-service`,
  customFetch,
});
