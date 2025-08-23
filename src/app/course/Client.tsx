"use client";
import React, { useMemo, useState } from "react";
import { Button, Col, Divider, Drawer, Layout, Row, Select, Tag } from "antd";
import CourseCard from "EmoEase/components/CourseCard/CourseCard";
import { FiFilter } from "react-icons/fi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterContent, {
  FilterGroup,
} from "EmoEase/components/Common/Filter/FilterContent";
import Title from "antd/es/typography/Title";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import BaseScreenWhiteNav from "EmoEase/layout/BaseScreenWhiteNav";
import CourseSearchSection from "EmoEase/components/Course/HeroBannerCourse";
import { ZoomIn } from "EmoEase/components/Animation/ZoomIn";

export default function CourseListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openFilter, setOpenFilter] = useState(false);

  const filterGroups: FilterGroup[] = useMemo(
    () => [
      {
        param: "topic",
        title: "Môn học",
        type: "multi",
        options: [
          { label: "Khoa học máy tính", value: "Computer Science" },
          { label: "Công nghệ thông tin", value: "Information Technology" },
          { label: "Khoa học dữ liệu", value: "Data Science" },
          { label: "Kinh doanh", value: "Business" },
        ],
      },
      {
        param: "language",
        title: "Ngôn ngữ",
        type: "single", // chọn 1 ngôn ngữ
        options: [
          { label: "Tiếng Anh", value: "English" },
          { label: "Tây Ban Nha", value: "Spanish" },
          { label: "Pháp", value: "French" },
          { label: "Bồ Đào Nha", value: "Portuguese" },
        ],
      },
      {
        param: "level",
        title: "Cấp độ",
        type: "multi",
        options: [
          { label: "Người mới bắt đầu", value: "Beginner" },
          { label: "Trung cấp", value: "Intermediate" },
          { label: "Nâng cao", value: "Advanced" },
        ],
      },
    ],
    [],
  );
  const courses = [
    {
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      title: "Code Yourself! An Introduction to Programming",
      descriptionLines: [
        "Software Engineering",
        "Video Game Development",
        "Programming Principles",
      ],
      instructor: "University of Edinburgh",
      price: "Free",
      routerPush: "/course/code-yourself",
    },
    {
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      title: "Crash Course on Python",
      descriptionLines: [
        "Programming Principles",
        "Python Programming",
        "Computational Thinking",
      ],
      instructor: "Google",
      price: "Free",
      routerPush: "/course/python-crash",
    },
    {
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      title: "Vibe Coding Essentials - Build Apps with AI",
      descriptionLines: [
        "Web Development",
        "Prompt Engineering",
        "App Development",
      ],
      instructor: "Scrimba",
      price: "Free",
      routerPush: "/course/vibe-coding",
    },
    {
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      title: "Lập trình với JavaScript",
      descriptionLines: [
        "Front-End Development",
        "Web Fundamentals",
        "Javascript Basics",
      ],
      instructor: "Meta",
      price: "Free",
      routerPush: "/course/js-meta",
    },
    {
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      title: "Google IT Automation with Python",
      descriptionLines: ["Version Control", "Cloud Services", "Debugging"],
      instructor: "Google",
      price: "Free",
      routerPush: "/course/google-it-python",
    },
    {
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      title: "Google IT Automation with Python",
      descriptionLines: ["Version Control", "Cloud Services", "Debugging"],
      instructor: "Google",
      price: "Free",
      routerPush: "/course/google-it-python",
    },
    {
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      title: "Google IT Automation with Python",
      descriptionLines: ["Version Control", "Cloud Services", "Debugging"],
      instructor: "Google",
      price: "Free",
      routerPush: "/course/google-it-python",
    },
    {
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      title: "Google IT Automation with Python",
      descriptionLines: ["Version Control", "Cloud Services", "Debugging"],
      instructor: "Google",
      price: "Free",
      routerPush: "/course/google-it-python",
    },
    {
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      title: "Google IT Automation with Python",
      descriptionLines: ["Version Control", "Cloud Services", "Debugging"],
      instructor: "Google",
      price: "Free",
      routerPush: "/course/google-it-python",
    },
    {
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      title: "Google IT Automation with Python",
      descriptionLines: ["Version Control", "Cloud Services", "Debugging"],
      instructor: "Google",
      price: "Free",
      routerPush: "/course/google-it-python",
    },
    {
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      title: "Google IT Automation with Python",
      descriptionLines: ["Version Control", "Cloud Services", "Debugging"],
      instructor: "Google",
      price: "Free",
      routerPush: "/course/google-it-python",
    },
    {
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      title: "Google IT Automation with Python",
      descriptionLines: ["Version Control", "Cloud Services", "Debugging"],
      instructor: "Google",
      price: "Free",
      routerPush: "/course/google-it-python",
    },
  ];
  const sortValue = searchParams.get("sortBy") ?? "BEST_MATCH";
  const setSort = (val: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("sortBy", val);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
  const readParamValues = (sp: URLSearchParams, key: string) => {
    const multi = sp.getAll(key);
    if (multi.length) return multi;
    const single = sp.get(key);
    return single ? single.split(",").filter(Boolean) : [];
  };

  const removeParamValue = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams.toString());
    const current = readParamValues(next, key).filter((v) => v !== val);
    next.delete(key);
    current.forEach((v) => next.append(key, v));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const clearAllFilters = (keys: string[]) => {
    const next = new URLSearchParams(searchParams.toString());
    keys.forEach((k) => next.delete(k));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const selectedChips = useMemo(() => {
    return filterGroups.flatMap((g) => {
      const vals = readParamValues(searchParams, g.param);
      return vals.map((v) => ({
        param: g.param,
        value: v,
        label: g.options.find((o) => o.value === v)?.label ?? v,
      }));
    });
  }, [searchParams, filterGroups]);
  const handleSearch = (value: string) => {
    console.log("Search:", value);
    // Gọi API tìm kiếm hoặc router.push query
  };
  return (
    <BaseScreenWhiteNav>
      <ZoomIn>
        <CourseSearchSection onSearch={handleSearch} />
        {/* Khung ngoài, canh giữa theo max width */}
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
          <Layout hasSider className="!bg-transparent gap-4 lg:gap-10">
            {/* SIDEBAR (LG+) */}
            <Sider
              width={288}
              breakpoint="xl"
              collapsedWidth={0}
              className="hidden lg:block !bg-transparent !px-0 !transition-all !will-change-[width]"
              style={{ position: "sticky", top: 96, alignSelf: "flex-start" }}
            >
              <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-sm dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] p-5 h-screen">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiFilter className="text-gray-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Lọc khóa học
                    </span>
                  </div>
                  {selectedChips.length > 0 && (
                    <button
                      className="text-xs font-medium text-blue-600 hover:underline"
                      onClick={() =>
                        clearAllFilters(filterGroups.map((g) => g.param))
                      }
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>

                {/* Chips đã chọn */}
                {selectedChips.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedChips.map((chip) => (
                      <Tag
                        key={`${chip.param}:${chip.value}`}
                        closable
                        className="rounded-full px-2.5 py-1 text-xs border-gray-200 bg-gray-50 dark:bg-slate-800"
                        onClose={(e) => {
                          e.preventDefault();
                          removeParamValue(chip.param, chip.value);
                        }}
                      >
                        {chip.label}
                      </Tag>
                    ))}
                  </div>
                )}

                <Divider className="my-2" />

                {/* Groups */}
                <div className="divide-y divide-gray-100 [&>section]:py-3">
                  <FilterContent groups={filterGroups} />
                </div>

                {/* Footer */}
                <div className="pt-4 mt-4 border-t border-gray-100 sticky bottom-0 bg-white dark:bg-[#0b1220]">
                  <div className="flex gap-2">
                    <Button
                      block
                      size="small"
                      onClick={() =>
                        clearAllFilters(filterGroups.map((g) => g.param))
                      }
                    >
                      Xóa
                    </Button>
                    <Button type="primary" block size="small">
                      Áp dụng
                    </Button>
                  </div>
                </div>
              </div>
            </Sider>

            {/* CONTENT */}
            <Content className="!bg-transparent min-w-0">
              {/* Header */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Title
                    level={2}
                    className="!mb-0 text-xl sm:text-2xl font-bold"
                  >
                    Kết quả cho
                  </Title>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* nút lọc chỉ hiện mobile */}
                    <Button
                      icon={<FiFilter />}
                      onClick={() => setOpenFilter(true)}
                      className="lg:!hidden"
                    >
                      Lọc
                    </Button>

                    {/* Select full width trên mobile */}
                    <Select
                      value={sortValue}
                      onChange={setSort}
                      className="w-full sm:w-[200px]"
                      options={[
                        { value: "BEST_MATCH", label: "Phù hợp nhất" },
                        { value: "NEWEST", label: "Mới nhất" },
                        { value: "POPULAR", label: "Phổ biến" },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Grid cards */}
              <div className="mx-0 sm:mx-2 lg:mx-0">
                <Row
                  gutter={[
                    { xs: 20, sm: 16, md: 24, lg: 0, xl: 0 }, // ngang
                    { xs: 20, sm: 24, md: 32, lg: 24, xl: 24 }, // dọc
                  ]}
                >
                  {courses.map((c, idx) => (
                    <Col key={idx} xs={24} sm={12} xl={8}>
                      <div className="h-full xs:ml-2">
                        <CourseCard {...c} />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Content>
          </Layout>
        </div>

        {/* Drawer mobile */}
        <Drawer
          placement="left"
          width={320}
          title="Lọc khóa học"
          open={openFilter}
          onClose={() => setOpenFilter(false)}
          maskClosable
          rootClassName="xl:hidden"
        >
          <FilterContent groups={filterGroups} />
          <div className="sticky bottom-0 left-0 right-0 bg-white pt-3">
            <div className="flex gap-2">
              <Button block onClick={() => setOpenFilter(false)}>
                Đóng
              </Button>
              <Button type="primary" block onClick={() => setOpenFilter(false)}>
                Áp dụng
              </Button>
            </div>
          </div>
        </Drawer>
      </ZoomIn>
    </BaseScreenWhiteNav>
  );
}
