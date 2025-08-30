'use client';
import { FC, useEffect, useRef } from 'react';
import { StepTransition } from 'EmoEase/components/Animation/StepTransition';
import { Form } from 'antd';

// Layout and Provider
import CreateCourseLayout from './components/common/CreateCourseLayout';
import CreateCourseProvider from './components/common/CreateCourseProvider';

// Step Components
import CourseInformation from './components/steps/CourseInformation';
import Curriculum from './components/steps/Curriculum';
import CourseContent from './components/steps/CourseContent';
import Pricing from './components/steps/Pricing';

// Store
import { useCreateCourseStore } from 'EmoEase/stores/CreateCourse/CreateCourseStore';

// Constants
import { COURSE_CREATION_STEPS } from './constants/steps';

const CreateCoursePageContent: FC = () => {
    const { currentStep, courseInformation } = useCreateCourseStore();
    const [form] = Form.useForm();
    const prevStepRef = useRef(currentStep);

    // Auto scroll to top when step changes
    useEffect(() => {
        if (prevStepRef.current !== currentStep) {
            const container = document.getElementById('create-course-content');
            
            const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
            const toContainer = () => container?.scrollIntoView({ behavior: 'smooth', block: 'start' });

            const active = document.activeElement as HTMLElement | null;
            const viewportH = window.innerHeight;
            const activeBottom = active ? active.getBoundingClientRect().bottom : 0;
            
            if (activeBottom > viewportH * 0.7) {
                toTop();
            } else {
                toContainer();
            }

            prevStepRef.current = currentStep;
        }
    }, [currentStep]);

    const renderStep = () => {
        const currentStepData = COURSE_CREATION_STEPS[currentStep];
        
        if (!currentStepData) {
            return <div className="text-center py-8">Step not found</div>;
        }

        switch (currentStep) {
            case 0:
                return <CourseInformation />;
            case 1:
                return <Curriculum />;
            case 2:
                return <CourseContent />;
            case 3:
                return <Pricing />;
            default:
                return <div className="text-center py-8">Step not found</div>;
        }
    };

    return (
        <CreateCourseLayout>
            <div className="min-h-screen">
                <Form 
                    form={form} 
                    layout="vertical" 
                    initialValues={courseInformation}
                    className="space-y-6"
                >
                    <StepTransition item={currentStep}>
                        {renderStep()}
                    </StepTransition>
                </Form>
            </div>
        </CreateCourseLayout>
    );
};

const CreateCoursePage: FC = () => {
    return (
        <CreateCourseProvider>
            <CreateCoursePageContent />
        </CreateCourseProvider>
    );
};

export default CreateCoursePage;

