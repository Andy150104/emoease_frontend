export interface CourseFormData {
    title?: string;
    subtitle?: string;
    description?: string;
    detailedDescription?: string;
    learningObjectives?: string;
    targetAudience?: string;
    prerequisites?: string;
    whatYouWillGet?: string;
    level?: string;
    category?: string;
    subcategory?: string;
    tags?: string[];
    language?: string;
    duration?: number;
    totalLectures?: number;
    totalQuizzes?: number;
    totalAssignments?: number;
    certificate?: boolean;
    lifetimeAccess?: boolean;
    mobileAccess?: boolean;
    offlineAccess?: boolean;
    coverImage?: File | string;
    promotionalVideo?: string;
    instructorBio?: string;
    instructorPhoto?: File | string;
    courseLanguage?: string;
    subtitleLanguage?: string;
    accessibility?: string[];
    skillLevel?: string;
    projectBased?: boolean;
    handsOnPractice?: boolean;
    communitySupport?: boolean;
    officeHours?: boolean;
    mentorship?: boolean;
    careerGuidance?: boolean;
    jobPlacement?: boolean;
    moneyBackGuarantee?: boolean;
    previewContent?: string;
    courseHighlights?: string[];
}

export interface CourseStep {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    isRequired: boolean;
}

export interface CreateCourseState {
    currentStep: number;
    courseInformation: Partial<CourseFormData>;
    curriculum: any;
    courseContent: any;
    pricing: any;
    isSubmitting: boolean;
    errors: string[];
}

export interface CreateCourseActions {
    setCurrentStep: (step: number) => void;
    updateCourseInformation: (data: Partial<CourseFormData>) => void;
    updateCurriculum: (data: any) => void;
    updateCourseContent: (data: any) => void;
    updatePricing: (data: any) => void;
    resetForm: () => void;
    submitCourse: () => Promise<void>;
}
