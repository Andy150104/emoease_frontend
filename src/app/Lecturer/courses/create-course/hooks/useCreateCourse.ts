import { useState, useCallback, useEffect } from 'react';
import { useCreateCourseStore } from 'EmoEase/stores/CreateCourse/CreateCourseStore';
import { CourseFormData } from '../types';
import { isStepValid } from '../utils/validation';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from '../utils/autoSave';

export const useCreateCourse = () => {
    const { currentStep, setCurrentStep, courseInformation, updateCourseInformation } = useCreateCourseStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // Load saved data on mount
    useEffect(() => {
        const savedData = loadFromLocalStorage();
        if (savedData) {
            updateCourseInformation(savedData);
        }
    }, [updateCourseInformation]);

    // Auto-save when data changes
    const handleDataChange = useCallback((data: Partial<CourseFormData>) => {
        updateCourseInformation(data);
        saveToLocalStorage(data, 'courseInformation');
    }, [updateCourseInformation]);

    // Navigate to next step
    const goToNextStep = useCallback(() => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    }, [currentStep, setCurrentStep]);

    // Navigate to previous step
    const goToPreviousStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }, [currentStep, setCurrentStep]);

    // Go to specific step
    const goToStep = useCallback((step: number) => {
        if (step >= 0 && step <= 4) {
            setCurrentStep(step);
        }
    }, [setCurrentStep]);

    // Validate current step
    const validateCurrentStep = useCallback(() => {
        let currentData: Partial<CourseFormData>;
        let validationFunction: (data: Partial<CourseFormData>) => string[];

        switch (currentStep) {
            case 0:
                currentData = courseInformation;
                validationFunction = (data) => {
                    const errors: string[] = [];
                    if (!data.title || data.title.trim().length === 0) {
                        errors.push('Tên khóa học là bắt buộc');
                    }
                    if (!data.description || data.description.trim().length === 0) {
                        errors.push('Mô tả ngắn là bắt buộc');
                    }
                    if (!data.coverImage) {
                        errors.push('Ảnh bìa khóa học là bắt buộc');
                    }
                    return errors;
                };
                break;
            default:
                currentData = {};
                validationFunction = () => [];
        }

        const stepErrors = validationFunction(currentData);
        setErrors(stepErrors);
        return stepErrors.length === 0;
    }, [currentStep, courseInformation]);

    // Submit course
    const submitCourse = useCallback(async () => {
        setIsSubmitting(true);
        setErrors([]);

        try {
            // Validate all steps
            const allValid = isStepValid(currentStep, courseInformation);
            if (!allValid) {
                throw new Error('Vui lòng hoàn thành tất cả các bước bắt buộc');
            }

            // Clear saved data
            clearLocalStorage();

            // TODO: Submit to API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success
            return true;
        } catch (error) {
            setErrors([error instanceof Error ? error.message : 'Có lỗi xảy ra']);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [currentStep, courseInformation]);

    // Reset form
    const resetForm = useCallback(() => {
        updateCourseInformation({});
        clearLocalStorage();
        setCurrentStep(0);
        setErrors([]);
    }, [updateCourseInformation, setCurrentStep]);

    return {
        currentStep,
        courseInformation,
        isSubmitting,
        errors,
        handleDataChange,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        validateCurrentStep,
        submitCourse,
        resetForm,
    };
};
