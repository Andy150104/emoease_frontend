'use client';
import { FC, useEffect, useState, useCallback, useRef } from 'react';
import { useCreateCourseStore } from 'EmoEase/stores/CreateCourse/CreateCourseStore';
import BaseControlSelect from 'EmoEase/components/BaseControl/BaseControlSelect';
import ControlledImageUploader from 'EmoEase/components/BaseControl/ControlledImageUploader';
import { useTheme } from 'EmoEase/Provider/ThemeProvider';
import { ConfigProvider, Form, Input, theme, message, Button } from 'antd';

import { FaArrowRight, FaCheck, FaSpinner, FaTrash, FaInfoCircle, FaUser, FaTag } from 'react-icons/fa';
import { FadeInUp } from 'EmoEase/components/Animation/FadeInUp';
import DynamicProgressIndicator from '../ui/DynamicProgressIndicator';
import SmartInput from '../ui/SmartInput';
import RichTextEditor from '../ui/RichTextEditor';

// Auto-save configuration
const AUTO_SAVE_KEY = 'course_creation_draft';
const AUTO_SAVE_DELAY = 2000; // 2 seconds

// Save status types
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Form data interface
interface CourseFormData {
    title?: string;
    description?: string;
    detailedDescription?: string;
    learningObjectives?: string;
    targetAudience?: string;
    level?: string;
    category?: string;
    coverImage?: File | string;
}

