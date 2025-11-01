"use client";

import React from "react";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Select,
  Typography,
  Divider,
  Space,
  Row,
  Col,
  Layout,
} from "antd";

const { Title, Text } = Typography;
const { Content } = Layout;

type StudyYear =
  | "year1"
  | "year2"
  | "year3"
  | "year4"
  | "year5"
  | "otherYear";

type GoalKey =
  | "improveSkills"
  | "internshipOrJob"
  | "deepDive"
  | "certification"
  | "portfolio"
  | "other";

type StudentSurveyFormValues = {
  firstName: string;
  lastName: string;
  studyYear: StudyYear | undefined;
  goals: GoalKey[];
  otherGoal?: string;
};

const studyYearOptions = [
  { label: "Năm 1", value: "year1" as const },
  { label: "Năm 2", value: "year2" as const },
  { label: "Năm 3", value: "year3" as const },
  { label: "Năm 4", value: "year4" as const },
  { label: "Năm 5", value: "year5" as const },
  { label: "Khác", value: "otherYear" as const },
];

const goalOptions: { label: React.ReactNode; value: GoalKey }[] = [
  {
    value: "improveSkills",
    label: "Cải thiện kiến thức chuyên môn về lập trình/phát triển phần mềm.",
  },
  {
    value: "internshipOrJob",
    label:
      "Chuẩn bị cho kỳ thực tập hoặc cơ hội việc làm ngành Kỹ thuật phần mềm.",
  },
  {
    value: "deepDive",
    label: "Tìm hiểu sâu hơn về một công nghệ hoặc lĩnh vực mới.",
  },
  {
    value: "certification",
    label:
      "Đạt được chứng chỉ chuyên môn (ví dụ: AWS Certified, Google Cloud, Oracle Certified Developer).",
  },
  {
    value: "portfolio",
    label: "Xây dựng portfolio cá nhân với các dự án thực tế.",
  },
  { value: "other", label: "Khác (Vui lòng điền vào ô trống)" },
];

export default function StudentSurveyFullPage() {
  const [form] = Form.useForm<StudentSurveyFormValues>();
  const selectedGoals = Form.useWatch("goals", form) as GoalKey[] | undefined;
  const showOther = (selectedGoals ?? []).includes("other");

  const onFinish = (values: StudentSurveyFormValues) => {
    // eslint-disable-next-line no-console
    console.log("Survey submit:", values);
  };

  return (
    <Layout className="!h-dvh">
      <Content className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 !h-screen">
        <Card
          // full-width card (no max width), bo góc nhẹ để vẫn “ăn” full màn
          className="w-full rounded-none sm:rounded-2xl border border-gray-200/70 shadow-sm dark:border-gray-800 dark:bg-gray-900 h-full"
        >
          <header className="mb-6">
            <Title level={3} className="!mb-1 text-gray-800 dark:!text-gray-100">
              Thông tin cơ bản
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">
              Vui lòng điền thông tin để hệ thống gợi ý lộ trình phù hợp.
            </Text>
          </header>

          <Form<StudentSurveyFormValues>
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
          >
            {/* Hàng đầu: Tên / Họ — luôn căng theo màn hình */}
            <Row gutter={[16, 8]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Tên"
                  name="firstName"
                  rules={[{ required: true, message: "Vui lòng nhập Tên" }]}
                >
                  <Input
                    size="large"
                    placeholder="DUYÊN"
                    className="rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Họ"
                  name="lastName"
                  rules={[{ required: true, message: "Vui lòng nhập Họ" }]}
                >
                  <Input
                    size="large"
                    placeholder="NGUYỄN THỊ BÍCH"
                    className="rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Bạn đang ở năm học thứ mấy tại FPT (ngành Kỹ thuật phần mềm)"
              name="studyYear"
              rules={[{ required: true, message: "Vui lòng chọn năm học" }]}
            >
              <Select
                size="large"
                placeholder="Dropdown option"
                className="rounded-xl dark:[&_.ant-select-selector]:!bg-gray-800 dark:[&_.ant-select-selector]:!border-gray-700 dark:[&_.ant-select-selection-item]:!text-gray-100"
                options={studyYearOptions}
                allowClear
              />
            </Form.Item>

            <Divider className="my-6 dark:border-gray-800" />

            <div className="mb-2">
              <Title level={4} className="!mb-1 text-gray-800 dark:!text-gray-100">
                Mục tiêu chính của bạn khi tham gia các khóa học trên hệ thống là gì?
              </Title>
            </div>

            <Form.Item
              name="goals"
              rules={[{ required: true, message: "Vui lòng chọn ít nhất một mục tiêu" }]}
            >
              <Checkbox.Group className="block">
                <Space direction="vertical" size="large" className="w-full">
                  {goalOptions.map((opt) => (
                    <Checkbox
                      key={opt.value}
                      value={opt.value}
                      className="flex items-start text-gray-700 dark:text-gray-200 [&_.ant-checkbox]:mt-1"
                    >
                      <span>{opt.label}</span>
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            </Form.Item>

            {showOther && (
              <Form.Item
                name="otherGoal"
                rules={[
                  { required: true, message: "Vui lòng mô tả mục tiêu của bạn" },
                  { max: 200, message: "Tối đa 200 ký tự" },
                ]}
              >
                <Input.TextArea
                  placeholder="Mô tả mục tiêu khác của bạn…"
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  className="rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  showCount
                  maxLength={200}
                />
              </Form.Item>
            )}

            {/* Thanh action dính góc phải, vẫn full-width */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="rounded-full px-6 py-5 !h-auto shadow dark:!bg-blue-500"
              >
                Tiếp tục
              </Button>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}
