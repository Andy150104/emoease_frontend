// ProductsTable.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Tag, Image, Space } from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import BaseControlTable from "EmoEase/components/Table/BaseControlTable";

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

type ApiResponse = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: ApiItem[];
};

type RowType = ApiItem & { key: React.Key };

const API_BASE =
  "http://127.0.0.1:3658/m1/1041328-1028536-default/table/test/getAllUser";

const ProductsTable: React.FC = () => {
  const [data, setData] = useState<RowType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // state phân trang/sort/filter (controlled)
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // (Optional) nếu sau này backend hỗ trợ sort/filter qua query
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<
    "ascend" | "descend" | undefined
  >();
  const [filters, setFilters] = useState<Record<string, FilterValue | null>>(
    {},
  );

  const columns = useMemo<TableColumnsType<RowType>>(
    () => [
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        sorter: true, // bật UI sorter; convert sang query khi call API nếu cần
        // ví dụ filter theo status/category nếu muốn lọc client-side (tạm ẩn vì đang server-side)
        // filters: [
        //   { text: "Active", value: "active" },
        //   { text: "Inactive", value: "inactive" },
        // ],
        // onFilter: (value, record) => record.status === value,
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        sorter: true,
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
        sorter: true,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        filters: [
          { text: "Active", value: "active" },
          { text: "Inactive", value: "inactive" },
        ],
        render: (s: RowType["status"]) =>
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
      },
      {
        title: "Đánh giá",
        dataIndex: "rating",
        key: "rating",
        sorter: true,
      },
      {
        title: "Nổi bật",
        dataIndex: "isFeatured",
        key: "isFeatured",
        filters: [
          { text: "Featured", value: "true" },
          { text: "Normal", value: "false" },
        ],
        render: (v: boolean) => (v ? <Tag color="gold">Featured</Tag> : "-"),
      },
      {
        title: "Tạo lúc",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (iso: string) =>
          new Date(iso).toLocaleString("vi-VN", { hour12: false }),
        sorter: true,
      },
      {
        title: "Cập nhật",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (iso: string) =>
          new Date(iso).toLocaleString("vi-VN", { hour12: false }),
        sorter: true,
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
    [],
  );

  const fetchData = async () => {
    setLoading(true);

    // Build query (hiện backend của bạn chắc mới hỗ trợ page & pageSize; để sẵn sorter/filters nếu sau này cần)
    const params = new URLSearchParams();
    params.set("page", String(current));
    params.set("pageSize", String(pageSize));

    // Nếu backend hỗ trợ:
    // if (sortField && sortOrder) {
    //   params.set("sortField", sortField);
    //   params.set("sortOrder", sortOrder === "ascend" ? "asc" : "desc");
    // }
    // Object.entries(filters).forEach(([k, v]) => {
    //   if (v && v.length) params.set(k, String(v[0]));
    // });

    const url = `${API_BASE}?${params.toString()}`;
    const res = await fetch(url);
    const json: ApiResponse = await res.json();

    const rows: RowType[] = (json.items || []).map((it) => ({
      key: it.id, // bắt buộc có key cho antd table
      ...it,
    }));

    setData(rows);
    setTotal(json.totalItems || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize, sortField, sortOrder, filters]);

  const handleChange = (
    pagination: TablePaginationConfig,
    tableFilters: Record<string, FilterValue | null>,
    sorter: SorterResult<RowType> | SorterResult<RowType>[],
  ) => {
    // pagination
    setCurrent(pagination.current || 1);
    setPageSize(pagination.pageSize || 50);

    // sorter
    if (!Array.isArray(sorter)) {
      setSortField((sorter?.field as string) || undefined);
      setSortOrder(
        (sorter?.order as "ascend" | "descend" | undefined) || undefined,
      );
    }

    // filters
    setFilters(tableFilters);
  };

  return (
    <BaseControlTable
      columns={columns}
      data={data}
      total={total}
      loading={loading}
      pagination={{ current, pageSize, showSizeChanger: true }}
      onChange={handleChange}
      isShowDescription
      getDescription={(record) => (
        <div style={{ paddingRight: 16 }}>
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
    />
  );
};

export default ProductsTable;
