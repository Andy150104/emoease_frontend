import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import {
  GoogleOutlined,
  LogoutOutlined,
  YoutubeOutlined,
  CrownOutlined,
  DollarOutlined,
  DatabaseOutlined,
  BgColorsOutlined,
  GlobalOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  CommentOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { ThemeSwitch } from "../Themes/Theme";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const scrollYRef = useRef(0);
  const prevRef = useRef({
    bodyOverflow: "",
    bodyPaddingRight: "",
    htmlOverflow: "",
    bodyTop: "",
    bodyPosition: "",
    bodyWidth: "",
    htmlScrollBehavior: "",
  });

  // Khóa cuộn kiểu fixed-body (chặn mọi nguồn cuộn)
useEffect(() => {
  if (typeof window === "undefined") return;
  const body = document.body;
  const html = document.documentElement;

  if (open) {
    // Lưu style trước khi khóa
    prevRef.current = {
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      htmlOverflow: html.style.overflow,
      bodyTop: body.style.top,
      bodyPosition: body.style.position,
      bodyWidth: body.style.width,
      htmlScrollBehavior: html.style.scrollBehavior, // lưu scroll-behavior
    };

    // Bù thanh cuộn ngang dọc để tránh "nhảy" layout
    const gap = window.innerWidth - document.documentElement.clientWidth;
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    // Lưu vị trí cuộn hiện tại rồi cuộn lên đầu trang
    scrollYRef.current = window.scrollY;
    html.style.scrollBehavior = "auto"; // đảm bảo nhảy tức thì
    window.scrollTo(0, 0);

    // Khóa cuộn (giữ trang ở top)
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = "0";          // QUAN TRỌNG: để = 0 (không dùng -scrollY)
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
  } else {
    // Mở khóa & phục hồi style
    html.style.overflow = prevRef.current.htmlOverflow || "";
    body.style.overflow = prevRef.current.bodyOverflow || "";
    body.style.paddingRight = prevRef.current.bodyPaddingRight || "";
    body.style.position = prevRef.current.bodyPosition || "";
    body.style.top = prevRef.current.bodyTop || "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = prevRef.current.bodyWidth || "";

    // Phục hồi hành vi cuộn & trả về vị trí cũ
    html.style.scrollBehavior = prevRef.current.htmlScrollBehavior || "";
    if (typeof scrollYRef.current === "number") {
      window.scrollTo(0, scrollYRef.current);
    }
  }

  return () => {
    // Cleanup an toàn nếu component unmount khi đang mở
    html.style.overflow = prevRef.current.htmlOverflow || "";
    body.style.overflow = prevRef.current.bodyOverflow || "";
    body.style.paddingRight = prevRef.current.bodyPaddingRight || "";
    body.style.position = prevRef.current.bodyPosition || "";
    body.style.top = prevRef.current.bodyTop || "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = prevRef.current.bodyWidth || "";
    html.style.scrollBehavior = prevRef.current.htmlScrollBehavior || "";
  };
}, [open]);

  const items: MenuProps["items"] = [
    {
      key: "header",
      disabled: false,
      label: (
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar size={48} src="https://i.pravatar.cc/150?img=3" />
          <div style={{ marginLeft: 12 }}>
            <div style={{ fontWeight: 600 }}>Duy Anh Trần</div>
            <div style={{ fontSize: 13, color: "#aaa" }}>@duyanh15104</div>
            <a href="#" style={{ fontSize: 12, color: "#1890ff" }}>
              Xem kênh của bạn
            </a>
          </div>
        </div>
      ),
    },
    { type: "divider" },
    { key: "google", icon: <GoogleOutlined />, label: "Tài khoản Google" },
    { key: "switch", icon: <SwapOutlined />, label: "Chuyển đổi tài khoản" },
    { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất" },
    { type: "divider" },
    { key: "studio", icon: <YoutubeOutlined />, label: "YouTube Studio" },
    {
      key: "premium",
      icon: <CrownOutlined />,
      label: "Lợi ích của gói Premium",
    },
    {
      key: "billing",
      icon: <DollarOutlined />,
      label: "Giao dịch mua và gói thành viên",
    },
    { type: "divider" },
    {
      key: "data",
      icon: <DatabaseOutlined />,
      label: "Dữ liệu của bạn trong YouTube",
    },
    {
      key: "theme",
      icon: <BgColorsOutlined />,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span>Giao diện</span>
          <ThemeSwitch /> {/* <--- Dùng component đổi theme ở đây */}
        </div>
      ),
    },
    { key: "lang", icon: <GlobalOutlined />, label: "Ngôn ngữ: Tiếng Việt" },
    {
      key: "restrict",
      icon: <SafetyOutlined />,
      label: "Chế độ hạn chế: Đã tắt",
    },
    {
      key: "location",
      icon: <EnvironmentOutlined />,
      label: "Địa điểm: Việt Nam",
    },
    { key: "shortcuts", icon: <EnvironmentOutlined />, label: "Phím tắt" },
    { type: "divider" },
    { key: "settings", icon: <SettingOutlined />, label: "Cài đặt" },
    { key: "help", icon: <QuestionCircleOutlined />, label: "Trợ giúp" },
    {
      key: "feedback",
      icon: <CommentOutlined />,
      label: "Gửi ý kiến phản hồi",
    },
  ];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dropdown
      menu={{
        items,
        onClick: () => setOpen(false), // chọn item thì đóng
        className: "user-menu", // tuỳ style thêm nếu cần
      }}
      open={open}
      onOpenChange={setOpen}
      trigger={["click"]}
      placement="bottomRight"
      getPopupContainer={() => document.documentElement}
      popupRender={(
        menu, // bo góc + overflow ẩn
      ) => <div style={{ borderRadius: 8, overflow: "hidden" }}>{menu}</div>}
    >
      <Avatar
        size={40}
        src="https://i.pravatar.cc/150?img=3"
        style={{ cursor: "pointer" }}
      />
    </Dropdown>
  );
};

export default UserMenu;
