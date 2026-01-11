'use client';
import { FC } from 'react';
import { Form, Input, Button, Space, Typography } from 'antd';
import { FaPlus, FaTrash, FaInfoCircle } from 'react-icons/fa';

const { Text } = Typography;

interface ListFieldManagerProps {
  name: string;
  label: string;
  placeholder: string;
  minItems?: number;
  maxItems?: number;
  helpText?: string;
  examples?: string[];
  required?: boolean;
}

const ListFieldManager: FC<ListFieldManagerProps> = ({
  name,
  label,
  placeholder,
  minItems = 1,
  maxItems = 10,
  helpText,
  examples = [],
  required = false
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {helpText && (
          <div className="group relative">
            <FaInfoCircle className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
            <div className="absolute left-6 top-0 w-80 p-3 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
              {helpText}
            </div>
          </div>
        )}
      </div>

      <Form.List
        name={name}
        rules={[
          {
            validator: async (_, items) => {
              if (required && (!items || items.length < minItems)) {
                return Promise.reject(new Error(`Vui lòng thêm ít nhất ${minItems} mục`));
              }
              if (items && items.length > maxItems) {
                return Promise.reject(new Error(`Không được vượt quá ${maxItems} mục`));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <div className="space-y-3">
            {fields.map(({ key, name: fieldName, ...restField }) => (
              <Space key={key} className="flex w-full" align="baseline">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                  {fieldName + 1}
                </div>
                <Form.Item
                  {...restField}
                  name={[fieldName]}
                  className="flex-1 mb-0"
                  rules={[
                    { required: true, message: 'Vui lòng nhập nội dung!' },
                    { max: 200, message: 'Không được vượt quá 200 ký tự!' }
                  ]}
                >
                  <Input
                    placeholder={`${placeholder} ${fieldName + 1}`}
                    size="large"
                    className="w-full"
                  />
                </Form.Item>
                {fields.length > minItems && (
                  <Button
                    type="text"
                    icon={<FaTrash />}
                    onClick={() => remove(fieldName)}
                    className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                    title="Xóa mục này"
                  />
                )}
              </Space>
            ))}

            {fields.length < maxItems && (
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<FaPlus />}
                className="w-full h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Thêm mục mới ({fields.length}/{maxItems})
              </Button>
            )}

            {errors.length > 0 && (
              <div className="text-red-500 text-sm">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}

            {examples.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Text className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  💡 Ví dụ:
                </Text>
                <ul className="mt-1 text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  {examples.map((example, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Tối thiểu: {minItems} mục</span>
              <span>Tối đa: {maxItems} mục</span>
            </div>
          </div>
        )}
      </Form.List>
    </div>
  );
};

export default ListFieldManager;
