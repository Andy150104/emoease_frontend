'use client';
import { FC, useState } from 'react';
import { Form } from 'antd';
import BaseControlSelect from 'EmoEase/components/BaseControl/BaseControlSelect';
import TagsSelector from '../../ui/TagsSelector';

const ClassificationSection: FC = () => {
  const form = Form.useFormInstance();
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categoryOptions = [
    { label: 'Web Development', value: 'web-development' },
    { label: 'Mobile Development', value: 'mobile-development' },
    { label: 'Data Science & AI', value: 'data-science' },
    { label: 'DevOps & Cloud', value: 'devops-cloud' },
    { label: 'Programming Languages', value: 'programming-languages' },
    { label: 'Database & Backend', value: 'database-backend' },
    { label: 'UI/UX Design', value: 'ui-ux-design' },
    { label: 'Software Testing', value: 'software-testing' },
    { label: 'Cybersecurity', value: 'cybersecurity' },
    { label: 'Game Development', value: 'game-development' }
  ];

  const subcategoryOptions: Record<string, Array<{ label: string; value: string }>> = {
    'web-development': [
      { label: 'Frontend Development', value: 'frontend' },
      { label: 'Backend Development', value: 'backend' },
      { label: 'Full Stack Development', value: 'fullstack' },
      { label: 'Web Frameworks', value: 'web-frameworks' },
      { label: 'API Development', value: 'api-development' }
    ],
    'mobile-development': [
      { label: 'iOS Development', value: 'ios' },
      { label: 'Android Development', value: 'android' },
      { label: 'React Native', value: 'react-native' },
      { label: 'Flutter', value: 'flutter' },
      { label: 'Cross-platform', value: 'cross-platform' }
    ],
    'data-science': [
      { label: 'Machine Learning', value: 'machine-learning' },
      { label: 'Deep Learning', value: 'deep-learning' },
      { label: 'Data Analysis', value: 'data-analysis' },
      { label: 'Data Visualization', value: 'data-visualization' },
      { label: 'Natural Language Processing', value: 'nlp' }
    ],
    'programming-languages': [
      { label: 'JavaScript', value: 'javascript' },
      { label: 'Python', value: 'python' },
      { label: 'Java', value: 'java' },
      { label: 'C#', value: 'csharp' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'Go', value: 'go' },
      { label: 'Rust', value: 'rust' }
    ]
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Reset subcategory when category changes

    form.setFieldValue('subcategory', undefined);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Phân loại khóa học</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Giúp học viên dễ dàng tìm thấy khóa học của bạn thông qua tìm kiếm và bộ lọc.</p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Form.Item
            label="Trình độ"
            name="level"
            rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}
          >
            <BaseControlSelect
              options={[
                { label: 'Người mới bắt đầu', value: 'Beginner' },
                { label: 'Trung bình', value: 'Intermediate' },
                { label: 'Nâng cao', value: 'Advanced' }
              ]}
              width="100%"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Danh mục chính"
            name="category"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <BaseControlSelect
              options={categoryOptions}
              width="100%"
              size="large"
              onChange={handleCategoryChange}
            />
          </Form.Item>

          <Form.Item
            label="Danh mục phụ"
            name="subcategory"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục phụ!' }]}
          >
            <BaseControlSelect
              options={subcategoryOptions[selectedCategory] || []}
              width="100%"
              size="large"
              disabled={!selectedCategory}
              placeholder={selectedCategory ? "Chọn danh mục phụ" : "Chọn danh mục chính trước"}
            />
          </Form.Item>
        </div>

        <Form.Item name="tags" rules={[{ required: true, message: 'Vui lòng thêm ít nhất 3 tags!' }]}>
          <TagsSelector
            maxTags={10}
            placeholder="Nhập và chọn các từ khóa liên quan..."
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default ClassificationSection;

