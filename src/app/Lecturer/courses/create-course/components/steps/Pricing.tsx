'use client';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCreateCourseStore } from 'EmoEase/stores/CreateCourse/CreateCourseStore';
import { useTheme } from 'EmoEase/Provider/ThemeProvider';
import { Button, ConfigProvider, DatePicker, Form, Input, InputNumber, Select, Switch, theme, message } from 'antd';
import { FaArrowLeft, FaArrowRight, FaCheck, FaDollarSign, FaPercent, FaTicketAlt, FaBullhorn } from 'react-icons/fa';
import dayjs from 'dayjs';
import { FadeInUp } from 'EmoEase/components/Animation/FadeInUp';

const AUTO_SAVE_KEY = 'pricing_creation_draft';
const AUTO_SAVE_DELAY = 2000;

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const Pricing: FC = () => {
    const { isDarkMode } = useTheme();
    const { pricing, updatePricing, setCurrentStep } = useCreateCourseStore();
    const form = Form.useFormInstance();

    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialLoadRef = useRef(true);



    const saveToLocal = useCallback((values: any) => {
        try {
            const data = { ...values, timestamp: new Date().toISOString(), version: '1.0', formStep: 'pricing' };
            localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(data));
            setSaveStatus('saved');
            setLastSaved(new Date());
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch {
            setSaveStatus('error');
            message.error('Không thể lưu dữ liệu tự động');
            setTimeout(() => setSaveStatus('idle'), 5000);
        }
    }, []);

    const debouncedSave = useCallback((values: any) => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        if (isInitialLoadRef.current) return;
        setSaveStatus('saving');
        saveTimeoutRef.current = setTimeout(() => saveToLocal(values), AUTO_SAVE_DELAY);
    }, [saveToLocal]);

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
                    const { timestamp, version, formStep, ...data } = parsed;
                    if (data.discountStartDate) data.discountStartDate = dayjs(data.discountStartDate);
                    if (data.discountEndDate) data.discountEndDate = dayjs(data.discountEndDate);
                    form.setFieldsValue(data);
                    setLastSaved(new Date(parsed.timestamp));
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
        return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
    }, [form, pricing]);

    const onValuesChange = useCallback(() => {
        debouncedSave(form.getFieldsValue());
    }, [debouncedSave, form]);

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

    const parseCurrency = (v?: string) => (v ? Number(v.replace(/\D/g, '')) : 0);

    const header = useMemo(() => (
        <div className="bg-gradient-to-r from-white to-amber-50 dark:from-gray-800 dark:to-yellow-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">4</div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">Giá khóa học</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Thiết lập giá và các ưu đãi thanh toán</p>
                </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-3 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 h-3 rounded-full transition-all duration-500 shadow-sm" style={{ width: '80%' }}>
                    <div className="h-full bg-white/20 animate-pulse"></div>
                </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400"><span>Bước 4 của 5</span><span>80% hoàn thành</span></div>
        </div>
    ), []);

    const CONTROL_HEIGHT = 56;

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
                                parser={(v) => v!.replace(/\s?VND|,/g, '')}
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
                                <InputNumber className="w-full" min={0} addonAfter="VND" formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => v!.replace(/\s?VND|,/g, '')} placeholder="VD: 299,000" size="large" />
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


