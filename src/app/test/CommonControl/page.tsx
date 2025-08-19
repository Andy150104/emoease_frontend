// src/pages/DemoPage.tsx
"use client";
import React from "react";
import BasecontrolModal from "EmoEase/components/BaseControl/BasecontrolModal";
import BaseScreenAdmin from "EmoEase/layout/BaseScreenAdmin";
import { XmlColumn } from "EmoEase/utils/xmlColumn";
import { Form } from "antd";
import CommonControlForm from "EmoEase/components/CommonControl/CommonControlForm";
import { FieldConfig } from "EmoEase/utils/FieldConfig";
import "@ant-design/v5-patch-for-react-19";

const DemoPage: React.FC = () => {
  const [form] = Form.useForm();
  const firstNameColumn: XmlColumn = {
    id: "firstName",
    name: "Họ và tên",
    rules: "required",
  };
  const emailColumn: XmlColumn = {
    id: "email",
    name: "Email",
    rules: "required",
  };
  const phoneColumn: XmlColumn = {
    id: "phone",
    name: "Số điện thoại",
    rules: "required",
  };

  const fieldConfigs: FieldConfig[] = [
    {
      xmlColumn: firstNameColumn,
      maxLength: 50,
      placeholder: "Nhập họ và tên",
      span: 12,
    },
    { xmlColumn: emailColumn, maxLength: 100, placeholder: "Nhập email" },
    {
      xmlColumn: phoneColumn,
      maxLength: 15,
      placeholder: "Nhập số điện thoại",
    },
  ];
  const handleSave = async (): Promise<boolean> => {
    try {
      // nếu thành công sẽ vào đây, không throw
      await form.validateFields();
      console.log("not error");
      form.resetFields();
      return true; // cho modal đóng
    } catch (error) {
      console.log("error", error);
      return false; // giữ modal
    }
  };

  return (
    <BaseScreenAdmin
      defaultSelectedKeys={["dashboard-user"]}
      breadcrumbItems={[{ title: "Danh sách hồ sơ theo mốc thời gian" }]}
    >
      <BasecontrolModal
        triggerText="Mở Modal Tùy Chỉnh"
        isResponsive
        triggerButtonProps={{
          type: "default",
          ghost: true,
          className: "gradient-button-cyan-to-blue",
        }}
        header={
          <div className="flex items-center">
            <span className="mr-2 text-xl font-semibold">
              🎨 Header Tuỳ Chỉnh
            </span>
            <span className="text-sm text-gray-500">Subtitle nhỏ</span>
          </div>
        }
        okText="Lưu"
        cancelText="Huỷ"
        onOk={handleSave}
        onCancel={() => {
          console.log("Đã huỷ");
          form.resetFields();
        }}
        extraFooterButtons={[
          {
            key: "extra",
            text: "Khác",
            type: "link",
            onClick: () => console.log("Extra button clicked"),
          },
        ]}
      >
        <CommonControlForm
          fields={fieldConfigs}
          form={form}
          layout="vertical"
        ></CommonControlForm>
      </BasecontrolModal>
    </BaseScreenAdmin>
  );
};

export default DemoPage;
