'use client';
import { FC, useEffect, useState, useCallback, useRef } from 'react';
import { useCreateCourseStore, type Curriculum as CurriculumType } from 'EmoEase/stores/CreateCourse/CreateCourseStore';
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

// Notification debouncing state (outside the component)
let notificationTimeout: NodeJS.Timeout | null = null;
let lastNotification: string = '';

const showDebouncedNotification = (type: 'success' | 'error' | 'warning', content: string, delay: number = 1000) => {
    if (lastNotification === content) {
        return; // Prevent duplicate notifications
    }

    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    lastNotification = content;

    notificationTimeout = setTimeout(() => {
        message[type](content);
        setTimeout(() => {
            lastNotification = '';
        }, 2000); // Reset after 2 seconds to allow future messages
    }, delay);
};

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

    // Auto-save functions
    const saveToLocalStorage = useCallback((curriculumData: CurriculumType) => {
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
    }, []);

    const debouncedSave = useCallback((curriculumData: CurriculumType) => {
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
                const savedTimestamp = new Date(parsedData.timestamp);
                const now = new Date();
                const diffMinutes = (now.getTime() - savedTimestamp.getTime()) / (1000 * 60);

                if (diffMinutes > 10) {
                    localStorage.removeItem(AUTO_SAVE_KEY);
                    showDebouncedNotification('warning', 'Dữ liệu đã lưu đã quá 10 phút và đã bị xóa.', 1000);
                    return false;
                }

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
    }, [updateCurriculum]);



    // Load saved data on component mount
    useEffect(() => {
        if (isInitialLoadRef.current) {
            loadFromLocalStorage();
            isInitialLoadRef.current = false;
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
        const container = document.getElementById('create-course-content');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setCurrentStep(2);
    };

    const handleBack = () => {
        const container = document.getElementById('create-course-content');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setCurrentStep(0);
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
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Giáo trình khóa học</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Xây dựng chương trình học chi tiết và có cấu trúc.</p>
                    </div>
                    <AutoSaveStatus />
                </div>

                {/* Module List */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Danh sách chương ({curriculum.modules.length})</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tổ chức và chỉnh sửa các chương học của bạn.</p>
                        </div>
                        <Button type="primary" icon={<FaPlus />} onClick={handleOpenModal} size="large">Thêm chương mới</Button>
                    </div>

                    <div className="space-y-4">
                        {curriculum.modules.map((module, index) => (
                            <FadeInOnScrollSpring key={module.id}>
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-shadow hover:shadow-md">
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                        onClick={() => toggleModuleExpansion(module.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-gray-600 dark:text-gray-400">{index + 1}</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-800 dark:text-gray-200">{module.title}</h4>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    <span><FaClock className="inline mr-1" />{module.duration} phút</span>
                                                    <span><FaGraduationCap className="inline mr-1" />{module.learningObjectives.length} mục tiêu</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Button type="text" danger icon={<FaTrash />} onClick={(e) => { e.stopPropagation(); removeModule(module.id); }} />
                                            {module.isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </div>
                                    {module.isExpanded && (
                                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
                                            <Input addonBefore="Tên chương" value={module.title} onChange={(e) => handleUpdateModule(module.id, 'title', e.target.value)} />
                                            <div className="ant-input-group-wrapper">
                                                <div className="ant-input-wrapper ant-input-group">
                                                    <span className="ant-input-group-addon">Mô tả</span>
                                                    <Input.TextArea value={module.description} onChange={(e) => handleUpdateModule(module.id, 'description', e.target.value)} rows={3} />
                                                </div>
                                            </div>
                                            <InputNumber addonBefore="Thời lượng (phút)" value={module.duration} onChange={(value) => handleUpdateModule(module.id, 'duration', value || 0)} min={0} className="w-full" />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mục tiêu học tập</label>
                                                {module.learningObjectives.map((obj, i) => (
                                                    <div key={i} className="flex items-center gap-2 mb-2">
                                                        <Input value={obj} onChange={(e) => handleUpdateObjective(module.id, module.learningObjectives, i, e.target.value)} />
                                                        {module.learningObjectives.length > 1 && <Button icon={<FaTrash />} onClick={() => handleRemoveObjective(module.id, module.learningObjectives, i)} danger />}
                                                    </div>
                                                ))}
                                                <Button type="dashed" onClick={() => handleAddObjective(module.id, module.learningObjectives)} icon={<FaPlus />}>Thêm mục tiêu</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </FadeInOnScrollSpring>
                        ))}
                        {curriculum.modules.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                <FaBook className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
                                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Chưa có chương nào</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bắt đầu bằng cách thêm chương đầu tiên cho khóa học của bạn.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button icon={<FaArrowLeft />} onClick={handleBack} size="large">Quay lại</Button>
                    <Button type="primary" icon={<FaArrowRight />} onClick={handleNext} size="large">Tiếp theo: Thêm nội dung</Button>
                </div>
            </FadeInUp>

            {/* Add Chapter Modal */}
            <Modal
                title="Thêm chương mới"
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="back" onClick={handleCloseModal} size="large">Hủy</Button>,
                    <Button key="submit" type="primary" loading={isSubmitting} onClick={handleModalSubmit} size="large">Thêm chương</Button>,
                ]}
                width={600}
                centered
            >
                <Form form={modalForm} layout="vertical" onFinish={handleModalSubmit} className="mt-6">
                    <Form.Item name="title" label="Tên chương" rules={[{ required: true, message: 'Vui lòng nhập tên chương!' }, { max: 100, message: 'Tên không quá 100 ký tự!' }]}>
                        <Input placeholder="VD: Giới thiệu về React" size="large" />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }, { type: 'number', min: 1, message: 'Thời lượng phải lớn hơn 0!' }]}>
                            <InputNumber placeholder="60" size="large" className="w-full" />
                        </Form.Item>
                        <Form.Item name="difficulty" label="Mức độ" initialValue="easy">
                            <select className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3">
                                <option value="easy">Dễ</option>
                                <option value="medium">Trung bình</option>
                                <option value="hard">Khó</option>
                            </select>
                        </Form.Item>
                    </div>
                    <Form.Item name="description" label="Mô tả chương" rules={[{ max: 500, message: 'Mô tả không quá 500 ký tự!' }]}>
                        <Input.TextArea placeholder="Mô tả chi tiết về nội dung chương học này" rows={3} showCount maxLength={500} />
                    </Form.Item>
                    <Form.List name="learningObjectives" initialValue={['']}>
                        {(fields, { add, remove }) => (
                            <div>
                                <label className="block text-sm font-medium mb-2">Mục tiêu học tập</label>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="flex items-center gap-2 mb-2">
                                        <Form.Item {...restField} name={[name]} className="flex-1 mb-0" rules={[{ required: true, message: 'Vui lòng nhập mục tiêu!' }]}>
                                            <Input placeholder={`Mục tiêu ${name + 1}`} />
                                        </Form.Item>
                                        {fields.length > 1 && <Button icon={<FaTrash />} onClick={() => remove(name)} danger />}
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<FaPlus />}>Thêm mục tiêu</Button>
                            </div>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </ConfigProvider>
    );
};

export default Curriculum;

