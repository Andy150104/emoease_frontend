'use client';
import { FC, useEffect, useRef } from 'react';
import { StepTransition } from 'EmoEase/components/Animation/StepTransition';
import CreateCourseLayout from './components/CreateCourseLayout';
import CreateCourseProvider from './components/CreateCourseProvider';
import CourseInformation from './components/CourseInformation';
import Curriculum from './components/Curriculum';
import CourseContent from './components/CourseContent';
import Pricing from './components/Pricing';
import { useCreateCourseStore } from 'EmoEase/stores/CreateCourse/CreateCourseStore';
import { Form } from 'antd';

const CreateCoursePageContent: FC = () => {
    const { currentStep, courseInformation } = useCreateCourseStore();
    const [form] = Form.useForm();
    const prevStepRef = useRef(currentStep);

    // Auto scroll to top when step changes
    useEffect(() => {
        if (prevStepRef.current !== currentStep) {
            const container = document.getElementById('create-course-content');
            // Heuristic: if previous focus was near bottom, scroll to top; otherwise to container
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
                return <div>Step not found</div>;
        }
    };

    return (
        <CreateCourseLayout>
            <div className="min-h-screen">
                <Form form={form} layout="vertical" initialValues={courseInformation}>
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

