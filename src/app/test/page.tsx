import { cookies } from "next/headers";
import DashboardRevenueClient from "./DashboardRevenueClient";
import { serverPayment } from "EmoEase/hooks/serverPayment";

export default async function Page() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth-storage")?.value;
  let token: string | null = null;

  if (authCookie) {
    try {
      // cookieRawStorage lưu JSON string, có thể url-encoded
      const { token: t } = JSON.parse(decodeURIComponent(authCookie));
      token = t;
      console.log("token", token)
    } catch (e) {
      console.warn("Không parse được auth-storage cookie:", e);
    }
  }

  const res = await serverPayment.payments.getDailyRevenue(
    { startTime: "2004-01-01", endTime: "2025-07-15" },
    { headers: { Authorization: token ? `Bearer ${token}` : "" } }
  );
  const initialRevenues = res.data.revenues ?? [];
  return <DashboardRevenueClient initialRevenues={initialRevenues} />;
}
