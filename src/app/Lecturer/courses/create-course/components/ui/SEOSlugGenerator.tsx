'use client';
import { FC, useEffect, useState } from 'react';
import { Input, Button, Typography } from 'antd';
import { FaEdit, FaSync, FaCheck, FaCopy } from 'react-icons/fa';

const { Text } = Typography;

interface SEOSlugGeneratorProps {
  title: string;
  value?: string;
  onChange?: (value: string) => void;
  baseUrl?: string;
}

const SEOSlugGenerator: FC<SEOSlugGeneratorProps> = ({
  title,
  value = '',
  onChange,
  baseUrl = 'https://emoease.edu.vn/course/'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Generate slug from title
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      // Remove Vietnamese accents
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace special characters
      .replace(/[^a-z0-9\s-]/g, '')
      // Replace spaces with hyphens
      .replace(/\s+/g, '-')
      // Remove multiple hyphens
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '');
  };

  // Auto-generate slug when title changes (only if not manually edited)
  useEffect(() => {
    if (title && !isEditing && !value) {
      const newSlug = generateSlug(title);
      setLocalValue(newSlug);
      onChange?.(newSlug);
    }
  }, [title, isEditing, value, onChange]);

  const handleRegenerateSlug = () => {
    const newSlug = generateSlug(title);
    setLocalValue(newSlug);
    onChange?.(newSlug);
    setIsEditing(false);
  };

  const handleManualEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const cleanedSlug = generateSlug(localValue);
    setLocalValue(cleanedSlug);
    onChange?.(cleanedSlug);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(baseUrl + localValue);
  };

  const fullUrl = baseUrl + localValue;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          URL khóa học (SEO Slug)
        </label>
        <div className="flex gap-2">
          <Button
            type="text"
            size="small"
            icon={<FaSync />}
            onClick={handleRegenerateSlug}
            title="Tạo lại từ tiêu đề"
            disabled={!title}
          >
            Tạo lại
          </Button>
          <Button
            type="text"
            size="small"
            icon={<FaEdit />}
            onClick={handleManualEdit}
            title="Chỉnh sửa thủ công"
          >
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Text className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
            {baseUrl}
          </Text>
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={localValue}
                onChange={handleInputChange}
                size="large"
                placeholder="nhap-url-khoa-hoc"
                className="flex-1"
              />
              <Button
                type="primary"
                size="large"
                icon={<FaCheck />}
                onClick={handleSaveEdit}
              >
                Lưu
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <Text 
                className="text-blue-600 dark:text-blue-400 font-medium flex-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
              >
                {localValue || 'chua-co-url'}
              </Text>
              <Button
                type="text"
                icon={<FaCopy />}
                onClick={copyToClipboard}
                title="Copy URL"
                disabled={!localValue}
              />
            </div>
          )}
        </div>

        {/* Full URL preview */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            URL đầy đủ:
          </Text>
          <div className="mt-1 font-mono text-sm text-gray-700 dark:text-gray-300 break-all">
            {fullUrl}
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div>• URL sẽ được tạo tự động từ tiêu đề khóa học</div>
        <div>• Chỉ chứa chữ cái thường, số và dấu gạch ngang</div>
        <div>• URL tốt giúp SEO và dễ nhớ cho học viên</div>
      </div>
    </div>
  );
};

export default SEOSlugGenerator;
