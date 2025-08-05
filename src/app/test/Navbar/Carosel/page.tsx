// pages/index.tsx
import React from "react";
import BaseControlCarousel from "EmoEase/components/BaseControl/Carousel";
import CourseCard from "EmoEase/components/CourseCard/CourseCard";
import BaseScreenWhiteNav from "EmoEase/layout/BaseScreenWhiteNav";
import { ZoomIn } from "EmoEase/components/Animation/ZoomIn";
import { FadeTransition } from "EmoEase/components/Animation/FadeTransition";

const continuingCourses = [
  {
    id: "html-css",
    title: "HTML & CSS Foundation",
    instructor: "Lina",
    instructorAvatar: "/avatars/lina.png",
    progress: 70,
    currentLesson: 5,
    totalLessons: 7,
    href: "/courses/html-css",
    imageUrl:
      "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
    description:
      "Master the fundamentals of web development with hands-on projects and real-world examples. Learn responsive design, modern CSS techniques, and best practices for creating beautiful, accessible websites.",
    duration: "8 weeks",
    level: "Beginner",
    students: 1247,
  },
  {
    id: "aws-sol-arch",
    title: "AWS Certified Solutions Architect",
    instructor: "Lina",
    instructorAvatar: "/avatars/lina.png",
    progress: 45,
    currentLesson: 3,
    totalLessons: 10,
    href: "/courses/aws-architect",
    imageUrl:
      "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
    description:
      "Design and deploy scalable, highly available, and fault-tolerant systems on AWS. Master cloud architecture patterns, security best practices, and cost optimization strategies.",
    duration: "12 weeks",
    level: "Advanced",
    students: 892,
  },
  {
    id: "react-advanced-1",
    title: "React Advanced Patterns I",
    instructor: "Lina",
    instructorAvatar: "/avatars/lina.png",
    progress: 30,
    currentLesson: 2,
    totalLessons: 5,
    href: "/courses/react-advanced",
    imageUrl:
      "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
    description:
      "Dive deep into React's advanced concepts including hooks, context, performance optimization, and state management patterns. Build enterprise-level applications with confidence.",
    duration: "6 weeks",
    level: "Intermediate",
    students: 1563,
  },
  {
    id: "react-advanced-2",
    title: "React Advanced Patterns II",
    instructor: "Lina",
    instructorAvatar: "/avatars/lina.png",
    progress: 30,
    currentLesson: 2,
    totalLessons: 5,
    href: "/courses/react-advanced-2",
    imageUrl:
      "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
    description:
      "Master advanced React patterns including render props, higher-order components, custom hooks, and performance optimization techniques for large-scale applications.",
    duration: "8 weeks",
    level: "Advanced",
    students: 743,
  },
];

const nextInPathway = [
  {
    id: "java-oop",
    title: "Lập trình OOP với Java",
    instructor: "Michael Chasen",
    instructorAvatar: "/avatars/chasen.png",
    descriptionLines: [
      "🎯 Master Object-Oriented Programming concepts",
      "🏗️ Design patterns and best practices",
      "⚡ Advanced Java features and techniques",
      "🔧 Real-world project implementation",
    ],
    href: "/courses/java-oop",
    imageUrl:
      "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
    duration: "10 weeks",
    level: "Intermediate",
    students: 2341,
    rating: 4.8,
  },
  {
    id: "spring-basic",
    title: "Lập trình với Spring Framework",
    instructor: "Michael Chasen",
    instructorAvatar: "/avatars/chasen.png",
    descriptionLines: [
      "🌱 Spring Core and Dependency Injection",
      "🔗 RESTful API development with Spring Boot",
      "🗄️ Database integration with JPA/Hibernate",
      "🛡️ Security implementation and testing",
    ],
    href: "/courses/spring-basic",
    imageUrl:
      "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
    duration: "12 weeks",
    level: "Intermediate",
    students: 1892,
    rating: 4.7,
  },
  {
    id: "spring-advanced",
    title: "Lập trình với Spring Framework nâng cao",
    instructor: "Michael Chasen",
    instructorAvatar: "/avatars/chasen.png",
    descriptionLines: [
      "🚀 Spring Boot advanced features",
      "🔐 Security, AOP, and transaction management",
      "📊 Microservices architecture patterns",
      "☁️ Cloud deployment and DevOps integration",
    ],
    href: "/courses/spring-advanced",
    imageUrl:
      "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
    duration: "14 weeks",
    level: "Advanced",
    students: 1123,
    rating: 4.9,
  },
];

