// components/Navbar.jsx
"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "antd";
import { useTransition, animated } from "@react-spring/web";
import { ThemeSwitch } from "../Themes/Theme";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { key: "home", label: "Trang chủ", href: "/Home" },
    { key: "jobs", label: "Công việc", href: "/job" },
    { key: "contact", label: "Liên hệ chúng tôi", href: "/contact" },
    { key: "match", label: "Công việc phù hợp cho bạn", href: "/my-job" },
    { key: "quiz", label: "Quiz", href: "/quiz" },
    { key: "login", label: "Đăng nhập", button: true, type: "link" },
    { key: "signup", label: "Đăng Ký", button: true, type: "primary" },
  ];

  const transitions = useTransition(isOpen ? menuItems : [], {
    keys: (item) => item.key,
    from: { opacity: 0, transform: "translate3d(0,-10px,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0px,0)" },
    leave: { opacity: 0, transform: "translate3d(0,-10px,0)" },
    trail: 100,
  });

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-black text-white shadow p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="https://rubicmarketing.com/wp-content/uploads/2022/07/y-nghia-logo-fpt-lan-3.jpg" alt="Logo" width={28} height={28} />
            <span className="text-lg font-semibold">FCareer</span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex flex-1 justify-center space-x-6">
            {menuItems.slice(0, 5).map((item) => (
              <Link
                key={item.key}
                href={item.href ?? ""}
                className={`text-base font-medium tracking-wide hover:text-white transition ${
                  item.key === "home" ? "text-white font-semibold" : "text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeSwitch />
            <Link
              href="/Login"
              className="text-white font-medium text-base hover:underline"
            >
              Đăng nhập
            </Link>
            <Link
              href="/Login"
              className="bg-[#73b4a1] hover:bg-[#5da38f] text-white font-medium text-base px-4 py-2 rounded"
            >
              Đăng Ký
            </Link>
          </div>

          {/* Hamburger (mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 px-4 py-3">
          {transitions((style, item) => (
            <animated.div style={style} key={item.key} className="mb-2">
              {item.button ? (
                item.key === "login" ? (
                  <Button
                    type="link"
                    className="text-green-400 hover:text-green-200 transition-colors duration-200 p-0 text-base"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    className="w-full bg-[#73b4a1] hover:bg-[#5da38f] transition-colors duration-300 text-base"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Button>
                )
              ) : (
                <Link
                  href={item.href ?? "#"}
                  className="block text-base text-white hover:text-gray-300 py-1"
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              )}
            </animated.div>
          ))}
        </div>
      )}
    </nav>
  );
}
