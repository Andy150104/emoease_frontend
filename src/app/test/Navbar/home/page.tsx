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
      <div className="bg-[#49BBBD] h-[600px] rounded-b-[32rem] z-10"></div>
      <section
        className="bg-white overflow-hidden relative z-0"
        data-speed="0.6"
        data-lag="0.2"
      >
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center px-4 mb-12 mt-48">
          <div className="text-3xl font-bold mb-2">
            Tính năng nổi bật{" "}
            <span className="text-teal-400 font-bold">FLearning</span>
          </div>
          <p className="text-gray-500">
            TOTC vận dụng AI trong việc cá nhân hóa khóa học phù hợp với học
            sinh.
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="feature-card relative bg-white pt-16 pb-8 px-8 rounded-2xl shadow-lg text-center"
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

                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white h-[500px]"></div>
      </section>
      <div className="mt-32">
        <MoreSection />
      </div>
      {/* spacer */}
      <div className="bg-amber-300 h-[2000px]" />
    </BaseScreen>
  </>
);

export default FeatureSection;
