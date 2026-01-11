'use client';
import { FC } from 'react';
import { Form, Select } from 'antd';
import SmartInput from '../../ui/SmartInput';
import ControlledImageUploader from 'EmoEase/components/BaseControl/ControlledImageUploader';
import VideoUploader from '../../ui/VideoUploader';
import SEOSlugGenerator from '../../ui/SEOSlugGenerator';

const BasicInfoSection: FC = () => {
  const form = Form.useFormInstance();
  const titleValue = Form.useWatch('title', form);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Thông tin cơ bản</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Tên, mô tả ngắn và hình ảnh đại diện cho khóa học.</p>
      <div className="space-y-6">
        <SmartInput
          name="title"
          label="Tên khóa học"
          placeholder="VD: Lập trình ReactJS từ cơ bản đến nâng cao"
          validationType="title"
          required
          maxLength={60}
          showCount
        />

        <SmartInput
          name="subtitle"
          label="Mô tả phụ"
          placeholder="VD: Xây dựng ứng dụng web hiện đại với React, Redux và TypeScript"
          validationType="subtitle"
          required
          maxLength={120}
          showCount
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="language"
            label="Ngôn ngữ giảng dạy"
            rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ!' }]}
          >
            <Select
              size="large"
              placeholder="Chọn ngôn ngữ"
              options={[
                { label: 'Tiếng Việt', value: 'vi' },
                { label: 'English', value: 'en' },
                { label: 'Tiếng Việt + English', value: 'vi-en' }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="subtitleLanguages"
            label="Phụ đề có sẵn"
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="Chọn ngôn ngữ phụ đề"
              options={[
                { label: 'Tiếng Việt', value: 'vi' },
                { label: 'English', value: 'en' }
              ]}
            />
          </Form.Item>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ảnh bìa khóa học <span className="text-red-500">*</span>
          </label>
          <ControlledImageUploader
            xmlColumn={{ id: 'coverImage', name: 'Ảnh khóa học', rules: 'required' }}
            maxCount={1}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Ảnh bìa chất lượng cao (tỷ lệ 16:9, kích thước 750x422px) sẽ tạo ấn tượng tốt.
          </p>
        </div>

        <Form.Item name="promoVideo" label="Video giới thiệu">
          <VideoUploader
            label="Video giới thiệu khóa học"
            helpText="Video ngắn (1-3 phút) giới thiệu nội dung và lợi ích của khóa học"
            maxSize={100}
          />
        </Form.Item>

        <Form.Item name="seoSlug">
          <SEOSlugGenerator
            title={titleValue || ''}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default BasicInfoSection;

