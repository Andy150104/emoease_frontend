'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button, Tag, Space, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useCourseManagementStore } from 'EmoEase/stores/CourseManagement/CourseManagementStore';
import BaseControlTable from 'EmoEase/components/Table/BaseControlTable';
import { Course } from 'EmoEase/types/course';

const CourseManagementPage: React.FC = () => {
  const {
    courses,
    isLoading,
    fetchCourses,
    deleteCourse,
  } = useCourseManagementStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = (courseId: string) => {
    deleteCourse(courseId);
  };

  const columns: TableColumnsType<Course> = [
    {
      title: 'Tên khóa học',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link href={`/Lecturer/courses/edit/${record.id}`} className="font-semibold text-primary hover:underline">
          {text}
        </Link>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Course['status']) => {
        let color = 'default';
        if (status === 'published') color = 'success';
        if (status === 'archived') color = 'error';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) =>
        `${price.toLocaleString()} ${record.currency}`,
    },
    {
      title: 'Số học viên',
      dataIndex: 'studentCount',
      key: 'studentCount',
      align: 'center',
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Sửa">
            <Link href={`/Lecturer/courses/edit/${record.id}`}>
              <Button icon={<EditOutlined />} type="text" className="text-primary" />
            </Link>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa khóa học"
              description="Bạn có chắc chắn muốn xóa khóa học này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button icon={<DeleteOutlined />} danger type="text" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý khóa học</h1>
        <Link href="/Lecturer/courses/create-course">
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Tạo khóa học mới
          </Button>
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <BaseControlTable<Course>
          columns={columns}
          data={courses.map(c => ({...c, key: c.id}))}
          loading={isLoading}
          total={courses.length}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            total: courses.length,
          }}
        />
      </div>
    </div>
  );
};

export default CourseManagementPage;