const recommendedCourses = [
  {
    id: "python-data-science",
    title: "Python cho Data Science",
    instructor: "Sarah Johnson",
    instructorAvatar: "/avatars/sarah.png",
    descriptionLines: [
      "📊 Data analysis with Pandas and NumPy",
      "📈 Visualization with Matplotlib and Seaborn",
      "🤖 Machine Learning fundamentals",
      "📋 Real-world data science projects",
    ],
    href: "/courses/python-data-science",
    imageUrl:
      "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
    price: "299.000 VND",
    duration: "16 weeks",
    level: "Intermediate",
    students: 3421,
    rating: 4.8,
  },
  {
    id: "devops-practices",
    title: "DevOps Practices & Tools",
    instructor: "Alex Chen",
    instructorAvatar: "/avatars/alex.png",
    descriptionLines: [
      "🐳 Docker containerization",
      "☸️ Kubernetes orchestration",
      "🔄 CI/CD pipeline automation",
      "☁️ Cloud infrastructure management",
    ],
    href: "/courses/devops-practices",
    imageUrl:
      "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
    price: "399.000 VND",
    duration: "18 weeks",
    level: "Advanced",
    students: 1567,
    rating: 4.9,
  },
  {
    id: "mobile-development",
    title: "Mobile App Development",
    instructor: "Emma Wilson",
    instructorAvatar: "/avatars/emma.png",
    descriptionLines: [
      "📱 React Native cross-platform development",
      "🎨 UI/UX design principles",
      "🔔 Push notifications and APIs",
      "🚀 App store deployment strategies",
    ],
    href: "/courses/mobile-development",
    imageUrl:
      "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
    price: "249.000 VND",
    duration: "14 weeks",
    level: "Intermediate",
    students: 2134,
    rating: 4.6,
  },
];

