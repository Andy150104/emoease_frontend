// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/", // landing
  "/login",
  "/register",
  "/forgot-password",
  "/_error", // phòng khi lỗi
  "/api/public", // ví dụ
];

const PROTECTED_PREFIXES = [
  "/Admin",
  "/Admin/profiles",
  "/profiles",
  "/patient",
  "/me",
  "/secure", // ví dụ
];

/** Kiểm tra xem pathname có nằm trong PUBLIC_PATHS không */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

/** Kiểm tra xem pathname có cần login không */
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lấy cookie
  const raw = req.cookies.get("auth-storage")?.value;
  let token: string | null = null;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      token =
        typeof parsed.token === "string"
          ? parsed.token
          : (parsed.state?.token ?? null);
    } catch (err) {
      console.log("[middleware] JSON.parse error:", err);
    }
  }

  // Nếu đã login rồi mà truy cập /login → redirect về /Admin
  if (
    token &&
    (pathname.toLowerCase() === "/login" || pathname.toLowerCase() === "/")
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/Admin";
    return NextResponse.redirect(url);
  }

  // 1) Public paths → cho qua
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 2) Nếu không phải protected → cho qua
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // 3) Protected path mà chưa login → redirect về /login
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/404";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4) Đã login, path được phép → cho qua
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
