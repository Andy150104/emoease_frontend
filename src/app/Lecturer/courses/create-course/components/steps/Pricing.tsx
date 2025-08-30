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
    const [form] = Form.useForm();

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
                const { timestamp, version, formStep, ...data } = parsed;
                if (data.discountStartDate) data.discountStartDate = dayjs(data.discountStartDate);
                if (data.discountEndDate) data.discountEndDate = dayjs(data.discountEndDate);
                form.setFieldsValue(data);
                setLastSaved(new Date(parsed.timestamp));
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

    const onBack = () => setCurrentStep(2);
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
        <div className="space-y-6 max-w-5xl mx-auto px-4">
            <FadeInUp>{header}</FadeInUp>

            <ConfigProvider
                theme={{
                    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    token: {
                        colorText: isDarkMode ? '#FFFFFF' : '#000000',
                        colorTextPlaceholder: isDarkMode ? '#9CA3AF' : '#6B7280',
                        colorBgContainer: isDarkMode ? '#374151' : '#FFFFFF',
                        colorBorder: isDarkMode ? '#4B5563' : '#D1D5DB',
                        borderRadius: 10,
                        fontSize: 16,
                        fontSizeLG: 16,
                        controlHeight: 48,
                        controlHeightLG: 52,
                    },
                    components: {
                        Form: { labelColor: isDarkMode ? '#FFFFFF' : '#000000', labelFontSize: 13 },
                        Input: { controlHeightLG: 52 },
                        InputNumber: { controlHeightLG: 52 },
                        DatePicker: { controlHeightLG: 52 },
                        Select: { controlHeightLG: 52 },
                    },
                }}
            >
                <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
                    <FadeInUp delay={100}>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-xl flex items-center justify-center">
                                    <FaDollarSign />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Giá gốc (VND)</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Giá bán trước khi áp dụng ưu đãi</p>
                                </div>
                            </div>
                            <Form.Item name="basePrice" rules={[{ required: true, message: 'Vui lòng nhập giá gốc!' }]}> 
                                <InputNumber
                                    className="w-full"
                                    min={0}
                                    precision={0}
                                    addonAfter="₫"
                                    formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={parseCurrency as unknown as (displayValue: string | undefined) => number}
                                    placeholder="VD: 499000"
                                    size="large"
                                    style={{ height: CONTROL_HEIGHT, fontSize: 16 }}
                                />
                            </Form.Item>
                        </div>
                    </FadeInUp>

                    <FadeInUp delay={150}>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl flex items-center justify-center">
                                    <FaPercent />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Giảm giá (tùy chọn)</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Thiết lập giá giảm và thời gian áp dụng</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Form.Item name="discountPrice" label={<span className="text-sm">Giảm còn (VND)</span>}>
                                    <InputNumber
                                        className="w-full"
                                        min={0}
                                        precision={0}
                                        addonAfter="₫"
                                        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={parseCurrency as unknown as (displayValue: string | undefined) => number}
                                        placeholder="VD: 299000"
                                        size="large"
                                        style={{ height: CONTROL_HEIGHT, fontSize: 16 }}
                                    />
                                </Form.Item>
                                <Form.Item shouldUpdate noStyle>
                                    {() => (
                                        <Form.Item name="discountStartDate" label={<span className="text-sm">Bắt đầu</span>}>
                                            <DatePicker className="w-full" size="large" format="YYYY-MM-DD" style={{ height: CONTROL_HEIGHT }} disabled={!form.getFieldValue('discountPrice')} />
                                        </Form.Item>
                                    )}
                                </Form.Item>
                                <Form.Item shouldUpdate noStyle>
                                    {() => (
                                        <Form.Item name="discountEndDate" label={<span className="text-sm">Kết thúc</span>}>
                                            <DatePicker className="w-full" size="large" format="YYYY-MM-DD" style={{ height: CONTROL_HEIGHT }} disabled={!form.getFieldValue('discountPrice')} />
                                        </Form.Item>
                                    )}
                                </Form.Item>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Item name="maxDiscountQuantity" label={<span className="text-sm">Số lượt ưu đãi tối đa</span>}>
                                    <InputNumber className="w-full" min={1} precision={0} placeholder="VD: 100" style={{ height: CONTROL_HEIGHT, fontSize: 16 }} disabled={!form.getFieldValue('discountPrice')} />
                                </Form.Item>
                                <Form.Item name="showStrikethroughOriginal" label={<span className="text-sm">Hiển thị gạch giá gốc khi giảm</span>} valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </div>
                        </div>
                    </FadeInUp>

                    <FadeInUp delay={200}>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl flex items-center justify-center">
                                    <FaTicketAlt />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Mã giảm giá riêng (tùy chọn)</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Học viên nhập mã này để nhận ưu đãi khi thanh toán</p>
                                </div>
                            </div>
                            <Form.Item name="privateCouponCode" label={<span className="text-sm">Mã giảm giá riêng (tùy chọn)</span>}>
                                <Input placeholder="VD: CODE30, VIP123..." size="large" style={{ height: CONTROL_HEIGHT }} />
                            </Form.Item>
                        </div>
                    </FadeInUp>

                    <FadeInUp delay={250}>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl flex items-center justify-center">
                                    <FaBullhorn />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Thông điệp ưu đãi (hiển thị công khai)</h3>
                                </div>
                            </div>
                            <Form.Item name="publicPromoMessage">
                                <Input placeholder="VD: Ưu đãi giá hơn hết tuần này!" size="large" />
                            </Form.Item>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Item name="packageId" label={<span className="text-sm">Gán khóa học vào gói / combo</span>}>
                                    <Select
                                        placeholder="Không chọn"
                                        options={[
                                            { label: 'Không chọn', value: undefined },
                                            { label: 'Combo Lập trình Web', value: 'web_combo' },
                                            { label: 'Gói Frontend nâng cao', value: 'fe_advanced' },
                                        ]}
                                        size="large"
                                        allowClear
                                        style={{ height: CONTROL_HEIGHT }}
                                    />
                                </Form.Item>
                                <Form.Item name="valueNote" label={<span className="text-sm">Ghi chú giá trị khóa học</span>}>
                                    <Input placeholder="VD: Khóa học trị giá hơn 5 triệu, nay chỉ còn..." size="large" style={{ height: CONTROL_HEIGHT }} />
                                </Form.Item>
                            </div>
                        </div>
                    </FadeInUp>

                    <FadeInUp delay={300}>
                        <div className="bg-gradient-to-r from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-xl flex items-center justify-center">
                                        <FaCheck />
                                    </div>
                                    <div className="text-gray-700 dark:text-gray-300">Bước 4 của 5: Thiết lập giá</div>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={onBack} className="inline-flex items-center gap-2 px-6 py-2.5 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all">
                                        <FaArrowLeft className="text-xs" />
                                        Quay lại
                                    </button>
                                    <button type="button" onClick={onNext} className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                                        Tiếp theo: Xuất bản
                                        <FaArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                </Form>
            </ConfigProvider>
        </div>
    );
};

export default Pricing;


