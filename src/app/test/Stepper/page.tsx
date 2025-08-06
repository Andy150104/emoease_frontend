// src/pages/DemoPage.tsx
"use client";
import React, { useState } from "react";
import { Button } from "antd";
import BaseScreenAdmin from "EmoEase/layout/BaseScreenAdmin";
import CustomStepper, { StepItem } from "EmoEase/components/Stepper/BaseControlStepper";
import BaseControlStepperContent from "EmoEase/components/Stepper/BaseControlStepperContent";
import BaseControlDivide from "EmoEase/components/Stepper/BaseControlDivide";

const StepperPage: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const steps: StepItem[] = [
    { title: "Đăng ký", description: "Nhập thông tin tài khoản" },
    { title: "Xác nhận", description: "Xác nhận email" },
    { title: "Hoàn thành", description: "Thiết lập hoàn tất" },
  ];

  return (
    <BaseScreenAdmin
      defaultSelectedKeys={["dashboard-user"]}
      breadcrumbItems={[{ title: "Danh sách hồ sơ theo mốc thời gian" }]}
    >
      <h2>Quy trình đăng ký</h2>

      <BaseControlDivide
        // tuỳ chỉnh tỷ lệ cột: stepper 6/24, nội dung 18/24
        colSizes={[
          { xs: 24, sm: 8, md: 6 },
          { xs: 24, sm: 16, md: 18 },
        ]}
        gutter={[24, 24]}
      >
        {/* Cột 1: Stepper */}
        <div className="border border-gray-200 rounded-lg p-4">
          <CustomStepper
            steps={steps}
            currentIndex={current}
            onChange={setCurrent}
            direction="vertical"
          />
        </div>

        {/* Cột 2: Nội dung theo bước */}
        <div className="border border-gray-200 rounded-lg p-4">
          <BaseControlStepperContent index={0} current={current}>
            <div>Form đăng ký ở bước 1</div>
          </BaseControlStepperContent>

          <BaseControlStepperContent index={1} current={current}>
            <div>Form xác nhận email ở bước 2</div>
          </BaseControlStepperContent>

          <BaseControlStepperContent index={2} current={current}>
            <div>Nội dung hoàn tất ở bước 3</div>
          </BaseControlStepperContent>
        </div>
      </BaseControlDivide>

      {/* Nút điều hướng */}
      <div style={{ marginTop: 16 }}>
        <Button
          onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
          disabled={current === 0}
        >
          Quay lại
        </Button>
        <Button
          onClick={() => setCurrent((prev) => Math.min(prev + 1, steps.length - 1))}
          disabled={current === steps.length - 1}
          style={{ marginLeft: 8 }}
        >
          Tiếp theo
        </Button>
      </div>
    </BaseScreenAdmin>
  );
};

export default StepperPage;
