import React from 'react';
import { Check, Minus } from 'lucide-react';
import './Checkbox.css';

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, indeterminate, onChange }) => {
  return (
    <button
      type="button"
      className={`glass-checkbox ${checked ? 'checked' : ''} ${indeterminate ? 'indeterminate' : ''}`}
      onClick={onChange}
      aria-checked={indeterminate ? 'mixed' : checked}
    >
      {checked && <Check size={12} strokeWidth={3} />}
      {indeterminate && !checked && <Minus size={12} strokeWidth={3} />}
    </button>
  );
};

export default Checkbox;
