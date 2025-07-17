// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",                // landing
  "/login",
  "/register",
  "/forgot-password",
  "/_error",          // phòng khi lỗi
  "/api/public",      // ví dụ
];

const PROTECTED_PREFIXES = [
  "/admin",
  "/dashboard",
  "/profiles",
  "/patient",
  "/me",
  "/secure",          // ví dụ
];

/**
 * Cookie do zustand persist tạo: "auth-storage".
 * Cấu trúc (theo config bạn gửi): JSON có field state.token.
 */
function readTokenFromPersistCookie(req: NextRequest): string | null {
  const raw = req.cookies.get("auth-storage")?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const state = parsed?.state;
    if (state?.token) return String(state.token);
  } catch {
    // ignore parse error -> coi như không có token
  }
  return null;
}

/** Path có nằm trong PUBLIC_PATHS? (prefix match) */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

/** Path có cần đăng nhập? (prefix match) */
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bỏ qua public -> cho qua
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Không nằm public nhưng cũng không thuộc danh sách cần bảo vệ?
  // Tuỳ chính sách: hoặc cho qua, hoặc coi như protected mặc định.
  // Ở đây: nếu không thuộc PROTECTED_PREFIXES -> cho qua.
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // Bảo vệ: cần đăng nhập
  const token = readTokenFromPersistCookie(req);
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ĐÃ có token -> cho qua. Quyền sẽ do backend kiểm khi gọi API.
  return NextResponse.next();
}

/**
 * Matcher:
 *  - Bỏ qua static assets, _next, favicon, file media.
 *  - Áp dụng cho mọi đường dẫn còn lại.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
