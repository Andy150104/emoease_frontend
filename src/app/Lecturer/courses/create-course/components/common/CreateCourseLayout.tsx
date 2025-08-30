'use client';
import { FadeInUp } from 'EmoEase/components/Animation/FadeInUp';
import CustomStepper from 'EmoEase/components/Stepper/BaseControlStepper';
import { useCreateCourseStore } from 'EmoEase/stores/CreateCourse/CreateCourseStore';
import { ConfigProvider, theme } from 'antd';
import { useTheme } from 'EmoEase/Provider/ThemeProvider';
import { FC, ReactNode } from 'react';

// Constants
import { COURSE_CREATION_STEPS } from '../../constants/steps';

interface CreateCourseLayoutProps {
    children: ReactNode;
}

const CreateCourseLayout: FC<CreateCourseLayoutProps> = ({ children }) => {
    const { currentStep } = useCreateCourseStore();
    const { isDarkMode } = useTheme();

    // Transform steps data for stepper component
    const stepperSteps = COURSE_CREATION_STEPS.map(step => ({
        title: step.title,
        description: step.description,
    }));

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
            <FadeInUp className="bg-transparent dark:bg-transparent w-full">
                <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
                    <h1 className="sticky top-0 z-10 text-3xl font-bold text-gray-900 dark:text-white mb-8 py-4 bg-gray-50 dark:bg-gray-900">
                        Tạo khóa học
                    </h1>
                    
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar with Stepper */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24">
                                <ConfigProvider 
                                    theme={{ 
                                        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm 
                                    }}
                                >
                                    <CustomStepper
                                        currentIndex={currentStep}
                                        direction='vertical'
                                        steps={stepperSteps}
                                    />
                                </ConfigProvider>
                            </div>
                        </div>
                        
                        {/* Main Content */}
                        <div 
                            id="create-course-content" 
                            className="w-full lg:w-2/3 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </FadeInUp>
        </div>
    );
};

export default CreateCourseLayout;