const CourseInformation: FC = () => {
    const { updateCourseInformation, setCurrentStep } = useCreateCourseStore();
    const form = Form.useFormInstance();
    const { isDarkMode } = useTheme();

    // Auto-save state
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialLoadRef = useRef(true);

    // Auto-save functions
    const saveToLocalStorage = useCallback((formData: CourseFormData) => {
        try {
            // Filter out empty values to reduce storage size
            const filteredData = Object.entries(formData).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    acc[key] = value;
                }
                return acc;
            }, {} as Record<string, unknown>);

            const dataToSave = {
                ...filteredData,
                timestamp: new Date().toISOString(),
                version: '1.0',
                formStep: 'courseInformation'
            };

            localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(dataToSave));
            setSaveStatus('saved');
            setLastSaved(new Date());

            // Reset status after 3 seconds
            setTimeout(() => {
                setSaveStatus('idle');
            }, 3000);
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            setSaveStatus('error');
            message.error('Không thể lưu dữ liệu tự động');

            // Reset error status after 5 seconds
            setTimeout(() => {
                setSaveStatus('idle');
            }, 5000);
        }
    }, []);

    const debouncedSave = useCallback((formData: CourseFormData) => {
        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Don't save during initial load
        if (isInitialLoadRef.current) {
            return;
        }

        setSaveStatus('saving');

        // Set new timeout
        saveTimeoutRef.current = setTimeout(() => {
            saveToLocalStorage(formData);
        }, AUTO_SAVE_DELAY);
    }, [saveToLocalStorage]);

    // Smooth scroll to top function
    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const loadFromLocalStorage = useCallback(() => {
        try {
            const savedData = localStorage.getItem(AUTO_SAVE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                const savedTimestamp = new Date(parsedData.timestamp);
                const now = new Date();
                const diffMinutes = (now.getTime() - savedTimestamp.getTime()) / (1000 * 60);

                if (diffMinutes > 10) {
                    localStorage.removeItem(AUTO_SAVE_KEY);
                    message.warning('Dữ liệu đã lưu đã quá 10 phút và đã bị xóa.');
                    return false;
                }

                // Remove metadata before setting form values
                const { timestamp, ...formData } = parsedData;
                // Remove metadata fields
                delete formData.version;
                delete formData.formStep;

                // Set form values
                form.setFieldsValue(formData);
                setLastSaved(new Date(timestamp));

                message.success('Đã khôi phục dữ liệu đã lưu trước đó');
                // Scroll to top after loading data
                setTimeout(() => scrollToTop(), 100);
                return true;
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            message.warning('Không thể khôi phục dữ liệu đã lưu');
        }
        return false;
    }, [form, scrollToTop]);

    const clearSavedData = useCallback(() => {
        try {
            localStorage.removeItem(AUTO_SAVE_KEY);
            message.success('Đã xóa dữ liệu đã lưu');
            setLastSaved(null);
            setSaveStatus('idle');
            // Scroll to top after clearing data
            scrollToTop();
        } catch (error) {
            console.error('Failed to clear saved data:', error);
            message.error('Không thể xóa dữ liệu đã lưu');
        }
    }, [scrollToTop]);

    // Load saved data on component mount
    useEffect(() => {
        const hasRestoredData = loadFromLocalStorage();
        isInitialLoadRef.current = false;

        // If no data was restored, still mark as loaded to enable auto-save
        if (!hasRestoredData) {
            setTimeout(() => {
                isInitialLoadRef.current = false;
            }, 100);
        }
    }, [loadFromLocalStorage]);

    // Watch for form changes and auto-save
    const handleFormChange = useCallback(() => {
        if (!isInitialLoadRef.current) {
            const formData = form.getFieldsValue();
            debouncedSave(formData);
        }
    }, [form, debouncedSave]);

    const handleNext = async () => {
        try {
            const values = await form.validateFields();
            updateCourseInformation(values);

            // Clear saved data on successful submission
            localStorage.removeItem(AUTO_SAVE_KEY);

            const container = document.getElementById('create-course-content');
            if (container) {
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setCurrentStep(1);
        } catch (error) {
            console.log('Validation failed:', error);
            // Scroll to first error field if validation fails
            const errorField = document.querySelector('.ant-form-item-has-error');
            if (errorField) {
                errorField.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    };

    const handleResetForm = useCallback(() => {
        form.resetFields();
        const container = document.getElementById('create-course-content');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        message.success('Đã đặt lại form thành công');
    }, [form]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    // Auto-save status component
    const AutoSaveStatus = () => {
        if (saveStatus === 'idle' && !lastSaved) return null;

        const getStatusIcon = () => {
            switch (saveStatus) {
                case 'saving':
                    return <FaSpinner className="animate-spin text-blue-500" />;
                case 'saved':
                    return <FaCheck className="text-green-500" />;
                case 'error':
                    return <span className="text-red-500">⚠</span>;
                default:
                    return lastSaved ? <FaCheck className="text-gray-400" /> : null;
            }
        };

        const getStatusText = () => {
            switch (saveStatus) {
                case 'saving':
                    return 'Đang lưu...';
                case 'saved':
                    return 'Đã lưu';
                case 'error':
                    return 'Lỗi lưu';
                default:
                    return lastSaved ? `Lưu lần cuối: ${lastSaved.toLocaleTimeString()}` : '';
            }
        };

        return (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                {getStatusIcon()}
                <span>{getStatusText()}</span>
            </div>
        );
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorText: isDarkMode ? "#E5E7EB" : "#1F2937",
                    colorTextPlaceholder: isDarkMode ? "#9CA3AF" : "#6B7280",
                    colorBgContainer: isDarkMode ? "#374151" : "#FFFFFF",
                    colorBorder: isDarkMode ? "#4B5563" : "#D1D5DB",
                },
            }}
        >
            <FadeInUp>
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Thông tin khóa học</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Tạo ấn tượng đầu tiên tuyệt vời cho khóa học của bạn.</p>
                    </div>
                    <AutoSaveStatus />
                </div>

                {/* Section 1: Basic Info */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Thông tin cơ bản</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Tên và hình ảnh đại diện cho khóa học.</p>
                    <div className="space-y-6">
                        <SmartInput
                            name="title"
                            label="Tên khóa học"
                            placeholder="VD: Lập trình ReactJS từ cơ bản đến nâng cao"
                            validationType="title"
                            required
                            maxLength={100}
                            showCount
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ảnh bìa khóa học <span className="text-red-500">*</span></label>
                            <ControlledImageUploader xmlColumn={{ id: 'coverImage', name: 'Ảnh khóa học', rules: 'required' }} maxCount={1} />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Ảnh bìa chất lượng cao (tỷ lệ 16:9) sẽ tạo ấn tượng tốt.</p>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700 my-8" />

                {/* Section 2: Description */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Mô tả chi tiết</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Giúp học viên hiểu rõ về nội dung và mục tiêu của khóa học.</p>
                    <div className="space-y-6">
                        <SmartInput
                            name="description"
                            label="Mô tả ngắn"
                            type="textarea"
                            placeholder="Mô tả ngắn gọn, hấp dẫn để thu hút học viên."
                            validationType="description"
                            required
                            maxLength={200}
                            rows={3}
                            showCount
                        />
                        <Form.Item
                            name="detailedDescription"
                            label="Mô tả chi tiết"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả chi tiết!' }, { max: 2000, message: 'Mô tả không được vượt quá 2000 ký tự!'}]}
                        >
                            <RichTextEditor
                                placeholder="Mô tả chi tiết về nội dung, phương pháp giảng dạy, và lợi ích..."
                                maxLength={2000}
                                minHeight={150}
                                enableMarkdown
                            />
                        </Form.Item>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SmartInput
                                name="learningObjectives"
                                label="Mục tiêu học tập"
                                type="textarea"
                                placeholder="• Xây dựng ứng dụng React từ đầu..."
                                validationType="learningObjectives"
                                required
                                maxLength={1000}
                                rows={5}
                                showCount
                            />
                            <SmartInput
                                name="targetAudience"
                                label="Đối tượng học viên"
                                type="textarea"
                                placeholder="• Sinh viên CNTT muốn học Frontend..."
                                validationType="targetAudience"
                                required
                                maxLength={500}
                                rows={5}
                                showCount
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700 my-8" />

                {/* Section 3: Classification */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Phân loại</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Giúp học viên dễ dàng tìm thấy khóa học của bạn.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Form.Item label="Trình độ" name="level" rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}>
                            <BaseControlSelect
                                options={[{ label: 'Người mới bắt đầu', value: 'Beginner' }, { label: 'Trung bình', value: 'Intermediate' }, { label: 'Nâng cao', value: 'Advanced' }]}
                                width="100%"
                                size="large"
                            />
                        </Form.Item>
                        <div className="md:col-span-2">
                            <Form.Item label="Danh mục công nghệ" name="category" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                                <BaseControlSelect
                                    options={[
                                        { label: 'Java - Phát triển ứng dụng doanh nghiệp', value: 'Java' },
                                        { label: 'C# - Phát triển ứng dụng Windows và Web', value: 'CSharp' },
                                        { label: 'JavaScript - Phát triển Web Frontend và Backend', value: 'Javascript' },
                                        { label: 'Python - Data Science và Machine Learning', value: 'Python' },
                                        { label: 'React - Phát triển giao diện người dùng hiện đại', value: 'React' },
                                        { label: 'Node.js - Phát triển Backend và API', value: 'NodeJS' },
                                    ]}
                                    width="100%"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center gap-4 mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button type="text" icon={<FaTrash />} onClick={handleResetForm}>Đặt lại</Button>
                    <Button type="primary" icon={<FaArrowRight />} onClick={handleNext} size="large">
                        Tiếp theo: Xây dựng giáo trình
                    </Button>
                </div>
            </FadeInUp>
        </ConfigProvider>
    );
};

export default CourseInformation;

