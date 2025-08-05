// File: src/components/FeatureSection.tsx
import HeroSection from "EmoEase/components/HomePage/HeroSection";
import MoreSection from "EmoEase/components/HomePage/MoreSection";
import Stats from "EmoEase/components/HomePage/Stats";
import BaseScreen from "EmoEase/layout/BaseScreen";
import React from "react";
import { FiCalendar, FiFileText, FiUsers } from "react-icons/fi";

const features = [
  {
    icon: <FiFileText className="w-8 h-8 text-white" />,
    bg: "bg-indigo-500",
    title: "Online Billing, Invoicing, & Contracts",
    desc: "Simple and secure control of your organization’s financial and legal transactions. Send customized invoices and contracts.",
  },
  {
    icon: <FiCalendar className="w-8 h-8 text-white" />,
    bg: "bg-teal-400",
    title: "Easy Scheduling & Attendance Tracking",
    desc: "Schedule and reserve classrooms at one campus or multiple campuses. Keep detailed records of student attendance.",
  },
  {
    icon: <FiUsers className="w-8 h-8 text-white" />,
    bg: "bg-cyan-400",
    title: "Customer Tracking",
    desc: "Automate and track emails to individuals or groups. Built-in system helps organize your organization’s workflow.",
  },
];

const FeatureSection: React.FC = () => (
  <>
    <BaseScreen>
      <HeroSection />
      <div className="pt-12">
        <Stats />
      </div>
      <div className="bg-[#49BBBD] dark:bg-[#1a4a4c] h-[600px] rounded-b-[32rem] z-10"></div>
      <section
        className="bg-white dark:bg-gray-900 overflow-hidden relative z-0"
        data-speed="0.6"
        data-lag="0.2"
      >
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center px-4 mb-12 mt-48">
          <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Tính năng nổi bật{" "}
            <span className="text-teal-400 dark:text-teal-300 font-bold">
              FLearning
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            FLearning vận dụng AI trong việc cá nhân hóa khóa học phù hợp với
            học sinh.
          </p>
        </div>
        {/* Cards */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="feature-card relative bg-white dark:bg-gray-800 pt-16 pb-8 px-8 rounded-2xl shadow-lg dark:shadow-gray-900/50 text-center"
                data-speed={1 + idx * 0.3}
                data-lag="0.2"
              >
                {/* icon circle */}
                <div
                  className={`
                      absolute -top-8 left-1/2 
                      transform -translate-x-1/2 
                      ${f.bg} w-16 h-16 rounded-full 
                      flex items-center justify-center
                    `}
                >
                  {f.icon}
                </div>

                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 h-[50px]"></div>
      </section>
      <div className="mt-32 overflow-hidden">
        <MoreSection />
      </div>
      {/* Enhanced spacer section */}
      <div className="relative bg-gradient-to-br from-[#49BBBD] via-[#3da8aa] to-[#2d9597] dark:from-[#1a4a4c] dark:via-[#153f41] dark:to-[#0f3436] rounded-t-[40rem] h-[600px] z-10 overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0">
          {/* Geometric shapes */}
          <div className="absolute top-16 left-8 w-16 h-16 border-2 border-white/10 rounded-lg rotate-45 animate-pulse"></div>
          <div
            className="absolute top-32 right-12 w-20 h-20 border border-white/15 rounded-full animate-bounce"
            style={{ animationDelay: "1.2s" }}
          ></div>
          <div
            className="absolute top-48 left-1/3 w-12 h-12 bg-white/5 rounded-lg rotate-12 animate-pulse"
            style={{ animationDelay: "2.4s" }}
          ></div>
          <div
            className="absolute top-64 right-1/4 w-24 h-24 border-2 border-white/8 rounded-full animate-bounce"
            style={{ animationDelay: "0.8s" }}
          ></div>
          <div
            className="absolute top-80 left-1/2 w-8 h-8 bg-white/12 rounded-full animate-pulse"
            style={{ animationDelay: "1.6s" }}
          ></div>

          {/* Professional icons with better styling */}
          <div className="absolute top-24 left-1/4 flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 animate-float">
            <span className="text-2xl">📚</span>
          </div>
          <div
            className="absolute top-40 right-1/3 flex items-center justify-center w-20 h-20 bg-white/8 backdrop-blur-sm rounded-2xl border border-white/15 animate-float"
            style={{ animationDelay: "1.8s" }}
          >
            <span className="text-3xl">🎓</span>
          </div>
          <div
            className="absolute top-56 left-2/3 flex items-center justify-center w-14 h-14 bg-white/12 backdrop-blur-sm rounded-2xl border border-white/18 animate-float"
            style={{ animationDelay: "2.2s" }}
          >
            <span className="text-xl">💡</span>
          </div>

          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/3 to-white/8"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent"></div>

          {/* Enhanced wave effect */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1440 160" className="w-full h-40">
              <path
                d="M0,120 C360,80 720,100 1440,120 L1440,160 L0,160 Z"
                fill="rgba(255,255,255,0.08)"
              />
              <path
                d="M0,140 C360,110 720,125 1440,140 L1440,160 L0,160 Z"
                fill="rgba(255,255,255,0.04)"
              />
            </svg>
          </div>

          {/* Particle effect */}
          <div className="absolute top-20 left-1/2 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
          <div
            className="absolute top-40 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-60 right-1/4 w-1 h-1 bg-white/50 rounded-full animate-ping"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Enhanced content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-6">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/25 mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight">
                Sẵn sàng bắt đầu
                <span className="block text-white/90">hành trình học tập?</span>
              </h3>
              <p className="text-lg md:text-xl mb-8 text-white/80 leading-relaxed">
                Khám phá các khóa học được cá nhân hóa với AI,
                <span className="block">tối ưu hóa cho từng học viên</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group relative bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="text-white font-semibold text-lg">
                  Khám phá ngay
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button className="group bg-transparent backdrop-blur-sm px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/40">
                <span className="text-white/90 font-medium text-lg">
                  Tìm hiểu thêm
                </span>
              </button>
            </div>

            {/* Stats preview */}
            <div className="mt-12 flex justify-center items-center space-x-8 text-white/70">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm">Học viên</div>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm">Khóa học</div>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm">Hài lòng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseScreen>
  </>
);

export default FeatureSection;
