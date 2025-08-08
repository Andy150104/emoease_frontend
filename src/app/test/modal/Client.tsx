// src/pages/DemoPage.tsx
"use client";
import React from "react";
import BasecontrolModal from "EmoEase/components/BaseControl/BasecontrolModal";
import BaseScreenAdmin from "EmoEase/layout/BaseScreenAdmin";
import { XmlColumn } from "EmoEase/utils/xmlColumn";
import BaseControlTextField from "EmoEase/components/BaseControl/BasecontrolTextField";
import { Form } from "antd";
import BaseControlForm from "EmoEase/components/BaseControl/BaseControlForm";

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

  const handleSave = async (): Promise<boolean> => {
    const hasError = await form.validateFields();
    if (hasError) {
      // toast.error("Có lỗi, không thể đóng modal");
      return false;
    }
    // thực hiện lưu dữ liệu
    // await api.save(...);
    return true;
  };

  return (
    <BaseScreenAdmin
      defaultSelectedKeys={["dashboard-user"]}
      breadcrumbItems={[{ title: "Danh sách hồ sơ theo mốc thời gian" }]}
    >
      <BasecontrolModal
        triggerText="Mở Modal Tùy Chỉnh"
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
        onCancel={() => console.log("Đã huỷ")}
        extraFooterButtons={[
          {
            key: "extra",
            text: "Khác",
            type: "link",
            onClick: () => console.log("Extra button clicked"),
          },
        ]}
      >
        <BaseControlForm form={form} layout="vertical">
          <BaseControlTextField
            xmlColumn={firstNameColumn}
            maxlength={5}
            placeholder="Nhập họ và tên"
          />
          <BaseControlTextField
            xmlColumn={emailColumn}
            maxlength={100}
            placeholder="Nhập email"
          />
          <BaseControlTextField
            xmlColumn={phoneColumn}
            maxlength={15}
            placeholder="Nhập số điện thoại"
          />
        </BaseControlForm>
      </BasecontrolModal>
    </BaseScreenAdmin>
  );
};

export default DemoPage;
