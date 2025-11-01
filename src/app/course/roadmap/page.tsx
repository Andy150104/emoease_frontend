"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Empty,
  Input,
  Progress,
  Segmented,
  Space,
  Steps,
  Switch,
  Tag,
  Typography,
  message,
} from "antd";
import {
  PlayCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import BaseScreenWhiteNav from "EmoEase/layout/BaseScreenWhiteNav";
import { FadeTransition } from "EmoEase/components/Animation/FadeTransition";

const { Title, Text, Paragraph } = Typography;

/* ===================== Types ===================== */
export type CourseItem = {
  id: string;
  title: string;
  provider: string;
  imageUrl: string;
  tags: string[];
  durationHours: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  href: string;
};

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Mixed";
  courses: CourseItem[];
};

/* ===================== Mock data ===================== */
const PATH_ID = "web-foundation-beginner";
const MOCK_PATH: LearningPath = {
  id: PATH_ID,
  title: "Lộ trình Web Foundation (HTML/CSS/JS cơ bản)",
  description:
    "Bắt đầu từ nền tảng HTML & CSS, sau đó làm quen lập trình với Python/JS và các kỹ năng tư duy. Lộ trình gồm nhiều khoá ngắn để đi nhanh – học đến đâu áp dụng đến đó.",
  level: "Beginner",
  courses: [
    {
      id: "c-html-css",
      title: "HTML & CSS Foundation",
      provider: "EmoEase Academy",
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      tags: ["HTML", "CSS", "Responsive"],
      durationHours: 14,
      level: "Beginner",
      href: "/course/html-css-foundation",
    },
    {
      id: "c-code-yourself",
      title: "Code Yourself! An Introduction to Programming",
      provider: "University of Edinburgh",
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      tags: ["Programming", "Logic"],
      durationHours: 10,
      level: "Beginner",
      href: "/course/code-yourself",
    },
    {
      id: "c-python-crash",
      title: "Crash Course on Python",
      provider: "Google",
      imageUrl:
        "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      tags: ["Python", "Automation"],
      durationHours: 18,
      level: "Beginner",
      href: "/course/python-crash",
    },
    {
      id: "c-vibe-ai",
      title: "Vibe Coding Essentials – Build Apps with AI",
      provider: "Scrimba",
      imageUrl:
        "https://cdn/shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      tags: ["Web", "AI", "Prompt"],
      durationHours: 12,
      level: "Intermediate",
      href: "/course/vibe-coding",
    },
    {
      id: "c-js-meta",
      title: "Lập trình với JavaScript",
      provider: "Meta",
      imageUrl:
        "https://cdn/shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531",
      tags: ["JavaScript", "Front-end"],
      durationHours: 20,
      level: "Beginner",
      href: "/course/js-meta",
    },
  ],
};

/* ===================== Helpers ===================== */
const storageKey = (pathId: string) => `lp:${pathId}:completed`;
const sumHours = (items: CourseItem[]) =>
  items.reduce((acc, c) => acc + c.durationHours, 0);

type RoadmapStatus = "now" | "next" | "later" | "done";

