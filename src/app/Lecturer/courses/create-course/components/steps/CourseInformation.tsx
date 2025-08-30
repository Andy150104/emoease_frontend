'use client';
import { FC, useEffect, useState, useCallback, useRef } from 'react';
import { useCreateCourseStore } from 'EmoEase/stores/CreateCourse/CreateCourseStore';
import BaseControlSelect from 'EmoEase/components/BaseControl/BaseControlSelect';
import ControlledImageUploader from 'EmoEase/components/BaseControl/ControlledImageUploader';
import { useTheme } from 'EmoEase/Provider/ThemeProvider';
import { ConfigProvider, Form, Input, theme, message, Button } from 'antd';

import { FaArrowRight, FaCheck, FaSpinner, FaTrash, FaInfoCircle, FaUser, FaTag } from 'react-icons/fa';
import { FadeInUp } from 'EmoEase/components/Animation/FadeInUp';

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

            // Scroll to top before navigating to next step
            scrollToTop();

            // Small delay to ensure smooth transition
            setTimeout(() => {
                setCurrentStep(1);
                const container = document.getElementById('create-course-content');
                setTimeout(() => {
                    if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    else window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 50);
            }, 300);
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
        <div className="space-y-6 max-w-5xl mx-auto px-4">
            {/* Enhanced Header with Progress */}
            <FadeInUp>
                <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">Tạo khóa học</span>
                        <span>›</span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium cursor-default">Thông tin cơ bản</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                                        1
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                        <FaInfoCircle className="text-white text-xs" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                                        Thông tin khóa học
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                                        Tạo ấn tượng đầu tiên tuyệt vời cho khóa học của bạn
                                    </p>
                                </div>
                            </div>

                            {/* Enhanced Progress Bar */}
                            <div className="relative">
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-3 overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-sm" style={{ width: '20%' }}>
                                        <div className="h-full bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>Bước 1 của 5</span>
                                    <span>20% hoàn thành</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            <AutoSaveStatus />
                            {lastSaved && (
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<FaTrash />}
                                    onClick={clearSavedData}
                                    className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                                    title="Xóa dữ liệu đã lưu"
                                >
                                    Xóa bản nháp
                                </Button>
                            )}
                            
                            {/* Quick stats */}
                            <div className="flex gap-2">
                                {['Tiêu đề', 'Mô tả', 'Hình ảnh', 'Phân loại'].map((field) => (
                                    <div key={field} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                                        {field}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </FadeInUp>

            <ConfigProvider
                theme={{
                    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    token: {
                        colorText: isDarkMode ? "#FFFFFF" : "#000000",
                        colorTextPlaceholder: isDarkMode ? "#9CA3AF" : "#6B7280",
                        colorBgContainer: isDarkMode ? "#374151" : "#FFFFFF",
                        colorBorder: isDarkMode ? "#4B5563" : "#D1D5DB",
                        colorBorderSecondary: isDarkMode ? "#4B5563" : "#E5E7EB",
                    },
                    components: {
                        Input: {
                            colorText: isDarkMode ? "#FFFFFF" : "#000000",
                            colorTextPlaceholder: isDarkMode ? "#9CA3AF" : "#6B7280",
                            colorBgContainer: isDarkMode ? "#374151" : "#FFFFFF",
                            colorBorder: isDarkMode ? "#4B5563" : "#D1D5DB",
                            activeBorderColor: isDarkMode ? "#60A5FA" : "#3B82F6",
                            hoverBorderColor: isDarkMode ? "#60A5FA" : "#3B82F6",
                        },
                        Select: {
                            colorText: isDarkMode ? "#FFFFFF" : "#000000",
                            colorTextPlaceholder: isDarkMode ? "#9CA3AF" : "#6B7280",
                            colorBgContainer: isDarkMode ? "#374151" : "#FFFFFF",
                            colorBorder: isDarkMode ? "#4B5563" : "#D1D5DB",
                            colorBgElevated: isDarkMode ? "#374151" : "#FFFFFF",
                            optionSelectedBg: isDarkMode ? "#4B5563" : "#F3F4F6",
                        },
                        Upload: {
                            colorText: isDarkMode ? "#FFFFFF" : "#000000",
                            colorBgContainer: isDarkMode ? "#374151" : "#FFFFFF",
                            colorBorder: isDarkMode ? "#4B5563" : "#D1D5DB",
                        },
                        Form: {
                            labelColor: isDarkMode ? "#FFFFFF" : "#000000",
                            labelFontSize: 14,
                        }
                    }
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="space-y-6"
                    onValuesChange={handleFormChange}
                >
                    {/* Basic Information Section */}
                    <FadeInUp delay={100}>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <FaInfoCircle className="text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Thông tin cơ bản</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Tên và hình ảnh đại diện cho khóa học</p>
                                </div>
                            </div>

                        <Form.Item
                            name="title"
                            label={
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tên khóa học</span>
                                    <span className="text-red-500">*</span>
                                </div>
                            }
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên khóa học!' },

                                { max: 100, message: 'Tên khóa học không được vượt quá 100 ký tự!' }
                            ]}
                            className="mb-6"
                            extra={
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                     Tên khóa học hấp dẫn sẽ thu hút nhiều học viên hơn. Hãy mô tả rõ nội dung và đối tượng học.
                                </div>
                            }
                        >
                            <Input
                                placeholder="VD: Lập trình ReactJS từ cơ bản đến nâng cao cho người mới bắt đầu"
                                maxLength={100}
                                size="large"
                                className="rounded-lg"
                                showCount
                            />
                        </Form.Item>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ảnh bìa khóa học</span>
                                <span className="text-red-500">*</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                 Ảnh bìa chất lượng cao (tỷ lệ 16:9, tối thiểu 1280x720px) sẽ tạo ấn tượng tốt với học viên
                            </div>
                            <ControlledImageUploader xmlColumn={{ id: 'coverImage', name: 'Ảnh khóa học', rules: 'required' }} maxCount={1} />
                        </div>
                    </div>
                    </FadeInUp>

                    {/* Description Section */}
                    <FadeInUp delay={200}>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <FaUser className="text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Mô tả khóa học</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Giúp học viên hiểu rõ về khóa học của bạn</p>
                                </div>
                            </div>

                        <Form.Item
                            name="description"
                            label={
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mô tả ngắn</span>
                                    <span className="text-red-500">*</span>
                                    <span className="text-xs text-gray-400">(Hiển thị trong danh sách khóa học)</span>
                                </div>
                            }
                            rules={[
                                { required: true, message: 'Vui lòng nhập mô tả ngắn!' },

                                { max: 200, message: 'Mô tả ngắn không được vượt quá 200 ký tự!' }
                            ]}
                            className="mb-6"
                            extra={
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                     Mô tả ngắn gọn, hấp dẫn để thu hút học viên. Tập trung vào lợi ích chính mà học viên sẽ nhận được.
                                </div>
                            }
                        >
                            <Input.TextArea
                                placeholder="VD: Học ReactJS từ cơ bản đến nâng cao với các dự án thực tế. Phù hợp cho người mới bắt đầu muốn trở thành Frontend Developer chuyên nghiệp."
                                maxLength={200}
                                rows={3}
                                showCount
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="detailedDescription"
                            label={
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mô tả chi tiết</span>
                                    <span className="text-red-500">*</span>
                                    <span className="text-xs text-gray-400">(Hiển thị trong trang chi tiết khóa học)</span>
                                </div>
                            }
                            rules={[
                                { required: true, message: 'Vui lòng nhập mô tả chi tiết!' },

                                { max: 2000, message: 'Mô tả chi tiết không được vượt quá 2000 ký tự!' }
                            ]}
                            className="mb-6"
                            extra={
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                     Mô tả chi tiết về nội dung, phương pháp giảng dạy, và lợi ích. Bao gồm thông tin về dự án thực tế, công cụ sử dụng.
                                </div>
                            }
                        >
                            <Input.TextArea
                                placeholder="VD: Khóa học ReactJS toàn diện với 50+ bài giảng video HD. Bạn sẽ học từ cơ bản như JSX, Components đến nâng cao như Redux, Testing. Bao gồm 5 dự án thực tế: Todo App, E-commerce, Social Media Dashboard. Sử dụng công cụ hiện đại: Vite, TypeScript, Tailwind CSS..."
                                maxLength={2000}
                                rows={6}
                                showCount
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Form.Item
                                name="learningObjectives"
                                label={
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mục tiêu học tập</span>
                                        <span className="text-red-500">*</span>
                                    </div>
                                }
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mục tiêu học tập!' },

                                ]}
                                className="mb-6"
                                extra={
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                         Liệt kê cụ thể các kỹ năng và kiến thức học viên sẽ đạt được
                                    </div>
                                }
                            >
                                <Input.TextArea
                                    placeholder="• Xây dựng ứng dụng React từ đầu&#10;• Sử dụng thành thạo Hooks và State Management&#10;• Tích hợp API và xử lý dữ liệu&#10;• Deploy ứng dụng lên production&#10;• Viết unit test cho React components"
                                    maxLength={1000}
                                    rows={5}
                                    showCount
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                name="targetAudience"
                                label={
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Đối tượng học viên</span>
                                        <span className="text-red-500">*</span>
                                    </div>
                                }
                                rules={[
                                    { required: true, message: 'Vui lòng nhập đối tượng phù hợp!' },

                                ]}
                                className="mb-6"
                                extra={
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                         Mô tả rõ ai sẽ hưởng lợi từ khóa học này
                                    </div>
                                }
                            >
                                <Input.TextArea
                                    placeholder="• Sinh viên CNTT muốn học Frontend&#10;• Lập trình viên mới bắt đầu với React&#10;• Developer muốn chuyển sang React&#10;• Freelancer muốn mở rộng kỹ năng"
                                    maxLength={500}
                                    rows={5}
                                    showCount
                                    className="rounded-lg"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    </FadeInUp>

                    {/* Category and Level Section */}
                    <FadeInUp delay={300}>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <FaTag className="text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Phân loại khóa học</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Giúp học viên tìm thấy khóa học phù hợp</p>
                                </div>
                            </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Form.Item
                                label={
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Trình độ</span>
                                        <span className="text-red-500">*</span>
                                    </div>
                                }
                                name="level"
                                rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}
                                className="mb-6"
                                extra={
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                         Chọn trình độ phù hợp với nội dung khóa học
                                    </div>
                                }
                            >
                                <BaseControlSelect
                                    options={[
                                        { label: 'Người mới bắt đầu', value: 'Beginner' },
                                        { label: 'Trung bình', value: 'Intermediate' },
                                        { label: 'Nâng cao', value: 'Advanced' },
                                    ]}
                                    width="100%"
                                    size="large"
                                    isSearch={true}
                                />
                            </Form.Item>

                            <div className="lg:col-span-2">
                                <Form.Item
                                    label={
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Danh mục công nghệ</span>
                                            <span className="text-red-500">*</span>
                                        </div>
                                    }
                                    name="category"
                                    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                                    className="mb-6"
                                    extra={
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Chọn công nghệ chính mà khóa học tập trung vào
                                        </div>
                                    }
                                >
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
                                        isSearch={true}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    </FadeInUp>

                    {/* Enhanced Navigation Section */}
                    <FadeInUp delay={400}>
                        <div className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-indigo-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                            <FaCheck className="text-lg" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                                Bước 1 của 5: Thông tin khóa học
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                Hoàn thành thông tin cơ bản để tiếp tục xây dựng giáo trình
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                            <FaCheck className="text-white text-xs" />
                                        </div>
                                        <span>Dữ liệu được tự động lưu an toàn</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                                        onClick={handleResetForm}
                                    >
                                        <FaTrash className="text-xs" />
                                        <span>Đặt lại</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                                        onClick={handleNext}
                                    >
                                        <span>Tiếp theo: Xây dựng giáo trình</span>
                                        <FaArrowRight className="text-xs transition-transform duration-200 ease-in-out group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                </Form>
            </ConfigProvider>
        </div>
    );
};

export default CourseInformation;

