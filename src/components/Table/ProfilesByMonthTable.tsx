import React, { useState } from "react";
import {
  List,
  Card,
  Typography,
  Drawer,
  Table,
  Button,
  Divider,
  Space,
  Tag,
  Input,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import moment from "moment";
import { CalendarOutlined, ProfileOutlined } from "@ant-design/icons";
import { GetCreatedPatientProfileDto } from "EmoEase/api/api-profile-service";
import apiClient from "EmoEase/hooks/apiClient";
import { FadeInOnScrollSpring } from "../Animation/FadeInOnScroll";
import PaymentsCardModal from "../PaymentCard/PaymentCard";
import { usePaymentStore } from "EmoEase/stores/Payment/PaymentStore";
import { PaymentDto, PaymentStatus } from "EmoEase/api/api-payment-service";

const { Title, Text } = Typography;

export interface Profile {
  id: string;
  fullName: string;
  gender: string;
  birthDate: string;
  createdAt: string;
}

export interface Datapoint {
  date: string;
  profiles: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    data: Profile[];
    totalPages: number;
  };
}

interface ProfilesByMonthCardsProps {
  datapoints: GetCreatedPatientProfileDto[];
}

const columns: ColumnsType<Profile> = [
  {
    title: "Tên đầy đủ",
    dataIndex: "fullName",
    key: "fullName",
    width: 250,
    render: (text) => (
      <Text strong style={{ whiteSpace: "nowrap" }}>
        {text}
      </Text>
    ),
  },
  { title: "Giới tính", dataIndex: "gender", key: "gender" },
  {
    title: "Sinh nhật",
    dataIndex: "birthDate",
    key: "birthDate",
    render: (d) => (d !== "0001-01-01" ? moment(d).format("DD/MM/YYYY") : "-"),
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (d) => moment(d).format("DD/MM/YYYY HH:mm"),
  },
];

