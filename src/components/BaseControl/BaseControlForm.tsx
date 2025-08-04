// src/components/BaseControl/FormWrapper.tsx
"use client";
import React from 'react';
import { Form, FormInstance } from 'antd';

export interface BaseControlFormProps {
  form: FormInstance;
  layout?: 'horizontal' | 'vertical' | 'inline';
  children: React.ReactNode;
  /** Giới hạn chiều rộng tối đa (px hoặc %) */
  maxWidth?: number | string;
}

const BaseControlForm: React.FC<BaseControlFormProps> = ({
  form,
  layout = 'vertical',
  children,
  maxWidth = '80%',
}) => (
  <div style={{ maxWidth, margin: '0 auto' }}>
    <Form form={form} layout={layout}>
      {children}
    </Form>
  </div>
);

export default BaseControlForm;
