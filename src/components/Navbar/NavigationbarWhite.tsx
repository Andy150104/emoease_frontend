"use client";
import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import Image from "next/image";
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

export default function NavigationbarWhite() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { key: "home", label: "Trang chủ", href: "/test/Navbar/home" },
    { key: "jobs", label: "Công việc", href: "/test/Navbar/jobs" },
    { key: "contact", label: "Liên hệ chúng tôi", href: "/contact" },
    { key: "match", label: "Công việc phù hợp cho bạn", href: "/my-job" },
    { key: "quiz", label: "Quiz", href: "/quiz" },
    { key: "login", label: "Đăng nhập", button: true, type: "link" },
    { key: "signup", label: "Đăng Ký", button: true, type: "primary" },
  ];

  const activeItem =
    menuItems
      .slice(0, 5)
      .find((item) => pathname.startsWith(item.href ?? "")) || menuItems[0];
  const currentKey = activeItem.key;

  const [underline, api] = useSpring(() => ({
    x: 0,
    width: 0,
    config: { mass: 1, tension: 400, friction: 20 },
  }));

  useLayoutEffect(() => {
    if (!showNav) return;
    const el = document.querySelector<HTMLElement>(
      `a[data-key="${currentKey}"]`,
    );
    if (!el) return;
    const targetX = el.offsetLeft;
    const targetW = el.offsetWidth;
    api.start({
      to: async (next) => {
        await next({ width: 0, x: targetX + targetW / 2, immediate: true });
        await next({ x: targetX, width: targetW });
      },
    });
  }, [currentKey, showNav, api]);

  const handleNavClick =
    (href: string, key: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      const el = document.querySelector<HTMLElement>(`a[data-key="${key}"]`);
      if (!el) {
        router.push(href);
        return;
      }
      const targetX = el.offsetLeft;
      const targetW = el.offsetWidth;
      api.start({
        to: async (next) => {
          next({ width: 0, x: targetX + targetW / 2 });
          await router.push(href);
        },
        config: { mass: 1, tension: 400, friction: 20 },
      });
    };

  const transitions = useTransition(isOpen ? menuItems : [], {
    keys: (item) => item.key,
    from: { opacity: 0, transform: "translate3d(0,-10px,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0px,0)" },
    leave: { opacity: 0, transform: "translate3d(0,-10px,0)" },
    trail: 100,
    config: { tension: 300, friction: 20 },
  });
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setShowNav(currentY <= lastScrollY.current);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    const navHeight = navRef.current.getBoundingClientRect().height;
    const SCROLL_THRESHOLD = 5;

    const onMouseMove = (e: MouseEvent) => {
      const y = window.scrollY;
      const cursorY = e.clientY;

      if (y <= SCROLL_THRESHOLD) {
        setShowNav(true);
      } else if (cursorY <= navHeight) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <nav
      onMouseEnter={() => setShowNav(true)}
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 bg-[#e1f0ff] dark:bg-[#1a4a4c] text-black p-4 transform transition-transform duration-300 ${
        showNav ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
          <div className="hidden md:flex flex-1 justify-center items-center relative mx-20">
            {menuItems.slice(0, 5).map((item) => {
              const isActive = item.key === currentKey;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  data-key={item.key}
                  onClick={handleNavClick(item.href!, item.key)}
                  className={`inline-block mx-4 pb-2 text-base tracking-wide transition-all duration-500 whitespace-nowrap ${
                    isActive
                      ? "text-black font-semibold"
                      : "text-black hover:font-bold"
                  }`}
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
          <div className="hidden md:flex items-center space-x-3 ml-8">
            <ThemeSwitch />
            <button
              onClick={() => router.push("/Login")}
              className="flex items-center justify-center h-12 px-6 border-2 border-white text-black font-medium text-base whitespace-nowrap rounded-full transition-all duration-300 hover:bg-white hover:text-[#49BBBD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white "
            >
              Đăng nhập
            </button>
            <button
              onClick={() => router.push("/Signup")}
              className="flex items-center justify-center h-12 px-6 bg-gradient-to-r from-[#5da38f] to-[#4a8a7a] text-black font-medium text-base whitespace-nowrap rounded-full shadow-lg transition-all duration-300 hover:from-[#4a8a7a] hover:to-[#5da38f] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5da38f]"
            >
              Đăng Ký
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-black hover:bg-gray-700"
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
      {isOpen && (
        <div className="md:hidden bg-gray-900 px-4 py-3">
          <div className="flex justify-center mb-2">
            <ThemeSwitch />
          </div>
          {transitions((style, item) => {
            const isActive = item.key === currentKey;
            if (item.button) {
              const btnProps = {
                className:
                  item.type === "link"
                    ? `p-0 text-base transition-colors duration-200 ${isActive ? "text-green-200 font-semibold" : "text-green-400 hover:text-green-200"}`
                    : `w-full text-base transition-colors duration-300 ${isActive ? "bg-green-600 font-semibold" : "bg-[#73b4a1] hover:bg-[#5da38f]"} `,
                onClick: () => {
                  closeMenu();
                  router.push(item.key === "login" ? "/Login" : "/Signup");
                },
              };
              return (
                <animated.div key={item.key} style={style} className="mb-2">
                  <Button
                    type={item.type === "link" ? "link" : "primary"}
                    {...btnProps}
                  >
                    {item.label}
                  </Button>
                </animated.div>
              );
            }
            return (
              <animated.div key={item.key} style={style} className="mb-2">
                <button
                  onClick={() => {
                    closeMenu();
                    router.push(item.href!);
                  }}
                  className={`block text-base py-1 transition ${isActive ? "text-black font-semibold" : "text-gray-300 hover:text-gray-400"}`}
                >
                  {item.label}
                </button>
              </animated.div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
