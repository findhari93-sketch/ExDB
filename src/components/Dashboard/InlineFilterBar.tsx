import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import GlassDropdown from '../Common/GlassDropdown';
import GlassInput from '../Common/GlassInput';
import type { DashboardFilters, SupplierRequest } from '../../types/supplierRequest';
import './InlineFilterBar.css';

function unique(arr: string[]): string[] {
  return [...new Set(arr)].filter(Boolean).sort();
}

interface InlineFilterBarProps {
  filters: DashboardFilters;
  data: SupplierRequest[];
  onFilterChange: (key: keyof Omit<DashboardFilters, 'columnFilters' | 'activeStageFilter'>, value: string) => void;
  onClearFilters: () => void;
  isFlipped: boolean;
  onToggleFlip: () => void;
}

const InlineFilterBar: React.FC<InlineFilterBarProps> = ({
  filters,
  data,
  onFilterChange,
  onClearFilters,
  isFlipped,
  onToggleFlip,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const suppliers = unique(data.map((r) => r.ex_supplier_name));
  const requestIds = unique(data.map((r) => String(r.request_id)));
  const requestors = unique(data.map((r) => r.requestor));
  const approvers = unique(
    data.flatMap((r) => [r.pre_align_approver, r.bu_approver, r.sam_approver, r.saml_approver, r.qr_approver])
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.partNumber) count++;
    if (filters.exSupplier) count++;
    if (filters.requestId) count++;
    if (filters.requestType) count++;
    if (filters.approverType) count++;
    if (filters.partStatus) count++;
    if (filters.regionalHold) count++;
    return count;
  }, [filters]);

  // FloatingField wrapper for MUI-style floating labels
  const FloatingField: React.FC<{
    label: string;
    fieldKey: string;
    hasValue: boolean;
    className?: string;
    children: React.ReactNode;
  }> = ({ label, fieldKey, hasValue, className, children }) => {
    const isFocused = focusedField === fieldKey;
    const isFloated = isFocused || hasValue;

    return (
      <div
        className={`floating-field ${isFloated ? 'floating-field--floated' : ''} ${isFocused ? 'floating-field--focused' : ''} ${className || ''}`}
        onFocus={() => setFocusedField(fieldKey)}
        onBlur={() => setFocusedField(null)}
      >
        <span className="floating-field-label">{label}</span>
        {children}
      </div>
    );
  };

  return (
    <div className="inline-filter-bar">
      <div className={`filter-flip-container ${isFlipped ? 'filter-flip-container--flipped' : ''}`}>

        {/* FRONT FACE: Filter grid with floating labels */}
        <div className="filter-flip-face filter-flip-front">
          <div className="inline-filter-grid">

            {/* Column 1: Part Numbers spanning both rows */}
            <FloatingField
              label="Enter Part Numbers"
              fieldKey="partNumber"
              hasValue={filters.partNumber !== ''}
              className="filter-field-partnumber"
            >
              <GlassInput
                size="sm"
                placeholder=""
                value={filters.partNumber}
                onChange={(v) => onFilterChange('partNumber', v)}
              />
            </FloatingField>

            {/* Row 1, Columns 2-4 */}
            <FloatingField label="Ex Supplier" fieldKey="exSupplier" hasValue={filters.exSupplier !== ''}>
              <GlassDropdown placeholder="All Suppliers" options={suppliers} value={filters.exSupplier} onChange={(v) => onFilterChange('exSupplier', v)} />
            </FloatingField>

            <FloatingField label="Request ID" fieldKey="requestId" hasValue={filters.requestId !== ''}>
              <GlassDropdown placeholder="All IDs" options={requestIds} value={filters.requestId} onChange={(v) => onFilterChange('requestId', v)} />
            </FloatingField>

            <FloatingField label="Part Status" fieldKey="partStatus" hasValue={filters.partStatus !== ''}>
              <GlassDropdown placeholder="All" options={requestors} value={filters.partStatus} onChange={(v) => onFilterChange('partStatus', v)} />
            </FloatingField>

            {/* Row 2, Columns 2-4 */}
            <FloatingField label="Request Type" fieldKey="requestType" hasValue={filters.requestType !== ''}>
              <GlassDropdown placeholder="All Types" options={['Award', 'Remove']} value={filters.requestType} onChange={(v) => onFilterChange('requestType', v)} />
            </FloatingField>

            <FloatingField label="Approver Type" fieldKey="approverType" hasValue={filters.approverType !== ''}>
              <GlassDropdown placeholder="All Approvers" options={approvers} value={filters.approverType} onChange={(v) => onFilterChange('approverType', v)} />
            </FloatingField>

            <FloatingField label="Regional Hold" fieldKey="regionalHold" hasValue={filters.regionalHold !== ''}>
              <GlassDropdown placeholder="All" options={['Yes', 'No']} value={filters.regionalHold} onChange={(v) => onFilterChange('regionalHold', v)} />
            </FloatingField>

          </div>
        </div>

        {/* BACK FACE: Collapsed summary */}
        <div className="filter-flip-face filter-flip-back">
          <div className="filter-collapsed-summary" onClick={onToggleFlip}>
            <Filter size={16} />
            <span className="filter-collapsed-text">
              {activeFilterCount > 0
                ? `${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} active`
                : 'No filters applied'}
            </span>
            <span className="filter-collapsed-hint">Click Search to show filters</span>
            {activeFilterCount > 0 && (
              <button
                className="inline-filter-clear-btn"
                onClick={(e) => { e.stopPropagation(); onClearFilters(); }}
                title="Clear all filters"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InlineFilterBar;
