"use client";

import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Divider,
  Image,
  Layout,
  List,
  Progress,
  Rate,
  Space,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  CheckCircleTwoTone,
  TabletOutlined,
  CheckSquareOutlined,
  AppstoreOutlined,
  FacebookFilled,
  YoutubeFilled,
  InstagramOutlined,
  LinkedinFilled,
  WhatsAppOutlined,
  TwitterOutlined,
  ShoppingCartOutlined,
  PlayCircleOutlined,
  HomeOutlined,
  RightOutlined,
  BookOutlined,
} from "@ant-design/icons";
import BaseScreenWhiteNav from "EmoEase/layout/BaseScreenWhiteNav";
import { FadeTransition } from "EmoEase/components/Animation/FadeTransition";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

const IMG =
  "https://cdn.shopaccino.com/igmguru/products/java-training-igmguru_188702274_l.jpg?v=531";

const reviews = [
  {
    id: 1,
    name: "Lina",
    time: "3 tháng",
    avatar:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Lina&backgroundColor=b6e3f4",
    content:
      "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively…",
  },
  {
    id: 2,
    name: "Lina",
    time: "3 tháng",
    avatar:
      "https://api.dicebear.com/9.x/adventurer/svg?seed=Lina2&backgroundColor=c0aede",
    content:
      "Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively…",
  },
];

