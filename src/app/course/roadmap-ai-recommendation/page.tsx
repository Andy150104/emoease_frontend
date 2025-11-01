"use client";

import React, { useMemo, useRef } from "react";
import {
  Badge,
  Button,
  Card,
  Divider,
  Progress,
  Segmented,
  Space,
  Steps,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  LockOutlined,
  PlayCircleOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

/* ===================== Types ===================== */
export type CourseStatus = "done" | "in_progress" | "todo" | "locked";

export type RoadmapCourse = {
  id: string;
  code?: string;
  title: string;
  hours?: number;
  credits?: number;
  status: CourseStatus;
  href?: string;
  tags?: string[];
  // optional: prerequisite ids nếu có
  prereqIds?: string[];
};

export type RoadmapTerm = {
  id: string;
  name: string;
  note?: string;
  requiredCredits?: number;
  courses: RoadmapCourse[]; // theo thứ tự gợi ý học -> flow trong kỳ
};

export type RoadmapTrack = {
  key: string;
  label: string;
  terms: RoadmapTerm[];
};

export type RoadmapByTermProps = {
  tracks?: RoadmapTrack[];
  initialTrackKey?: string;
};

/* ===================== Utils ===================== */
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
const weightOf = (c: RoadmapCourse) =>
  typeof c.credits === "number"
    ? c.credits
    : typeof c.hours === "number"
    ? Math.max(1, Math.round(c.hours / 10))
    : 1;

function termStats(term: RoadmapTerm) {
  const w = term.courses.map(weightOf);
  const total = sum(w);
  const done = term.courses.reduce(
    (acc, c, i) => acc + (c.status === "done" ? w[i] : 0),
    0,
  );
  const percent = total ? Math.round((done / total) * 100) : 0;
  return {
    percent,
    finishedCount: term.courses.filter((c) => c.status === "done").length,
    totalCourses: term.courses.length,
  };
}

function overallStats(terms: RoadmapTerm[]) {
  const totals = terms.map(termStats);
  const totalWeight = sum(
    terms.map((t) => sum(t.courses.map(weightOf))),
  );
  const doneWeight = sum(
    terms.map((t) =>
      t.courses.reduce(
        (acc, c, i) => acc + (c.status === "done" ? weightOf(c) : 0),
        0,
      ),
    ),
  );
  const percent = totalWeight ? Math.round((doneWeight / totalWeight) * 100) : 0;

  return {
    percent,
    totalCourses: sum(terms.map((t) => t.courses.length)),
    completedCourses: sum(
      terms.map((t) => t.courses.filter((c) => c.status === "done").length),
    ),
    totalHours: sum(terms.flatMap((t) => t.courses.map((c) => c.hours ?? 0))),
    doneHours: sum(
      terms.flatMap((t) =>
        t.courses.map((c) => (c.status === "done" ? c.hours ?? 0 : 0)),
      ),
    ),
    totalCredits: sum(terms.flatMap((t) => t.courses.map((c) => c.credits ?? 0))),
    doneCredits: sum(
      terms.flatMap((t) =>
        t.courses.map((c) => (c.status === "done" ? c.credits ?? 0 : 0)),
      ),
    ),
  };
}

/* ===================== Icons ===================== */
function StatusIcon({ status }: { status: CourseStatus }) {
  if (status === "done")
    return <CheckCircleTwoTone twoToneColor="#52c41a" className="text-base" />;
  if (status === "in_progress")
    return <ClockCircleTwoTone twoToneColor="#1677ff" className="text-base" />;
  if (status === "locked") return <LockOutlined className="text-gray-400" />;
  return <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-300" />;
}

/* ===================== TermFlow (lộ trình trong 1 kỳ) ===================== */
function TermFlow({
  term,
  onOpenCourse,
}: {
  term: RoadmapTerm;
  onOpenCourse: (c: RoadmapCourse) => void;
}) {
  // current index: ưu tiên in_progress -> todo đầu tiên -> cuối cùng là finished cuối cùng
  const idxInProgress = term.courses.findIndex((c) => c.status === "in_progress");
  const idxTodo = term.courses.findIndex((c) => c.status === "todo");
  const current =
    idxInProgress >= 0
      ? idxInProgress
      : idxTodo >= 0
      ? idxTodo
      : Math.max(
          0,
          term.courses.findLastIndex
            ? term.courses.findLastIndex((c) => c.status === "done")
            : [...term.courses].reverse().findIndex((c) => c.status === "done"),
        );

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (x: number) => scrollerRef.current?.scrollBy({ left: x, behavior: "smooth" });

  return (
    <div className="relative">
      {/* Arrow buttons for wide flows */}
      <div className="hidden md:block">
        <Button
          shape="circle"
          icon={<LeftOutlined />}
          className="!absolute -left-3 top-1/2 -translate-y-1/2 z-10"
          onClick={() => scrollBy(-280)}
        />
        <Button
          shape="circle"
          icon={<RightOutlined />}
          className="!absolute -right-3 top-1/2 -translate-y-1/2 z-10"
          onClick={() => scrollBy(280)}
        />
      </div>

      <div
        ref={scrollerRef}
        className="overflow-x-auto no-scrollbar px-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <Steps
          size="small"
          current={current < 0 ? 0 : current}
          labelPlacement="vertical"
          className="min-w-[660px] pr-2"
          items={term.courses.map((c) => ({
            title: (
              <div className="min-w-[180px] pr-2" style={{ scrollSnapAlign: "center" }}>
                <div className="flex items-center gap-2">
                  <StatusIcon status={c.status} />
                  <div className="truncate font-medium">{c.title}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {c.code ? `${c.code} · ` : ""}
                  {typeof c.credits === "number" ? `${c.credits} tín chỉ` : ""}
                  {typeof c.hours === "number"
                    ? `${c.credits ? " · " : ""}${c.hours}h`
                    : ""}
                </div>
                {!!c.tags?.length && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {c.tags.slice(0, 3).map((t) => (
                      <Tag key={t} bordered={false} className="text-[11px]">
                        {t}
                      </Tag>
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <Button
                    size="small"
                    type="default"
                    disabled={c.status === "locked" || !c.href}
                    onClick={() => onOpenCourse(c)}
                  >
                    {c.status === "in_progress" ? "Tiếp tục" : "Xem"}
                  </Button>
                </div>
              </div>
            ),
            status:
              c.status === "done"
                ? "finish"
                : c.status === "in_progress"
                ? "process"
                : "wait",
            icon: c.status === "locked" ? <LockOutlined /> : undefined,
            disabled: c.status === "locked",
          }))}
        />
      </div>
    </div>
  );
}

/* ===================== CoursePill (giữ view cũ dạng list) ===================== */
function CoursePill({ c, onOpen }: { c: RoadmapCourse; onOpen: (c: RoadmapCourse) => void }) {
  const disabled = c.status === "locked";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onOpen(c)}
      className={[
        "group flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition",
        disabled
          ? "cursor-not-allowed bg-gray-50 dark:bg-[#0c1322] border-gray-200 dark:border-zinc-800 opacity-70"
          : "hover:-translate-y-[1px] hover:shadow border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
      ].join(" ")}
      aria-label={c.title}
    >
      <StatusIcon status={c.status} />
      <div className="min-w-0">
        <div className="truncate font-medium">{c.title}</div>
        <div className="text-xs text-gray-500">
          {c.code ? `${c.code} · ` : ""}
          {typeof c.credits === "number" ? `${c.credits} tín chỉ` : ""}
          {typeof c.hours === "number" ? `${c.credits ? " · " : ""}${c.hours}h` : ""}
        </div>
        {!!c.tags?.length && (
          <div className="mt-1 flex flex-wrap gap-1">
            {c.tags.slice(0, 3).map((t) => (
              <Tag key={t} bordered={false} className="text-[11px]">
                {t}
              </Tag>
            ))}
          </div>
        )}
      </div>
      <RightOutlined className="ml-auto opacity-30 text-[10px]" />
    </button>
  );
}

/* ===================== TermCard ===================== */
function TermCard({
  term,
  onOpenCourse,
  onContinue,
}: {
  term: RoadmapTerm;
  onOpenCourse: (c: RoadmapCourse) => void;
  onContinue: () => void;
}) {
  const s = termStats(term);

  return (
    <Card id={term.id} className="rounded-2xl ring-1 ring-zinc-200/60 dark:ring-zinc-800/60">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Title level={4} className="!mb-0">
            {term.name}
            {term.note ? <span className="text-gray-500"> · {term.note}</span> : null}
          </Title>
          <div className="text-sm text-gray-500">
            Đã hoàn thành {s.finishedCount}/{s.totalCourses} môn
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-44">
            <Progress percent={s.percent} size="small" />
          </div>
          <Tooltip title="Ưu tiên môn đang học, nếu không có thì môn kế tiếp">
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={onContinue}>
              Học tiếp
            </Button>
          </Tooltip>
        </div>
      </div>

      <Divider className="!my-4" />

      {/* FLOW TRONG KỲ */}
      <TermFlow term={term} onOpenCourse={onOpenCourse} />

      {/* Optional: List view bổ trợ */}
      <Divider className="!my-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {term.courses.map((c) => (
          <CoursePill key={c.id} c={c} onOpen={onOpenCourse} />
        ))}
      </div>
    </Card>
  );
}

