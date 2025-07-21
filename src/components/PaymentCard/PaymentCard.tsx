// PaymentsCardModal.tsx

import React, { useState, useMemo } from "react";
import {
  Modal,
  Timeline,
  Input,
  Pagination,
  Typography,
  Space,
  Card,
  Grid,
  Tooltip,
  Select,
  DatePicker,
  Empty,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { PaymentDto, PaymentStatus } from "EmoEase/api/api-payment-service";

const { Text, Title } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

export interface PaymentsCardModalProps {
  visible: boolean;
  onClose: () => void;
  paymentsData: {
    data: PaymentDto[]; // full list of payments
  };
  status: PaymentStatus;
  onStatusChange: (status: PaymentStatus) => void;
  onCreatedAtChange?: (date: string | null) => void;
}

const PaymentsCardModal: React.FC<PaymentsCardModalProps> = ({
  visible,
  onClose,
  paymentsData,
  status,
  onStatusChange,
  onCreatedAtChange,
}) => {
  const allPayments = paymentsData.data;
  const pageSize = 5;

  // search term state
  const [searchTerm, setSearchTerm] = useState<string>("");

  // filter payments by ID or subscription
  const filteredPayments = useMemo(
    () =>
      allPayments.filter((item) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        return (
          item.subscriptionId?.toLowerCase().includes(term) ||
          item.id?.toLowerCase().includes(term)
        );
      }),
    [allPayments, searchTerm],
  );

  // pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalCount = filteredPayments.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedData = filteredPayments.slice(startIdx, startIdx + pageSize);

  // responsive
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // map status to icon/color
  const statusMap: Record<string, { icon: React.ReactNode; color: string }> = {
    Pending: { icon: <ClockCircleOutlined />, color: "#faad14" },
    Completed: { icon: <CheckCircleOutlined />, color: "#52c41a" },
    Failed: { icon: <ExclamationCircleOutlined />, color: "#f5222d" },
  };

  // styles for filter row
  const filterWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: isMobile ? "wrap" : "nowrap",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  };

  return (
    <Modal
      open={visible}
      width={isMobile ? "100%" : 800}
      centered
      style={isMobile ? { top: 0, padding: 0 } : {}}
      onCancel={onClose}
      footer={null}
      styles={
        isMobile
          ? {
              body: {
                minHeight: "60vh",
                padding: 16,
                overflowY: "auto",
              },
            }
          : {
              body: {
                minHeight: "60vh",
                maxHeight: "70vh",
                padding: 24,
                overflowY: "auto",
              },
            }
      }
      title={
        <>
          {/* Header row: title centered */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <Title level={4} style={{ margin: 0 }}>
              Payments Timeline
            </Title>
            <Text type="secondary">
              Tổng {totalCount} bản ghi — Trang {currentPage}/{totalPages}
            </Text>
          </div>

          {/* Filters/Search */}
          <div style={filterWrapperStyle}>
            <Select<PaymentStatus>
              value={status}
              onChange={onStatusChange}
              options={Object.values(PaymentStatus).map((s) => ({
                label: s,
                value: s,
              }))}
              placeholder="Trạng thái"
              style={{ minWidth: 160 }}
              allowClear
            />

            <DatePicker
              picker="date"
              format="DD-MM-YYYY"
              onChange={(date) =>
                onCreatedAtChange?.(date ? date.format("YYYY-MM-DD") : null)
              }
              placeholder="Chọn ngày"
              allowClear
              style={{ minWidth: 150 }}
            />

            <Search
              placeholder="Tìm ID / Subscription"
              allowClear
              enterButton
              onSearch={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              style={{ minWidth: isMobile ? "100%" : 240 }}
            />
          </div>
        </>
      }
    >
      {/* Body */}
      <div className="p-6 flex flex-col max-h-[70vh] overflow-y-auto">
        {paginatedData.length > 0 ? (
          <>
            <Timeline mode="left" style={{ padding: "24px 0" }}>
              {paginatedData.map((item) => {
                const st = statusMap[item.status ?? "Pending"];
                return (
                  <Timeline.Item
                    key={item.id}
                    dot={
                      <Tooltip title={item.status}>
                        <div
                          style={{
                            background: st.color,
                            color: "#fff",
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {st.icon}
                        </div>
                      </Tooltip>
                    }
                  >
                    <div style={{ marginLeft: isMobile ? 40 : 80 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
                      </Text>
                      <Card
                        size="small"
                        bordered={false}
                        hoverable
                        style={{
                          marginTop: 8,
                          border: `1px solid ${st.color}33`,
                          borderRadius: 8,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          padding: 16,
                        }}
                      >
                        <Space direction="vertical" size="small">
                          <Text>
                            <Text strong>Subscription:</Text>{" "}
                            <Text
                              copyable
                              ellipsis={{ tooltip: item.subscriptionId }}
                            >
                              {item.subscriptionId}
                            </Text>
                          </Text>
                          <Text>
                            <Text strong>ID:</Text>{" "}
                            <Text copyable ellipsis={{ tooltip: item.id }}>
                              {item.id}
                            </Text>
                          </Text>
                          <Text>
                            <Text strong>Amount:</Text>{" "}
                            {item.totalAmount?.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </Text>
                          <Text>
                            <Text strong>Type:</Text> {item.paymentType}
                          </Text>
                        </Space>
                      </Card>
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>

            {/* Client-side Pagination */}
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Pagination
                current={currentPage}
                total={totalCount}
                pageSize={pageSize}
                showSizeChanger={false}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Empty description="Không có bản ghi nào" />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentsCardModal;
