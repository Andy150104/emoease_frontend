declare module "js-cookie" {
  type SameSiteOption = "lax" | "strict" | "none";
  interface CookieAttributes {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: SameSiteOption;
  }
  const Cookies: {
    get(name: string): string | undefined;
    set(name: string, value: string, attributes?: CookieAttributes): void;
    remove(name: string, attributes?: CookieAttributes): void;
  };
  export default Cookies;
}
