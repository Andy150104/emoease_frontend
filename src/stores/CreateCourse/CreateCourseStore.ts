import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface CourseInformation {
    title: string;
    description: string;
    detailedDescription: string;
    learningObjectives: string;
    targetAudience: string;
    level: string;
    category: string;
    coverImage?: File;
}

export interface CurriculumModule {
    id: string;
    title: string;
    description: string;
    duration: number; // in minutes
    learningObjectives: string[];
    isExpanded?: boolean;
    isOptional?: boolean;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Curriculum {
    modules: CurriculumModule[];
}

export interface CreateCourseState {
    currentStep: number;
    courseInformation: CourseInformation;
    curriculum: Curriculum;
    pricing: Pricing;
    contentItems: CourseContentItem[];
    contentByModule: Record<string, CourseContentItem[]>;
    isLoading: boolean;
    errors: Record<string, string>;
}

export interface CreateCourseActions {
    setCurrentStep: (step: number) => void;
    updateCourseInformation: (data: Partial<CourseInformation>) => void;
    updateCurriculum: (data: Partial<Curriculum>) => void;
    updatePricing: (data: Partial<Pricing>) => void;
    setContentItems: (items: CourseContentItem[]) => void;
    setModuleContent: (moduleId: string, items: CourseContentItem[]) => void;
    addModuleContent: (moduleId: string, item: CourseContentItem) => void;
    updateModuleContent: (moduleId: string, itemId: string, data: Partial<CourseContentItem>) => void;
    removeModuleContent: (moduleId: string, itemId: string) => void;
    addModule: (module: Omit<CurriculumModule, 'id'>) => void;
    updateModule: (id: string, data: Partial<CurriculumModule>) => void;
    removeModule: (id: string) => void;
    toggleModuleExpansion: (id: string) => void;
    reorderModules: (startIndex: number, endIndex: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (field: string, error: string) => void;
    clearError: (field: string) => void;
    clearAllErrors: () => void;
    resetForm: () => void;
}

export type CreateCourseStore = CreateCourseState & CreateCourseActions;

export interface Pricing {
    basePrice: number;
    discountPrice?: number;
    discountStartDate?: string; // ISO string
    discountEndDate?: string;   // ISO string
    maxDiscountQuantity?: number;
    privateCouponCode?: string;
    publicPromoMessage?: string;
    packageId?: string;
    valueNote?: string;
    showStrikethroughOriginal?: boolean;
}

export interface CourseContentItem {
    id: string;
    type: string;
    title: string;
    description?: string;
    duration?: number;
    file?: File;
    url?: string;
    quiz?: unknown;
    metadata?: Record<string, unknown>;
    order: number;
}

const defaultInitialState: CreateCourseState = {
    currentStep: 0,
    courseInformation: {
        title: '',
        description: '',
        detailedDescription: '',
        learningObjectives: '',
        targetAudience: '',
        level: 'Người mới',
        category: 'Lập trình Java',
    },
    curriculum: {
        modules: [],
    },
    pricing: {
        basePrice: 0,
        discountPrice: undefined,
        discountStartDate: undefined,
        discountEndDate: undefined,
        maxDiscountQuantity: undefined,
        privateCouponCode: '',
        publicPromoMessage: '',
        packageId: undefined,
        valueNote: '',
        showStrikethroughOriginal: true,
    },
    contentItems: [],
    contentByModule: {},
    isLoading: false,
    errors: {},
};

export const useCreateCourseStore = create<CreateCourseStore>()(
    devtools(
        (set) => ({
            ...defaultInitialState,
            setCurrentStep: (step) => set({ currentStep: step }, false, 'setCurrentStep'),
            updateCourseInformation: (data) =>
                set(
                    (state) => ({ courseInformation: { ...state.courseInformation, ...data } }),
                    false,
                    'updateCourseInformation'
                ),
            updateCurriculum: (data) =>
                set(
                    (state) => ({ curriculum: { ...state.curriculum, ...data } }),
                    false,
                    'updateCurriculum'
                ),
            updatePricing: (data) =>
                set(
                    (state) => ({ pricing: { ...state.pricing, ...data } }),
                    false,
                    'updatePricing'
                ),
            setContentItems: (items) =>
                set(
                    () => ({ contentItems: items }),
                    false,
                    'setContentItems'
                ),
            setModuleContent: (moduleId, items) =>
                set(
                    (state) => ({ contentByModule: { ...state.contentByModule, [moduleId]: items } }),
                    false,
                    'setModuleContent'
                ),
            addModuleContent: (moduleId, item) =>
                set(
                    (state) => ({
                        contentByModule: {
                            ...state.contentByModule,
                            [moduleId]: [ ...(state.contentByModule[moduleId] || []), item ]
                        }
                    }),
                    false,
                    'addModuleContent'
                ),
            updateModuleContent: (moduleId, itemId, data) =>
                set(
                    (state) => ({
                        contentByModule: {
                            ...state.contentByModule,
                            [moduleId]: (state.contentByModule[moduleId] || []).map(item => item.id === itemId ? { ...item, ...data } : item)
                        }
                    }),
                    false,
                    'updateModuleContent'
                ),
            removeModuleContent: (moduleId, itemId) =>
                set(
                    (state) => ({
                        contentByModule: {
                            ...state.contentByModule,
                            [moduleId]: (state.contentByModule[moduleId] || []).filter(item => item.id !== itemId)
                        }
                    }),
                    false,
                    'removeModuleContent'
                ),
            addModule: (module) =>
                set(
                    (state) => ({
                        curriculum: {
                            ...state.curriculum,
                            modules: [
                                ...state.curriculum.modules,
                                { ...module, id: Date.now().toString(), isExpanded: true }
                            ]
                        }
                    }),
                    false,
                    'addModule'
                ),
            updateModule: (id, data) =>
                set(
                    (state) => ({
                        curriculum: {
                            ...state.curriculum,
                            modules: state.curriculum.modules.map(module =>
                                module.id === id ? { ...module, ...data } : module
                            )
                        }
                    }),
                    false,
                    'updateModule'
                ),
            removeModule: (id) =>
                set(
                    (state) => ({
                        curriculum: {
                            ...state.curriculum,
                            modules: state.curriculum.modules.filter(module => module.id !== id)
                        }
                    }),
                    false,
                    'removeModule'
                ),
            toggleModuleExpansion: (id) =>
                set(
                    (state) => ({
                        curriculum: {
                            ...state.curriculum,
                            modules: state.curriculum.modules.map(module =>
                                module.id === id ? { ...module, isExpanded: !module.isExpanded } : module
                            )
                        }
                    }),
                    false,
                    'toggleModuleExpansion'
                ),
            reorderModules: (startIndex, endIndex) =>
                set(
                    (state) => {
                        const modules = [...state.curriculum.modules];
                        const [removed] = modules.splice(startIndex, 1);
                        modules.splice(endIndex, 0, removed);
                        return {
                            curriculum: {
                                ...state.curriculum,
                                modules
                            }
                        };
                    },
                    false,
                    'reorderModules'
                ),
            setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),
            setError: (field, error) =>
                set(
                    (state) => ({ errors: { ...state.errors, [field]: error } }),
                    false,
                    'setError'
                ),
            clearError: (field) =>
                set(
                    (state) => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { [field]: _unused, ...rest } = state.errors;
                        return { errors: rest };
                    },
                    false,
                    'clearError'
                ),
            clearAllErrors: () => set({ errors: {} }, false, 'clearAllErrors'),
            resetForm: () => set({ ...defaultInitialState }, false, 'resetForm'),
        }),
        { name: 'CreateCourseStore' }
    )
);

