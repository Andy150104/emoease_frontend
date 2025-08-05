"use client";
import React, { useState, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "antd";
import { useSpring, useTransition, animated } from "@react-spring/web";
import { ThemeSwitch } from "../Themes/Theme";
import { usePathname, useRouter } from "next/navigation";
import { Kaushan_Script } from "next/font/google";

const kaushan = Kaushan_Script({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export default function Navigationbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { key: "home", label: "Trang chủ", href: "/test/Navbar/home" },
    { key: "jobs", label: "Công việc", href: "/test/Navbar/jobs" },
    { key: "contact", label: "Liên hệ chúng tôi", href: "/contact" },
    { key: "match", label: "Công việc phù hợp cho bạn", href: "/my-job" },
    { key: "quiz", label: "Quiz", href: "/quiz" },
    { key: "login", label: "Đăng nhập", button: true, type: "link" },
    { key: "signup", label: "Đăng Ký", button: true, type: "primary" },
  ];

  // Xác định item đang active dựa trên href (dành cho desktop)
  const activeItem =
    menuItems
      .slice(0, 5)
      .find((item) => pathname.startsWith(item.href ?? "")) || menuItems[0];
  const currentKey = activeItem.key;

  // --- Spring cho desktop underline indicator ---
  const [underline, api] = useSpring(() => ({
    x: 0,
    width: 0,
    config: { mass: 1, tension: 400, friction: 20 },
  }));

  useLayoutEffect(() => {
    const el = document.querySelector<HTMLElement>(
      `a[data-key="${currentKey}"]`,
    );
    if (!el) return;
    const targetX = el.offsetLeft;
    const targetW = el.offsetWidth;

    api.start({
      to: async (next) => {
        // 1) Thu nhỏ về giữa
        await next({ width: 0, x: targetX + targetW / 2, immediate: true });
        // 2) Dời và mở rộng
        await next({ x: targetX, width: targetW });
      },
    });
  }, [currentKey, api]);
  const router = useRouter();
  const handleNavClick =
    (href: string, key: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      // tìm thẻ đang active
      const el = document.querySelector<HTMLElement>(`a[data-key="${key}"]`);
      if (!el) {
        // fallback: điều hướng luôn
        router.push(href);
        return;
      }
      const targetX = el.offsetLeft;
      const targetW = el.offsetWidth;

      // animate thu underline về giữa
      api.start({
        to: async (next) => {
          next({
            width: 0,
            x: targetX + targetW / 2,
          });
          await router.push(href);
        },
        config: { mass: 1, tension: 400, friction: 20 },
      });
    };
  // --- Transition cho mobile menu ---
  const transitions = useTransition(isOpen ? menuItems : [], {
    keys: (item) => item.key,
    from: { opacity: 0, transform: "translate3d(0,-10px,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0px,0)" },
    leave: { opacity: 0, transform: "translate3d(0,-10px,0)" },
    trail: 100,
    config: { tension: 300, friction: 20 },
  });

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#49BBBD] dark:bg-[#1a4a4c] text-white p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="https://rubicmarketing.com/wp-content/uploads/2022/07/y-nghia-logo-fpt-lan-3.jpg"
              alt="Logo"
              width={28}
              height={28}
            />
            <span className={`${kaushan.className} text-3xl cursor-pointer`}>
              FLearning
            </span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex flex-1 justify-center items-center relative mx-20">
            {menuItems.slice(0, 5).map((item) => {
              const isActive = item.key === currentKey;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  data-key={item.key}
                  onClick={handleNavClick(item.href ?? "", item.key)}
                  className={`
          inline-block mx-4 pb-2 text-base tracking-wide transition-all duration-500 whitespace-nowrap
          ${isActive ? "text-white font-semibold" : "text-white hover:font-bold"}
        `}
                >
                  {item.label}
                </a>
              );
            })}
            <animated.div
              className="absolute bottom-0 left-0 h-0.5 bg-blue-500 rounded"
              style={{
                left: 0,
                width: underline.width,
                transform: underline.x.to((x) => `translate3d(${x}px, 0, 0)`),
              }}
            />
          </div>

          {/* Desktop auth & theme */}
          <div className="hidden md:flex items-center space-x-3 ml-8">
            <div className="ml-8">
              <ThemeSwitch />
            </div>
            <Link
              href="/Login"
              className="
                flex items-center justify-center
                h-12 px-6
                border-2 border-white
                text-white font-medium text-base whitespace-nowrap
                rounded-full
                transition-all duration-300
                hover:bg-white hover:text-[#49BBBD]
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white
              "
            >
              Đăng nhập
            </Link>

            {/* Đăng Ký */}
            <Link
              href="/Signup"
              className="
                flex items-center justify-center
                h-12 px-6
                bg-gradient-to-r from-[#5da38f] to-[#4a8a7a]
                text-white font-medium text-base whitespace-nowrap
                rounded-full shadow-lg
                transition-all duration-300
                hover:from-[#4a8a7a] hover:to-[#5da38f]
                hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5da38f]
              "
            >
              Đăng Ký
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 px-4 py-3">
          <div className="flex justify-center">
            <ThemeSwitch />
          </div>

          {transitions((style, item) => {
            const isActive = item.key === currentKey;
            return (
              <animated.div key={item.key} style={style} className="mb-2">
                {item.button ? (
                  item.type === "link" ? (
                    <Button
                      type="link"
                      className={`p-0 text-base transition-colors duration-200 ${
                        isActive
                          ? "text-green-200 font-semibold"
                          : "text-green-400 hover:text-green-200"
                      }`}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      className={`w-full text-base transition-colors duration-300 ${
                        isActive
                          ? "bg-green-600 font-semibold"
                          : "bg-[#73b4a1] hover:bg-[#5da38f]"
                      }`}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Button>
                  )
                ) : (
                  <Link
                    href={item.href ?? ""}
                    onClick={closeMenu}
                    className={`block text-base py-1 transition ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-gray-300 hover:text-gray-400"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </animated.div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
