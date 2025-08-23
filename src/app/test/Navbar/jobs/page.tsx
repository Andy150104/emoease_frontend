"use client";
import BaseControlSearchInput, {
  SearchItem,
} from "EmoEase/components/BaseControl/BaseControlSearchInput";
import BaseScreen from "EmoEase/layout/BaseScreen";
import React from "react";

export default function NavbarPage() {
  const demoSearch = async (q: string): Promise<SearchItem[]> => {
    // Thay bằng API của bạn
    const all: SearchItem[] = [
      { id: "a", title: "Sản phẩm A", subtitle: "Mô tả demo cho sản phẩm" },
      { id: "b", title: "Sản phẩm B", subtitle: "Mô tả demo cho sản phẩm" },
      { id: "c", title: "Sản phẩm C", subtitle: "Mô tả demo cho sản phẩm" },
      { id: "d", title: "Sản phẩm D", subtitle: "Mô tả demo cho sản phẩm" },
    ];
    const s = q.toLowerCase();
    return all.filter(
      (x) =>
        x.title.toLowerCase().includes(s) ||
        x.subtitle?.toLowerCase().includes(s),
    );
  };
  return (
    <>
      <BaseScreen>
        <div>
          <BaseControlSearchInput
            onSearch={demoSearch}
            onSelect={(item) => {
              // điều hướng / hành động khi chọn
              console.log("Selected:", item);
            }}
          />
        </div>
      </BaseScreen>
    </>
  );
}
