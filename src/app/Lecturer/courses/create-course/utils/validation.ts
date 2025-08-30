import { CourseFormData } from '../types';

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

    if (!data.learningObjectives || data.learningObjectives.trim().length === 0) {
        errors.push('Mục tiêu học tập là bắt buộc');
    }

    if (!data.targetAudience || data.targetAudience.trim().length === 0) {
        errors.push('Đối tượng học viên là bắt buộc');
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

export const validateCurriculum = (data: any): string[] => {
    const errors: string[] = [];

    if (!data.sections || data.sections.length === 0) {
        errors.push('Khóa học phải có ít nhất một section');
    }

    if (data.sections) {
        data.sections.forEach((section: any, index: number) => {
            if (!section.title || section.title.trim().length === 0) {
                errors.push(`Section ${index + 1}: Tiêu đề là bắt buộc`);
            }

            if (!section.lessons || section.lessons.length === 0) {
                errors.push(`Section ${index + 1}: Phải có ít nhất một bài giảng`);
            }
        });
    }

    return errors;
};

export const validateCourseContent = (data: any): string[] => {
    const errors: string[] = [];

    if (!data.lessons || data.lessons.length === 0) {
        errors.push('Khóa học phải có ít nhất một bài giảng');
    }

    if (data.lessons) {
        data.lessons.forEach((lesson: any, index: number) => {
            if (!lesson.title || lesson.title.trim().length === 0) {
                errors.push(`Bài giảng ${index + 1}: Tiêu đề là bắt buộc`);
            }

            if (!lesson.content || lesson.content.trim().length === 0) {
                errors.push(`Bài giảng ${index + 1}: Nội dung là bắt buộc`);
            }
        });
    }

    return errors;
};

export const validatePricing = (data: any): string[] => {
    const errors: string[] = [];

    if (data.price === undefined || data.price === null) {
        errors.push('Giá khóa học là bắt buộc');
    }

    if (data.price !== undefined && data.price !== null && data.price < 0) {
        errors.push('Giá khóa học không được âm');
    }

    return errors;
};

export const isStepValid = (step: number, data: any): boolean => {
    switch (step) {
        case 0:
            return validateCourseInformation(data).length === 0;
        case 1:
            return validateCurriculum(data).length === 0;
        case 2:
            return validateCourseContent(data).length === 0;
        case 3:
            return validatePricing(data).length === 0;
        default:
            return true;
    }
};
