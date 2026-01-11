"use client";
import React, { useState, useEffect } from 'react';
import { UploadFile } from 'antd';
import BaseControlUploadImage from './BaseControlUploadImage';
import { XmlColumn } from 'EmoEase/utils/xmlColumn';

interface ControlledImageUploaderProps {
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
  xmlColumn: XmlColumn; 
  maxCount?: number;
}

const ControlledImageUploader: React.FC<ControlledImageUploaderProps> = ({ value, onChange, xmlColumn, maxCount }) => {
  const [internalFileList, setInternalFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (value) {
      setInternalFileList(value);
    }
  }, [value]);

  const handleChange = (fileList: UploadFile[]) => {
    setInternalFileList(fileList);
    if (onChange) {
      onChange(fileList);
    }
  };

  return (
    <BaseControlUploadImage
      xmlColumn={xmlColumn}
      initialFileList={internalFileList}
      onChange={handleChange}
      maxCount={maxCount}
    />
  );
};

export default ControlledImageUploader;

