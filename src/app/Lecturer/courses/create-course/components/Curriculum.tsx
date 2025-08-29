'use client';
import { FC, useEffect, useState, useCallback, useRef } from 'react';
import { useCreateCourseStore, type Curriculum } from 'EmoEase/stores/CreateCourse/CreateCourseStore';
import { useTheme } from 'EmoEase/Provider/ThemeProvider';
import { ConfigProvider, Input, InputNumber, Button, message, theme, Modal, Form } from 'antd';
import { FaArrowLeft, FaArrowRight, FaPlus, FaTrash, FaCheck, FaSpinner, FaChevronDown, FaChevronUp, FaBook, FaGraduationCap, FaClock } from 'react-icons/fa';
import { FadeInUp } from 'EmoEase/components/Animation/FadeInUp';
import { FadeInOnScrollSpring } from 'EmoEase/components/Animation/FadeInOnScroll';

// Auto-save configuration
const AUTO_SAVE_KEY = 'curriculum_creation_draft';
const AUTO_SAVE_DELAY = 2000; // 2 seconds

// Save status types
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const Curriculum: FC = () => {
    const {
        setCurrentStep,
        curriculum,
        updateCurriculum,
        addModule,
        updateModule,
        removeModule,
        toggleModuleExpansion
    } = useCreateCourseStore();

    const { isDarkMode } = useTheme();

    // Auto-save state
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialLoadRef = useRef(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalForm] = Form.useForm();

    // Notification debouncing
    const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastNotificationRef = useRef<string>('');

    const showDebouncedNotification = useCallback((type: 'success' | 'error' | 'warning', content: string, delay: number = 1000) => {
        // Prevent duplicate notifications
        if (lastNotificationRef.current === content) {
            return;
        }

        // Clear previous timeout
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
        }

        // Set new timeout for notification
        notificationTimeoutRef.current = setTimeout(() => {
            message[type](content);
            lastNotificationRef.current = content;

            // Clear the last notification after some time to allow future notifications
            setTimeout(() => {
                lastNotificationRef.current = '';
            }, 5000);
        }, delay);
    }, []);

    // Auto-save functions
    const saveToLocalStorage = useCallback((curriculumData: Curriculum) => {
        try {
            const dataToSave = {
                ...curriculumData,
                timestamp: new Date().toISOString(),
                version: '1.0',
                formStep: 'curriculum'
            };

            localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(dataToSave));
            setSaveStatus('saved');
            setLastSaved(new Date());

            setTimeout(() => {
                setSaveStatus('idle');
            }, 3000);
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            setSaveStatus('error');
            showDebouncedNotification('error', 'Không thể lưu dữ liệu tự động', 2000);

            setTimeout(() => {
                setSaveStatus('idle');
            }, 5000);
        }
    }, [showDebouncedNotification]);

    const debouncedSave = useCallback((curriculumData: Curriculum) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        if (isInitialLoadRef.current) {
            return;
        }

        setSaveStatus('saving');

        saveTimeoutRef.current = setTimeout(() => {
            saveToLocalStorage(curriculumData);
        }, AUTO_SAVE_DELAY);
    }, [saveToLocalStorage]);

    const loadFromLocalStorage = useCallback(() => {
        try {
            const savedData = localStorage.getItem(AUTO_SAVE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                const { timestamp, ...curriculumData } = parsedData;
                delete curriculumData.version;
                delete curriculumData.formStep;

                updateCurriculum(curriculumData);
                setLastSaved(new Date(timestamp));

                showDebouncedNotification('success', 'Đã khôi phục dữ liệu giáo trình đã lưu', 500);
                return true;
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            showDebouncedNotification('warning', 'Không thể khôi phục dữ liệu đã lưu', 1000);
        }
        return false;
    }, [updateCurriculum, showDebouncedNotification]);

    const clearSavedData = useCallback(() => {
        try {
            localStorage.removeItem(AUTO_SAVE_KEY);
            showDebouncedNotification('success', 'Đã xóa dữ liệu đã lưu', 500);
            setLastSaved(null);
            setSaveStatus('idle');
        } catch (error) {
            console.error('Failed to clear saved data:', error);
            showDebouncedNotification('error', 'Không thể xóa dữ liệu đã lưu', 1000);
        }
    }, [showDebouncedNotification]);

    // Load saved data on component mount
    useEffect(() => {
        const hasRestoredData = loadFromLocalStorage();
        isInitialLoadRef.current = false;

        if (!hasRestoredData) {
            setTimeout(() => {
                isInitialLoadRef.current = false;
            }, 100);
        }
    }, [loadFromLocalStorage]);

    // Watch for curriculum changes and auto-save
    useEffect(() => {
        if (!isInitialLoadRef.current) {
            debouncedSave(curriculum);
        }
    }, [curriculum, debouncedSave]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    // Helper functions
    const handleOpenModal = () => {
        setIsModalOpen(true);
        // Focus on first input after modal opens
        setTimeout(() => {
            modalForm.getFieldInstance('title')?.focus();
        }, 100);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        modalForm.resetFields();
        setIsSubmitting(false);
    };

    const handleModalSubmit = async () => {
        try {
            setIsSubmitting(true);
            const values = await modalForm.validateFields();

            // Filter out empty learning objectives
            const filteredObjectives = values.learningObjectives?.filter((obj: string) => obj.trim() !== '') || [];

            addModule({
                title: values.title,
                description: values.description || '',
                duration: values.duration || 0,
                learningObjectives: filteredObjectives,
                isOptional: values.isOptional || false,
                difficulty: values.difficulty
            });

            showDebouncedNotification('success', 'Đã thêm chương mới thành công!', 0);
            handleCloseModal();
        } catch (error) {
            console.error('Validation failed:', error);
            setIsSubmitting(false);
        }
    };

    const handleUpdateModule = (id: string, field: string, value: string | number) => {
        updateModule(id, { [field]: value });
    };

    const handleAddObjective = (moduleId: string, objectives: string[]) => {
        updateModule(moduleId, { learningObjectives: [...objectives, ''] });
    };

    const handleRemoveObjective = (moduleId: string, objectives: string[], index: number) => {
        const newObjectives = objectives.filter((_, i) => i !== index);
        updateModule(moduleId, { learningObjectives: newObjectives });
    };

    const handleUpdateObjective = (moduleId: string, objectives: string[], index: number, value: string) => {
        const newObjectives = [...objectives];
        newObjectives[index] = value;
        updateModule(moduleId, { learningObjectives: newObjectives });
    };

    const handleNext = async () => {
        if (curriculum.modules.length === 0) {
            showDebouncedNotification('warning', 'Vui lòng thêm ít nhất một chương học', 0);
            return;
        }

        // Clear saved data on successful submission
        localStorage.removeItem(AUTO_SAVE_KEY);
        setCurrentStep(2);
        const container = document.getElementById('create-course-content');
        setTimeout(() => {
            if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
    };

    const handleBack = () => {
        setCurrentStep(0);
        setTimeout(() => {
            const container = document.getElementById('create-course-content');
            if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
    };

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
                        <span>Tạo khóa học</span>
                        <span>›</span>
                        <button 
                            onClick={() => {
                                if (curriculum.modules.length > 0) {
                                    if (confirm('Bạn có chắc chắn muốn quay lại bước Thông tin cơ bản? Dữ liệu hiện tại sẽ được lưu tự động.')) {
                                        setCurrentStep(0);
                                    }
                                } else {
                                    setCurrentStep(0);
                                }
                            }}
                            className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium cursor-pointer transition-colors underline-offset-2 hover:underline"
                        >
                            Thông tin cơ bản
                        </button>
                        <span>›</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium cursor-default">Giáo trình</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                                        2
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <FaBook className="text-white text-xs" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                                        Giáo trình khóa học
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                                        Xây dựng chương trình học chi tiết và có cấu trúc
                                    </p>
                                </div>
                            </div>

                            {/* Enhanced Progress Bar */}
                            <div className="relative">
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-3 overflow-hidden">
                                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all duration-500 shadow-sm" style={{ width: '40%' }}>
                                        <div className="h-full bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>Bước 2 của 5</span>
                                    <span>40% hoàn thành</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {curriculum.modules.length}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        chương đã tạo
                                    </div>
                                </div>
                                {curriculum.modules.length > 0 && (
                                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                        <FaCheck className="text-white text-xs" />
                                    </div>
                                )}
                            </div>
                            
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
                                {['Chương', 'Bài học', 'Thời lượng', 'Mức độ'].map((stat) => (
                                    <div key={stat} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                                        {stat}
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
                        InputNumber: {
                            colorText: isDarkMode ? "#FFFFFF" : "#000000",
                            colorTextPlaceholder: isDarkMode ? "#9CA3AF" : "#6B7280",
                            colorBgContainer: isDarkMode ? "#374151" : "#FFFFFF",
                            colorBorder: isDarkMode ? "#4B5563" : "#D1D5DB",
                            activeBorderColor: isDarkMode ? "#60A5FA" : "#3B82F6",
                            hoverBorderColor: isDarkMode ? "#60A5FA" : "#3B82F6",
                        },
                        Button: {
                            colorText: isDarkMode ? "#FFFFFF" : "#000000",
                            colorBgContainer: isDarkMode ? "#374151" : "#FFFFFF",
                            colorBorder: isDarkMode ? "#4B5563" : "#D1D5DB",
                        },
                        Collapse: {
                            colorText: isDarkMode ? "#FFFFFF" : "#000000",
                            colorBgContainer: isDarkMode ? "#374151" : "#FFFFFF",
                            colorBorder: isDarkMode ? "#4B5563" : "#D1D5DB",
                        },
                        Modal: {
                            colorText: isDarkMode ? "#FFFFFF" : "#000000",
                            colorBgContainer: isDarkMode ? "#374151" : "#FFFFFF",
                            colorBorder: isDarkMode ? "#4B5563" : "#D1D5DB",
                            colorBgElevated: isDarkMode ? "#374151" : "#FFFFFF",
                            colorBgMask: isDarkMode ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.45)",
                        },
                        Form: {
                            labelColor: isDarkMode ? "#FFFFFF" : "#000000",
                            labelFontSize: 14,
                        }
                    }
                }}
            >
                <div className="space-y-8">
                    {/* Enhanced Add New Module Section */}
                    <FadeInUp delay={100}>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <FaGraduationCap className="text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Quản lý chương học</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Tạo và tổ chức cấu trúc học tập</p>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    type="primary"
                                    icon={<FaPlus />}
                                    onClick={handleOpenModal}
                                    size="middle"
                                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-0 px-6 py-2 h-auto font-semibold shadow-md hover:shadow-lg transition-all duration-200 rounded-lg"
                                >
                                    Thêm chương mới
                                </Button>
                            </div>
                        </div>
                    </FadeInUp>

                    {/* Enhanced Existing Modules Section */}
                    {curriculum.modules.length > 0 && (
                        <FadeInUp delay={200}>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                        <FaBook className="text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                            Danh sách chương ({curriculum.modules.length})
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">Quản lý và chỉnh sửa các chương học</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {curriculum.modules.map((module, index) => (
                                        <FadeInOnScrollSpring key={module.id}>
                                            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-lg">
                                                <div
                                                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 dark:hover:from-emerald-900/20 dark:hover:to-green-900/20 transition-all duration-300"
                                                    onClick={() => toggleModuleExpansion(module.id)}
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-md">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{module.title}</h4>
                                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                                <div className="flex items-center gap-1">
                                                                    <FaClock className="text-xs" />
                                                                    <span>{module.duration} phút</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <FaGraduationCap className="text-xs" />
                                                                    <span>{module.learningObjectives.length} mục tiêu</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={<FaTrash />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeModule(module.id);
                                                            }}
                                                            className="hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                                                            title="Xóa chương"
                                                        />
                                                        <div className="text-xs px-2 py-1 rounded-full border ml-2 select-none">
                                                            {module.isOptional ? 'Tùy chọn' : 'Bắt buộc'}
                                                        </div>
                                                        {module.difficulty && (
                                                            <div className="text-xs px-2 py-1 rounded-full border ml-2 select-none">
                                                                {module.difficulty === 'easy' ? 'Dễ' : module.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                                                            </div>
                                                        )}
                                                        <div className="text-emerald-600 dark:text-emerald-400">
                                                            {module.isExpanded ? <FaChevronUp className="text-lg" /> : <FaChevronDown className="text-lg" />}
                                                        </div>
                                                    </div>
                                                </div>

                                        {module.isExpanded && (
                                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                            Tên chương
                                                        </label>
                                                        <Input
                                                            value={module.title}
                                                            onChange={(e) => handleUpdateModule(module.id, 'title', e.target.value)}
                                                            className="rounded-lg"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                                Mô tả
                                                            </label>
                                                            <Input.TextArea
                                                                value={module.description}
                                                                onChange={(e) => handleUpdateModule(module.id, 'description', e.target.value)}
                                                                rows={3}
                                                                className="rounded-lg"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                                Thời lượng (phút)
                                                            </label>
                                                            <Input
                                                                type="number"
                                                                value={module.duration}
                                                                onChange={(e) => handleUpdateModule(module.id, 'duration', parseInt(e.target.value) || 0)}
                                                                className="rounded-lg"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                            Mục tiêu học tập
                                                        </label>
                                                        {module.learningObjectives.map((objective, objIndex) => (
                                                            <div key={objIndex} className="flex gap-2 mb-2">
                                                                <Input
                                                                    value={objective}
                                                                    onChange={(e) => handleUpdateObjective(module.id, module.learningObjectives, objIndex, e.target.value)}
                                                                    placeholder={`Mục tiêu ${objIndex + 1}`}
                                                                    className="rounded-lg"
                                                                />
                                                                {module.learningObjectives.length > 1 && (
                                                                    <Button
                                                                        type="text"
                                                                        danger
                                                                        icon={<FaTrash />}
                                                                        onClick={() => handleRemoveObjective(module.id, module.learningObjectives, objIndex)}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                        <Button
                                                            type="dashed"
                                                            icon={<FaPlus />}
                                                            onClick={() => handleAddObjective(module.id, module.learningObjectives)}
                                                            className="mt-2"
                                                        >
                                                            Thêm mục tiêu
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                            </div>
                                            </FadeInOnScrollSpring>
                                    ))}
                                </div>
                            </div>
                        </FadeInUp>
                    )}

                    {/* Enhanced Navigation Section */}
                    <FadeInUp delay={300}>
                        <div className="bg-gradient-to-r from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                            <FaCheck className="text-lg" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                                Bước 2 của 5: Giáo trình khóa học
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                Xây dựng cấu trúc bài học và mục tiêu học tập
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                            <FaCheck className="text-white text-xs" />
                                        </div>
                                        <span>Dữ liệu được tự động lưu an toàn trong quá trình nhập</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="button"
                                        className="group inline-flex items-center gap-2 px-6 py-2.5 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                                        onClick={handleBack}
                                    >
                                        <FaArrowLeft className="text-xs transition-transform duration-200 ease-in-out group-hover:-translate-x-0.5" />
                                        <span>Quay lại</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                                        onClick={handleNext}
                                    >
                                        <span>Tiếp theo: Thêm nội dung</span>
                                        <FaArrowRight className="text-xs transition-transform duration-200 ease-in-out group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                </div>

                {/* Add Chapter Modal */}
                <Modal
                    title={
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            Thêm chương mới
                        </div>
                    }
                    open={isModalOpen}
                    onCancel={handleCloseModal}
                    footer={null}
                    width={600}
                    centered
                    className="curriculum-modal"
                    maskClosable={true}
                    keyboard={true}
                    styles={{
                        body: {
                            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000'
                        },
                        header: {
                            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                            borderBottom: `1px solid ${isDarkMode ? '#4B5563' : '#E5E7EB'}`
                        }
                    }}
                >
                    <Form
                        form={modalForm}
                        layout="vertical"
                        onFinish={handleModalSubmit}
                        className="mt-6"
                        initialValues={{
                            duration: undefined,
                            learningObjectives: [''],
                            isOptional: false,
                            difficulty: 'easy'
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                e.preventDefault();
                                handleModalSubmit();
                            }
                        }}
                    >
                        <Form.Item
                            name="title"
                            label={<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tên chương</span>}
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên chương!' },

                                { max: 100, message: 'Tên chương không được vượt quá 100 ký tự!' }
                            ]}
                        >
                            <Input
                                placeholder="VD: Giới thiệu về React"
                                size="large"
                                className="rounded-lg"
                                maxLength={100}
                            />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                name="isOptional"
                                valuePropName="checked"
                                label={<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Chương tùy chọn</span>}
                            >
                                <input type="checkbox" className="w-5 h-5" />
                            </Form.Item>
                            <Form.Item
                                name="difficulty"
                                label={<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mức độ</span>}
                            >
                                <select className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3">
                                    <option value="easy">Dễ</option>
                                    <option value="medium">Trung bình</option>
                                    <option value="hard">Khó</option>
                                </select>
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                name="duration"
                                label={<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Thời lượng (phút)</span>}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập thời lượng!' },
                                    {
                                        validator: (_, value) => {
                                            if (!value) {
                                                return Promise.reject(new Error('Vui lòng nhập thời lượng!'));
                                            }
                                            if (value < 1) {
                                                return Promise.reject(new Error('Thời lượng phải lớn hơn 0!'));
                                            }
                                            if (value > 600) {
                                                return Promise.reject(new Error('Thời lượng không được vượt quá 600 phút!'));
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <InputNumber
                                    placeholder="60"
                                    size="large"
                                    className="rounded-lg w-full"
                                    min={1}
                                    max={600}
                                    precision={0}
                                    controls={true}
                                    keyboard={true}
                                />
                            </Form.Item>

                            <div></div>
                        </div>

                        <Form.Item
                            name="description"
                            label={<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mô tả chương</span>}
                            rules={[
                                { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Mô tả chi tiết về nội dung chương học này"
                                rows={3}
                                className="rounded-lg"
                                maxLength={500}
                                showCount
                            />
                        </Form.Item>

                        <Form.List name="learningObjectives">
                            {(fields, { add, remove }) => (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Mục tiêu học tập
                                    </label>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className="flex gap-2 mb-3">
                                            <Form.Item
                                                {...restField}
                                                name={[name]}
                                                className="flex-1 mb-0"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập mục tiêu!' },
                                                    { max: 200, message: 'Mục tiêu không được vượt quá 200 ký tự!' }
                                                ]}
                                            >
                                                <Input
                                                    placeholder={`Mục tiêu ${name + 1}`}
                                                    className="rounded-lg"
                                                    maxLength={200}
                                                />
                                            </Form.Item>
                                            {fields.length > 1 && (
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<FaTrash />}
                                                    onClick={() => remove(name)}
                                                    className="flex-shrink-0"
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<FaPlus />}
                                        className="w-full mt-2"
                                        disabled={fields.length >= 10}
                                    >
                                        Thêm mục tiêu {fields.length >= 10 && '(Tối đa 10 mục tiêu)'}
                                    </Button>
                                </div>
                            )}
                        </Form.List>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                            <Button
                                onClick={handleCloseModal}
                                size="large"
                                className="px-6"
                                disabled={isSubmitting}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 px-6"
                            >
                                {isSubmitting ? 'Đang thêm...' : 'Thêm chương'}
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </ConfigProvider>
        </div>
    );
};

export default Curriculum;

