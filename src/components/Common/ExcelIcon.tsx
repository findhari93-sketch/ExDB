import React from 'react';
import excelImg from '../../assets/excel.png';

interface ExcelIconProps {
  size?: number;
}

const ExcelIcon: React.FC<ExcelIconProps> = ({ size = 22 }) => (
  <img src={excelImg} alt="Excel" width={size} height={size} style={{ objectFit: 'contain' }} />
);

export default ExcelIcon;
