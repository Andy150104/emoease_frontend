"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Tag, Image, Space } from "antd";
import type { TableColumnsType } from "antd";
import BaseControlTableClient from "EmoEase/components/Table/BaseControlTableClient";
import BaseScreenAdmin from "EmoEase/layout/BaseScreenAdmin";

type ApiItem = {
  id: number;
  name: string;
  price: number;
  currency: string;
  status: "active" | "inactive";
  stock: number;
  category: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  rating: number;
  isFeatured: boolean;
};

type RowType = ApiItem & { key: React.Key };

const API_BASE =
  "http://127.0.0.1:3658/m1/1041328-1028536-default/table/test/getAllUser";

const TableClientPage: React.FC = () => {
  const [data, setData] = useState<RowType[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Fetch toàn bộ, để client tự sort/filter/paginate
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const url = `${API_BASE}?page=1&pageSize=9999`;
        const res = await fetch(url);
        const json = await res.json();
        const rows: RowType[] = (json.items || []).map((it: ApiItem) => ({
          key: it.id,
          ...it,
        }));
        if (!ignore) setData(rows);
        setMounted(true);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // Sinh filters động theo category (từ data)
  const categoryFilters = useMemo(
    () =>
      Array.from(new Set(data.map((x) => x.category)))
        .filter(Boolean)
        .map((c) => ({ text: c, value: c })),
    [data],
  );

  const columns: TableColumnsType<RowType> = useMemo(
    () => [
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        sorter: (a, b) => a.price - b.price,
        render: (v: number, record) =>
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: record.currency || "VND",
            currencyDisplay: "narrowSymbol",
          }).format(v),
      },
      {
        title: "Tồn kho",
        dataIndex: "stock",
        key: "stock",
        responsive: ["lg"], // chỉ hiển thị khi ở lg
        sorter: (a, b) => a.stock - b.stock,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        filters: [
          { text: "Active", value: "active" },
          { text: "Inactive", value: "inactive" },
        ],
        onFilter: (value, record) => record.status === value,
        render: (s) =>
          s === "active" ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Inactive</Tag>
          ),
      },
      {
        title: "Danh mục",
        dataIndex: "category",
        key: "category",
        filters: categoryFilters,
        onFilter: (value, record) => record.category === value,
      },
      {
        title: "Đánh giá",
        dataIndex: "rating",
        key: "rating",
        width: "100px",
        sorter: (a, b) => a.rating - b.rating,
      },
      {
        title: "Nổi bật",
        dataIndex: "isFeatured",
        key: "isFeatured",
        filters: [
          { text: "Featured", value: "true" },
          { text: "Normal", value: "false" },
        ],
        onFilter: (value, record) =>
          (record.isFeatured ? "true" : "false") === value,
        render: (v: boolean) => (v ? <Tag color="gold">Featured</Tag> : "-"),
      },
      {
        title: "Tạo lúc",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        render: (iso: string) =>
          new Date(iso).toLocaleString("vi-VN", { hour12: false }),
      },
      {
        title: "Cập nhật",
        dataIndex: "updatedAt",
        key: "updatedAt",
        sorter: (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
        render: (iso: string) =>
          new Date(iso).toLocaleString("vi-VN", { hour12: false }),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <Space>
            <a onClick={() => console.log("view", record.id)}>View</a>
            <a onClick={() => console.log("delete", record.id)}>Delete</a>
          </Space>
        ),
      },
    ],
    [categoryFilters],
  );
  if (!mounted) return null;
  return (
    <BaseScreenAdmin>
      <BaseControlTableClient
        columns={columns}
        data={data}
        isShowDescription
        loading={loading}
        getDescription={(record) => (
          <div className="p-4">
            <div style={{ marginBottom: 8 }}>{record.description || "—"}</div>
            {record.images?.length ? (
              <Image.PreviewGroup>
                <Space wrap>
                  {record.images.map((src, idx) => (
                    <Image
                      key={idx}
                      width={80}
                      src={src}
                      alt={`${record.name ?? "Hình sản phẩm"} – ${idx + 1}`}
                    />
                  ))}
                </Space>
              </Image.PreviewGroup>
            ) : (
              <em>Không có hình ảnh</em>
            )}
          </div>
        )}
        rowSelectionEnabled
        onRowSelectChange={(keys, rows) => {
          console.log("Selected keys:", keys);
          console.log("Selected rows:", rows);
        }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        isShowSearchTable
        searchKeys={["name", "category", "description"]}
        showLoadingOnSearch
        showLoadingOnPaginate
        searchDebounceMs={300}
        searchPlaceholder="Type keywords..."
        paletteMaxResults={12}
        onPaletteSelect={(row) => console.log("Selected:", row)}
        minSearchChars={1}
        searchMode="both"
        disableInputOnExternalLoading={false}
        loadingDelayMs={250}
      />
    </BaseScreenAdmin>
  );
};

export default TableClientPage;