const HomePage: React.FC = () => (
  <BaseScreenWhiteNav>
  <FadeTransition show={true}>
        <div>
      {/* Section 1: Welcome back - Enhanced with better descriptions */}
      <section className="bg-[#4abbbd66] w-screen" data-speed="0.9">
        <div className="max-w-7xl xxl:max-w-[2000px] mx-auto px-4 py-12">
          <ZoomIn>
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1">
                <p className="text-3xl font-bold text-gray-800 mb-2">
                  Chào mừng trở lại! 🎓
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  Bạn muốn tiếp tục hành trình học tập nào hôm nay? Hãy chọn
                  khóa học phù hợp để phát triển kỹ năng của bạn.
                </p>
              </div>
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-md"
              >
                <span>Xem chi tiết lộ trình</span>
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </ZoomIn>
          <BaseControlCarousel
            infinite={false}
            // autoplay
            autoplaySpeed={4000}
            isShowFooter
            totalItemsPerSlide={3}
            classItemStyle="md:mx-4"
          >
            {continuingCourses.map((course) => (
              <CourseCard
                key={course.id}
                imageUrl={course.imageUrl}
                title={course.title}
                instructor={course.instructor}
                instructorAvatar={course.instructorAvatar}
                isShowProgress
                progress={course.progress!}
                currentLesson={course.currentLesson!}
                totalLessons={course.totalLessons!}
                routerPush={course.href}
              />
            ))}
          </BaseControlCarousel>
        </div>
      </section>
      <section className="scroll-section bg-[#252641] text-white rounded-3xl px-6 py-12 md:px-16 md:py-20 mx-4 md:mx-auto max-w-7xl xxl:max-w-[2000px] my-20">
        <h1 className="text-2xl md:text-4xl font-semibold text-center mb-4">
          Tự học theo tiến độ của bạn
        </h1>
        <p className="text-sm md:text-base text-center opacity-90 mb-8">
          Truy cập thư viện bài giảng đa dạng, học mọi lúc mọi nơi và quản lý
          tiến độ cá nhân một cách linh hoạt.
        </p>
      </section>
      {/* Section 2: Next in pathway - Enhanced with visual highlights */}
      <section
        className="bg-gradient-to-br from-blue-50 to-indigo-100 w-screen my-8"
        data-speed="0.9"
      >
        <div className="max-w-7xl xxl:max-w-[2000px] mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <p className="text-2xl font-bold text-gray-800">
                  Các khoá học tiếp theo trong lộ trình
                </p>
              </div>
              <p className="text-gray-600 mb-4">
                Khám phá các khóa học được thiết kế đặc biệt để phát triển kỹ
                năng của bạn theo lộ trình tối ưu.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <span>Xem tất cả</span>
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
          <BaseControlCarousel
            infinite={false}
            autoplay={false}
            isShowFooter={false}
            totalItemsPerSlide={3}
            classItemStyle="md:mx-4"
          >
            {nextInPathway.map((course) => (
              <CourseCard
                key={course.id}
                imageUrl={course.imageUrl}
                title={course.title}
                descriptionLines={course.descriptionLines}
                instructor={course.instructor}
                instructorAvatar={course.instructorAvatar}
                routerPush={course.href}
              />
            ))}
          </BaseControlCarousel>
        </div>
      </section>

      {/* Section: Học trực tiếp cùng giảng viên */}
      <section
        className="bg-[#252641] text-white rounded-3xl px-6 py-12 md:px-16 md:py-20 mx-4 md:mx-auto max-w-7xl xxl:max-w-[2000px] my-20 relative z-0"
        data-speed="0.7"
      >
        <h1 className="text-2xl md:text-4xl font-semibold text-center mb-4">
          Học trực tiếp cùng giảng viên
        </h1>
        <p className="text-sm md:text-base text-center opacity-90 mb-8">
          Tham gia các buổi livestream tương tác, đặt câu hỏi theo thời gian
          thực và nhận hướng dẫn cá nhân hóa. Tận dung cơ hội học hỏi từ các
          chuyên gia hàng đầu trong ngành.
          <br />
          <span className="font-semibold">Đăng ký ngay để không bỏ lỡ!</span>
        </p>
      </section>

      {/* Section 3: Recommended for you - Enhanced with better descriptions */}
      <section className="bg-[#84c5c6] w-screen my-8 relative z-50">
        <div className="max-w-7xl xxl:max-w-[2000px] mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <p className="text-2xl font-bold text-gray-800">
                  Các khoá học đề xuất phù hợp với bạn
                </p>
              </div>
              <p className="text-gray-600 mb-4">
                Dựa trên sở thích và tiến độ học tập của bạn, chúng tôi đã chọn
                ra những khóa học phù hợp nhất.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <span>Xem tất cả</span>
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
          <BaseControlCarousel
            infinite={false}
            autoplay={false}
            isShowFooter={false}
            totalItemsPerSlide={3}
            classItemStyle="md:mx-4"
          >
            {recommendedCourses.map((course) => (
              <CourseCard
                key={course.id}
                imageUrl={course.imageUrl}
                title={course.title}
                descriptionLines={course.descriptionLines}
                instructor={course.instructor}
                price={course.price}
                routerPush={course.href}
              />
            ))}
          </BaseControlCarousel>
        </div>
      </section>
    </div>
  </FadeTransition>
  </BaseScreenWhiteNav>
);

export default HomePage;
