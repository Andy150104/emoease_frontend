"use client";

import React, { useState, useEffect, useRef } from "react";
import { Form, Segmented } from "antd";
import Image from "next/image";
import { useSpring, useTrail, animated, easings } from "@react-spring/web";
import BaseControlTextField from "EmoEase/components/BaseControl/BasecontrolTextField";
import { ThemeSwitch } from "EmoEase/components/Themes/Theme";
import bgQuestion from "EmoEase/assets/FPT_Logo_Background.jpg";
import { useAuthStore } from "EmoEase/stores/Auth/AuthStore";
import { isAxiosError } from "axios";
import BubbleBackground from "EmoEase/components/Bubble/BubbleBackground";
import { useRouter } from "next/navigation";
import { useNotification } from "EmoEase/Provider/NotificationProvider";
import Loading from "EmoEase/components/Loading/Loading";
import { useLoadingStore } from "EmoEase/stores/Loading/LoadingStore";
import { Lobster } from "next/font/google";
import "./styles/login.styles.css";

const xmlColumns = {
  email: { id: "email", name: "Email", rules: "required" },
  password: { id: "password", name: "Mật khẩu", rules: "required" },
  confirmPassword: {
    id: "confirmPassword",
    name: "Mật khẩu xác nhận",
    rules: "required|confirm_password:password",
  },
} as const;

type LoginFormValues = { email: string; password: string };