/* ===================== Main ===================== */
export default function RoadmapByTerm({
  tracks,
  initialTrackKey,
}: RoadmapByTermProps) {
  const router = useRouter();

  // Mock nếu chưa nối API
  const mock: RoadmapTrack[] = useMemo(
    () => [
      {
        key: "web",
        label: "Web (JS/React)",
        terms: [
          {
            id: "t1",
            name: "Kỳ 1",
            note: "Cơ bản",
            courses: [
              {
                id: "c-html",
                code: "WEB101",
                title: "HTML & CSS Foundation",
                hours: 20,
                credits: 3,
                status: "done",
                href: "/course/html-css",
                tags: ["HTML", "CSS", "Responsive"],
              },
              {
                id: "c-js",
                code: "WEB102",
                title: "JavaScript Basics",
                hours: 24,
                credits: 3,
                status: "in_progress",
                href: "/course/js-basics",
                tags: ["ES6", "DOM"],
              },
              {
                id: "c-git",
                code: "DEV101",
                title: "Git & GitHub",
                hours: 8,
                credits: 1,
                status: "todo",
                href: "/course/git",
                tags: ["Version Control"],
              },
              {
                id: "c-ux",
                code: "UX101",
                title: "UX Basics",
                hours: 10,
                credits: 2,
                status: "locked",
                href: "",
                tags: ["Design"],
              },
            ],
          },
          {
            id: "t2",
            name: "Kỳ 2",
            note: "Frontend nâng cao",
            courses: [
              {
                id: "c-react",
                code: "WEB201",
                title: "React Fundamentals",
                hours: 28,
                credits: 3,
                status: "todo",
                href: "/course/react",
                tags: ["Hooks", "State"],
              },
              {
                id: "c-rtk",
                code: "WEB202",
                title: "State Management",
                hours: 14,
                credits: 2,
                status: "locked",
                href: "/course/state",
                tags: ["Redux Toolkit", "Zustand"],
              },
              {
                id: "c-test",
                code: "WEB203",
                title: "Testing React",
                hours: 10,
                credits: 2,
                status: "locked",
                href: "/course/testing",
                tags: ["Jest", "RTL"],
              },
            ],
          },
        ],
      },
      {
        key: "java",
        label: "Java/Spring",
        terms: [
          {
            id: "tj1",
            name: "Kỳ 1",
            note: "Java Core",
            courses: [
              {
                id: "j-core",
                code: "JAVA101",
                title: "Java Fundamentals",
                hours: 24,
                credits: 3,
                status: "done",
                href: "/course/java-core",
                tags: ["OOP", "Collections"],
              },
              {
                id: "j-spring",
                code: "JAVA201",
                title: "Spring Framework",
                hours: 28,
                credits: 3,
                status: "todo",
                href: "/course/spring",
                tags: ["REST", "JPA"],
              },
            ],
          },
        ],
      },
    ],
    [],
  );

  const data = tracks?.length ? tracks : mock;
  const [active, setActive] = React.useState<string>(
    initialTrackKey ?? data[0]?.key ?? "web",
  );
  const currentTrack = data.find((t) => t.key === active) ?? data[0];
  const overall = overallStats(currentTrack.terms);

  const openCourse = (c: RoadmapCourse) => {
    if (c.href) router.push(c.href);
  };

  const continueInTerm = (term: RoadmapTerm) => {
    const next =
      term.courses.find((x) => x.status === "in_progress") ??
      term.courses.find((x) => x.status === "todo");
    if (next?.href) router.push(next.href);
  };

  return (
    <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Title level={3} className="!mb-1">Lộ trình học của bạn</Title>
          <Text type="secondary">Theo kỳ · Theo dõi tiến độ · Gợi ý môn kế tiếp</Text>
        </div>
        <Segmented
          value={active}
          onChange={(v) => setActive(String(v))}
          options={data.map((t) => ({ label: t.label, value: t.key }))}
        />
      </div>

      {/* Layout: summary + terms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <Card className="rounded-2xl ring-1 ring-zinc-200/60 dark:ring-zinc-800/60">
            <Title level={5}>Tổng quan tiến độ</Title>
            <div className="flex items-center gap-4">
              <Progress type="dashboard" percent={overall.percent} size={140} />
              <div className="space-y-1 text-sm">
                <div>
                  <Text strong>{overall.completedCourses}</Text> /{" "}
                  <Text>{overall.totalCourses}</Text> môn
                </div>
                <div>
                  <Text strong>{overall.doneHours}</Text> /{" "}
                  <Text>{overall.totalHours}</Text> giờ
                </div>
                <div>
                  <Text strong>{overall.doneCredits}</Text> /{" "}
                  <Text>{overall.totalCredits}</Text> tín chỉ
                </div>
                <div className="pt-2">
                  <Space size={[6, 6]} wrap>
                    <Badge color="#52c41a" text="Đã hoàn thành" className="text-xs" />
                    <Badge color="#1677ff" text="Đang học" className="text-xs" />
                    <Badge color="#d9d9d9" text="Chưa học" className="text-xs" />
                    <Badge color="#999999" text="Khoá" className="text-xs" />
                  </Space>
                </div>
              </div>
            </div>

            <Divider className="!my-4" />
            <Title level={5} className="!mb-2">Kỳ học</Title>
            <div className="flex flex-wrap gap-2">
              {currentTrack.terms.map((t) => {
                const s = termStats(t);
                return (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className="rounded-full border px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    {t.name} · {s.percent}%
                  </a>
                );
              })}
            </div>
          </Card>
        </aside>

        {/* Terms */}
        <div className="lg:col-span-2 space-y-6">
          {currentTrack.terms.map((t) => (
            <TermCard
              key={t.id}
              term={t}
              onOpenCourse={openCourse}
              onContinue={() => continueInTerm(t)}
            />
          ))}
        </div>
      </div>

      {/* small util: hide scrollbar (tailwind) */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
