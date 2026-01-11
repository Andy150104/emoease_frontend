import { CourseFormData } from '../types';
import { Curriculum, Pricing, CourseContentItem } from 'EmoEase/stores/CreateCourse/CreateCourseStore';

export const validateCourseInformation = (data: Partial<CourseFormData>): string[] => {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length === 0) {
        errors.push('Tên khóa học là bắt buộc');
    }

    if (data.title && data.title.length > 100) {
        errors.push('Tên khóa học không được vượt quá 100 ký tự');
    }

    if (!data.description || data.description.trim().length === 0) {
        errors.push('Mô tả ngắn là bắt buộc');
    }

    if (data.description && data.description.length > 200) {
        errors.push('Mô tả ngắn không được vượt quá 200 ký tự');
    }

    if (!data.detailedDescription || data.detailedDescription.trim().length === 0) {
        errors.push('Mô tả chi tiết là bắt buộc');
    }

    if (data.detailedDescription && data.detailedDescription.length > 2000) {
        errors.push('Mô tả chi tiết không được vượt quá 2000 ký tự');
    }

    if (!data.learningObjectives || data.learningObjectives.length === 0) {
        errors.push('Mục tiêu học tập là bắt buộc');
    }

    if (!data.targetAudience || data.targetAudience.length === 0) {
        errors.push('Đối tượng học viên là bắt buộc');
    }

    if (!data.requirements || data.requirements.length === 0) {
        errors.push('Yêu cầu khóa học là bắt buộc');
    }

    if (!data.level) {
        errors.push('Trình độ là bắt buộc');
    }

    if (!data.category) {
        errors.push('Danh mục công nghệ là bắt buộc');
    }

    if (!data.coverImage) {
        errors.push('Ảnh bìa khóa học là bắt buộc');
    }

    return errors;
};

export const validateCurriculum = (data: Partial<Curriculum>): string[] => {
    const errors: string[] = [];

    if (!data.modules || data.modules.length === 0) {
        errors.push('Khóa học phải có ít nhất một chương');
    }

    if (data.modules) {
        data.modules.forEach((module, index: number) => {
            if (!module.title || module.title.trim().length === 0) {
                errors.push(`Chương ${index + 1}: Tiêu đề là bắt buộc`);
            }
        });
    }

    return errors;
};

export const validateCourseContent = (data: Record<string, CourseContentItem[]>): string[] => {
    const errors: string[] = [];
    const totalContent = Object.values(data).reduce((acc, val) => acc + val.length, 0);

    if (totalContent === 0) {
        errors.push('Khóa học phải có ít nhất một nội dung');
    }

    return errors;
};

export const validatePricing = (data: Partial<Pricing>): string[] => {
    const errors: string[] = [];

    if (data.basePrice === undefined || data.basePrice === null) {
        errors.push('Giá khóa học là bắt buộc');
    }

    if (data.basePrice !== undefined && data.basePrice !== null && data.basePrice <= 0) {
        errors.push('Giá khóa học phải lớn hơn 0');
    }

    return errors;
};

export const isStepValid = (step: number, data: Partial<CourseFormData> | Partial<Curriculum> | Record<string, CourseContentItem[]> | Partial<Pricing>): boolean => {
    switch (step) {
        case 0:
            return validateCourseInformation(data as Partial<CourseFormData>).length === 0;
        case 1:
            return validateCurriculum(data as Partial<Curriculum>).length === 0;
        case 2:
            return validateCourseContent(data as Record<string, CourseContentItem[]>).length === 0;
        case 3:
            return validatePricing(data as Partial<Pricing>).length === 0;
        default:
            return true;
    }
};
