'use client';
import { useMemo } from 'react';
import { useCreateCourseStore } from 'EmoEase/stores/CreateCourse/CreateCourseStore';

export interface StepProgress {
  stepId: number;
  stepName: string;
  isCompleted: boolean;
  completionPercentage: number;
  requiredFields: string[];
  completedFields: string[];
  missingFields: string[];
  warnings: string[];
  estimatedTimeRemaining?: number;
}

export interface OverallProgress {
  totalPercentage: number;
  completedSteps: number;
  totalSteps: number;
  currentStepProgress: StepProgress;
  allStepsProgress: StepProgress[];
  canProceedToNext: boolean;
  estimatedTimeToComplete?: number;
}

export const useProgressTracking = () => {
  const { 
    courseInformation, 
    curriculum, 
    contentByModule, 
    pricing, 
    currentStep 
  } = useCreateCourseStore();

  const stepProgressCalculations = useMemo(() => {
    // Step 0: Course Information
    const courseInfoProgress = (): StepProgress => {
      const requiredFields = ['title', 'description', 'detailedDescription', 'learningObjectives', 'targetAudience', 'level', 'category', 'coverImage'];
      const completedFields: string[] = [];
      const warnings: string[] = [];

      // Check required fields
      if (courseInformation.title?.trim()) completedFields.push('title');
      if (courseInformation.description?.trim()) completedFields.push('description');
      if (courseInformation.detailedDescription?.trim()) completedFields.push('detailedDescription');
      if (courseInformation.learningObjectives?.trim()) completedFields.push('learningObjectives');
      if (courseInformation.targetAudience?.trim()) completedFields.push('targetAudience');
      if (courseInformation.level) completedFields.push('level');
      if (courseInformation.category) completedFields.push('category');
      if (courseInformation.coverImage) completedFields.push('coverImage');

      // Quality warnings
      if (courseInformation.title && courseInformation.title.length < 20) {
        warnings.push('Tiêu đề nên có ít nhất 20 ký tự để tối ưu SEO');
      }
      if (courseInformation.description && courseInformation.description.length < 50) {
        warnings.push('Mô tả ngắn nên có ít nhất 50 ký tự');
      }
      if (courseInformation.detailedDescription && courseInformation.detailedDescription.length < 200) {
        warnings.push('Mô tả chi tiết nên có ít nhất 200 ký tự để thu hút học viên');
      }

      const completionPercentage = (completedFields.length / requiredFields.length) * 100;
      const missingFields = requiredFields.filter(field => !completedFields.includes(field));

      return {
        stepId: 0,
        stepName: 'Thông tin khóa học',
        isCompleted: completedFields.length === requiredFields.length,
        completionPercentage,
        requiredFields,
        completedFields,
        missingFields,
        warnings,
        estimatedTimeRemaining: missingFields.length * 2 // 2 minutes per field
      };
    };

    // Step 1: Curriculum
    const curriculumProgress = (): StepProgress => {
      const requiredFields = ['modules'];
      const completedFields: string[] = [];
      const warnings: string[] = [];

      if (curriculum.modules.length > 0) {
        completedFields.push('modules');
      }

      // Quality checks
      if (curriculum.modules.length < 3) {
        warnings.push('Khóa học nên có ít nhất 3 chương để đảm bảo chất lượng');
      }

      const incompleteModules = curriculum.modules.filter(module => 
        !module.title?.trim() || 
        !module.description?.trim() || 
        module.duration === 0 ||
        module.learningObjectives.length === 0
      );

      if (incompleteModules.length > 0) {
        warnings.push(`${incompleteModules.length} chương chưa hoàn thiện thông tin`);
      }

      const totalDuration = curriculum.modules.reduce((sum, module) => sum + (module.duration || 0), 0);
      if (totalDuration < 60) {
        warnings.push('Tổng thời lượng khóa học nên ít nhất 60 phút');
      }

      const completionPercentage = curriculum.modules.length > 0 ? 
        ((curriculum.modules.length - incompleteModules.length) / curriculum.modules.length) * 100 : 0;

      return {
        stepId: 1,
        stepName: 'Giáo trình',
        isCompleted: curriculum.modules.length >= 2 && incompleteModules.length === 0,
        completionPercentage,
        requiredFields,
        completedFields,
        missingFields: completedFields.length === 0 ? ['modules'] : [],
        warnings,
        estimatedTimeRemaining: (curriculum.modules.length === 0 ? 15 : incompleteModules.length * 5)
      };
    };

    // Step 2: Course Content
    const contentProgress = (): StepProgress => {
      const requiredFields = ['moduleContent'];
      const completedFields: string[] = [];
      const warnings: string[] = [];

      const totalContent = Object.values(contentByModule).reduce((sum, moduleContent) => 
        sum + (Array.isArray(moduleContent) ? moduleContent.length : 0), 0
      );

      if (totalContent > 0) {
        completedFields.push('moduleContent');
      }

      // Quality checks
      const modulesWithoutContent = curriculum.modules.filter(module => 
        !contentByModule[module.id] || (contentByModule[module.id] as any[]).length === 0
      );

      if (modulesWithoutContent.length > 0) {
        warnings.push(`${modulesWithoutContent.length} chương chưa có nội dung`);
      }

      if (totalContent < curriculum.modules.length * 2) {
        warnings.push('Mỗi chương nên có ít nhất 2 nội dung (video, quiz, tài liệu)');
      }

      // Check for video content
      const hasVideo = Object.values(contentByModule).some(moduleContent => 
        Array.isArray(moduleContent) && moduleContent.some((content: any) => content.type === 'video')
      );

      if (!hasVideo) {
        warnings.push('Khóa học nên có ít nhất 1 video bài giảng');
      }

      const completionPercentage = curriculum.modules.length > 0 ? 
        ((curriculum.modules.length - modulesWithoutContent.length) / curriculum.modules.length) * 100 : 0;

      return {
        stepId: 2,
        stepName: 'Nội dung bài học',
        isCompleted: totalContent >= curriculum.modules.length && modulesWithoutContent.length === 0,
        completionPercentage,
        requiredFields,
        completedFields,
        missingFields: totalContent === 0 ? ['moduleContent'] : [],
        warnings,
        estimatedTimeRemaining: modulesWithoutContent.length * 10
      };
    };

    // Step 3: Pricing
    const pricingProgress = (): StepProgress => {
      const requiredFields = ['basePrice'];
      const completedFields: string[] = [];
      const warnings: string[] = [];

      if (pricing.basePrice && pricing.basePrice > 0) {
        completedFields.push('basePrice');
      }

      // Quality checks
      if (pricing.basePrice && pricing.basePrice < 50000) {
        warnings.push('Giá thấp có thể ảnh hưởng đến nhận thức chất lượng khóa học');
      }

      if (pricing.discountPrice && pricing.discountPrice >= pricing.basePrice) {
        warnings.push('Giá giảm phải nhỏ hơn giá gốc');
      }

      if (pricing.discountPrice && (!pricing.discountStartDate || !pricing.discountEndDate)) {
        warnings.push('Nên thiết lập thời gian cho chương trình giảm giá');
      }

      const completionPercentage = (completedFields.length / requiredFields.length) * 100;

      return {
        stepId: 3,
        stepName: 'Giá khóa học',
        isCompleted: completedFields.length === requiredFields.length,
        completionPercentage,
        requiredFields,
        completedFields,
        missingFields: requiredFields.filter(field => !completedFields.includes(field)),
        warnings,
        estimatedTimeRemaining: completedFields.length === 0 ? 5 : 0
      };
    };

    // Step 4: Course Analytics (placeholder)
    const courseAnalyticsProgress = (): StepProgress => {
      return {
        stepId: 4,
        stepName: 'Phân tích',
        isCompleted: false,
        completionPercentage: 0,
        requiredFields: [],
        completedFields: [],
        missingFields: [],
        warnings: [],
        estimatedTimeRemaining: 0
      };
    };

    // Step 5: Publish (placeholder)
    const publishProgress = (): StepProgress => {
      return {
        stepId: 5,
        stepName: 'Xuất bản',
        isCompleted: false,
        completionPercentage: 0,
        requiredFields: ['review'],
        completedFields: [],
        missingFields: ['review'],
        warnings: [],
        estimatedTimeRemaining: 5
      };
    };

    return [
      courseInfoProgress(),
      curriculumProgress(),
      contentProgress(),
      pricingProgress(),
      courseAnalyticsProgress(),
      publishProgress()
    ];
  }, [courseInformation, curriculum, contentByModule, pricing]);

  const overallProgress = useMemo((): OverallProgress => {
    const completedSteps = stepProgressCalculations.filter(step => step.isCompleted).length;
    const totalSteps = stepProgressCalculations.length;
    const totalPercentage = stepProgressCalculations.reduce((sum, step) => sum + step.completionPercentage, 0) / totalSteps;
    
    const currentStepProgress = stepProgressCalculations[currentStep] || stepProgressCalculations[0];
    const canProceedToNext = currentStepProgress.isCompleted || currentStepProgress.completionPercentage >= 80;
    
    const estimatedTimeToComplete = stepProgressCalculations.reduce((sum, step) => 
      sum + (step.estimatedTimeRemaining || 0), 0
    );

    return {
      totalPercentage,
      completedSteps,
      totalSteps,
      currentStepProgress,
      allStepsProgress: stepProgressCalculations,
      canProceedToNext,
      estimatedTimeToComplete
    };
  }, [stepProgressCalculations, currentStep]);

  return {
    overallProgress,
    stepProgress: stepProgressCalculations,
    currentStepProgress: overallProgress.currentStepProgress
  };
};
