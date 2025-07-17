// src/pages/dashboard/Revenue.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spin, Alert, theme } from "antd";
import { Line } from "@ant-design/charts";
import { Column as BarColumn, ColumnConfig } from "@ant-design/charts";
import {
  BarChartOutlined,
  UserAddOutlined,
  RedoOutlined,
  RiseOutlined,
  FundOutlined,
} from "@ant-design/icons";
import BaseScreenAdmin from "EmoEase/layout/BaseScreenAdmin";
import type { DailyRevenue } from "EmoEase/api/api-payment-service";
import { usePaymentStore } from "EmoEase/stores/Payment/PaymentStore";
import dayjs, { Dayjs } from "dayjs";
import BaseControlRangePicker from "EmoEase/components/BaseControl/BaseControlRangePicker";
import Head from "next/head";

const DashboardRevenuePage: React.FC = () => {
  const { revenues, isLoading, error, fetchDailyRevenue } = usePaymentStore();
  const { token } = theme.useToken();

  // Khoảng ngày để filter dữ liệu
  const [range, setRange] = useState<[Dayjs, Dayjs]>(() => [
    dayjs("2004-01-01"),
    dayjs("2025-07-15"),
  ]);

  // Fetch dữ liệu mỗi khi range thay đổi
  useEffect(() => {
    const [start, end] = range;
    fetchDailyRevenue(start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
  }, [fetchDailyRevenue, range]);

  const onRangeChange = (dates: [Dayjs, Dayjs] | null) => {
    if (dates) setRange(dates);
  };

  // Tính các số liệu tổng hợp
  const totalRevenue = revenues.reduce(
    (sum, r) => sum + (r.totalRevenue ?? 0),
    0
  );
  const totalPayment = revenues.reduce(
    (sum, r) => sum + (r.totalPayment ?? 0),
    0
  );
  const avgRevenue = revenues.length ? totalRevenue / revenues.length : 0;
  const maxRevenueDay = revenues.reduce(
    (max, r) => ((r.totalRevenue ?? 0) > (max.totalRevenue ?? 0) ? r : max),
    revenues[0] || { date: "", totalRevenue: 0, totalPayment: 0 }
  );
  const maxPaymentDay = revenues.reduce(
    (max, r) => ((r.totalPayment ?? 0) > (max.totalPayment ?? 0) ? r : max),
    revenues[0] || { date: "", totalRevenue: 0, totalPayment: 0 }
  );

  const stats = [
    {
      title: "Tổng doanh thu",
      value: totalRevenue,
      icon: <BarChartOutlined />,
      color: token.colorPrimary,
      suffix: "₫",
    },
    {
      title: "Tổng số giao dịch",
      value: totalPayment,
      icon: <UserAddOutlined />,
      color: token.colorSuccess,
    },
    {
      title: "Doanh thu TB/ngày",
      value: avgRevenue,
      icon: <RiseOutlined />,
      color: token.colorInfo,
      suffix: "₫",
    },
    {
      title: "Ngày doanh thu cao nhất",
      value: dayjs(maxRevenueDay.date).format("DD/MM/YYYY"),
      icon: <FundOutlined />,
      color: token.colorWarning,
      suffix: `: ${maxRevenueDay.totalRevenue?.toLocaleString()}₫`,
    },
    {
      title: "Ngày nhiều giao dịch nhất",
      value: dayjs(maxPaymentDay.date).format("DD/MM/YYYY"),
      icon: <RedoOutlined />,
      color: token.colorWarning,
      suffix: `: ${maxPaymentDay.totalPayment}`,
    },
  ];

  // Cấu hình cho biểu đồ đường
  const lineConfig: React.ComponentProps<typeof Line> = {
    data: revenues as DailyRevenue[],
    xField: "date",
    yField: "totalRevenue",
    smooth: true,
    autoFit: true,
    padding: "auto",
    xAxis: {
      type: "timeCat",
      tickCount: revenues.length || 5,
      title: { text: "Ngày" },
      label: { autoRotate: false },
    },
    yAxis: {
      title: { text: "Doanh thu (₫)" },
      label: {
        formatter: (val: number | string) => `${Number(val).toLocaleString()}₫`,
        style: { fill: "red" },
      },
    },
    point: { size: 4, shape: "circle" },
    tooltip: {
      formatter: (d: DailyRevenue) => ({
        name: "Doanh thu",
        value: `${d.totalRevenue?.toLocaleString() ?? 0}₫`,
      }),
    },
    height: 300,
  };

  // Dữ liệu cho biểu đồ cột
  const columnData = revenues.map((r) => ({
    date: dayjs(r.date).format("DD/MM"),
    totalPayment: r.totalPayment ?? 0,
  }));

  // Cấu hình cho biểu đồ cột
  const columnConfig: ColumnConfig = {
    data: columnData,
    xField: "date",
    yField: "totalPayment",
    columnWidthRatio: 0.6,
    color: token.colorPrimary,
    label: {
      style: { fill: "#fff", fontSize: 14 },
      formatter: (value: number) => `${value}`,
    },
    xAxis: { title: { text: "Ngày" } },
    yAxis: {
      title: { text: "Số giao dịch" },
      label: { style: { fill: "red" } },
    },
    height: 220,
  };

  return (
    <>
      <Head>
        <title>EmoEase-Admin</title>
      </Head>
      <BaseScreenAdmin
        defaultSelectedKeys={["dashboard"]}
        breadcrumbItems={[{ title: "Doanh thu" }]}
      >
        <Row gutter={[32, 32]}>
          {/* Cột trái: cards thống kê */}
          <Col xs={24} md={8} lg={6}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {stats.map((item, idx) => (
                <Card
                  key={idx}
                  hoverable
                  style={{
                    borderRadius: 16,
                    background: token.colorBgContainer,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    textAlign: "left",
                    padding: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      background: item.color + "15",
                      borderRadius: "50%",
                      width: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        color: token.colorTextDescription,
                        fontSize: 15,
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        color: item.color,
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        marginTop: 4,
                      }}
                    >
                      {item.value.toLocaleString()} {item.suffix}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Col>

          {/* Cột phải: hai biểu đồ */}
          <Col xs={24} md={16} lg={18}>
            <Row gutter={[32, 32]}>
              {/* Biểu đồ đường */}
              <Col xs={24}>
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 20,
                        fontWeight: 600,
                      }}
                    >
                      <span>Doanh thu hằng tháng</span>
                      <BaseControlRangePicker
                        value={range}
                        onChange={onRangeChange}
                        format="DD-MM-YYYY"
                      />
                    </div>
                  }
                  style={{
                    borderRadius: 16,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    padding: 36,
                    marginBottom: 32,
                  }}
                >
                  {isLoading ? (
                    <div style={{ textAlign: "center", padding: 24 }}>
                      <Spin />
                    </div>
                  ) : error ? (
                    <Alert
                      type="error"
                      message="Lỗi tải dữ liệu"
                      description={error}
                      showIcon
                    />
                  ) : (
                    <Line {...lineConfig} />
                  )}
                </Card>
              </Col>

              {/* Biểu đồ cột */}
              <Col xs={24}>
                <Card
                  title={<span style={{ fontWeight: 600 }}>Tổng quan</span>}
                  extra={
                    <select style={{ borderRadius: 8, padding: "2px 8px" }}>
                      <option>Monthly</option>
                      <option>Weekly</option>
                    </select>
                  }
                  style={{
                    borderRadius: 16,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    padding: 24,
                    height: "100%",
                  }}
                >
                  <BarColumn {...columnConfig} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </BaseScreenAdmin>
    </>
  );
};

export default DashboardRevenuePage;
