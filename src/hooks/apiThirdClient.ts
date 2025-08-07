import { ApiThirdModule, axiosFetch } from "EmoEase/api/api-province";

const isBrowser = typeof window !== "undefined";

export const apiThirdClient = new ApiThirdModule({
  baseUrl: isBrowser
    // **client-side**: phải gọi relative đường dẫn lên Next.js API proxy
    ? "/api"
    // **server-side** (SSR, getServerSideProps…): mới gọi thẳng ra 34tinhthanh.com
    : `${process.env.API_BASE_URL}/api`,
  customFetch: (input, init) =>
    axiosFetch(input, { ...init, credentials: "omit" }),
});
