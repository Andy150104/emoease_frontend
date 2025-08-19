"use client";
import { Button, Form } from "antd";
import { FormProps } from "antd/lib";
import BaseControlForm from "EmoEase/components/BaseControl/BaseControlForm";
import BaseControlTextField from "EmoEase/components/BaseControl/BasecontrolTextField";
import BaseControlUploadImage from "EmoEase/components/BaseControl/BaseControlUploadImage";
import Loading from "EmoEase/components/Loading/Loading";
import BaseScreenWhiteNav from "EmoEase/layout/BaseScreenWhiteNav";
import { useTestStore } from "EmoEase/stores/Test/testStore";
import { mapUrlsToUploadFiles } from "EmoEase/utils/commonFunction";
import { XmlColumn } from "EmoEase/utils/xmlColumn";
import React, { useEffect, useState } from "react";

export default function CropImagePage() {
  const urls = [
    "https://media.istockphoto.com/id/2150399781/vi/anh/m%E1%BB%99t-c%C3%A1nh-%C4%91%E1%BB%93ng-n%C3%B4ng-nghi%E1%BB%87p-r%E1%BB%99ng-l%E1%BB%9Bn-v%E1%BB%9Bi-nh%E1%BB%AFng-c%C3%A2y-ng%C3%B4-tr%E1%BB%93ng-ng%C3%B4-%E1%BB%9F-quy-m%C3%B4-c%C3%B4ng-nghi%E1%BB%87p-c%E1%BA%A3nh-quan.jpg?s=2048x2048&w=is&k=20&c=IX8bx3uLJS71IP7WHB3mvlj7pKJrx5T-YG6_pCXNrko=",
  ];

  const initialFileList = mapUrlsToUploadFiles(urls);

  const [isDisable, setIsDisable] = useState(true);

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
  const ImageColumn: XmlColumn = {
    id: "Image",
    name: "Ảnh đại diện",
    rules: "",
  };
  const onFinish: FormProps["onFinish"] = (values) => {
    console.log("Form values:", values);
  };
  const [mounted, setMounted] = useState(false);
  const testFunction = useTestStore((state) => state.testFunction);

  useEffect(() => {
    const fetchData = async () => {
      const data = await testFunction();
      form.setFieldsValue(data);
    };
    fetchData();
    setMounted(true);
  }, [testFunction, form]);

  const onCancelEdit = async () => {
    const data = await testFunction();
    form.resetFields();
    form.setFieldsValue(data);
    setIsDisable(true);
  };

  if (!mounted) {
    return <Loading />;
  }
  return (
    <BaseScreenWhiteNav>
      <BaseControlForm form={form} layout="vertical" onFinish={onFinish}>
        <BaseControlTextField
          xmlColumn={firstNameColumn}
          maxlength={5}
          placeholder="Nhập họ và tên"
          disabled={isDisable}
        />
        <BaseControlTextField
          xmlColumn={emailColumn}
          maxlength={100}
          placeholder="Nhập email"
          disabled={isDisable}
        />
        <BaseControlTextField
          xmlColumn={phoneColumn}
          maxlength={15}
          placeholder="Nhập số điện thoại"
          disabled={isDisable}
        />
        <BaseControlUploadImage
          xmlColumn={ImageColumn}
          maxCount={2}
          initialFileList={initialFileList}
          showGrid
          rotationSlider
          isShowEdit
          disabled={isDisable}
          allowedExtensions={["jpg", "jpeg", "png"]}
          aspectSlider
          showReset
        />
        {isDisable ? (
          <>
            <Button type="primary" onClick={() => setIsDisable(false)}>
              Cho phép chỉnh sửa
            </Button>
          </>
        ) : (
          <>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button type="primary" onClick={async () => onCancelEdit()}>
              Hủy chỉnh sửa
            </Button>
          </>
        )}
      </BaseControlForm>
    </BaseScreenWhiteNav>
  );
}
