import React from 'react';
import { ChevronDown } from 'lucide-react';
import './GlassDropdown.css';

interface GlassDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const GlassDropdown: React.FC<GlassDropdownProps> = ({ options, value, onChange, placeholder }) => {
  return (
    <div className="glass-dropdown-wrapper">
      <select
        className="glass-dropdown"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder || 'All'}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={14} className="glass-dropdown-chevron" />
    </div>
  );
};

export default GlassDropdown;
