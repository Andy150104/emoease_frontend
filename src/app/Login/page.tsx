"use client";

import React, { useState, useEffect } from "react";
import { Form } from "antd";
import Image from "next/image";
import { useSpring, useTrail, animated } from "@react-spring/web";
import BaseControlTextField from "EmoEase/components/BaseControl/BasecontrolTextField";
import { ThemeSwitch } from "EmoEase/components/Themes/Theme";
import bgQuestion from "EmoEase/assets/bg_Question.webp";
import { useAuthStore } from "EmoEase/stores/Auth/AuthStore";
import { isAxiosError } from "axios";
import BubbleBackground from "EmoEase/components/Bubble/BubbleBackground";
import { useRouter } from "next/navigation";
import { useNotification } from "EmoEase/Provider/NotificationProvider";
import Loading from "EmoEase/components/Loading/Loading";
import { useLoadingStore } from "EmoEase/stores/Loading/LoadingStore";
import { Knewave } from "next/font/google";

const xmlColumns = {
  email: { id: "email", name: "Email", rules: "required" },
  password: { id: "password", name: "Password", rules: "required" },
} as const;

type LoginFormValues = { email: string; password: string };
const knewave = Knewave({
  weight: "400",
  subsets: ["latin"],
});

export default function LoginPage() {
  const messageApi = useNotification();
  const [form] = Form.useForm<LoginFormValues>();
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    setShowForm(true);
  }, []);

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
    config: { mass: 1, tension: 280, friction: 60 },
    delay: 300,
  });

  // 2) Trail cho các input field
  const fieldKeys = ["email", "password"] as const;
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
        <h2
          className={`${knewave.className} text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-center px-4 text-[#4a2580]`}
        >
          Welcome to EmoEase!
        </h2>
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
                  type={key === "password" ? "password" : undefined}
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

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen">
        <Loading />
        {/* Left: background + mobile form */}
        <div className="relative flex-1 h-screen md:h-auto overflow-hidden">
          <Image
            src={bgQuestion}
            alt="Hero"
            fill
            className="object-cover object-right brightness-90 dark:brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-red-400 to-purple-500 opacity-50 dark:opacity-40" />
          <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 text-white z-10">
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-2xl`}
            >
              Welcome To EmoEase!! <ThemeSwitch />
            </h1>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg md:text-xl drop-shadow-lg">
              Let&apos;s Login
            </p>
          </div>
          {/* Mobile */}
          <div className="absolute inset-0 md:hidden">
            <div className="relative w-full h-screen">
              <BubbleBackground />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {FormCard}
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
              {FormCard}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
