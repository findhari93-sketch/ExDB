import React, { useRef, useCallback } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import GlassDropdown from '../Common/GlassDropdown';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import type { DashboardFilters, SupplierRequest } from '../../types/supplierRequest';
import './FilterPopover.css';

function unique(arr: string[]): string[] {
  return [...new Set(arr)].filter(Boolean).sort();
}

interface FilterPopoverProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  filters: DashboardFilters;
  data: SupplierRequest[];
  activeFilterCount: number;
  onFilterChange: (key: keyof Omit<DashboardFilters, 'columnFilters' | 'activeStageFilter'>, value: string) => void;
  onClearFilters: () => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  isOpen,
  onToggle,
  onClose,
  filters,
  data,
  activeFilterCount,
  onFilterChange,
  onClearFilters,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside(panelRef, onClose, isOpen);
  useFocusTrap(panelRef, isOpen);

  const suppliers = unique(data.map((r) => r.ex_supplier_name));
  const requestIds = unique(data.map((r) => String(r.request_id)));
  const requestors = unique(data.map((r) => r.requestor));
  const approvers = unique(
    data.flatMap((r) => [r.pre_align_approver, r.bu_approver, r.sam_approver, r.saml_approver, r.qr_approver])
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div className="filter-popover-anchor" ref={panelRef} onKeyDown={handleKeyDown}>
      <button
        className={`filter-popover-trigger ${isOpen ? 'filter-popover-trigger--active' : ''} ${activeFilterCount > 0 ? 'filter-popover-trigger--has-filters' : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
        title="Filters"
      >
        <SlidersHorizontal size={15} strokeWidth={2} />
        <span className="filter-popover-trigger-label">Filters</span>
        {activeFilterCount > 0 && (
          <span className="filter-popover-badge">{activeFilterCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="filter-popover-panel" role="dialog" aria-label="Filter options">
          <div className="filter-popover-header">
            <span className="filter-popover-title">Filters</span>
            <div className="filter-popover-header-actions">
              {activeFilterCount > 0 && (
                <button className="filter-popover-clear" onClick={onClearFilters}>
                  Clear all
                </button>
              )}
              <button className="filter-popover-close" onClick={onClose} aria-label="Close filters">
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="filter-popover-grid">
            <div className="filter-popover-field">
              <label className="filter-popover-label">Ex Supplier</label>
              <GlassDropdown
                placeholder="All Suppliers"
                options={suppliers}
                value={filters.exSupplier}
                onChange={(v) => onFilterChange('exSupplier', v)}
              />
            </div>
            <div className="filter-popover-field">
              <label className="filter-popover-label">Request ID</label>
              <GlassDropdown
                placeholder="All IDs"
                options={requestIds}
                value={filters.requestId}
                onChange={(v) => onFilterChange('requestId', v)}
              />
            </div>
            <div className="filter-popover-field">
              <label className="filter-popover-label">Type</label>
              <GlassDropdown
                placeholder="All Types"
                options={['Award', 'Remove']}
                value={filters.requestType}
                onChange={(v) => onFilterChange('requestType', v)}
              />
            </div>
            <div className="filter-popover-field">
              <label className="filter-popover-label">Approver</label>
              <GlassDropdown
                placeholder="All Approvers"
                options={approvers}
                value={filters.approverType}
                onChange={(v) => onFilterChange('approverType', v)}
              />
            </div>
            <div className="filter-popover-field">
              <label className="filter-popover-label">Requestor</label>
              <GlassDropdown
                placeholder="All Requestors"
                options={requestors}
                value={filters.partStatus}
                onChange={(v) => onFilterChange('partStatus', v)}
              />
            </div>
            <div className="filter-popover-field">
              <label className="filter-popover-label">Regional Hold</label>
              <GlassDropdown
                placeholder="All"
                options={['Yes', 'No']}
                value={filters.regionalHold}
                onChange={(v) => onFilterChange('regionalHold', v)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPopover;