export default function CourseDetailUI() {
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      message.success("Đã copy link khóa học");
    } catch {
      message.info(url ? "Sao chép thủ công: " + url : "Không có URL");
    }
  };
  const courseTitle = "HTML & CSS Foundation";

  return (
    <BaseScreenWhiteNav>
      <FadeTransition show={true}>
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 mb-6"
        >
          <div className="sticky top-24 z-30">
            {" "}
            {/* nằm dưới navbar trắng của bạn */}
            <div
              className={[
                "rounded-xl px-3 py-2",
                "bg-white/75 dark:bg-[#0b1220]/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur",
                "ring-1 ring-zinc-200/70 dark:ring-zinc-800/70",
                "shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)]",
                "text-sm",
              ].join(" ")}
            >
              <Breadcrumb
                separator={
                  <RightOutlined className="text-zinc-400/70 text-[10px]" />
                }
                items={[
                  {
                    title: (
                      <Link
                        href="/test/Navbar/home"
                        className="inline-flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      >
                        <HomeOutlined className="text-[14px]" />
                        <span className="hidden sm:inline">Trang chủ</span>
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <Link
                        href="/course"
                        className="inline-flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      >
                        <BookOutlined className="text-[14px]" />
                        <span className="hidden xs:inline">Khóa học</span>
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <Tooltip title={courseTitle}>
                        <span
                          className="text-gray-500 dark:text-gray-400 truncate inline-block align-middle
                             max-w-[60vw] sm:max-w-[40vw] md:max-w-[32vw] lg:max-w-[28vw]"
                          aria-current="page"
                        >
                          {courseTitle}
                        </span>
                      </Tooltip>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </nav>
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <Layout className="!bg-transparent">
            <Card
              variant="borderless"
              hoverable
              className="lg:col-span-2 h-[400px] w-full !rounded-2xl shadow-sm ring-1 ring-zinc-200/60 dark:ring-zinc-800/60 bg-white dark:bg-zinc-900"
              cover={
                // Ảnh hero có chiều cao cố định theo breakpoint
                <Image
                  src={IMG}
                  alt="Ảnh bìa khóa học"
                  className="!h-[400px] !rounded-2xl !w-full !object-cover !object-center"
                  preview={false}
                  fallback={IMG}
                  placeholder={
                    <div className="h-full w-full animate-pulse bg-zinc-200/60 dark:bg-zinc-800/60" />
                  }
                />
              }
            />
          </Layout>
        </div>
        <div>
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {/* TOP: Banner + Sidebar card */}
            <section
              aria-label="Course summary & sidebar"
              className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {/* MAIN LEFT: stars + tabs + reviews */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stars + Tabs bar (nằm trên, nổi) */}
                <div
                  className="
        rounded-2xl p-3 sm:p-4
        bg-white/95 dark:bg-zinc-900/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur
        ring-1 ring-zinc-200/60 dark:ring-zinc-800/60
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
      "
                >
                  <div className="flex items-center gap-2">
                    <Rate disabled defaultValue={4} />
                    <span className="text-sm text-gray-500">Top đánh giá</span>
                  </div>
                  <Tabs
                    className="w-full sm:w-auto"
                    defaultActiveKey="overview"
                    items={[
                      { key: "curriculum", label: "Nội dung khóa học" },
                      { key: "overview", label: "Tổng quan" },
                      { key: "reviews", label: "Đánh giá" },
                      { key: "instructor", label: "Giảng viên" },
                    ]}
                  />
                </div>

                {/* Card tổng hợp điểm + reviews */}
                <Card className="rounded-2xl ring-1 ring-zinc-200/60 dark:ring-zinc-800/60 bg-cyan-50/80 dark:bg-cyan-950/30">
                  {/* Box 4/5 + thanh tỷ lệ */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="md:col-span-1">
                      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-5 shadow-sm">
                        <div className="text-lg font-semibold">4 trên 5</div>
                        <Rate disabled defaultValue={4} className="!mt-1" />
                        <div className="mt-2 text-gray-500 text-sm">
                          Top đánh giá
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      {[5, 4, 3, 2, 1].map((star, idx) => (
                        <div key={star} className="flex items-center gap-3">
                          <div className="w-12 text-right text-sm tabular-nums">
                            {star} Sao
                          </div>
                          <Progress
                            percent={[78, 62, 44, 28, 12][idx]}
                            showInfo={false}
                            strokeLinecap="round"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Divider />
                  <List
                    itemLayout="vertical"
                    dataSource={reviews}
                    renderItem={(item) => (
                      <List.Item key={item.id} className="!px-0">
                        <List.Item.Meta
                          avatar={<Avatar src={item.avatar} />}
                          title={
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-xs text-gray-500">
                                • {item.time}
                              </span>
                            </div>
                          }
                          description={<Rate disabled defaultValue={4} />}
                        />
                        <Paragraph className="!mb-0 text-gray-700 dark:text-gray-300">
                          {item.content}
                        </Paragraph>
                      </List.Item>
                    )}
                  />
                </Card>
              </div>

              {/* SIDEBAR RIGHT */}
              <aside className="lg:col-span-1 -mt-36 mr-10">
                <Card
                  className="
                rounded-2xl shadow-xl ring-1 ring-zinc-200/60 dark:ring-zinc-800/60
                bg-white/95 dark:bg-zinc-900/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur
                lg:sticky lg:top-6 h-fit -mt-40
                "
                >
                  <div className="overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
                    <Image
                      src={IMG}
                      alt="Thumbnail"
                      preview={false}
                      className="w-full aspect-[16/9] object-cover"
                    />
                  </div>

                  <Title level={4} className="!mt-4 !mb-2">
                    HTML &amp; CSS Foundation
                  </Title>

                  <div className="flex items-center gap-2">
                    <Rate disabled defaultValue={4} />
                    <Text type="secondary" className="ml-1">
                      4/5 (128 đánh giá)
                    </Text>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Tag color="blue">HTML</Tag>
                    <Tag color="geekblue">CSS</Tag>
                    <Tag color="cyan">Responsive</Tag>
                  </div>

                  <Divider className="!my-5" />
                  <Title level={5} className="!mb-3">
                    Khóa học bao gồm
                  </Title>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                      <span>Đảm bảo hoàn tiền</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TabletOutlined className="opacity-80" />
                      <span>Truy cập trên mọi thiết bị</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckSquareOutlined className="opacity-80" />
                      <span>Chứng nhận hoàn thành</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AppstoreOutlined className="opacity-80" />
                      <Tag color="blue" className="align-middle">
                        32 Modules
                      </Tag>
                    </div>
                  </div>

                  <Divider className="!my-5" />
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Giá
                      </div>
                      <div className="text-2xl font-semibold">499.000₫</div>
                    </div>
                    <Space>
                      <Button
                        icon={<ShoppingCartOutlined />}
                        onClick={() => message.success("Đã thêm vào giỏ")}
                      >
                        Thêm vào giỏ
                      </Button>
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={() => message.success("Bắt đầu học ngay")}
                      >
                        Học ngay
                      </Button>
                    </Space>
                  </div>

                  <Divider className="!my-5" />
                  <Title level={5} className="!mb-3">
                    Chia sẻ khóa học
                  </Title>
                  <Space size={8} wrap>
                    <Button
                      type="text"
                      shape="circle"
                      aria-label="Facebook"
                      icon={<FacebookFilled />}
                      onClick={handleShare}
                    />
                    <Button
                      type="text"
                      shape="circle"
                      aria-label="YouTube"
                      icon={<YoutubeFilled />}
                      onClick={handleShare}
                    />
                    <Button
                      type="text"
                      shape="circle"
                      aria-label="Instagram"
                      icon={<InstagramOutlined />}
                      onClick={handleShare}
                    />
                    <Button
                      type="text"
                      shape="circle"
                      aria-label="LinkedIn"
                      icon={<LinkedinFilled />}
                      onClick={handleShare}
                    />
                    <Button
                      type="text"
                      shape="circle"
                      aria-label="WhatsApp"
                      icon={<WhatsAppOutlined />}
                      onClick={handleShare}
                    />
                    <Button
                      type="text"
                      shape="circle"
                      aria-label="Twitter/X"
                      icon={<TwitterOutlined />}
                      onClick={handleShare}
                    />
                  </Space>
                </Card>
              </aside>
            </section>
          </div>
        </div>
      </FadeTransition>
    </BaseScreenWhiteNav>
  );
}
