'use client';
import { FC, useCallback, useEffect, useState } from 'react';
import { Input, InputNumber, Form } from 'antd';
import { useRealTimeValidation } from '../../hooks/useRealTimeValidation';
import ValidationFeedback from './ValidationFeedback';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface SmartInputProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'number' | 'password';
  validationType: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  rows?: number;
  showCount?: boolean;
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
  addonAfter?: string;
  min?: number;
  max?: number;
  precision?: number;
  formatter?: (value: string | undefined) => string;
  parser?: (value: string | undefined) => number;
  className?: string;
  rules?: any[];
  extra?: React.ReactNode;
  showValidationFeedback?: boolean;
  showCharacterCount?: boolean;
  showOptimizationTips?: boolean;
}

const SmartInput: FC<SmartInputProps> = ({
  name,
  label,
  placeholder,
  type = 'text',
  validationType,
  required = false,
  maxLength,
  minLength,
  rows = 3,
  showCount = false,
  size = 'large',
  disabled = false,
  addonAfter,
  min,
  max,
  precision,
  formatter,
  parser,
  className = '',
  rules = [],
  extra,
  showValidationFeedback = true,
  showCharacterCount = true,
  showOptimizationTips = true
}) => {
  const { validateField, getValidation } = useRealTimeValidation();
  const [value, setValue] = useState<string | number>('');
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const validation = getValidation(name);

  const handleChange = useCallback((newValue: string | number) => {
    setValue(newValue);
    validateField(name, newValue, validationType);
  }, [name, validationType, validateField]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const getCharacterCountColor = () => {
    if (!maxLength || typeof value !== 'string') return 'text-gray-500';
    
    const percentage = (value.length / maxLength) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getOptimizationStatus = () => {
    if (!validation || typeof value !== 'string') return null;
    
    if (validation.level === 'success') {
      return {
        color: 'text-green-600',
        text: 'Tối ưu',
        icon: '✓'
      };
    }
    
    if (validation.level === 'warning') {
      return {
        color: 'text-yellow-600',
        text: 'Có thể cải thiện',
        icon: '⚠'
      };
    }
    
    if (validation.level === 'error') {
      return {
        color: 'text-red-600',
        text: 'Cần sửa',
        icon: '✗'
      };
    }
    
    return {
      color: 'text-blue-600',
      text: 'Đang kiểm tra...',
      icon: '○'
    };
  };

  const renderInput = () => {
    const commonProps = {
      placeholder,
      size,
      disabled,
      className: `${className} ${validation?.level === 'error' ? 'border-red-300' : validation?.level === 'success' ? 'border-green-300' : ''}`,
      onFocus: handleFocus,
      onBlur: handleBlur,
    };

    switch (type) {
      case 'textarea':
        return (
          <Input.TextArea
            {...commonProps}
            rows={rows}
            maxLength={maxLength}
            showCount={showCount}
            onChange={(e) => handleChange(e.target.value)}
            autoSize={rows > 3 ? { minRows: rows, maxRows: rows + 2 } : false}
          />
        );
      
      case 'number':
        return (
          <InputNumber
            {...commonProps}
            min={min}
            max={max}
            precision={precision}
            formatter={formatter}
            parser={parser}
            addonAfter={addonAfter}
            style={{ width: '100%' }}
            onChange={(val) => handleChange(val || 0)}
          />
        );
      
      case 'password':
        return (
          <Input.Password
            {...commonProps}
            maxLength={maxLength}
            onChange={(e) => handleChange(e.target.value)}
            iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
          />
        );
      
      default:
        return (
          <Input
            {...commonProps}
            maxLength={maxLength}
            showCount={showCount}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
    }
  };

  const optimizationStatus = getOptimizationStatus();

  return (
    <Form.Item
      name={name}
      label={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {label}
            </span>
            {required && <span className="text-red-500">*</span>}
          </div>
          
          {showOptimizationTips && optimizationStatus && (
            <div className={`flex items-center gap-1 text-xs ${optimizationStatus.color}`}>
              <span>{optimizationStatus.icon}</span>
              <span>{optimizationStatus.text}</span>
            </div>
          )}
        </div>
      }
      rules={[
        ...(required ? [{ required: true, message: `Vui lòng nhập ${label.toLowerCase()}!` }] : []),
        ...(minLength ? [{ min: minLength, message: `${label} phải có ít nhất ${minLength} ký tự!` }] : []),
        ...(maxLength ? [{ max: maxLength, message: `${label} không được vượt quá ${maxLength} ký tự!` }] : []),
        ...rules
      ]}
      extra={
        <div className="space-y-2">
          {extra}
          
          {/* Character count and optimization info */}
          {(showCharacterCount || showOptimizationTips) && typeof value === 'string' && value.length > 0 && (
            <div className="flex items-center justify-between text-xs">
              {showCharacterCount && maxLength && (
                <span className={getCharacterCountColor()}>
                  {value.length}/{maxLength} ký tự
                </span>
              )}
              
              {showOptimizationTips && validation && validation.level === 'success' && (
                <span className="text-green-600 flex items-center gap-1">
                  <span>✓</span>
                  <span>Tối ưu SEO</span>
                </span>
              )}
            </div>
          )}
          
          {/* Real-time validation feedback */}
          {showValidationFeedback && validation && (isFocused || validation.level === 'error') && (
            <ValidationFeedback 
              validation={validation}
              showSuggestions={isFocused || validation.level !== 'success'}
            />
          )}
        </div>
      }
      className="mb-6"
    >
      {renderInput()}
    </Form.Item>
  );
};

export default SmartInput;
