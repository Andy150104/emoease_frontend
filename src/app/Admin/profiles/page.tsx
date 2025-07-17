// pages/profiles.tsx
"use client";
import React, { useEffect } from "react";
import moment from "moment";
import { Alert } from "antd";
import ProfilesByMonthTable from "EmoEase/components/Table/ProfilesByMonthTable";
import BaseScreenAdmin from "EmoEase/layout/BaseScreenAdmin";
import { useProfilesStore } from "EmoEase/stores/Profiles/ProfilesStore";

const ProfilesPage: React.FC = () => {
  // Lấy state và action từ zustand store
  const {
    patientProfiles: datapoints,
    isLoading,
    error,
    fetchProfiles,
  } = useProfilesStore();
  useEffect(() => {
    const start = moment("2004-01-01").startOf("day").toISOString();
    const end = moment().endOf("month").toISOString();
    fetchProfiles(start, end, 1, 10);
  }, [fetchProfiles]);

  return (
    <BaseScreenAdmin
      defaultSelectedKeys={["dashboard-user"]}
      breadcrumbItems={[{ title: "Danh sách hồ sơ theo mốc thời gian" }]}
    >
      <h2>Danh sách hồ sơ theo mốc thời gian</h2>
      {error && (
        <Alert
          type="error"
          message="Lỗi khi lấy dữ liệu"
          description={error}
          style={{ marginBottom: 16 }}
        />
      )}

      {!isLoading && !error && <ProfilesByMonthTable datapoints={datapoints} />}
    </BaseScreenAdmin>
  );
};

export default ProfilesPage;
