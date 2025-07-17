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
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import moment from "moment";
import { CalendarOutlined, ProfileOutlined } from "@ant-design/icons";
import { GetCreatedPatientProfileDto } from "EmoEase/api/api-profile-service";
import apiClient from "EmoEase/hooks/apiClient";
import { FadeInOnScrollSpring } from "../Animation/FadeInOnScroll";

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
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
    render: (text) => <Text strong>{text}</Text>,
  },
  { title: "Gender", dataIndex: "gender", key: "gender" },
  {
    title: "Birth Date",
    dataIndex: "birthDate",
    key: "birthDate",
    render: (d) => (d !== "0001-01-01" ? moment(d).format("DD/MM/YYYY") : "-"),
  },
  {
    title: "Created At",
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
  };

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
              <Table<Profile>
                columns={columns}
                dataSource={(selected.profiles?.data ?? []).map((item) => ({
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
            </>
          )}
        </Drawer>
      </div>
    </>
  );
};

export default ProfilesByMonthCards;
