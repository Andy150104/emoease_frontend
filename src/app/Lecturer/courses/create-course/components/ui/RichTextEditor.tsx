'use client';
import { FC, useCallback, useState, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { useRealTimeValidation } from '../../hooks/useRealTimeValidation';
import ValidationFeedback from './ValidationFeedback';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaCode,
  FaQuoteLeft,
  FaUndo,
  FaRedo,
  FaEye,
  FaEdit
} from 'react-icons/fa';

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
  enableMarkdown?: boolean;
  enableImageUpload?: boolean;
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
  enableMarkdown = true,
  enableImageUpload = false,
  value = '',
  onChange
}) => {
  const { validateField, getValidation } = useRealTimeValidation();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validation = getValidation(name);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleContentChange = useCallback((newContent: string) => {
    if (onChange) {
      onChange(newContent);
    }
    validateField(name, newContent, validationType);
  }, [name, validationType, validateField, onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      handleContentChange(newContent);
    }
  }, [handleContentChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            execCommand('redo');
          } else {
            execCommand('undo');
          }
          break;
      }
    }
  }, [execCommand]);

  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      const newText = `${before}${selectedText}${after}`;

      range.deleteContents();
      range.insertNode(document.createTextNode(newText));

      if (editorRef.current) {
        const newContent = editorRef.current.textContent || '';
        handleContentChange(newContent);
      }
    }
  }, [handleContentChange]);

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        execCommand('insertImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [execCommand]);

  const getPlainText = useCallback(() => {
    if (typeof document === 'undefined') {
      // Provide a server-side safe approximation
      return (value || '').replace(/<[^>]*>?/gm, '');
    }
    const div = document.createElement('div');
    div.innerHTML = value || '';
    return div.textContent || div.innerText || '';
  }, [value]);

  const renderMarkdownPreview = useCallback(() => {
    // Simple markdown rendering for preview
    let html = (value || '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>');

    // Wrap consecutive <li> elements in <ul>
    html = html.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');

    return html;
  }, [value]);

  const toolbarButtons = [
    { icon: FaBold, command: 'bold', title: 'Đậm (Ctrl+B)', shortcut: 'Ctrl+B' },
    { icon: FaItalic, command: 'italic', title: 'Nghiêng (Ctrl+I)', shortcut: 'Ctrl+I' },
    { icon: FaUnderline, command: 'underline', title: 'Gạch chân (Ctrl+U)', shortcut: 'Ctrl+U' },
    { icon: FaListUl, command: 'insertUnorderedList', title: 'Danh sách không thứ tự' },
    { icon: FaListOl, command: 'insertOrderedList', title: 'Danh sách có thứ tự' },
    { icon: FaQuoteLeft, command: 'formatBlock', value: 'blockquote', title: 'Trích dẫn' },
    { icon: FaCode, command: 'formatBlock', value: 'pre', title: 'Code block' },
    { icon: FaLink, command: 'createLink', title: 'Thêm liên kết' },
  ];

  if (enableImageUpload) {
    toolbarButtons.push({ icon: FaImage, command: 'image', title: 'Thêm hình ảnh' } as any);
  }

  toolbarButtons.push(
    { icon: FaUndo, command: 'undo', title: 'Hoàn tác (Ctrl+Z)' },
    { icon: FaRedo, command: 'redo', title: 'Làm lại (Ctrl+Shift+Z)' }
  );

  return (
    <div className={`mb-6 ${className}`}>
      <label className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {required && <span className="text-red-500">*</span>}
        </div>

        <div className="flex items-center gap-2">
          {enableMarkdown && (
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title={isPreviewMode ? 'Chỉnh sửa' : 'Xem trước'}
            >
              {isPreviewMode ? <FaEdit /> : <FaEye />}
              <span>{isPreviewMode ? 'Sửa' : 'Xem'}</span>
            </button>
          )}

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {getPlainText().length}/{maxLength}
          </span>
        </div>
      </label>
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title={button.title}
              onClick={() => {
                if (button.command === 'image') {
                  handleImageUpload();
                } else if (button.command === 'createLink') {
                  const url = prompt('Nhập URL:');
                  if (url) execCommand(button.command, url);
                } else {
                  execCommand(button.command, button.value);
                }
              }}
            >
              <button.icon className="text-sm" />
            </button>
          ))}
        </div>

        {/* Editor */}
        {isPreviewMode ? (
          <div
            className="p-4 min-h-[200px] bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdownPreview() }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
            style={{ minHeight: `${minHeight}px` }}
            placeholder={placeholder}
            onInput={(e) => {
              const newContent = e.currentTarget.innerHTML;
              if (value !== newContent) {
                handleContentChange(newContent);
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}

            role="textbox"
            aria-label={label}
            aria-multiline="true"
            aria-required={required}
            aria-describedby={validation ? `${name}-validation` : undefined}
          />
        )}

        {/* Hidden file input for image upload */}
        {enableImageUpload && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;