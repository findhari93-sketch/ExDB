import React from 'react';
import TableHeader, { type ColumnDef } from './TableHeader';
import TableRow from './TableRow';
import Pagination from './Pagination';
import type { SupplierRequest, SortState, DashboardFilters, PipelineStageName } from '../../types/supplierRequest';
import './DataTable.css';

interface DataTableProps {
  rows: SupplierRequest[];
  allData: SupplierRequest[];
  totalFiltered: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  sort: SortState;
  filters: DashboardFilters;
  columnFilters: Record<string, string>;
  selectedRows: Set<number>;
  allFilteredIds: number[];
  pipelineFilter: PipelineStageName | null;
  onSort: (column: string) => void;
  onColumnFilter: (column: string, value: string) => void;
  onPipelineFilter: (stage: PipelineStageName | null) => void;
  onPageChange: (page: number) => void;
  onToggleRow: (id: number) => void;
  onSelectAll: (ids: number[]) => void;
  onDeselectAll: () => void;
}

const COLUMNS: ColumnDef[] = [
  { key: 'request_id', label: 'Request ID', sortable: true, filterable: true, width: '110px', sticky: true },
  { key: 'request_date', label: 'Date', sortable: true, filterable: false, width: '100px' },
  { key: 'ex_supplier_name', label: 'Ex Supplier Name', sortable: true, filterable: true, width: '500px' },
  { key: 'regional_hold', label: 'Regional Hold', sortable: true, filterable: false, width: '110px' },
  { key: 'requestor', label: 'Requestor', sortable: true, filterable: true, width: '110px' },
  { key: 'type', label: 'Type', sortable: true, filterable: false, width: '90px' },
  { key: 'pipeline', label: 'Pipeline Status', sortable: false, filterable: false, width: '200px' },
  { key: 'pre_align_approver', label: 'PreAlign Approver', sortable: true, filterable: true, width: '140px' },
  { key: 'bu_approver', label: 'BU Approver', sortable: true, filterable: true, width: '120px' },
  { key: 'sam_approver', label: 'SAM Approver', sortable: true, filterable: true, width: '120px' },
  { key: 'saml_approver', label: 'SAML Approver', sortable: true, filterable: true, width: '130px' },
  { key: 'qr_approver', label: 'Q&R Approver', sortable: true, filterable: true, width: '120px' },
  { key: 'last_acted_on', label: 'Last Acted On', sortable: true, filterable: false, width: '120px' },
];

const DataTable: React.FC<DataTableProps> = ({
  rows, totalFiltered, totalPages, currentPage, pageSize, sort, columnFilters,
  selectedRows, allFilteredIds, pipelineFilter, onSort, onColumnFilter, onPipelineFilter, onPageChange,
  onToggleRow, onSelectAll, onDeselectAll,
}) => {
  const visibleIds = rows.map((r) => r.request_id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedRows.has(id));
  const someVisibleSelected = visibleIds.some((id) => selectedRows.has(id));

  const handleSelectAll = () => {
    if (allVisibleSelected) {
      onDeselectAll();
    } else {
      onSelectAll(allFilteredIds);
    }
  };

  return (
    <div className="data-table-wrapper">
      {/* Table */}
      <div className="data-table-scroll">
        <table className="data-table">
          <TableHeader
            columns={COLUMNS}
            sortColumn={sort.column}
            sortDirection={sort.direction}
            onSort={onSort}
            columnFilters={columnFilters}
            onColumnFilter={onColumnFilter}
            pipelineFilter={pipelineFilter}
            onPipelineFilter={onPipelineFilter}
            allSelected={allVisibleSelected}
            someSelected={someVisibleSelected}
            onSelectAll={handleSelectAll}
          />
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="empty-state">
                  No requests found matching your filters.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <TableRow
                  key={r.request_id}
                  request={r}
                  columns={COLUMNS}
                  selected={selectedRows.has(r.request_id)}
                  onToggleSelect={() => onToggleRow(r.request_id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalFiltered={totalFiltered}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default DataTable;
