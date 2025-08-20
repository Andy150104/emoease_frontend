import { ApiThirdModule, axiosFetch } from "EmoEase/api/api-province";

export const apiThirdClient = new ApiThirdModule({
  baseUrl: process.env.NEXT_PUBLIC_THIRD_API_BASE_URL ?? "/api",
  customFetch: axiosFetch,
});
