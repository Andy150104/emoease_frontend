'use client';
import { FC, useState, useCallback, useMemo } from 'react';
import { ConfigProvider, theme, message, Modal, Form, Input, Button, Upload, InputNumber } from 'antd';
import { useTheme } from 'EmoEase/Provider/ThemeProvider';
import { useCreateCourseStore, CourseContentItem } from 'EmoEase/stores/CreateCourse/CreateCourseStore';
import { FadeInUp } from 'EmoEase/components/Animation/FadeInUp';

import { QuizBuilder } from 'EmoEase/components/Common/QuizBuilder';
import { 
  FaVideo, 
  FaQuestionCircle, 
  FaClipboardList, 
  FaFile, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaGripVertical,
  FaUpload,
  FaArrowRight,
  FaArrowLeft,
  FaClock
} from 'react-icons/fa';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Content types enum
enum ContentType {
  VIDEO = 'video',
  QUIZ = 'quiz', 
  QUESTION = 'question',
  FILE = 'file'
}



interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

interface QuizSettings {
  timeLimit?: number;
  passingScore?: number;
  shuffleQuestions?: boolean;
  showResults?: boolean;
  allowRetake?: boolean;
}


const CourseContent: FC = () => {
  const { isDarkMode } = useTheme();
  const { setCurrentStep, curriculum, contentByModule, setModuleContent, addModuleContent, updateModuleContent, removeModuleContent } = useCreateCourseStore();
  
  // State management
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Keep store in sync when local list changes
  const getModuleItems = useCallback((moduleId: string): CourseContentItem[] => {
    return (contentByModule[moduleId] as CourseContentItem[]) || [];
  }, [contentByModule]);

  const totalContentCount = useMemo(() =>
    Object.values(contentByModule).reduce((acc, arr) => acc + ((arr as CourseContentItem[])?.length || 0), 0)
  , [contentByModule]);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizBuilderOpen, setIsQuizBuilderOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CourseContentItem | null>(null);
  const [form] = Form.useForm();

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Content type configurations - Enhanced with distinctive colors
  const contentTypes = [
    {
      type: ContentType.VIDEO,
      icon: FaVideo,
      title: 'Video Bài Học',
      description: 'Tải lên hoặc liên kết video bài giảng',
      color: 'bg-red-600',
      gradient: 'from-red-500 to-red-700',
      lightBg: 'bg-red-50',
      darkBg: 'dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      type: ContentType.QUIZ,
      icon: FaClipboardList,
      title: 'Bài Kiểm Tra',
      description: 'Tạo câu hỏi trắc nghiệm và bài kiểm tra',
      color: 'bg-emerald-600',
      gradient: 'from-emerald-500 to-emerald-700',
      lightBg: 'bg-emerald-50',
      darkBg: 'dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800'
    },
    {
      type: ContentType.QUESTION,
      icon: FaQuestionCircle,
      title: 'Câu Hỏi Thảo Luận',
      description: 'Thêm câu hỏi để học viên thảo luận',
      color: 'bg-blue-600',
      gradient: 'from-blue-500 to-blue-700',
      lightBg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      type: ContentType.FILE,
      icon: FaFile,
      title: 'Tài Liệu Học Tập',
      description: 'Tải lên tài liệu, PDF, hình ảnh',
      color: 'bg-amber-600',
      gradient: 'from-amber-500 to-amber-700',
      lightBg: 'bg-amber-50',
      darkBg: 'dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800'
    }
  ];


  // Handle content type selection
  const handleTypeSelection = useCallback((type: ContentType) => {
    setSelectedType(type);
    setEditingItem(null);
    
    if (type === ContentType.QUIZ) {
      setIsQuizBuilderOpen(true);
    } else {
      setIsModalOpen(true);
      form.resetFields();
    }
  }, [form]);

  // Handle drag and drop reordering
  const handleDragEnd = useCallback((event: DragEndEvent, moduleId: string) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const items = getModuleItems(moduleId);
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);
      const reorderedItems = arrayMove(items, oldIndex, newIndex).map((it, idx) => ({ ...it, order: idx }));
      setModuleContent(moduleId, reorderedItems as CourseContentItem[]);
    }
  }, [getModuleItems, setModuleContent]);

  // Handle content creation/editing
  const handleSubmitContent = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const currentItems = activeModuleId ? getModuleItems(activeModuleId) : [];
      const newItem: CourseContentItem = {
        id: editingItem?.id || Date.now().toString(),
        type: selectedType!,
        title: values.title,
        description: values.description,
        duration: values.duration,
        order: editingItem?.order ?? currentItems.length,
        ...values
      };

      if (!activeModuleId) {
        message.warning('Vui lòng chọn chương để thêm nội dung');
        return;
      }

      if (editingItem) {
        updateModuleContent(activeModuleId, editingItem.id, newItem);
      } else {
        addModuleContent(activeModuleId, newItem);
      }

      setIsModalOpen(false);
      setEditingItem(null);
      form.resetFields();
      message.success(`${selectedType} đã được ${editingItem ? 'cập nhật' : 'thêm'} thành công!`);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  }, [form, selectedType, editingItem, activeModuleId, addModuleContent, updateModuleContent, getModuleItems]);

  // Handle quiz creation from QuizBuilder
  const handleQuizSave = useCallback((questions: QuizQuestion[], settings: QuizSettings) => {
    const newQuiz: CourseContentItem = {
      id: Date.now().toString(),
      type: ContentType.QUIZ,
      title: `Bài kiểm tra ${(() => {
        if (!activeModuleId) return 1;
        const items = getModuleItems(activeModuleId);
        return items.filter((i: CourseContentItem) => i.type === ContentType.QUIZ).length + 1;
      })()}`,
      description: `Bài kiểm tra gồm ${questions.length} câu hỏi`,
      quiz: { questions, ...settings },
      order: activeModuleId ? getModuleItems(activeModuleId).length : 0,
      duration: settings.timeLimit || 30
    };

    if (!activeModuleId) {
      message.warning('Vui lòng chọn chương để thêm nội dung');
      return;
    }
    const items = getModuleItems(activeModuleId);
    const next = [...items, newQuiz];
    setModuleContent(activeModuleId, next);
    setIsQuizBuilderOpen(false);
    setSelectedType(null);
    message.success('Bài kiểm tra đã được tạo thành công!');
  }, [activeModuleId, getModuleItems, setModuleContent]);

  // Handle quiz builder cancel
  const handleQuizCancel = useCallback(() => {
    setIsQuizBuilderOpen(false);
    setSelectedType(null);
  }, []);

  // Handle content deletion
  const handleDeleteContent = useCallback((moduleId: string, itemId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa nội dung này?',
      onOk: () => {
        removeModuleContent(moduleId, itemId);
        message.success('Đã xóa nội dung thành công!');
      }
    });
  }, [removeModuleContent]);

  // Handle content editing
  const handleEditContent = useCallback((moduleId: string, item: CourseContentItem) => {
    setEditingItem(item);
    setSelectedType(item.type as ContentType);
    setIsModalOpen(true);
    setActiveModuleId(moduleId);
    form.setFieldsValue(item);
  }, [form]);

  // Render content type selector
  const renderContentTypeSelector = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {contentTypes.map((type, index) => {
        const IconComponent = type.icon;
        return (
          <FadeInUp key={type.type} delay={index * 100}>
            <div
              onClick={() => handleTypeSelection(type.type)}
              className={`
                group relative overflow-hidden rounded-xl border-2 transition-all duration-300 h-56
                cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1
                ${selectedType === type.type 
                  ? `${type.borderColor} shadow-xl scale-[1.02] -translate-y-1 ${type.lightBg} ${type.darkBg}` 
                  : `border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:${type.borderColor}`
                }
              `}
            >
              {/* Background gradient overlay on selection */}
              {selectedType === type.type && (
                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-5`} />
              )}
              
              <div className="relative flex flex-col items-center justify-center h-full text-center p-6">
                {/* Enhanced icon with better colors and effects */}
                <div className={`
                  inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4
                  bg-gradient-to-br ${type.gradient} text-white shadow-lg
                  group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                  ring-4 ring-white/20
                `}>
                  <IconComponent className="text-3xl drop-shadow-sm" />
                </div>
                
                {/* Enhanced title with color coding */}
                <h3 className={`
                  text-lg font-bold mb-2 line-clamp-1 transition-colors duration-300
                  ${selectedType === type.type 
                    ? `text-${type.gradient.split('-')[1]}-700 dark:text-${type.gradient.split('-')[1]}-300`
                    : 'text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white'
                  }
                `}>
                  {type.title}
                </h3>
                
                {/* Enhanced description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  {type.description}
                </p>
                
                {/* Enhanced call-to-action */}
                <div className={`
                  opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0
                  ${selectedType === type.type ? 'opacity-100 translate-y-0' : ''}
                `}>
                                                      <div className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                    bg-gradient-to-r ${type.gradient} text-white shadow-md
                    hover:shadow-lg transition-shadow duration-300 whitespace-nowrap
                  `}>
                    <FaPlus className="text-xs" />
                    <span>Thêm ngay</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>
        );
      })}
    </div>
  );

  // Sortable content item component
  const SortableContentItem: FC<{ item: CourseContentItem; moduleId: string }> = ({ item, moduleId }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: item.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const typeConfig = contentTypes.find(t => t.type === item.type);
    const IconComponent = typeConfig?.icon || FaFile;

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`
          group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
          p-6 mb-4 transition-all duration-300 hover:shadow-md
          ${isDragging ? 'shadow-2xl opacity-80 scale-105' : ''}
        `}
      >
        <div className="flex items-start gap-4">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 cursor-grab active:cursor-grabbing mt-1 group/handle relative"
          >
            <FaGripVertical className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl" />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/handle:opacity-100 text-xs text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 rounded shadow-sm">Kéo để sắp xếp</span>
          </div>

          {/* Content icon */}
          <div className={`
            flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${typeConfig?.gradient}
            flex items-center justify-center text-white
          `}>
            <IconComponent className="text-lg" />
          </div>

          {/* Content details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                {item.title}
              </h4>
              <div className="flex items-center gap-2 ml-4">
                {item.duration && (
                  <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <FaClock className="text-xs" />
                    {item.duration} phút
                  </span>
                )}
              </div>
            </div>

            {item.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
            )}

            <div className="flex items-center gap-2">
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${typeConfig?.color} text-white
              `}>
                {typeConfig?.title}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => handleEditContent(moduleId, item)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
              title="Chỉnh sửa"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDeleteContent(moduleId, item.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
              title="Xóa"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render modal content based on type
  const renderModalContent = () => {
    const typeConfig = contentTypes.find(t => t.type === selectedType);
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`
            inline-flex items-center justify-center w-16 h-16 rounded-full mb-4
            bg-gradient-to-br ${typeConfig?.gradient} text-white
          `}>
            {typeConfig?.icon && <typeConfig.icon className="text-2xl" />}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {editingItem ? 'Chỉnh sửa' : 'Thêm'} {typeConfig?.title}
          </h3>
        </div>

        {/* Common fields */}
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
        >
          <Input placeholder="Nhập tiêu đề nội dung..." size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <Input.TextArea 
            placeholder="Mô tả chi tiết về nội dung này..."
            rows={3}
            showCount
            maxLength={500}
          />
        </Form.Item>

        {/* Type-specific fields */}
        {selectedType === ContentType.VIDEO && (
          <>
            <Form.Item
              name="duration"
              label="Thời lượng (phút)"
              rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}
            >
              <InputNumber 
                placeholder="30"
                min={1}
                max={480}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>
            
            <Form.Item label="Upload Video">
              <Upload.Dragger
                name="video"
                accept="video/*"
                maxCount={1}
                className="hover:border-blue-400 transition-colors duration-200"
              >
                <p className="ant-upload-drag-icon">
                  <FaUpload className="text-4xl text-blue-500" />
                </p>
                <p className="ant-upload-text text-lg font-medium">
                  Kéo thả video vào đây hoặc click để chọn
                </p>
                <p className="ant-upload-hint text-gray-500">
                  Hỗ trợ: MP4, MOV, AVI (tối đa 2GB)
                </p>
              </Upload.Dragger>
            </Form.Item>
          </>
        )}

        {selectedType === ContentType.FILE && (
          <Form.Item label="Upload File">
            <Upload.Dragger
              name="file"
              multiple
              className="hover:border-blue-400 transition-colors duration-200"
            >
              <p className="ant-upload-drag-icon">
                <FaFile className="text-4xl text-purple-500" />
              </p>
              <p className="ant-upload-text text-lg font-medium">
                Kéo thả file vào đây hoặc click để chọn
              </p>
              <p className="ant-upload-hint text-gray-500">
                Hỗ trợ: PDF, DOC, PPT, XLS, TXT, ZIP
              </p>
            </Upload.Dragger>
          </Form.Item>
        )}



        {selectedType === ContentType.QUESTION && (
          <Form.Item
            name="question"
            label="Câu hỏi thảo luận"
            rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}
          >
            <Input.TextArea 
              placeholder="Đặt một câu hỏi để học viên thảo luận..."
              rows={4}
              showCount
              maxLength={1000}
            />
          </Form.Item>
        )}
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
        }
      }}
    >
      <FadeInUp>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Nội dung khóa học</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Thêm video, quiz, và tài liệu để hoàn thiện khóa học của bạn.</p>
            </div>
        </div>

        {/* Modules Collapse */}
        <div className="space-y-4">
            {curriculum.modules.map((module) => {
                const items = getModuleItems(module.id);
                return (
                    <div key={module.id} className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-sm">
                        <div className="p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{module.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} nội dung</p>
                            </div>
                            <Button icon={<FaPlus />} onClick={() => { setActiveModuleId(module.id); setIsModalOpen(true); setSelectedType(null); }}>
                                Thêm nội dung
                            </Button>
                        </div>
                        <div className="px-4 pb-4">
                            {items.length > 0 ? (
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, module.id)}>
                                    <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-2">
                                            {items.sort((a,b)=>a.order-b.order).map((it) => (
                                                <SortableContentItem key={it.id} item={it} moduleId={module.id} />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md">
                                    <p className="text-gray-500 dark:text-gray-400">Chưa có nội dung nào. Bấm &quot;Thêm nội dung&quot; để bắt đầu.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button icon={<FaArrowLeft />} onClick={() => {
                const container = document.getElementById('create-course-content');
                if (container) {
                    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                setCurrentStep(1);
            }} size="large">Quay lại</Button>
            <Button type="primary" icon={<FaArrowRight />} onClick={() => {
                const container = document.getElementById('create-course-content');
                if (container) {
                    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                setCurrentStep(3);
            }} size="large" disabled={totalContentCount === 0}>
                Tiếp theo: Giá & Khuyến mãi
            </Button>
        </div>

        {/* Modal for adding/editing content */}
        <Modal
          title={editingItem ? 'Chỉnh sửa nội dung' : 'Thêm nội dung mới'}
          open={isModalOpen}
          onCancel={() => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); setSelectedType(null); }}
          footer={null}
          width={selectedType ? 600 : 800}
          destroyOnHidden
        >
            {!selectedType ? (
                <div className="p-4">
                    <h3 className="text-center text-lg font-semibold mb-6">Chọn loại nội dung bạn muốn thêm</h3>
                    {renderContentTypeSelector()}
                </div>
            ) : (
                <Form form={form} layout="vertical" onFinish={handleSubmitContent}>
                    {renderModalContent()}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button onClick={() => { setIsModalOpen(false); setEditingItem(null); form.resetFields(); setSelectedType(null); }}>Hủy</Button>
                        <Button type="primary" htmlType="submit">{editingItem ? 'Cập nhật' : 'Thêm nội dung'}</Button>
                    </div>
                </Form>
            )}
        </Modal>

        {/* Quiz Builder Modal */}
        <Modal
          title="Tạo Bài Kiểm Tra"
          open={isQuizBuilderOpen}
          onCancel={handleQuizCancel}
          footer={null}
          width={900}
          destroyOnHidden
        >
          <QuizBuilder onSave={handleQuizSave} onCancel={handleQuizCancel} />
        </Modal>
      </FadeInUp>
    </ConfigProvider>
  );
};

export default CourseContent;
