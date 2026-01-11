'use client';
import { FC, useEffect, useRef } from 'react';
import { useCreateCourseStore } from 'EmoEase/stores/CreateCourse/CreateCourseStore';
import { useTheme } from 'EmoEase/Provider/ThemeProvider';
import { Button, ConfigProvider, DatePicker, Form, Input, InputNumber, Switch, theme, message } from 'antd';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import dayjs from 'dayjs';
import { FadeInUp } from 'EmoEase/components/Animation/FadeInUp';

const AUTO_SAVE_KEY = 'pricing_creation_draft';




const Pricing: FC = () => {
    const { isDarkMode } = useTheme();
    const { pricing, updatePricing, setCurrentStep } = useCreateCourseStore();
    const form = Form.useFormInstance();



    const isInitialLoadRef = useRef(true);







    useEffect(() => {
        try {
            const saved = localStorage.getItem(AUTO_SAVE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                const savedTimestamp = new Date(parsed.timestamp);
                const now = new Date();
                const diffMinutes = (now.getTime() - savedTimestamp.getTime()) / (1000 * 60);

                if (diffMinutes > 10) {
                    localStorage.removeItem(AUTO_SAVE_KEY);
                    message.warning('Dữ liệu đã lưu đã quá 10 phút và đã bị xóa.');
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { timestamp, ...data } = parsed;
                    if (data.discountStartDate) data.discountStartDate = dayjs(data.discountStartDate);
                    if (data.discountEndDate) data.discountEndDate = dayjs(data.discountEndDate);
                    form.setFieldsValue(data);
                    message.success('Đã khôi phục dữ liệu đã lưu trước đó');
                }
            } else {
                form.setFieldsValue({
                    basePrice: pricing.basePrice || undefined,
                    discountPrice: pricing.discountPrice,
                    discountStartDate: pricing.discountStartDate ? dayjs(pricing.discountStartDate) : undefined,
                    discountEndDate: pricing.discountEndDate ? dayjs(pricing.discountEndDate) : undefined,
                    maxDiscountQuantity: pricing.maxDiscountQuantity,
                    privateCouponCode: pricing.privateCouponCode,
                    publicPromoMessage: pricing.publicPromoMessage,
                    packageId: pricing.packageId,
                    valueNote: pricing.valueNote,
                    showStrikethroughOriginal: pricing.showStrikethroughOriginal,
                });
            }
        } finally {
            setTimeout(() => { isInitialLoadRef.current = false; }, 100);
        }
    }, [form, pricing]);

    const onBack = () => {
        const container = document.getElementById('create-course-content');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setCurrentStep(2);
    };
    const onNext = async () => {
        try {
            const values = await form.validateFields();
            // Custom validations
            const base = Number(values.basePrice || 0);
            const discount = values.discountPrice != null ? Number(values.discountPrice) : undefined;
            if (discount != null && discount >= base) {
                message.error('Giảm còn phải nhỏ hơn Giá gốc');
                return;
            }
            if (values.discountStartDate && values.discountEndDate) {
                if (values.discountEndDate.isBefore(values.discountStartDate, 'day')) {
                    message.error('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu');
                    return;
                }
            }
            updatePricing({
                basePrice: values.basePrice,
                discountPrice: values.discountPrice,
                discountStartDate: values.discountStartDate ? values.discountStartDate.toISOString() : undefined,
                discountEndDate: values.discountEndDate ? values.discountEndDate.toISOString() : undefined,
                maxDiscountQuantity: values.maxDiscountQuantity,
                privateCouponCode: values.privateCouponCode || '',
                publicPromoMessage: values.publicPromoMessage || '',
                packageId: values.packageId,
                valueNote: values.valueNote || '',
                showStrikethroughOriginal: !!values.showStrikethroughOriginal,
            });
            localStorage.removeItem(AUTO_SAVE_KEY);
            const container = document.getElementById('create-course-content');
            if (container) {
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setCurrentStep(4);
        } catch {
            const errorField = document.querySelector('.ant-form-item-has-error');
            if (errorField) errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorText: isDarkMode ? "#E5E7EB" : "#1F2937",
                    colorTextPlaceholder: isDarkMode ? "#9CA3AF" : "#6B7280",
                    colorBgContainer: isDarkMode ? "#374151" : "#FFFFFF",
                    colorBorder: isDarkMode ? "#4B5563" : "#D1D5DB",
                },
            }}
        >
            <FadeInUp>
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Giá & Khuyến mãi</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Thiết lập giá và các chương trình ưu đãi cho khóa học của bạn.</p>
                    </div>
                </div>

                <div>
                    {/* Section 1: Base Price */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Giá gốc</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Giá bán chính thức của khóa học.</p>
                        <Form.Item name="basePrice" rules={[{ required: true, message: 'Vui lòng nhập giá gốc!' }]}>
                            <InputNumber
                                className="w-full"
                                min={0}
                                addonAfter="VND"
                                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                parser={(v) => Number(v!.replace(/\s?VND|,/g, '')) as any}
                                placeholder="VD: 500,000"
                                size="large"
                            />
                        </Form.Item>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700 my-8" />

                    {/* Section 2: Discount */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Chương trình giảm giá (Tùy chọn)</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Tạo ưu đãi hấp dẫn để thu hút học viên.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Form.Item name="discountPrice" label="Giảm còn (VND)">
                                <InputNumber className="w-full" min={0} addonAfter="VND" formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                parser={(v) => Number(v!.replace(/\s?VND|,/g, '')) as any} placeholder="VD: 299,000" size="large" />
                            </Form.Item>
                            <Form.Item name="discountStartDate" label="Ngày bắt đầu">
                                <DatePicker className="w-full" size="large" format="YYYY-MM-DD" />
                            </Form.Item>
                            <Form.Item name="discountEndDate" label="Ngày kết thúc">
                                <DatePicker className="w-full" size="large" format="YYYY-MM-DD" />
                            </Form.Item>
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700 my-8" />

                    {/* Section 3: Promotions */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Cài đặt khuyến mãi khác</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Tùy chỉnh cách hiển thị và các mã giảm giá riêng.</p>
                        <div className="space-y-6">
                            <Form.Item name="privateCouponCode" label="Mã giảm giá riêng">
                                <Input placeholder="VD: CODE2024" size="large" />
                            </Form.Item>
                            <Form.Item name="publicPromoMessage" label="Thông điệp ưu đãi công khai">
                                <Input placeholder="VD: Giảm 50% chỉ trong tuần này!" size="large" />
                            </Form.Item>
                            <Form.Item name="showStrikethroughOriginal" label="Hiển thị giá gốc bị gạch bỏ" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button icon={<FaArrowLeft />} onClick={onBack} size="large">Quay lại</Button>
                        <Button type="primary" icon={<FaArrowRight />} onClick={onNext} size="large">Tiếp theo: Xuất bản</Button>
                    </div>
                </div>
            </FadeInUp>
        </ConfigProvider>
    );
};

export default Pricing;


