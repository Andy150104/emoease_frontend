// src/pages/DemoPage.tsx
"use client";
import React from "react";
import BaseScreenAdmin from "EmoEase/layout/BaseScreenAdmin";
import BaseControlSelect from "EmoEase/components/BaseControl/BaseControlSelect";
import { DropdownOptions } from "EmoEase/enum/enum";
import { enumToTranslatedOptions } from "EmoEase/utils/commonFunction";
import UserControlSelectAddress from "EmoEase/components/UserControl/UserControlSelectAddress";
import { XmlColumn } from "EmoEase/utils/xmlColumn";
import BaseControlForm from "EmoEase/components/BaseControl/BaseControlForm";
import { Button, Form } from "antd";
import { useAddressThirdClientStore } from "EmoEase/stores/Address/addressThirdClientStore";

const StepperPage: React.FC = () => {
  const province: XmlColumn = {
    id: "province",
    name: "Tỉnh/Thành phố",
    rules: "required",
  };
  const ward: XmlColumn = {
    id: "ward",
    name: "Phường/Xã",
    rules: "required",
  };

  const submitAddressForm = useAddressThirdClientStore(
    (s) => s.submitAddressForm,
  );

  const handleChange = (value: string) => {
    console.log("Đã chọn:", value);
  };

  const initialProvinceCode = useAddressThirdClientStore.getState().province;

  const [form] = Form.useForm();

  return (
    <BaseScreenAdmin
      defaultSelectedKeys={["dashboard-user"]}
      breadcrumbItems={[{ title: "Danh sách hồ sơ theo mốc thời gian" }]}
    >
      <h2 className="h-10">Quy trình đăng ký</h2>
      <BaseControlSelect
        isSearch={true}
        options={enumToTranslatedOptions(DropdownOptions, "DropdownOptions")}
        defaultValue={
          enumToTranslatedOptions(DropdownOptions, "DropdownOptions")[0].value
        }
        onChange={handleChange}
        width={140}
        size="middle"
      />
      <BaseControlForm
        form={form}
        layout="vertical"
        onFinish={() => submitAddressForm(form)}
        initialValues={{ province: initialProvinceCode }}
      >
        <UserControlSelectAddress
          xmlProvinceColumn={province}
          xmlWardColumn={ward}
          defaultValueProvice="Chọn"
          defaultValueWard="Chọn"
          classNameProvince="!w-full lg:!w-72 !h-9"
          classNameWard="!w-full lg:!w-72 !h-9"
          size="middle"
          isSearch={true}
        ></UserControlSelectAddress>
        <Button htmlType="submit" type="primary">
          Lưu
        </Button>
      </BaseControlForm>
    </BaseScreenAdmin>
  );
};

export default StepperPage;
