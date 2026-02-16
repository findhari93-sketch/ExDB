import React from 'react';
import { X } from 'lucide-react';
import './FilterChip.css';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, value, onRemove }) => {
  return (
    <span className="filter-chip" role="status" aria-label={`Filter: ${label} is ${value}`}>
      <span className="filter-chip-label">{label}:</span>
      <span className="filter-chip-value">{value}</span>
      <button
        className="filter-chip-remove"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
      >
        <X size={10} strokeWidth={2.5} />
      </button>
    </span>
  );
};

export default FilterChip;
