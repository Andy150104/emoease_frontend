// src/pages/dashboard/Revenue.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spin, Alert, theme, Grid } from "antd";
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

const { useBreakpoint } = Grid;

const DashboardRevenuePage: React.FC = () => {
  // store, theme & responsive
  const { revenues, isLoading, error, fetchDailyRevenue } = usePaymentStore();
  const { token } = theme.useToken();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // range filter
  const [range, setRange] = useState<[Dayjs, Dayjs]>(() => [
    dayjs("2004-01-01"),
    dayjs("2025-07-15"),
  ]);
  useEffect(() => {
    const [start, end] = range;
    fetchDailyRevenue(start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
  }, [fetchDailyRevenue, range]);
  const onRangeChange = (dates: [Dayjs, Dayjs] | null) => {
    if (dates) setRange(dates);
  };

  // summary stats
  const totalRevenue = revenues.reduce(
    (sum, r) => sum + (r.totalRevenue ?? 0),
    0,
  );
  const totalPayment = revenues.reduce(
    (sum, r) => sum + (r.totalPayment ?? 0),
    0,
  );
  const avgRevenue = revenues.length ? totalRevenue / revenues.length : 0;
  const maxRevenueDay = revenues.reduce(
    (max, r) => (r.totalRevenue! > max.totalRevenue! ? r : max),
    revenues[0] || { date: "", totalRevenue: 0, totalPayment: 0 },
  );
  const maxPaymentDay = revenues.reduce(
    (max, r) => (r.totalPayment! > max.totalPayment! ? r : max),
    revenues[0] || { date: "", totalRevenue: 0, totalPayment: 0 },
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

  // line chart config
  const lineConfig: React.ComponentProps<typeof Line> = {
    data: revenues as DailyRevenue[],
    xField: "date",
    yField: "totalRevenue",
    smooth: true,
    autoFit: true,
    padding: isMobile ? [10, 10, 30, 40] : "auto",
    height: isMobile ? 200 : 300,
    xAxis: {
      type: "time",
      mask: "DD/MM",
      tickCount: isMobile ? 3 : Math.min(revenues.length, 6),
      title: { text: "Ngày" },
      label: {
        formatter: (val: string) => val, // giữ mask
        style: { fontSize: isMobile ? 10 : 12 },
      },
    },
    yAxis: {
      title: { text: "Doanh thu (₫)" },
      label: {
        formatter: (v: number | string) => `${Number(v).toLocaleString()}₫`,
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
  };

  // bar chart data & config
  const columnData = revenues.map((r) => ({
    date: dayjs(r.date).format("DD/MM"),
    totalPayment: r.totalPayment ?? 0,
  }));
  const columnConfig: ColumnConfig = {
    data: columnData,
    xField: "date",
    yField: "totalPayment",
    columnWidthRatio: isMobile ? 0.4 : 0.6,
    maxColumnWidth: isMobile ? 20 : undefined,
    color: token.colorPrimary,
    label: isMobile
      ? false
      : {
          style: { fill: "#fff", fontSize: 14 },
        },
    xAxis: {
      title: { text: "Ngày" },
      label: { style: { fontSize: isMobile ? 10 : 12 } },
    },
    yAxis: {
      title: { text: "Số giao dịch" },
      label: { style: { fill: "red" } },
    },
    height: isMobile ? 180 : 220,
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
          {/* Thống kê */}
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
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: 16,
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

          {/* Biểu đồ */}
          <Col xs={24} md={16} lg={18}>
            <Row gutter={[32, 32]}>
              {/* Line chart */}
              <Col xs={24}>
                <Card
                  title={
                    <div
                      style={{
                        display: "flex",
                        flexWrap: isMobile ? "wrap" : "nowrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: isMobile ? 16 : 20,
                        fontWeight: 600,
                      }}
                    >
                      <span>Doanh thu tháng</span>
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
                    padding: isMobile ? 16 : 36,
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
                    <div style={{ width: "100%" }}>
                      <Line {...lineConfig} />
                    </div>
                  )}
                </Card>
              </Col>

              {/* Bar chart */}
              <Col xs={24}>
                <Card
                  title={<span style={{ fontWeight: 600 }}>Tổng quan</span>}
                  extra={
                    !isMobile && (
                      <select style={{ borderRadius: 8, padding: "2px 8px" }}>
                        <option>Monthly</option>
                        <option>Weekly</option>
                      </select>
                    )
                  }
                  style={{
                    borderRadius: 16,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    padding: isMobile ? 16 : 24,
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <BarColumn {...columnConfig} />
                  </div>
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
