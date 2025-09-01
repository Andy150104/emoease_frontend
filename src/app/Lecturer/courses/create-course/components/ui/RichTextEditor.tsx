'use client';
import { FC, useCallback, useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useRealTimeValidation } from '../../hooks/useRealTimeValidation';
import ValidationFeedback from './ValidationFeedback';

interface RichTextEditorProps {
  name: string;
  label: string;
  placeholder?: string;
  validationType: string;
  required?: boolean;
  maxLength?: number;
  minHeight?: number;
  className?: string;
  rules?: any[];
  extra?: React.ReactNode;
  showValidationFeedback?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const RichTextEditor: FC<RichTextEditorProps> = ({
  name,
  label,
  placeholder = 'Nhập nội dung...',
  validationType,
  required = false,
  maxLength = 2000,
  minHeight = 200,
  className = '',
  rules = [],
  extra,
  showValidationFeedback = true,
  value = '',
  onChange
}) => {
  const { validateField, getValidation } = useRealTimeValidation();
  const [isFocused, setIsFocused] = useState(false);
  const [editorData, setEditorData] = useState(value);

  const validation = getValidation(name);

  const handleContentChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
    if (onChange) {
      onChange(data);
    }
    const text = new DOMParser().parseFromString(data, 'text/html').body.textContent || "";
    validateField(name, text, validationType);
  };

  const getPlainTextLength = useCallback(() => {
    return (new DOMParser().parseFromString(editorData, 'text/html').body.textContent || "").length;
  }, [editorData]);

  return (
    <div className={`mb-6 ${className}`}>
      <label className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {required && <span className="text-red-500">*</span>}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {getPlainTextLength()}/{maxLength}
        </span>
      </label>
      <div className="ck-editor-container">
        <CKEditor
          editor={ClassicEditor}
          data={value}
          onChange={handleContentChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {showValidationFeedback && validation && (isFocused || validation.level === 'error') && (
        <div className="mt-2">
            <ValidationFeedback
                validation={validation}
                showSuggestions={isFocused || validation.level !== 'success'}
            />
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;