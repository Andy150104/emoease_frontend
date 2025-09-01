'use client';
'use client';
import { FC } from 'react';
import { useCreateCourseStore } from 'EmoEase/stores/CreateCourse/CreateCourseStore';
import { Button, Modal, message } from 'antd';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';

const Publish: FC = () => {
  const { courseInformation, curriculum, pricing, contentByModule, setCurrentStep, resetForm } = useCreateCourseStore();

  const onBack = () => {
    const container = document.getElementById('create-course-content');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCurrentStep(3);
  };

  const handleConfirmSubmit = () => {
    const courseData = {
      courseInformation,
      curriculum,
      pricing,
      contentByModule,
    };

    // Mock submission
    console.log('Publishing course data:', courseData);
    message.success('Course published successfully!');

    // After successful submission, you might want to redirect the user or reset the form
    // resetForm();
    // setCurrentStep(0);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Publish Course</h2>

      {/* Course Information Preview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Course Information</h3>
        <p><strong>Title:</strong> {courseInformation.title}</p>
        <p><strong>Description:</strong> {courseInformation.description}</p>
        <p><strong>Detailed Description:</strong> {courseInformation.detailedDescription}</p>
        <p><strong>Learning Objectives:</strong> {courseInformation.learningObjectives}</p>
        <p><strong>Target Audience:</strong> {courseInformation.targetAudience}</p>
        <p><strong>Level:</strong> {courseInformation.level}</p>
        <p><strong>Category:</strong> {courseInformation.category}</p>
      </div>

      {/* Curriculum Preview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Curriculum</h3>
        {curriculum.modules.map((module) => (
          <div key={module.id} className="mb-4 p-2 border-b border-gray-200 dark:border-gray-700">
            <p><strong>Module:</strong> {module.title}</p>
            <p><strong>Description:</strong> {module.description}</p>
            <p><strong>Duration:</strong> {module.duration} minutes</p>
            <p><strong>Learning Objectives:</strong></p>
            <ul>
              {module.learningObjectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Course Content Preview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Course Content</h3>
        {Object.entries(contentByModule).map(([moduleId, items]) => (
          <div key={moduleId} className="mb-4">
            <h4>Module: {curriculum.modules.find(m => m.id === moduleId)?.title}</h4>
            {items.map(item => (
              <div key={item.id} className="p-2 border-b border-gray-200 dark:border-gray-700">
                <p><strong>Content:</strong> {item.title}</p>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pricing Preview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Pricing</h3>
        <p><strong>Base Price:</strong> {pricing.basePrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
        {pricing.discountPrice && <p><strong>Discount Price:</strong> {pricing.discountPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>}
        {pricing.discountStartDate && <p><strong>Discount Start Date:</strong> {new Date(pricing.discountStartDate).toLocaleDateString()}</p>}
        {pricing.discountEndDate && <p><strong>Discount End Date:</strong> {new Date(pricing.discountEndDate).toLocaleDateString()}</p>}
      </div>

      <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button icon={<FaArrowLeft />} onClick={onBack} size="large">Quay lại</Button>
        <Button type="primary" icon={<FaPaperPlane />} onClick={handleConfirmSubmit} size="large">Publish Course</Button>
      </div>
    </div>
  );
};

export default Publish;

