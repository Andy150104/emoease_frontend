'use client';
import { FC } from 'react';
import { Form } from 'antd';
import SmartInput from '../../ui/SmartInput';
import SEOSlugGenerator from '../../ui/SEOSlugGenerator';

const SEOSection: FC = () => {
  const form = Form.useFormInstance();
  const titleValue = Form.useWatch('title', form);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Tối ưu SEO</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Tối ưu hóa khóa học để dễ tìm thấy trên công cụ tìm kiếm và mạng xã hội.
      </p>
      
      <div className="space-y-6">
        <Form.Item name="seoSlug">
          <SEOSlugGenerator
            title={titleValue || ''}
          />
        </Form.Item>

        <SmartInput
          name="metaTitle"
          label="Tiêu đề SEO"
          placeholder="Tiêu đề tối ưu cho công cụ tìm kiếm (để trống sẽ dùng tên khóa học)"
          maxLength={60}
          showCount
          helpText="Tiêu đề này sẽ hiển thị trên kết quả tìm kiếm Google. Nên chứa từ khóa chính và hấp dẫn người dùng click."
        />

        <SmartInput
          name="metaDescription"
          label="Mô tả SEO"
          type="textarea"
          placeholder="Mô tả ngắn gọn về khóa học để hiển thị trên kết quả tìm kiếm"
          maxLength={160}
          rows={3}
          showCount
          helpText="Mô tả này sẽ xuất hiện dưới tiêu đề trên Google. Nên chứa từ khóa và call-to-action rõ ràng."
        />

        {/* SEO Preview */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Xem trước kết quả tìm kiếm:
          </h4>
          <div className="space-y-2">
            <div className="text-blue-600 dark:text-blue-400 text-lg font-medium hover:underline cursor-pointer">
              {Form.useWatch('metaTitle', form) || titleValue || 'Tên khóa học của bạn'}
            </div>
            <div className="text-green-700 dark:text-green-400 text-sm">
              https://emoease.edu.vn/course/{Form.useWatch('seoSlug', form) || 'url-khoa-hoc'}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              {Form.useWatch('metaDescription', form) || 'Mô tả khóa học sẽ hiển thị ở đây...'}
            </div>
          </div>
        </div>

        {/* SEO Tips */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
            💡 Mẹo SEO hiệu quả:
          </h4>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <li>• Sử dụng từ khóa chính trong tiêu đề và mô tả</li>
            <li>• Tiêu đề nên dài 50-60 ký tự để hiển thị đầy đủ</li>
            <li>• Mô tả nên dài 150-160 ký tự và có call-to-action</li>
            <li>• URL ngắn gọn, dễ nhớ và chứa từ khóa</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SEOSection;
