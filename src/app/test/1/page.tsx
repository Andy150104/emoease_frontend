// ví dụ: pages/index.tsx hoặc component khác
import VideoCard from "EmoEase/components/Video/VideoCard";
import React from "react";

export default function HomePage() {
  return (
    <div>
      <VideoCard
        url="https://res.cloudinary.com/demo/video/upload/q_auto/ddqrmgal2uxdxsq1il5c.mp4"
        poster=""
      />
    </div>
  );
}
