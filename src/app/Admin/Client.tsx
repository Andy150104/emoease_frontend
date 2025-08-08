"use client";

import React, { useEffect } from "react";
import dayjs from "dayjs";
import { usePaymentStore } from "EmoEase/stores/Payment/PaymentStore";
import DashboardRevenueClient from "../test/DashboardRevenueClient";
import { usePathname } from "next/navigation";

export default function DashboardRevenuePage(): React.ReactElement {
  const pathname = usePathname();
  // 1) Gọi hook luôn ở đây, không nằm trong bất kỳ nhánh nào
  const fetchDailyRevenue = usePaymentStore((s) => s.fetchDailyRevenue);
  const revenues = usePaymentStore((s) => s.revenues);

  // 2) Dùng effect để fetch có điều kiện
  useEffect(() => {
    if (pathname !== "/Admin") {
      return;
    }
    const startTime = dayjs().subtract(30, "day").format("YYYY-MM-DD");
    const endTime = dayjs().format("YYYY-MM-DD");
    void fetchDailyRevenue(startTime, endTime);

    // nếu cần cleanup khi unmount:
    return () => {
      usePaymentStore.getState().clearRevenues?.();
    };
  }, [pathname, fetchDailyRevenue]);

  // 3) Xong mới decide render hay không
  if (pathname !== "/Admin") {
    return <div></div>;
  }

  return <DashboardRevenueClient initialRevenues={revenues} />;
}
