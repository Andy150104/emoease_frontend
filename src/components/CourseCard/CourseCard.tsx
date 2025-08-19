"use client";
import React from "react";
import { Card, Button, Typography, Progress, Popover } from "antd";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
const { Title, Paragraph, Text } = Typography;

interface CourseCardProps {
  imageUrl: string | StaticImageData;
  title: string;
  descriptionLines?: string[];
  instructor: string;
  price?: string;
  isShowProgress?: boolean;
  progress?: number;
  currentLesson?: number;
  totalLessons?: number;
  instructorAvatar?: string | StaticImageData;
  routerPush?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  imageUrl,
  title,
  descriptionLines = [],
  instructor,
  price,
  isShowProgress = false,
  progress = 0,
  currentLesson = 0,
  totalLessons = 0,
  instructorAvatar,
  routerPush,
}) => {
  const router = useRouter();
  const handleClick = () => {
    if (routerPush) router.push(routerPush);
  };

  // Nội dung popover
  const popContent = isShowProgress ? (
    <div style={{ width: 280 }}>
      <Title level={5} style={{ marginBottom: 8 }}>
        Hãy học ngay bây giờ!!!
      </Title>
      <Button type="primary" onClick={handleClick}>
        Học tiếp
      </Button>
    </div>
  ) : (
    <div style={{ width: 280 }}>
      <Title level={5} style={{ marginBottom: 8 }}>
        Mô tả khóa học
      </Title>
      <ul className="list-disc list-inside space-y-1 mb-4">
        {descriptionLines.map((line, idx) => {
          const words = line.split(" ");
          const text =
            words.length > 8 ? words.slice(0, 8).join(" ") + "..." : line;
          return (
            <li key={idx}>
              <Text>{text}</Text>
            </li>
          );
        })}
      </ul>
      <Button type="primary" block>
        Add to cart
      </Button>
    </div>
  );

  return (
    <Popover
      content={popContent}
      trigger="hover"
      placement="rightTop"
      mouseEnterDelay={0.05}
      style={{ padding: 16 }}
    >
      <Card
        hoverable
        onClick={handleClick}
        className="
          !w-full sm:!w-80 md:!w-96 lg:!w-[20rem]
          max-w-[20rem] min-w-[16rem] h-[26rem]
          cursor-pointer rounded-lg overflow-hidden
        "
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        {/* Image */}
        <div style={{ position: "relative", width: "100%", height: 180 }}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Main content */}
        <div className="p-4">
          <Title level={4} style={{ marginBottom: 8 }}>
            {title}
          </Title>

          {isShowProgress ? (
            <>
              <div className="flex items-center space-x-2 mb-4">
                {instructorAvatar && (
                  <Image
                    src={instructorAvatar}
                    alt={instructor}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <Text>{instructor}</Text>
              </div>
              <Progress
                className="mb-2"
                percent={progress}
                showInfo={false}
                strokeColor="#20C997"
                trailColor="#E5E7EB"
              />
              <div className="text-right text-xs text-gray-500">
                Lesson {currentLesson} of {totalLessons}
              </div>
            </>
          ) : (
            <>
              <Paragraph
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "rgba(0,0,0,0.45)",
                }}
              >
                Giảng viên: {instructor}
              </Paragraph>
              <div className="mt-6">
                {price && (
                  <Text strong style={{ fontSize: 20, color: "#20C997" }}>
                    {price}
                  </Text>
                )}
                <div className="mt-6">
                  <Button style={{ marginRight: 8 }}>Chọn</Button>
                  <Button type="primary">Mua ngay</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </Popover>
  );
};

export default CourseCard;
