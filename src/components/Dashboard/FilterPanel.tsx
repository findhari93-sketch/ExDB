import React from 'react';
import { Search, FileSpreadsheet } from 'lucide-react';
import GlassInput from '../Common/GlassInput';
import GlassDropdown from '../Common/GlassDropdown';
import type { SupplierRequest, DashboardFilters } from '../../types/supplierRequest';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: DashboardFilters;
  data: SupplierRequest[];
  onFilterChange: (key: keyof Omit<DashboardFilters, 'columnFilters' | 'activeStageFilter'>, value: string) => void;
  onSearch: () => void;
  onExport: () => void;
  onClearFilters: () => void;
}

function unique(arr: string[]): string[] {
  return [...new Set(arr)].filter(Boolean).sort();
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, data, onFilterChange, onSearch, onExport, onClearFilters }) => {
  const suppliers = unique(data.map((r) => r.ex_supplier_name));
  const requestIds = unique(data.map((r) => String(r.request_id)));
  const requestors = unique(data.map((r) => r.requestor));
  const approvers = unique(
    data.flatMap((r) => [r.pre_align_approver, r.bu_approver, r.sam_approver, r.saml_approver, r.qr_approver])
  );

  const hasActiveFilters = filters.partNumber || filters.exSupplier || filters.requestId ||
    filters.requestType || filters.approverType || filters.regionalHold;

  return (
    <div className="filter-panel glass-card">
      <div className="filter-panel-search">
        <GlassInput
          placeholder="Search by part number, supplier name, or request ID..."
          value={filters.partNumber}
          onChange={(v) => onFilterChange('partNumber', v)}
          icon={<Search size={16} />}
        />
      </div>

      <div className="filter-panel-grid">
        <GlassDropdown
          placeholder="Ex Supplier"
          options={suppliers}
          value={filters.exSupplier}
          onChange={(v) => onFilterChange('exSupplier', v)}
        />
        <GlassDropdown
          placeholder="Request ID"
          options={requestIds}
          value={filters.requestId}
          onChange={(v) => onFilterChange('requestId', v)}
        />
        <GlassDropdown
          placeholder="Request Type"
          options={['Award', 'Remove']}
          value={filters.requestType}
          onChange={(v) => onFilterChange('requestType', v)}
        />
        <GlassDropdown
          placeholder="Approver"
          options={approvers}
          value={filters.approverType}
          onChange={(v) => onFilterChange('approverType', v)}
        />
        <GlassDropdown
          placeholder="Requestor"
          options={requestors}
          value={filters.partStatus}
          onChange={(v) => onFilterChange('partStatus', v)}
        />
        <GlassDropdown
          placeholder="Regional Hold"
          options={['Yes', 'No']}
          value={filters.regionalHold}
          onChange={(v) => onFilterChange('regionalHold', v)}
        />
      </div>

      <div className="filter-panel-actions">
        <button className="filter-btn-primary" onClick={onSearch}>
          <Search size={15} />
          <span>Search</span>
        </button>
        {hasActiveFilters && (
          <button className="filter-btn-secondary" onClick={onClearFilters}>
            Clear Filters
          </button>
        )}
        <button className="filter-btn-secondary" onClick={onExport}>
          <FileSpreadsheet size={15} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
