// File: app/test/question/page.tsx
"use client";

import React from "react";
import {
  Form,
  Input,
  Radio,
  Button,
  Space,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  CloseOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import BaseScreenAdmin from "EmoEase/layout/BaseScreenAdmin";

interface QuizFormValues {
  questions: Array<{
    question: string;
    correct: number;
    answers: Array<{ text: string }>;
  }>;
}

const QuestionPage: React.FC = () => {
  const [form] = Form.useForm<QuizFormValues>();

  return (
    <BaseScreenAdmin>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2>Thêm Quiz</h2>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                const qs = form.getFieldValue("questions") || [];
                form.setFieldsValue({
                  questions: [
                    ...qs,
                    {
                      question: "",
                      correct: 0,
                      answers: [{ text: "" }, { text: "" }],
                    },
                  ],
                });
              }}
            >
              Thêm câu hỏi
            </Button>
            <Button
              icon={<RobotOutlined />}
              style={{ background: "#52c41a", color: "#fff" }}
            >
              Thêm với AI
            </Button>
          </Space>
        </Col>
      </Row>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          questions: [
            { question: "", correct: 0, answers: [{ text: "" }, { text: "" }] },
          ],
        }}
        onFinish={(values) =>
          console.log("Form JSON:", JSON.stringify(values, null, 2))
        }
      >
        <Form.List name="questions">
          {(fields, { remove }) =>
            fields.map((field, qIndex) => (
              <Card
                key={field.key}
                style={{ borderRadius: 8, marginBottom: 24 }}
                size="small"
                title={`Câu hỏi #${qIndex + 1}`}
                extra={
                  <CloseOutlined
                    style={{ fontSize: 16, color: "#f5222d" }}
                    onClick={() => remove(field.name)}
                  />
                }
              >
                {/* Nội dung câu hỏi */}
                <Form.Item
                  {...field}
                  name={[field.name, "question"]}
                  label="Nội dung câu hỏi"
                  rules={[
                    { required: true, message: "Vui lòng nhập nội dung" },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Nhập nội dung..."
                    autoSize={{ minRows: 2, maxRows: 6 }}
                  />
                </Form.Item>

                <Divider />

                {/* Đáp án + chọn đáp án đúng */}
                <Form.List name={[field.name, "answers"]}>
                  {(ansFields, { add: addAns, remove: removeAns }) => (
                    <>
                      <Form.Item
                        {...field}
                        name={[field.name, "correct"]}
                        label="Chọn đáp án đúng"
                        rules={[
                          { required: true, message: "Chọn đáp án đúng" },
                        ]}
                      >
                        <Radio.Group>
                          <Space direction="vertical" style={{ width: "100%" }}>
                            {ansFields.map((ansField, aIndex) => (
                              <Space
                                key={ansField.key}
                                align="center"
                                style={{ display: "flex", width: "100%" }}
                              >
                                <Radio value={aIndex} />

                                <Form.Item
                                  {...ansField}
                                  name={[ansField.name, "text"]}
                                  noStyle
                                  rules={[
                                    { required: true, message: "Nhập đáp án" },
                                  ]}
                                >
                                  <Input
                                    placeholder={`Đáp án ${String.fromCharCode(65 + aIndex)}`}
                                    style={{ flex: 1 }}
                                  />
                                </Form.Item>

                                {/* Xóa đáp án */}
                                {ansFields.length > 2 && (
                                  <MinusCircleOutlined
                                    onClick={() => removeAns(ansField.name)}
                                    style={{ color: "#f5222d", fontSize: 16 }}
                                  />
                                )}
                              </Space>
                            ))}

                            {/* Thêm đáp án */}
                            <Button
                              type="dashed"
                              onClick={() => addAns()}
                              icon={<PlusOutlined />}
                              style={{ width: "100%" }}
                            >
                              Thêm đáp án
                            </Button>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>
            ))
          }
        </Form.List>

        {/* Nút Lưu toàn bộ quiz */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Lưu Quiz
          </Button>
        </Form.Item>
      </Form>
    </BaseScreenAdmin>
  );
};

export default QuestionPage;
