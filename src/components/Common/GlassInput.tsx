import React from 'react';
import './GlassInput.css';

interface GlassInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

const GlassInput: React.FC<GlassInputProps> = ({ placeholder, value, onChange, size = 'md', icon }) => {
  return (
    <div className={`glass-input-wrapper glass-input-${size}`}>
      {icon && <span className="glass-input-icon">{icon}</span>}
      <input
        type="text"
        className="glass-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default GlassInput;