const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
});
// const getAuthSeen = () => {
//   if (typeof window === "undefined") return false; // đang SSR
//   try {
//     return window.sessionStorage.getItem("authMountOnce") === "1";
//   } catch {
//     return false; // chặn mọi lỗi truy cập Storage
//   }
// };
export default function RegisterPage() {
  const messageApi = useNotification();
  const [form] = Form.useForm<LoginFormValues>();
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<"login" | "register">("register");
  const [skipMountAnim, setSkipMountAnim] = useState<boolean>(false);
  const [showFormBySwipeRun, setShowFormBySwipeRun] = useState<boolean>(true);
  const [showWipe, setShowWipe] = useState(false);
  const [wipeStyles, wipeApi] = useSpring<{ y: number }>(() => ({ y: 100 }));

  const didRunRef = useRef(false);

  useEffect(() => {
    const SetForm = async () => {
      const seen =
        typeof window !== "undefined" &&
        sessionStorage.getItem("authMountOnce") === "1";
      if (seen) {
        setShowFormBySwipeRun(false);
      }
      await setShowForm(true);
    };
    SetForm();
  }, []);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" &&
      sessionStorage.getItem("authMountOnce") === "1";

    setSkipMountAnim(seen);
    if (!seen || didRunRef.current) return;
    didRunRef.current = true;

    setShowWipe(true);

    requestAnimationFrame(() => {
      // Dừng animation đang chạy (nếu có) rồi set tức thời vị trí start
      wipeApi.stop();
      wipeApi.set({ y: 100 }); // <-- KHÔNG có immediate ở đây

      requestAnimationFrame(() => {
        wipeApi.start({
          to: [
            { y: 0, config: { duration: 700, easing: easings.easeOutCubic } },
            { y: -100, config: { duration: 550, easing: easings.easeInCubic } },
          ],
          onRest: () => setShowWipe(false),
        });
      });
    });
    setTimeout(() => {
      setShowFormBySwipeRun(true);
    }, 500);
  }, [wipeApi]);

  const onFinish = async (values: LoginFormValues) => {
    try {
      useLoadingStore.getState().showLoading();
      await login(values.email, values.password);
      await router.push("/Admin");
      await messageApi.success("Đăng nhập thành công!");
      useLoadingStore.getState().hideLoading();
    } catch (error: unknown) {
      useLoadingStore.getState().hideLoading();
      let errorMessage =
        "Đăng nhập thất bại, vui lòng kiểm tra lại email/mật khẩu.";
      if (isAxiosError(error)) {
        const serverMsg =
          error.response?.data?.errors || error.response?.data?.error;
        if (typeof serverMsg === "string") errorMessage = serverMsg;
      }
      messageApi.error(errorMessage);
    }
  };

  // 1) Mount animation: chỉ 1 useSpring
  const mountSprings = useSpring({
    opacity: showForm ? 1 : 0,
    transform: showForm ? "scale(1)" : "scale(0.8)",
    immediate: skipMountAnim,
    config: { mass: 1, tension: 280, friction: 60 },
    delay: 100,
  });

  // 2) Trail cho các input field
  const fieldKeys = ["email", "password", "confirmPassword"] as const;
  const trail = useTrail(showForm ? fieldKeys.length : 0, {
    from: { opacity: 0, transform: "translate3d(0,20px,0)" },
    to: { opacity: 1, transform: "translate3d(0,0,0)" },
    config: { mass: 1, tension: 200, friction: 20 },
    delay: 600,
  });

  const FormCard = (
    <animated.div style={mountSprings} className="relative w-full max-w-md">
      <BubbleBackground />
      <div className="relative z-10 bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* <h2
          className={`${knewave.className} text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-center px-4 text-[#4a2580]`}
        >
          Welcome to FLearning
        </h2> */}
        <div className="mx-auto mt-2 w-full">
          <Segmented
            block
            value={activeKey}
            onChange={(val) => {
              const v = val as "login" | "register";
              if (v !== activeKey) {
                setActiveKey(v);
                setTimeout(() => {
                  sessionStorage.removeItem("authMountOnce");
                  sessionStorage.setItem("authMountOnce", "1");
                  const target = v === "login" ? "/Login" : "/Register";
                  router.push(target);
                }, 220);
              }
            }}
            options={[
              {
                label: (
                  <span className="text-slate-900 dark:text-white">
                    Đăng Nhập
                  </span>
                ),
                value: "login",
              },
              {
                label: (
                  <span className="text-slate-700 dark:text-slate-300">
                    Đăng kí
                  </span>
                ),
                value: "register",
              },
            ]}
            className="auth-segmented"
          />
        </div>

        {/* Heading thay đổi theo tab */}
        <div
          className={`${lobster.className} flex justify-center items-center h-full
              text-black text-2xl md:text-3xl font-semibold my-6 dark:text-white transition-all`}
        >
          Đăng kí tài khoản mới
        </div>
        <Form<LoginFormValues>
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          {trail.map((style, idx) => {
            const key = fieldKeys[idx];
            return (
              <animated.div key={key} style={style} className="mb-4">
                <BaseControlTextField
                  xmlColumn={xmlColumns[key]}
                  maxlength={50}
                  placeholder={
                    key === "email" ? "Enter your Email" : "Enter your Password"
                  }
                  type={
                    key === "password" || key === "confirmPassword"
                      ? "password"
                      : undefined
                  }
                />
              </animated.div>
            );
          })}
          <div className="mt-6 sm:mt-8">
            {/* Đổi hover scale sang CSS */}
            <button
              type="submit"
              className="w-full py-4 font-semibold text-white rounded-full bg-gradient-to-r from-teal-400 to-blue-500 
                         hover:scale-[1.05] transition-transform duration-200"
            >
              Đăng nhập
            </button>
          </div>
        </Form>
      </div>
    </animated.div>
  );

  const ShowSwipeEffect = (
    <animated.div
      style={mountSprings}
      className="fixed inset-0 z-[2147483647] pointer-events-none"
    >
      {showWipe && (
        <animated.div
          className="fixed inset-0 z-[2147483647] pointer-events-none"
          style={{
            transform: wipeStyles.y.to((v) => `translate3d(0, ${v}%, 0)`),
          }}
        >
          {/* Wipe Sheet nâng cấp */}
          <div className="relative h-dvh w-full overflow-hidden rounded-t-[80px] shadow-[0_-20px_60px_rgba(16,185,129,.35)]">
            {/* Gradient nền chính (có thể đổi màu cho hợp brand) */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500" />

            {/* Lưới chấm mờ để có chiều sâu */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,.55) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                backgroundPosition: "0 0",
              }}
            />

            {/* Viền sáng ở mép trên (tạo cảm giác kính) */}
            <div className="absolute inset-x-0 top-0 h-24 bg-white/40 [mask-image:linear-gradient(to_bottom,white,transparent)]" />

            {/* Dải "shine" chạy chéo qua khi trượt */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-y-0 -left-1/3 w-1/2 rotate-6 bg-white/10 blur-3xl animate-wipe-shine" />
            </div>

            {/* Mép trên uốn lượn (wave) */}
            <svg
              className="absolute -top-10 left-0 w-full h-24 text-white/50"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <path
                fill="currentColor"
                d="M0,320L120,288C240,256,480,192,720,170.7C960,149,1200,171,1320,181.3L1440,192L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
              />
            </svg>
          </div>
        </animated.div>
      )}
    </animated.div>
  );

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen">
        {showWipe && ShowSwipeEffect}
        {/* Right: form card */}
        <Loading />
        {/* Left: background + mobile form */}
        <div className="relative flex-1 h-screen md:h-auto overflow-hidden">
          <Image
            src={bgQuestion}
            alt="Hero"
            fill
            priority
            placeholder="blur"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-right brightness-90 dark:brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 via-cyan-300 to-blue-300 opacity-50 dark:opacity-40" />
          <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 text-white z-10">
            <p
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-2xl`}
            >
              FLearning
            </p>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg md:text-xl drop-shadow-lg">
              Nền tảng học tập cho sinh viên FPT{" "}
              <span className="pl-4">
                {" "}
                <ThemeSwitch />
              </span>
            </p>
          </div>
          {/* Mobile */}
          <div className="absolute inset-0 md:hidden">
            <div className="relative w-full h-screen">
              <BubbleBackground />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {showFormBySwipeRun && FormCard}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div
          className="hidden md:flex flex-1 items-center justify-center
             bg-gradient-to-br from-blue-50 to-indigo-50
             dark:from-gray-900 dark:to-gray-800"
        >
          <div className="relative w-full h-full">
            {" "}
            {/* <-- đảm bảo cao bằng màn hình */}
            <BubbleBackground /> {/* <-- chạy full vùng này */}
            <div className="absolute inset-0 flex items-center justify-center">
              {showFormBySwipeRun && FormCard}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
