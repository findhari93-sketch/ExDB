import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Checkbox from '../Common/Checkbox';
import type { SortDirection, PipelineStageName } from '../../types/supplierRequest';
import './TableHeader.css';

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  sticky?: boolean;
}

interface TableHeaderProps {
  columns: ColumnDef[];
  sortColumn: string | null;
  sortDirection: SortDirection;
  onSort: (column: string) => void;
  columnFilters: Record<string, string>;
  onColumnFilter: (column: string, value: string) => void;
  pipelineFilter: PipelineStageName | null;
  onPipelineFilter: (stage: PipelineStageName | null) => void;
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: () => void;
}

const PIPELINE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Stages' },
  { value: 'pre_align', label: 'PreAlign' },
  { value: 'bu', label: 'BU' },
  { value: 'sam', label: 'SAM' },
  { value: 'saml', label: 'SAML' },
  { value: 'qr', label: 'Q&R' },
];

const STAGE_LABELS: { key: PipelineStageName; short: string }[] = [
  { key: 'pre_align', short: 'PA' },
  { key: 'bu', short: 'BU' },
  { key: 'sam', short: 'SAM' },
  { key: 'saml', short: 'SML' },
  { key: 'qr', short: 'Q&R' },
];

function SortIcon({ column, sortColumn, sortDirection }: { column: string; sortColumn: string | null; sortDirection: SortDirection }) {
  if (sortColumn !== column) return <ArrowUpDown size={13} className="sort-icon idle" />;
  if (sortDirection === 'asc') return <ArrowUp size={13} className="sort-icon active" />;
  return <ArrowDown size={13} className="sort-icon active" />;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns, sortColumn, sortDirection, onSort, columnFilters, onColumnFilter,
  pipelineFilter, onPipelineFilter,
  allSelected, someSelected, onSelectAll,
}) => {
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});

  // Debounce column filters
  useEffect(() => {
    const timer = setTimeout(() => {
      for (const [col, val] of Object.entries(localFilters)) {
        if (columnFilters[col] !== val) onColumnFilter(col, val);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localFilters]);

  return (
    <thead className="table-header">
      <tr>
        <th className="th-checkbox sticky-col sticky-col-0">
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={onSelectAll}
          />
        </th>
        {columns.map((col) => (
          <th
            key={col.key}
            className={`th-cell ${col.sticky ? 'sticky-col sticky-col-1' : ''}`}
            style={col.width ? { minWidth: col.width } : undefined}
          >
            <div
              className={`th-label ${col.sortable ? 'sortable' : ''}`}
              onClick={() => col.sortable && onSort(col.key)}
            >
              <span>{col.label}</span>
              {col.sortable && <SortIcon column={col.key} sortColumn={sortColumn} sortDirection={sortDirection} />}
            </div>
            {col.key === 'pipeline' && (
              <select
                className="th-filter-input th-pipeline-select"
                value={pipelineFilter ?? ''}
                onChange={(e) => onPipelineFilter(e.target.value ? e.target.value as PipelineStageName : null)}
              >
                {PIPELINE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            {col.filterable && (
              <input
                type="text"
                className="th-filter-input"
                placeholder="Filter..."
                value={localFilters[col.key] ?? columnFilters[col.key] ?? ''}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, [col.key]: e.target.value }))}
              />
            )}
          </th>
        ))}
      </tr>
      {/* Separator row with stage abbreviations */}
      <tr className="th-separator-row">
        <td className="sticky-col sticky-col-0" />
        {columns.map((col) => (
          <td key={col.key} className={col.sticky ? 'sticky-col sticky-col-1' : ''}>
            {col.key === 'pipeline' && (
              <div className="th-separator-stages">
                {STAGE_LABELS.map(({ key, short }) => (
                  <span
                    key={key}
                    className={`th-stage-btn${pipelineFilter === key ? ' th-stage-btn--active' : ''}`}
                    onClick={() => onPipelineFilter(pipelineFilter === key ? null : key)}
                  >
                    {short}
                  </span>
                ))}
              </div>
            )}
          </td>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