/* =============== Grid Card (giữ cho chế độ Lưới) =============== */
function GridCourseCard(props: {
  course: CourseItem;
  completed: boolean;
  onToggle: (id: string) => void;
  isNext?: boolean;
  stepNo?: number;
  total?: number;
}) {
  const { course, completed, onToggle, isNext, stepNo, total } = props;
  const router = useRouter();

  const cls =
    `rounded-2xl ring-1 ring-zinc-200/60 dark:ring-zinc-800/60 shadow-sm overflow-hidden ` +
    (isNext ? "ring-2 ring-blue-500 " : "") +
    (completed ? "opacity-90 " : "");

  return (
    <Card
      className={cls}
      bodyStyle={{ padding: 16 }}
      cover={
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          {isNext ? (
            <div className="absolute left-2 top-2 rounded-full bg-white/90 dark:bg-zinc-900/90 px-2.5 py-1 text-xs font-medium ring-1 ring-zinc-200/70 dark:ring-zinc-800/70">
              Tiếp theo
            </div>
          ) : null}
          {typeof stepNo === "number" && typeof total === "number" ? (
            <div className="absolute right-2 top-2 rounded-full bg-white/90 dark:bg-zinc-900/90 px-2.5 py-1 text-xs font-medium ring-1 ring-zinc-200/70 dark:ring-zinc-800/70">
              Bước {stepNo}/{total}
            </div>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 p-2">
            <Progress percent={completed ? 100 : 0} size="small" showInfo={false} />
          </div>
        </div>
      }
      actions={[
        <Button
          key="view"
          type="primary"
          icon={<ReadOutlined />}
          onClick={() => router.push(course.href)}
        >
          Xem khóa học
        </Button>,
        <Button
          key="done"
          icon={<CheckOutlined />}
          onClick={() => onToggle(course.id)}
        >
          {completed ? "Bỏ đánh dấu" : "Đánh dấu xong"}
        </Button>,
      ]}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Title level={4} className="!mb-1 line-clamp-2">
            {course.title}
          </Title>
          <div className="text-sm text-gray-500">{course.provider}</div>
        </div>
        <Tag
          color={
            course.level === "Beginner"
              ? "green"
              : course.level === "Intermediate"
              ? "blue"
              : "purple"
          }
        >
          {course.level}
        </Tag>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ClockCircleOutlined className="opacity-70" />
        <Text>{course.durationHours}h</Text>
        <Divider type="vertical" />
        {course.tags.map((t) => (
          <Tag key={`${course.id}-${t}`}>{t}</Tag>
        ))}
      </div>

      {completed ? (
        <div className="mt-3 text-green-600 flex items-center gap-2">
          <CheckOutlined /> <span>Đã hoàn thành</span>
        </div>
      ) : null}
    </Card>
  );
}

/* =============== Roadmap Row (compact, thông minh) =============== */
function RoadmapRow(props: {
  course: CourseItem;
  index: number; // 1-based
  total: number;
  status: RoadmapStatus;
  completed: boolean;
  onToggle: (id: string) => void;
  onOpen: (href: string) => void;
  showTopLine?: boolean;
  showBottomLine?: boolean;
  autoFocus?: boolean;
}) {
  const {
    course,
    index,
    total,
    status,
    completed,
    onToggle,
    onOpen,
    showTopLine,
    showBottomLine,
    autoFocus,
  } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [autoFocus]);

  const badgeColor =
    status === "now" ? "blue" : status === "done" ? "green" : "default";

  return (
    <div
      ref={ref}
      className={`relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 sm:p-4
        ${status === "now" ? "ring-2 ring-blue-500" : ""} ${completed ? "opacity-90" : ""}`}
    >
      {/* rail connectors (optional) */}
      {showTopLine ? (
        <div className="absolute left-6 top-0 h-3 w-[2px] bg-zinc-200 dark:bg-zinc-800" />
      ) : null}
      {showBottomLine ? (
        <div className="absolute left-6 bottom-0 h-3 w-[2px] bg-zinc-200 dark:bg-zinc-800" />
      ) : null}

      <div className="flex items-start gap-3">
        {/* Number circle */}
        <div className="relative shrink-0">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold
            ${status === "now" ? "border-blue-500 text-blue-600" : completed ? "border-green-500 text-green-600" : "border-zinc-300 text-zinc-600"}`}
            title={`Bước ${index}/${total}`}
          >
            {index}
          </div>
        </div>

        {/* Thumb + content */}
        <div className="flex w-full items-center gap-3">
          <div className="hidden sm:block shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800" style={{ width: 120, height: 68 }}>
            <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <Title level={5} className="!mb-0 truncate">{course.title}</Title>
              <Tag color={badgeColor}>
                {status === "now" ? "Now" : status === "next" ? "Next" : status === "later" ? "Later" : "Done"}
              </Tag>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <ClockCircleOutlined /> {course.durationHours}h
              <Divider type="vertical" />
              <span className="truncate">{course.provider}</span>
              <Divider type="vertical" />
              <span className="flex flex-wrap gap-1">
                {course.tags.slice(0, 3).map((t) => (
                  <Tag key={`${course.id}-${t}`} className="m-0">{t}</Tag>
                ))}
              </span>
            </div>

            {/* mini progress (0/100 placeholder) */}
            <Progress
              className="mt-2"
              percent={completed ? 100 : status === "now" ? 10 : 0}
              size="small"
              showInfo={false}
              status={completed ? "success" : "active"}
            />

            <div className="mt-2 flex flex-wrap gap-2">
              {status === "now" ? (
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => onOpen(course.href)}
                >
                  Bắt đầu / Tiếp tục
                </Button>
              ) : (
                <Button icon={<ReadOutlined />} onClick={() => onOpen(course.href)}>
                  Xem khóa học
                </Button>
              )}
              <Button icon={<CheckOutlined />} onClick={() => onToggle(course.id)}>
                {completed ? "Bỏ đánh dấu" : "Đánh dấu xong"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== Page ===================== */
export default function LearningPathPage() {
  const router = useRouter();
  const [path] = useState<LearningPath>(MOCK_PATH);
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [filter, setFilter] =
    useState<"ALL" | "INCOMPLETE" | "COMPLETED">("ALL");
  const [query, setQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"GRID" | "ROADMAP">("ROADMAP");
  const [hideCompletedInRoadmap, setHideCompletedInRoadmap] = useState<boolean>(true);

  // Load progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(path.id));
      if (raw) setCompletedMap(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      // ignore
    }
  }, [path.id]);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(path.id), JSON.stringify(completedMap));
    } catch {
      // ignore
    }
  }, [completedMap, path.id]);

  const totalCourses = path.courses.length;
  const doneCount = useMemo(
    () => path.courses.reduce((acc, c) => acc + (completedMap[c.id] ? 1 : 0), 0),
    [completedMap, path.courses],
  );
  const pct = Math.round((doneCount / Math.max(totalCourses, 1)) * 100);
  const totalHours = useMemo(() => sumHours(path.courses), [path.courses]);
  const doneHours = useMemo(
    () => path.courses.reduce((acc, c) => acc + (completedMap[c.id] ? c.durationHours : 0), 0),
    [completedMap, path.courses],
  );
  const remainingHours = Math.max(totalHours - doneHours, 0);

  // Bước kế tiếp (trái)
  const currentIdx = useMemo(() => {
    const idx = path.courses.findIndex((c) => !completedMap[c.id]);
    return idx === -1 ? Math.max(totalCourses - 1, 0) : idx;
  }, [path.courses, completedMap, totalCourses]);

  // Tìm next id (global)
  const nextIdGlobal = useMemo(() => {
    const next = path.courses.find((c) => !completedMap[c.id]);
    return next ? next.id : "";
  }, [path.courses, completedMap]);

  const stepNoFor = (id: string) =>
    path.courses.findIndex((c) => c.id === id) + 1;

  // Filter tìm kiếm
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = path.courses.filter((c) =>
      c.title.toLowerCase().includes(q),
    );
    if (filter === "COMPLETED") return base.filter((c) => completedMap[c.id]);
    if (filter === "INCOMPLETE") return base.filter((c) => !completedMap[c.id]);
    return base;
  }, [path.courses, completedMap, filter, query]);

  // Nhóm cho ROADMAP
  const roadmapItems = useMemo(() => {
    const items = filtered.map((c, i) => {
      let status: RoadmapStatus = "later";
      if (completedMap[c.id]) status = "done";
      else if (c.id === nextIdGlobal) status = "now";
      else if (!completedMap[c.id] && i > -1 && stepNoFor(c.id) === stepNoFor(nextIdGlobal) + 1)
        status = "next";
      return {
        course: c,
        index: stepNoFor(c.id),
        status,
      };
    });
    // Ẩn completed nếu cần
    return hideCompletedInRoadmap ? items.filter((it) => it.status !== "done") : items;
  }, [filtered, completedMap, nextIdGlobal, hideCompletedInRoadmap]);

  // Nhóm cho GRID
  const nextCourseGrid = filtered.find((c) => !completedMap[c.id]);
  const remainingGrid = filtered.filter(
    (c) => !completedMap[c.id] && c.id !== (nextCourseGrid ? nextCourseGrid.id : ""),
  );
  const completedGrid = filtered.filter((c) => completedMap[c.id]);

  const toggleCourse = (id: string) =>
    setCompletedMap((prev) => ({ ...prev, [id]: !prev[id] }));

  const openCourse = (href: string) => router.push(href);

  const continueNext = () => {
    const next = path.courses.find((c) => !completedMap[c.id]);
    if (next) router.push(next.href);
    else message.success("Tuyệt vời! Bạn đã hoàn thành toàn bộ lộ trình.");
  };

  return (
    <BaseScreenWhiteNav>
      <FadeTransition show>
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-6 py-8">
          {/* Header */}
          <header className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <Title level={2} className="!mb-1">
                  {path.title}
                </Title>
                <Paragraph className="!mb-2 text-gray-600 dark:text-gray-300">
                  {path.description}
                </Paragraph>
                <Space size={8} wrap>
                  <Tag color="green">Level: {path.level}</Tag>
                  <Tag color="blue">{totalCourses} khóa</Tag>
                  <Tag color="geekblue">~{totalHours} giờ</Tag>
                </Space>
              </div>
              <Space size={12} wrap>
                <Button
                  icon={<PlayCircleOutlined />}
                  type="primary"
                  onClick={continueNext}
                >
                  Tiếp tục học
                </Button>
                <Button onClick={() => setCompletedMap({})}>Reset tiến độ</Button>
              </Space>
            </div>
          </header>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Sidebar: Progress & Steps */}
            <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
              <Card className="rounded-2xl shadow-sm ring-1 ring-zinc-200/60 dark:ring-zinc-800/60">
                <Title level={4} className="!mb-3">
                  Tiến độ lộ trình
                </Title>

                <div className="grid grid-cols-3 gap-2 text-center mb-2">
                  <div className="rounded-lg bg-gray-50 dark:bg-zinc-800/60 p-2">
                    <div className="text-xs text-gray-500">Khóa</div>
                    <div className="font-semibold">
                      {doneCount}/{totalCourses}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-zinc-800/60 p-2">
                    <div className="text-xs text-gray-500">Giờ</div>
                    <div className="font-semibold">
                      {doneHours}h/{totalHours}h
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-zinc-800/60 p-2">
                    <div className="text-xs text-gray-500">Còn lại</div>
                    <div className="font-semibold">{remainingHours}h</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Text>Tiến độ tổng</Text>
                  <Text strong>{pct}%</Text>
                </div>
                <Progress
                  className="mt-2"
                  percent={pct}
                  showInfo={false}
                  status={pct === 100 ? "success" : "active"}
                  strokeLinecap="round"
                />

                <Divider className="!my-4" />
                <Title level={5} className="!mb-3">
                  Các bước học
                </Title>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="inline-flex items-center gap-1 text-blue-600">
                    <PlayCircleOutlined /> Đang học
                  </span>
                  <span className="inline-flex items-center gap-1 text-green-600">
                    <CheckOutlined /> Đã xong
                  </span>
                  <span className="inline-flex items-center gap-1">Chờ</span>
                </div>

                <Steps
                  direction="vertical"
                  size="small"
                  current={currentIdx}
                  onChange={(idx) => {
                    const target = path.courses[idx];
                    if (target) router.push(target.href);
                  }}
                  items={path.courses.map((c, i) => ({
                    title: (
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="truncate">{c.title}</span>
                        <Tag
                          color={
                            i === currentIdx
                              ? "blue"
                              : completedMap[c.id]
                              ? "green"
                              : "default"
                          }
                        >
                          Bước {i + 1}
                        </Tag>
                      </div>
                    ),
                    description: (
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <ClockCircleOutlined /> {c.durationHours}h
                        </span>
                        {completedMap[c.id] ? (
                          <span className="text-green-600 inline-flex items-center gap-1">
                            <CheckOutlined /> Xong
                          </span>
                        ) : i === currentIdx ? (
                          <span className="text-blue-600 inline-flex items-center gap-1">
                            <PlayCircleOutlined /> Đang học
                          </span>
                        ) : null}
                      </div>
                    ),
                    status: completedMap[c.id]
                      ? "finish"
                      : i === currentIdx
                      ? "process"
                      : "wait",
                    icon: completedMap[c.id] ? <CheckOutlined /> : undefined,
                  }))}
                />

                <Divider className="!my-4" />
                <Space direction="vertical" className="w-full">
                  <Button
                    block
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={continueNext}
                  >
                    Học tiếp bài kế
                  </Button>
                  <Button block onClick={() => setCompletedMap({})}>
                    Xoá toàn bộ tiến độ
                  </Button>
                </Space>
              </Card>
            </aside>

            {/* Main content */}
            <main className="lg:col-span-2 space-y-6">
              <Card
                className="rounded-2xl ring-1 ring-zinc-200/60 dark:ring-zinc-800/60"
                bodyStyle={{ padding: 16 }}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <Input.Search
                    allowClear
                    placeholder="Tìm trong lộ trình (tên khoá)"
                    onSearch={setQuery}
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                    className="md:w-[360px]"
                  />
                  <div className="flex items-center gap-3">
                    <Segmented
                      options={[
                        { label: "Tất cả", value: "ALL" },
                        { label: "Chưa xong", value: "INCOMPLETE" },
                        { label: "Đã xong", value: "COMPLETED" },
                      ]}
                      value={filter}
                      onChange={(val) => setFilter(val as typeof filter)}
                    />
                    <Segmented
                      options={[
                        { label: "Lộ trình", value: "ROADMAP" },
                        { label: "Lưới", value: "GRID" },
                      ]}
                      value={viewMode}
                      onChange={(val) => setViewMode(val as typeof viewMode)}
                    />
                  </div>
                                      {viewMode === "ROADMAP" && (
                      <div className="flex items-center gap-2">
                        <Text hidden={false} className="text-sm">
                          Ẩn mục đã xong
                        </Text>
                        <Switch
                          checked={hideCompletedInRoadmap}
                          onChange={setHideCompletedInRoadmap}
                          size="small"
                        />
                      </div>
                    )}
                </div>
              </Card>

              {filtered.length === 0 ? (
                <Empty description="Không có khoá phù hợp" />
              ) : viewMode === "ROADMAP" ? (
                // ======= ROADMAP: compact list theo thứ tự =======
                <section aria-label="Roadmap compact">
                  <div className="space-y-3">
                    {roadmapItems.map((it, idx) => {
                      const isNow = it.status === "now";
                      const isLast = idx === roadmapItems.length - 1;
                      return (
                        <RoadmapRow
                          key={it.course.id}
                          course={it.course}
                          index={it.index}
                          total={totalCourses}
                          status={it.status}
                          completed={Boolean(completedMap[it.course.id])}
                          onToggle={toggleCourse}
                          onOpen={openCourse}
                          showTopLine={idx > 0}
                          showBottomLine={!isLast}
                          autoFocus={isNow}
                        />
                      );
                    })}
                  </div>
                </section>
              ) : (
                // ======= GRID: nhóm Tiếp theo / Kế tiếp / Đã hoàn thành =======
                <>
                  {nextCourseGrid ? (
                    <section>
                      <div className="flex items-center justify-between mb-2">
                        <Title level={5} className="!mb-0">
                          Tiếp theo
                        </Title>
                        <Tag color="blue">
                          Bước {stepNoFor(nextCourseGrid.id)}/{totalCourses}
                        </Tag>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <GridCourseCard
                          course={nextCourseGrid}
                          completed={Boolean(completedMap[nextCourseGrid.id])}
                          onToggle={toggleCourse}
                          isNext
                          stepNo={stepNoFor(nextCourseGrid.id)}
                          total={totalCourses}
                        />
                      </div>
                    </section>
                  ) : null}

                  {remainingGrid.length > 0 ? (
                    <section>
                      <div className="flex items-center justify-between mt-4 mb-2">
                        <Title level={5} className="!mb-0">
                          Các bước kế tiếp
                        </Title>
                        <Tag>{remainingGrid.length}</Tag>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {remainingGrid.map((c) => (
                          <GridCourseCard
                            key={c.id}
                            course={c}
                            completed={Boolean(completedMap[c.id])}
                            onToggle={toggleCourse}
                            stepNo={stepNoFor(c.id)}
                            total={totalCourses}
                          />
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {completedGrid.length > 0 ? (
                    <section>
                      <div className="flex items-center justify-between mt-6 mb-2">
                        <Title level={5} className="!mb-0">
                          Đã hoàn thành
                        </Title>
                        <Tag color="green">{completedGrid.length}</Tag>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {completedGrid.map((c) => (
                          <GridCourseCard
                            key={c.id}
                            course={c}
                            completed
                            onToggle={toggleCourse}
                            stepNo={stepNoFor(c.id)}
                            total={totalCourses}
                          />
                        ))}
                      </div>
                    </section>
                  ) : null}
                </>
              )}
            </main>
          </div>
        </div>
      </FadeTransition>
    </BaseScreenWhiteNav>
  );
}