const ProfilesByMonthCards: React.FC<ProfilesByMonthCardsProps> = ({
  datapoints,
}) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<GetCreatedPatientProfileDto | null>(
    null,
  );
  const [startTimeSelected, setStartTimeSelected] = useState<string>("");
  const [endTimeSelected, setEndTimeSelected] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [modalProfileId, setModalProfileId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>(
    PaymentStatus.Pending,
  );
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [createdAtFilter, setCreatedAtFilter] = useState<string | null>(null);
  const [paymentsData, setPaymentsData] = useState<{
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    data: PaymentDto[];
  }>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    data: [],
  });
  const defaultPageSize = 10;

  const fetchPayments = async (
    page: number,
    patientProfileId: string,
    status = selectedStatus,
    createdAt = createdAtFilter,
  ) => {
    const res = await usePaymentStore
      .getState()
      .getAllPaymentPatient(
        page,
        defaultPageSize,
        createdAt ?? undefined,
        patientProfileId,
        status,
      );
    // giả sử res có các trường: pageIndex, pageSize, totalCount, totalPages, payments[]
    setPaymentsData({
      pageIndex: res.payments?.pageIndex ?? 0,
      pageSize: res.payments?.pageSize ?? 0,
      totalCount: res.payments?.totalCount ?? 0,
      totalPages: res.payments?.totalPages ?? 0,
      data: res.payments?.data ?? [],
    });
    setPaymentModalVisible(true);
  };
  const handleTableChange = async (pagination: TablePaginationConfig) => {
    if (!selected) return;
    const page = pagination.current ?? 1;
    const pageSize = pagination.pageSize ?? selected.profiles?.pageSize;

    // Gọi API trực tiếp, không dùng fetchProfiles của store
    const res =
      await apiClient.profileService.patients.getPatientProfilesCreated({
        PageIndex: page,
        PageSize: pageSize,
        StartDate: startTimeSelected,
        EndDate: endTimeSelected,
      });
    const datapointForMonth = res.data.datapoints?.find((dp) =>
      moment(dp.date).isSame(startTimeSelected, "month"),
    );
    if (datapointForMonth) {
      setSelected(datapointForMonth);
      // visible vẫn true, không touch lại
    }
  };

  const showDetail = (point: GetCreatedPatientProfileDto) => {
    setSelected(point);
    const start = moment(point.date).startOf("month").toISOString();
    const end = moment(point.date).endOf("month").toISOString();
    setStartTimeSelected(start);
    setEndTimeSelected(end);
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    setSelected(null);
    setSearchText("");
  };

  const showModal = (id: string) => {
    setModalProfileId(id);
    fetchPayments(1, id, selectedStatus, createdAtFilter);
  };

  const enhancedColumns: ColumnsType<Profile> = [
    ...columns,
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => showModal(record.id)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="min-h-screen">
        <List
          grid={{ column: 3, gutter: 16, xs: 1, sm: 2, lg: 3 }}
          dataSource={datapoints}
          renderItem={(point) => (
            <List.Item>
              <FadeInOnScrollSpring>
                <Card
                  hoverable
                  onClick={() => showDetail(point)}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 180,
                  }}
                >
                  <Space
                    direction="vertical"
                    size={10}
                    style={{ width: "100%", flex: 1, overflowWrap: "anywhere" }}
                  >
                    <Title level={4} style={{ margin: 0 }}>
                      <CalendarOutlined
                        style={{ marginRight: 8, color: "#1d4ed8" }}
                      />
                      {moment(point.date).format("MMMM YYYY")}
                    </Title>

                    <Text style={{ fontSize: 16 }}>
                      <ProfileOutlined
                        style={{ marginRight: 6, color: "#10b981" }}
                      />
                      <strong>{point.profiles?.totalCount}</strong> Profiles
                    </Text>

                    <Text type="secondary">
                      Total Pages: {point.profiles?.totalPages}
                    </Text>

                    <div style={{ marginTop: "auto" }}>
                      <Button
                        type="link"
                        style={{ paddingLeft: 0 }}
                        onClick={(e) => {
                          e.stopPropagation(); // tránh trigger onClick card 2 lần
                          showDetail(point);
                        }}
                      >
                        View Details →
                      </Button>
                    </div>
                  </Space>
                </Card>
              </FadeInOnScrollSpring>
            </List.Item>
          )}
        />

        <Drawer
          width={1000}
          title={
            selected ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  {moment(selected.date).format("MMMM YYYY")}
                </Title>
                <Tag color="blue">
                  Profiles: {selected.profiles?.totalCount}
                </Tag>
              </div>
            ) : null
          }
          placement="right"
          onClose={closeDrawer}
          open={visible}
        >
          {selected && (
            <>
              <Divider orientation="left" style={{ fontWeight: "bold" }}>
                Detailed Profiles
              </Divider>
              <Input.Search
                placeholder="Tìm theo tên đầy đủ"
                allowClear
                onSearch={(value) => setSearchText(value)}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 16, width: 300 }}
              />
              <Table<Profile>
                columns={enhancedColumns}
                scroll={{ x: true }}
                dataSource={(selected.profiles?.data ?? [])
                  .filter((item) =>
                    (item.fullName ?? "")
                      .toLowerCase()
                      .includes(searchText.toLowerCase()),
                  )
                  .map((item) => ({
                    id: item.id ?? "",
                    fullName: item.fullName ?? "",
                    gender: item.gender ?? "",
                    birthDate: item.birthDate ?? "",
                    createdAt: item.createdAt ?? "",
                  }))}
                rowKey="id"
                bordered
                pagination={{
                  current: selected.profiles?.pageIndex,
                  pageSize: selected.profiles?.pageSize,
                  total: selected.profiles?.totalCount,
                  showSizeChanger: false,
                }}
                onChange={handleTableChange}
              />
              <PaymentsCardModal
                visible={paymentModalVisible}
                onClose={() => setPaymentModalVisible(false)}
                paymentsData={paymentsData}
                status={selectedStatus}
                onStatusChange={(newStatus) => {
                  setSelectedStatus(newStatus);
                  if (modalProfileId)
                    fetchPayments(1, modalProfileId, newStatus);
                }}
                onCreatedAtChange={(dateString) => {
                  setCreatedAtFilter(dateString);
                  if (modalProfileId)
                    fetchPayments(
                      1,
                      modalProfileId,
                      selectedStatus,
                      dateString,
                    );
                }}
              />
            </>
          )}
        </Drawer>
      </div>
    </>
  );
};

export default ProfilesByMonthCards;
