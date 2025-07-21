"use client";

import React, { useEffect, useState } from "react";
import { Table, DatePicker, Alert, Typography, theme, Switch, message } from "antd";
import { Pie } from "@ant-design/charts";
import dayjs, { Dayjs } from "dayjs";
import BaseScreenAdmin from "EmoEase/layout/BaseScreenAdmin";
import { useSubscriptionStore } from "EmoEase/stores/Subscription/SubscriptionStore";
import type { ServicePackage } from "EmoEase/stores/Subscription/SubscriptionStore";

const { Title } = Typography;

type PieData = { name: string; value: number };

const SubscriptionsPage = () => {
  const {
    servicePackages,
    servicePackagesTotal,
    isLoading,
    error,
    fetchServicePackages,
    fetchServicePackagesTotal,
    updateServicePackage,
  } = useSubscriptionStore();
  const { token } = theme.useToken();
  const [fromDate, setFromDate] = useState<Dayjs>(dayjs().startOf("month"));
  const [toDate, setToDate] = useState<Dayjs>(dayjs().endOf("month"));

  // Fetch table and pie data
  useEffect(() => {
    const params = {
      startDate: fromDate.format("YYYY-MM-DD"),
      endDate: toDate.format("YYYY-MM-DD"),
    };
    fetchServicePackages({});
    fetchServicePackagesTotal(params);
  }, [fromDate, toDate, fetchServicePackages, fetchServicePackagesTotal]);

  const handleToggleActive = async (id: string, checked: boolean) => {
    const success = await updateServicePackage(id, { isActive: checked });
    if (success) {
      message.success("Cập nhật trạng thái thành công!");
      fetchServicePackages({});
      // Update the Pie chart data as well
      fetchServicePackagesTotal({
        startDate: fromDate.format("YYYY-MM-DD"),
        endDate: toDate.format("YYYY-MM-DD"),
      });
    } else {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const columns = [
    {
      title: "Tên gói dịch vụ",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      align: "center" as const,
      render: (_: boolean, record: ServicePackage) => (
        <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <span style={{ minWidth: 80, fontWeight: 500, color: record.isActive ? token.colorSuccess : token.colorWarning }}>
            {record.isActive ? "Hoạt động" : "Tạm dừng"}
          </span>
          <Switch
            checked={!!record.isActive}
            onChange={(checked) => handleToggleActive(record.id, checked)}
          />
        </span>
      ),
    },
  ];

  // Pie chart config
  const pieConfig = {
    data: servicePackagesTotal.map(pkg => ({
      name: pkg.name,
      value: pkg.totalSubscriptions,
    })),
    angleField: "value",
    colorField: "name",
    radius: 0.9,
    label: {
      content: ({ name, value }: PieData) => `${name}: ${value}`,
    },
    legend: { position: "bottom" },
    tooltip: {},
    color: ["#4a2580", "#36cfc9", "#ffc53d", "#ff7875", "#73d13d", "#597ef7", "#ff85c0", "#ffd666"],
    style: { fontFamily: "inherit" },
  };

  return (
    <BaseScreenAdmin
      defaultSelectedKeys={["subscriptions"]}
      breadcrumbItems={[{ title: "Gói dịch vụ" }]}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          Gói dịch vụ & số lượng đăng ký
        </Title>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>Từ ngày:</span>
          <DatePicker
            value={fromDate}
            onChange={date => date && setFromDate(date)}
            format="DD-MM-YYYY"
            allowClear={false}
            style={{ borderRadius: 8, cursor: "pointer" }}
            maxDate={toDate}
            inputReadOnly
          />
          <span>Đến ngày:</span>
          <DatePicker
            value={toDate}
            onChange={date => date && setToDate(date)}
            format="DD-MM-YYYY"
            allowClear={false}
            style={{ borderRadius: 8, cursor: "pointer" }}
            minDate={fromDate}
            inputReadOnly
          />
        </div>
      </div>
      {/* Pie chart for total subscriptions by package */}
      <div style={{ marginBottom: 32, background: token.colorBgContainer, borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", padding: 24 }}>
        <Title level={4} style={{ marginBottom: 16 }}>Tỉ lệ đăng ký theo gói</Title>
        <Pie {...pieConfig} height={320} />
      </div>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      <Table
        columns={columns}
        dataSource={servicePackages}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        bordered
        style={{ background: token.colorBgContainer }}
      />
    </BaseScreenAdmin>
  );
};

export default SubscriptionsPage;
