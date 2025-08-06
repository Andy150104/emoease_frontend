// src/App.tsx
"use client";
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Row, Col, Input } from "antd";
import BaseControlDrawer from "EmoEase/components/Drawer/BaseControlDrawer";
import BaseScreenAdmin from "EmoEase/layout/BaseScreenAdmin";

const Page: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const showDrawer = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(true);
  };

  return (
    <>
      <BaseScreenAdmin>
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          New account
        </Button>

        <BaseControlDrawer
          title="Create a new account"
          open={open}
          onClose={handleClose}
          onSubmit={handleSubmit}
        >
          <Form form={form} layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    { required: true, message: "Please enter user name" },
                  ]}
                >
                  <Input placeholder="Please enter user name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="url"
                  label="Url"
                  rules={[{ required: true, message: "Please enter url" }]}
                >
                  <Input
                    style={{ width: "100%" }}
                    addonBefore="http://"
                    addonAfter=".com"
                    placeholder="Please enter url"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </BaseControlDrawer>
      </BaseScreenAdmin>
    </>
  );
};

export default Page;
